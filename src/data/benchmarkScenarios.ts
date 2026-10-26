import { BugScenario } from '../types';

export const BENCHMARK_SCENARIOS: BugScenario[] = [
  {
    id: 'spinning-checkout-trap',
    title: 'The Spinning Checkout Trap',
    subtitle: 'Silent Promise rejection on null tax postalCode in Guest Checkout',
    category: 'State Mutation',
    severity: 'CRITICAL',
    description: 'During guest checkout, clicking "Pay Now" causes the button to enter an infinite loading spinner. No network request is dispatched, and no user-facing error message is rendered because an unhandled TypeError is swallowed inside an un-caught async Redux action.',
    duration: 12.0,
    canvasSimulation: {
      appType: 'ecommerce',
      appTitle: 'Starlight Goods — Fast Checkout',
    },
    frames: [
      {
        time: 0.0,
        label: 'User arrives at checkout',
        cursor: { x: 30, y: 40 },
        domElement: '<form id="checkout-form">',
        actionState: 'IDLE (Form prefilled as Guest)',
      },
      {
        time: 3.2,
        label: 'Selects Standard Shipping',
        cursor: { x: 42, y: 55 },
        highlightBox: { x: 38, y: 52, width: 28, height: 8 },
        domElement: '<input type="radio" value="standard" checked>',
        actionState: 'DISPATCH: shipping/selectMethod',
      },
      {
        time: 6.5,
        label: 'Moves cursor to Pay Button',
        cursor: { x: 50, y: 78 },
        highlightBox: { x: 35, y: 75, width: 30, height: 9 },
        domElement: '<button id="pay-submit-btn">',
        actionState: 'HOVER: #pay-submit-btn',
      },
      {
        time: 7.8,
        label: 'Clicks "Complete Purchase"',
        cursor: { x: 50, y: 78 },
        highlightBox: { x: 35, y: 75, width: 30, height: 9 },
        domElement: '<button id="pay-submit-btn">',
        actionState: 'CLICK_EVENT: handleCheckoutSubmit()',
      },
      {
        time: 8.5,
        label: 'Button spinner starts (Pending)',
        cursor: { x: 50, y: 78 },
        highlightBox: { x: 46, y: 76, width: 8, height: 6 },
        domElement: '<svg class="animate-spin text-white">',
        actionState: 'ASYNC_START: dispatch(processPaymentThunk)',
      },
      {
        time: 10.2,
        label: 'Infinite Hang Anomaly Detected',
        cursor: { x: 52, y: 77 },
        highlightBox: { x: 35, y: 75, width: 30, height: 9 },
        domElement: '<button disabled class="opacity-75">',
        actionState: 'DEADLOCK: Unhandled TypeError swallowed. UI stuck in loading: true',
        isAnomaly: true,
      },
    ],
    rootCause: {
      file: 'src/features/cart/reducer.ts',
      line: 42,
      component: 'CheckoutContainer / processPaymentThunk',
      astNodeType: 'MemberExpression (user.address.postalCode)',
      exceptionType: 'TypeError: Cannot read properties of undefined (reading "postalCode")',
      explanation: 'For registered users, user.address is populated. For guest users, user is an empty object {}. Accessing user.address.postalCode directly throws a TypeError before dispatching the payment request. The parent try-catch block logs to an unmonitored debug channel without setting isSubmitting = false.',
      codeSnippet: {
        lineStart: 38,
        lines: [
          { number: 38, code: 'export const processPaymentThunk = createAsyncThunk(', isFault: false },
          { number: 39, code: '  "cart/processPayment",', isFault: false },
          { number: 40, code: '  async (payload: PaymentPayload, { getState, rejectWithValue }) => {', isFault: false },
          { number: 41, code: '    const { user, cart } = getState() as RootState;', isFault: false },
          { number: 42, code: '    const taxRate = calculateSalesTax(user.address.postalCode); // ❌ FAULT: user.address is undefined for guests', isFault: true },
          { number: 43, code: '    const finalAmount = cart.subtotal + taxRate * cart.subtotal;', isFault: false },
          { number: 44, code: '    return await gatewayClient.charge({ amount: finalAmount, token: payload.token });', isFault: false },
          { number: 45, code: '  }', isFault: false },
          { number: 46, code: ');', isFault: false },
        ],
      },
    },
    reproductionTest: {
      framework: 'playwright',
      filename: 'tests/e2e/guest-checkout.spec.ts',
      code: `import { test, expect } from '@playwright/test';

test('guest checkout completes without infinite spinner deadlock', async ({ page }) => {
  // 1. Visit checkout page with guest session
  await page.goto('/checkout?guest=true');
  await page.waitForSelector('#checkout-form');

  // 2. Select shipping method
  await page.click('input[value="standard"]');

  // 3. Trigger Payment
  const payButton = page.locator('#pay-submit-btn');
  await expect(payButton).toBeVisible();
  await payButton.click();

  // 4. Expect success confirmation modal within 5s
  const confirmation = page.locator('[data-testid="order-confirmed-banner"]');
  await expect(confirmation).toBeVisible({ timeout: 5000 });
  await expect(payButton).not.toHaveClass(/animate-spin/);
});`,
      failureLog: [
        { timestamp: '14:22:01.102', level: 'info', message: 'Running 1 test using 1 worker' },
        { timestamp: '14:22:01.320', level: 'info', message: '[chromium] › guest-checkout.spec.ts:3:1 › guest checkout completes' },
        { timestamp: '14:22:02.045', level: 'info', message: 'Navigated to http://localhost:3000/checkout?guest=true' },
        { timestamp: '14:22:02.890', level: 'info', message: 'Clicked #pay-submit-btn' },
        { timestamp: '14:22:03.110', level: 'warn', message: 'Console Error: Uncaught (in promise) TypeError: Cannot read properties of undefined (reading "postalCode")' },
        { timestamp: '14:22:03.112', level: 'error', message: '    at processPaymentThunk (src/features/cart/reducer.ts:42:41)' },
        { timestamp: '14:22:07.902', level: 'error', message: 'Error: Timed out 5000ms waiting for expect(locator).toBeVisible()' },
        { timestamp: '14:22:07.905', level: 'error', message: 'Locator: locator("[data-testid=\\"order-confirmed-banner\\"]")' },
        { timestamp: '14:22:07.920', level: 'error', message: '1 failed (6.8s) ❌' },
      ],
      successLog: [
        { timestamp: '14:23:14.050', level: 'info', message: 'Running 1 test using 1 worker' },
        { timestamp: '14:23:14.280', level: 'info', message: '[chromium] › guest-checkout.spec.ts:3:1 › guest checkout completes' },
        { timestamp: '14:23:14.920', level: 'info', message: 'Navigated to http://localhost:3000/checkout?guest=true' },
        { timestamp: '14:23:15.410', level: 'info', message: 'Clicked #pay-submit-btn' },
        { timestamp: '14:23:15.430', level: 'info', message: 'PostalCode fallback applied: "00000" (Default Tax Tier)' },
        { timestamp: '14:23:15.750', level: 'info', message: 'Payment token authorized ($49.99)' },
        { timestamp: '14:23:15.890', level: 'pass', message: '✓ Order confirmation banner rendered in 480ms' },
        { timestamp: '14:23:15.910', level: 'pass', message: '1 passed (1.8s) ✨' },
      ],
    },
    patch: {
      summary: 'Add optional chaining and guest postalCode fallback in sales tax calculation',
      filename: 'src/features/cart/reducer.ts',
      originalLines: [
        '    const { user, cart } = getState() as RootState;',
        '    const taxRate = calculateSalesTax(user.address.postalCode);',
        '    const finalAmount = cart.subtotal + taxRate * cart.subtotal;',
      ],
      patchedLines: [
        '    const { user, cart } = getState() as RootState;',
        '    // Defensive check: Fallback to session guest zip or default standard tier',
        '    const postalCode = user?.address?.postalCode ?? cart.guestShippingZip ?? "00000";',
        '    const taxRate = calculateSalesTax(postalCode);',
        '    const finalAmount = cart.subtotal + taxRate * cart.subtotal;',
      ],
      unifiedDiff: `--- a/src/features/cart/reducer.ts
+++ b/src/features/cart/reducer.ts
@@ -41,3 +41,5 @@ export const processPaymentThunk = createAsyncThunk(
     const { user, cart } = getState() as RootState;
-    const taxRate = calculateSalesTax(user.address.postalCode);
+    // Defensive check: Fallback to session guest zip or default standard tier
+    const postalCode = user?.address?.postalCode ?? cart.guestShippingZip ?? "00000";
+    const taxRate = calculateSalesTax(postalCode);
     const finalAmount = cart.subtotal + taxRate * cart.subtotal;`,
    },
  },
  {
    id: 'z-index-modal-prison',
    title: 'The Z-Index Modal Prison',
    subtitle: 'Backdrop overlay intercepting clicks, preventing modal dismissal',
    category: 'Layout & Stacking',
    severity: 'HIGH',
    description: 'When updating subscription billing details, a confirmation modal appears. Clicking the "Cancel" button or the top-right "X" icon has zero effect because an invisible backdrop overlay with pointer-events: auto is mounted at z-50 while the dialog card sits at z-40.',
    duration: 10.0,
    canvasSimulation: {
      appType: 'modal',
      appTitle: 'CloudFlow — Subscription Settings',
    },
    frames: [
      {
        time: 0.0,
        label: 'User in Billing Settings',
        cursor: { x: 30, y: 35 },
        domElement: '<section class="billing-settings">',
        actionState: 'IDLE: Viewing current subscription tier ($49/mo)',
      },
      {
        time: 2.5,
        label: 'Clicks "Change Plan" button',
        cursor: { x: 75, y: 38 },
        highlightBox: { x: 68, y: 34, width: 16, height: 8 },
        domElement: '<button class="btn-change-plan">',
        actionState: 'CLICK: setModalOpen(true)',
      },
      {
        time: 3.8,
        label: 'Modal appears on screen',
        cursor: { x: 50, y: 50 },
        highlightBox: { x: 25, y: 20, width: 50, height: 60 },
        domElement: '<div class="dialog-content">',
        actionState: 'RENDER: Confirm Plan Upgrade Modal',
      },
      {
        time: 5.5,
        label: 'User decides to Cancel',
        cursor: { x: 42, y: 72 },
        highlightBox: { x: 38, y: 68, width: 12, height: 7 },
        domElement: '<button id="modal-cancel-btn">',
        actionState: 'HOVER: #modal-cancel-btn',
      },
      {
        time: 6.8,
        label: 'Clicks Cancel repeatedly (No response)',
        cursor: { x: 42, y: 72 },
        highlightBox: { x: 0, y: 0, width: 100, height: 100 },
        domElement: '<div class="fixed inset-0 bg-black/60 z-50">',
        actionState: 'INTERCEPTION: Click target intercepted by backdrop overlay',
        isAnomaly: true,
      },
    ],
    rootCause: {
      file: 'src/components/modals/DialogOverlay.tsx',
      line: 28,
      component: 'DialogOverlay & DialogContent',
      astNodeType: 'JSXAttribute (className="z-50")',
      exceptionType: 'PointerEventsInterception: Target hit test failed',
      explanation: 'The backdrop overlay was assigned class "z-50 pointer-events-auto", while the inner modal content container was assigned class "z-40". Because of CSS stacking order, all clicks on the cancel button and close icon were swallowed by the full-screen backdrop div.',
      codeSnippet: {
        lineStart: 25,
        lines: [
          { number: 25, code: 'export function BillingModal({ isOpen, onClose }: ModalProps) {', isFault: false },
          { number: 26, code: '  if (!isOpen) return null;', isFault: false },
          { number: 27, code: '  return (', isFault: false },
          { number: 28, code: '    <div className="fixed inset-0 bg-black/60 z-50 pointer-events-auto" onClick={onClose}>', isFault: true },
          { number: 29, code: '      <div className="relative z-40 bg-surface rounded-xl p-6 shadow-2xl">', isFault: true },
          { number: 30, code: '        <h2>Confirm Plan Upgrade</h2>', isFault: false },
          { number: 31, code: '        <button id="modal-cancel-btn" onClick={onClose}>Cancel</button>', isFault: false },
          { number: 32, code: '      </div>', isFault: false },
          { number: 33, code: '    </div>', isFault: false },
        ],
      },
    },
    reproductionTest: {
      framework: 'playwright',
      filename: 'tests/e2e/billing-modal.spec.ts',
      code: `import { test, expect } from '@playwright/test';

test('user can dismiss billing plan modal via cancel button', async ({ page }) => {
  await page.goto('/settings/billing');

  // Open modal
  await page.click('button:has-text("Change Plan")');
  const modal = page.locator('text=Confirm Plan Upgrade');
  await expect(modal).toBeVisible();

  // Attempt cancel
  const cancelBtn = page.locator('#modal-cancel-btn');
  await cancelBtn.click();

  // Modal must close
  await expect(modal).not.toBeVisible();
});`,
      failureLog: [
        { timestamp: '15:10:04.120', level: 'info', message: 'Running 1 test using 1 worker' },
        { timestamp: '15:10:04.400', level: 'info', message: '[chromium] › billing-modal.spec.ts:3:1 › user can dismiss modal' },
        { timestamp: '15:10:05.100', level: 'info', message: 'Modal opened successfully' },
        { timestamp: '15:10:05.650', level: 'error', message: 'locator.click: Error: elementHandle.click: Target intercepted by <div class="fixed inset-0 bg-black/60 z-50"></div>' },
        { timestamp: '15:10:05.655', level: 'error', message: '    at tests/e2e/billing-modal.spec.ts:12:19' },
        { timestamp: '15:10:05.670', level: 'error', message: '1 failed (1.5s) ❌' },
      ],
      successLog: [
        { timestamp: '15:11:22.010', level: 'info', message: 'Running 1 test using 1 worker' },
        { timestamp: '15:11:22.250', level: 'info', message: '[chromium] › billing-modal.spec.ts:3:1 › user can dismiss modal' },
        { timestamp: '15:11:22.890', level: 'info', message: 'Modal opened successfully' },
        { timestamp: '15:11:23.100', level: 'info', message: 'Cancel button clicked without interception' },
        { timestamp: '15:11:23.250', level: 'pass', message: '✓ Modal dismissed cleanly' },
        { timestamp: '15:11:23.260', level: 'pass', message: '1 passed (1.2s) ✨' },
      ],
    },
    patch: {
      summary: 'Invert stacking context so modal container is z-50 and backdrop is lower or pointer-events-none for content',
      filename: 'src/components/modals/DialogOverlay.tsx',
      originalLines: [
        '    <div className="fixed inset-0 bg-black/60 z-50 pointer-events-auto" onClick={onClose}>',
        '      <div className="relative z-40 bg-surface rounded-xl p-6 shadow-2xl">',
      ],
      patchedLines: [
        '    <div className="fixed inset-0 z-50 flex items-center justify-center">',
        '      <div className="fixed inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />',
        '      <div className="relative z-10 bg-surface rounded-xl p-6 shadow-2xl">',
      ],
      unifiedDiff: `--- a/src/components/modals/DialogOverlay.tsx
+++ b/src/components/modals/DialogOverlay.tsx
@@ -28,2 +28,3 @@ export function BillingModal({ isOpen, onClose }: ModalProps) {
-    <div className="fixed inset-0 bg-black/60 z-50 pointer-events-auto" onClick={onClose}>
-      <div className="relative z-40 bg-surface rounded-xl p-6 shadow-2xl">
+    <div className="fixed inset-0 z-50 flex items-center justify-center">
+      <div className="fixed inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
+      <div className="relative z-10 bg-surface rounded-xl p-6 shadow-2xl">`,
    },
  },
  {
    id: 'negative-inventory-underflow',
    title: 'Negative Inventory Underflow',
    subtitle: 'Rapid double-clicking decrements item counter past zero',
    category: 'Concurrency & Boundary',
    severity: 'MEDIUM',
    description: 'In the item quantity selector, rapid double-clicking of the "-" button causes the quantity state to jump from 0 to -1. This corrupts checkout calculations and causes upstream backend inventory validation to fail with a 422 Unprocessable Entity error.',
    duration: 8.0,
    canvasSimulation: {
      appType: 'counter',
      appTitle: 'Apex Hardware — Stock Selector',
    },
    frames: [
      {
        time: 0.0,
        label: 'Item counter at 1',
        cursor: { x: 50, y: 50 },
        domElement: '<span id="item-quantity">1</span>',
        actionState: 'IDLE: Quantity = 1',
      },
      {
        time: 2.1,
        label: 'Clicks "-" button once',
        cursor: { x: 42, y: 50 },
        highlightBox: { x: 38, y: 46, width: 8, height: 8 },
        domElement: '<button id="decrement-btn">-</button>',
        actionState: 'DECREMENT: count -> 0',
      },
      {
        time: 2.4,
        label: 'Rapid second click before disabled state re-renders',
        cursor: { x: 42, y: 50 },
        highlightBox: { x: 38, y: 46, width: 8, height: 8 },
        domElement: '<button id="decrement-btn">-</button>',
        actionState: 'RACE: Second click processed with stale state prev = 0',
      },
      {
        time: 3.5,
        label: 'Counter reads -1 (Underflow Anomaly)',
        cursor: { x: 50, y: 50 },
        highlightBox: { x: 48, y: 46, width: 8, height: 8 },
        domElement: '<span id="item-quantity">-1</span>',
        actionState: 'INVALID_STATE: Quantity = -1 violates non-negative constraint',
        isAnomaly: true,
      },
    ],
    rootCause: {
      file: 'src/hooks/useInventoryCounter.ts',
      line: 19,
      component: 'useInventoryCounter / handleDecrement',
      astNodeType: 'BinaryExpression (count - 1)',
      exceptionType: 'ConstraintViolation: Quantity must be non-negative integer',
      explanation: 'The decrement callback did not clamp the lower boundary with Math.max(0, ...), nor did it use functional state updater syntax. During rapid event firing, it evaluated count - 1 on stale zero values.',
      codeSnippet: {
        lineStart: 16,
        lines: [
          { number: 16, code: 'export function useInventoryCounter(initial: number = 1) {', isFault: false },
          { number: 17, code: '  const [count, setCount] = useState(initial);', isFault: false },
          { number: 18, code: '  const decrement = () => {', isFault: false },
          { number: 19, code: '    setCount(count - 1); // ❌ FAULT: missing boundary clamp Math.max(0, ...)', isFault: true },
          { number: 20, code: '  };', isFault: false },
          { number: 21, code: '  return { count, decrement, increment: () => setCount(count + 1) };', isFault: false },
          { number: 22, code: '}', isFault: false },
        ],
      },
    },
    reproductionTest: {
      framework: 'playwright',
      filename: 'tests/e2e/inventory-counter.spec.ts',
      code: `import { test, expect } from '@playwright/test';

test('inventory counter never underflows past zero on rapid clicks', async ({ page }) => {
  await page.goto('/products/apex-drill');

  const decBtn = page.locator('#decrement-btn');
  const countDisplay = page.locator('#item-quantity');

  // Double click rapidly
  await decBtn.dblclick();

  const finalValue = parseInt(await countDisplay.innerText(), 10);
  expect(finalValue).toBeGreaterThanOrEqual(0);
});`,
      failureLog: [
        { timestamp: '16:05:01.010', level: 'info', message: 'Running 1 test using 1 worker' },
        { timestamp: '16:05:01.210', level: 'info', message: '[chromium] › inventory-counter.spec.ts:3:1' },
        { timestamp: '16:05:01.890', level: 'info', message: 'Dispatched rapid dblclick on #decrement-btn' },
        { timestamp: '16:05:02.100', level: 'error', message: 'Error: expect(received).toBeGreaterThanOrEqual(expected)' },
        { timestamp: '16:05:02.105', level: 'error', message: 'Expected: >= 0' },
        { timestamp: '16:05:02.110', level: 'error', message: 'Received: -1' },
        { timestamp: '16:05:02.120', level: 'error', message: '1 failed (1.1s) ❌' },
      ],
      successLog: [
        { timestamp: '16:06:12.000', level: 'info', message: 'Running 1 test using 1 worker' },
        { timestamp: '16:06:12.210', level: 'info', message: '[chromium] › inventory-counter.spec.ts:3:1' },
        { timestamp: '16:06:12.800', level: 'info', message: 'Dispatched rapid dblclick on #decrement-btn' },
        { timestamp: '16:06:12.950', level: 'pass', message: '✓ Final value clamped at 0' },
        { timestamp: '16:06:12.960', level: 'pass', message: '1 passed (0.9s) ✨' },
      ],
    },
    patch: {
      summary: 'Clamp counter at zero using functional updater syntax Math.max(0, prev - 1)',
      filename: 'src/hooks/useInventoryCounter.ts',
      originalLines: [
        '  const decrement = () => {',
        '    setCount(count - 1);',
        '  };',
      ],
      patchedLines: [
        '  const decrement = () => {',
        '    setCount((prev) => Math.max(0, prev - 1));',
        '  };',
      ],
      unifiedDiff: `--- a/src/hooks/useInventoryCounter.ts
+++ b/src/hooks/useInventoryCounter.ts
@@ -18,3 +18,3 @@ export function useInventoryCounter(initial: number = 1) {
   const decrement = () => {
-    setCount(count - 1);
+    setCount((prev) => Math.max(0, prev - 1));
   };`,
    },
  },
];
