"""ChronoTrace AI — Master 1080p Demo Video Recorder (Zero Blank Frame).

Key Fix:
1. Navigates to local production server (http://localhost:3000) for instant hydration.
2. Waits for h1 and document.fonts.ready.
3. Injects sharp vector cursor.
4. Dynamically calculates trim offset to cut initial browser startup.
5. Synced segment choreography matching the 2m 35s voiceover audio.
6. Guarantees frame 0:00:00.00 is the dark dashboard with zero blank white screen!
"""

import os
import sys
import time
import subprocess
import imageio_ffmpeg
from playwright.sync_api import sync_playwright

CURRENT_MOUSE_POS = [960, 540]

def inject_virtual_cursor(page):
    """Inject a razor-sharp SVG pointer arrow with expanding click ripple rings."""
    js_code = """
    (() => {
        if (document.getElementById('playwright-cursor-container')) return;

        const container = document.createElement('div');
        container.id = 'playwright-cursor-container';
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100vw';
        container.style.height = '100vh';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '2147483647';
        document.body.appendChild(container);

        const cursor = document.createElement('div');
        cursor.id = 'playwright-cursor';
        cursor.style.position = 'fixed';
        cursor.style.width = '28px';
        cursor.style.height = '28px';
        cursor.style.pointerEvents = 'none';
        cursor.style.transform = 'translate(-2px, -2px)';
        cursor.style.transition = 'transform 0.08s ease';
        cursor.innerHTML = `
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 2L22 13L13.5 15.5L10 24L4 2Z" fill="#38bdf8" stroke="#ffffff" stroke-width="2.5" stroke-linejoin="round"/>
        </svg>
        `;
        container.appendChild(cursor);

        window.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        window.addEventListener('mousedown', (e) => {
            cursor.style.transform = 'translate(-2px, -2px) scale(0.85)';
            const ripple = document.createElement('div');
            ripple.style.position = 'fixed';
            ripple.style.left = e.clientX + 'px';
            ripple.style.top = e.clientY + 'px';
            ripple.style.width = '12px';
            ripple.style.height = '12px';
            ripple.style.borderRadius = '50%';
            ripple.style.backgroundColor = 'rgba(56, 189, 248, 0.4)';
            ripple.style.border = '2px solid #38bdf8';
            ripple.style.boxShadow = '0 0 16px #38bdf8';
            ripple.style.transform = 'translate(-50%, -50%)';
            ripple.style.pointerEvents = 'none';
            ripple.style.transition = 'width 0.35s cubic-bezier(0.1, 0.8, 0.2, 1), height 0.35s cubic-bezier(0.1, 0.8, 0.2, 1), opacity 0.35s ease-out';
            container.appendChild(ripple);

            requestAnimationFrame(() => {
                ripple.style.width = '55px';
                ripple.style.height = '55px';
                ripple.style.opacity = '0';
            });

            setTimeout(() => ripple.remove(), 400);
        });

        window.addEventListener('mouseup', () => {
            cursor.style.transform = 'translate(-2px, -2px) scale(1)';
        });
    })();
    """
    page.evaluate(js_code)

def smooth_move(page, target_x, target_y, steps=25, delay=0.015):
    """Generate human-like smooth cursor motion."""
    global CURRENT_MOUSE_POS
    start_x, start_y = CURRENT_MOUSE_POS

    for i in range(1, steps + 1):
        t = i / steps
        t_smooth = 2 * t * t if t < 0.5 else -1 + (4 - 2 * t) * t
        cur_x = start_x + (target_x - start_x) * t_smooth
        cur_y = start_y + (target_y - start_y) * t_smooth
        page.mouse.move(cur_x, cur_y)
        time.sleep(delay)

    CURRENT_MOUSE_POS = [target_x, target_y]

def smooth_click(page, selector, hover_time=0.4):
    """Locate element, move cursor smoothly to its center, and perform a realistic click."""
    elem = page.wait_for_selector(selector, state="visible", timeout=10000)
    box = elem.bounding_box()
    if box:
        target_x = box["x"] + box["width"] / 2
        target_y = box["y"] + box["height"] / 2
        smooth_move(page, target_x, target_y, steps=26)
        time.sleep(hover_time)
        page.mouse.down()
        time.sleep(0.12)
        page.mouse.up()
        time.sleep(0.35)
    else:
        page.click(selector)

def smooth_scroll(page, delta_y, steps=20, delay=0.02):
    """Smooth gradual scrolling."""
    step_delta = delta_y / steps
    for _ in range(steps):
        page.mouse.wheel(0, step_delta)
        time.sleep(delay)

def record():
    output_dir = os.path.abspath("recorded_video")
    os.makedirs(output_dir, exist_ok=True)

    print("[*] Launching Chromium (1920x1080) for Master Quality Recording...")

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-setuid-sandbox"]
        )

        context = browser.new_context(
            viewport={"width": 1920, "height": 1080},
            record_video_dir=output_dir,
            record_video_size={"width": 1920, "height": 1080}
        )

        t_context_start = time.time()
        page = context.new_page()

        # Use local server if running, otherwise use production Vercel deployment
        import urllib.request
        try:
            urllib.request.urlopen("http://localhost:3000", timeout=1)
            url = "http://localhost:3000"
        except Exception:
            url = "https://chronotrace-ai.vercel.app"
        print(f"[*] Navigating to {url} and waiting for full render...")
        page.goto(url, wait_until="networkidle")
        page.wait_for_selector("h1")
        page.evaluate("() => document.fonts.ready")
        inject_virtual_cursor(page)

        # Let the dark dashboard settle for 1.5 seconds
        time.sleep(1.5)

        # Dynamic trim offset: precisely cuts the navigation/loading period
        trim_offset = time.time() - t_context_start
        print(f"[*] Dark UI rendered & settled! Trim offset established at: {trim_offset:.2f}s")

        # -------------------------------------------------------------
        # SEGMENT 1 (0:00 - 0:25): Header, Branding & Problem Overview
        # (This is where the video and voiceover will start after trim!)
        # -------------------------------------------------------------
        print("[>] Segment 1: Header, Branding, & Overview...")
        smooth_move(page, 200, 30, steps=30)   # Logo & ChronoTrace AI
        time.sleep(5.5)
        smooth_move(page, 440, 30, steps=25)   # Devpost Learn Verified badge
        time.sleep(6.0)
        smooth_move(page, 960, 110, steps=30)  # Scenario Title & Severity badge
        time.sleep(8.5)

        # -------------------------------------------------------------
        # SEGMENT 2 (0:25 - 0:55): Quadrant 1 - Temporal Video Scrubber
        # -------------------------------------------------------------
        print("[>] Segment 2: Quadrant 1 - Video Scrubber interaction...")
        smooth_move(page, 480, 260, steps=30)  # Canvas video surface
        time.sleep(5.0)

        # Scrub timeline to T=3.2s
        smooth_move(page, 320, 520, steps=25)
        time.sleep(1.0)
        page.mouse.down()
        smooth_move(page, 420, 520, steps=20)
        page.mouse.up()
        time.sleep(5.0)

        # Scrub timeline to T=7.8s (Click Event)
        smooth_move(page, 420, 520, steps=20)
        page.mouse.down()
        smooth_move(page, 580, 520, steps=25)
        page.mouse.up()
        time.sleep(6.0)

        # Scrub timeline to T=10.2s (Anomaly Flash)
        smooth_move(page, 580, 520, steps=20)
        page.mouse.down()
        smooth_move(page, 720, 520, steps=25)
        page.mouse.up()
        time.sleep(7.0)

        # -------------------------------------------------------------
        # SEGMENT 3 (0:55 - 1:25): Quadrant 2 - Causality Graph & AST
        # -------------------------------------------------------------
        print("[>] Segment 3: Quadrant 2 - Causality AST localization...")
        # Move to Node 1 (Trigger)
        smooth_move(page, 1080, 260, steps=30)
        time.sleep(4.0)
        # Move to Node 2 (Component)
        smooth_move(page, 1260, 260, steps=25)
        time.sleep(4.0)
        # Move to Node 3 (AST Node)
        smooth_move(page, 1440, 260, steps=25)
        time.sleep(4.0)
        # Move to Node 4 (Exception)
        smooth_move(page, 1620, 260, steps=25)
        time.sleep(4.5)

        # Focus on source code line 42 fault
        smooth_move(page, 1350, 420, steps=30)
        time.sleep(5.5)
        # Forensic explanation box
        smooth_move(page, 1350, 540, steps=25)
        time.sleep(6.5)

        # -------------------------------------------------------------
        # SEGMENT 4 (1:25 - 1:52): Quadrant 3 - Playwright Test Runner
        # -------------------------------------------------------------
        print("[>] Segment 4: Quadrant 3 - Playwright Test Execution...")
        smooth_scroll(page, 400, steps=25)
        time.sleep(2.0)
        inject_virtual_cursor(page)

        # View test terminal
        smooth_move(page, 480, 680, steps=30)
        time.sleep(3.5)

        # Click Run Reproduction Test
        smooth_click(page, "button:has-text('Run Reproduction Test')")
        print("    Executing simulated Playwright runner...")
        time.sleep(7.0)

        # Hover over failure log
        smooth_move(page, 480, 800, steps=25)
        time.sleep(8.0)

        # -------------------------------------------------------------
        # SEGMENT 5 (1:52 - 2:15): Quadrant 4 - Verified Patch & Remediation
        # -------------------------------------------------------------
        print("[>] Segment 5: Quadrant 4 - Verified Patch...")
        # Hover over unified diff lines
        smooth_move(page, 1350, 680, steps=30)
        time.sleep(4.5)

        # Click Apply Patch & Verify (1-Click)
        smooth_click(page, "button:has-text('Apply Patch & Verify')")
        print("    Applying patch & re-running test suite...")
        time.sleep(5.5)

        # Hover over green verification banner
        smooth_move(page, 1350, 600, steps=25)
        time.sleep(8.0)

        # -------------------------------------------------------------
        # SEGMENT 6 (2:15 - 2:27): Methodology Modal
        # -------------------------------------------------------------
        print("[>] Segment 6: Methodology Modal & Devpost Learn Specs...")
        smooth_scroll(page, -400, steps=25)
        time.sleep(2.0)
        inject_virtual_cursor(page)

        # Click Methodology button in header
        smooth_click(page, "button:has-text('Methodology')")
        time.sleep(6.0)

        # Close Modal
        smooth_click(page, "button:has-text('Got It')")
        time.sleep(2.5)

        # -------------------------------------------------------------
        # CLOSING (2:27 - 2:38): GitHub & Final Call to Action
        # -------------------------------------------------------------
        print("[>] Closing: GitHub & Live links...")
        smooth_move(page, 1720, 30, steps=25)  # Hover GitHub button
        time.sleep(6.0)
        smooth_move(page, 960, 50, steps=30)   # Center rest on dashboard
        time.sleep(5.0)

        # Close page to flush raw webm video
        page.close()
        video_path = page.video.path()
        context.close()
        browser.close()

    print(f"\n[+] Raw browser video saved: {video_path}")

    # -------------------------------------------------------------
    # MASTER QUALITY ENCODING: Trim Initial Startup Period
    # + Multiplex with Neural Voiceover Audio
    # -------------------------------------------------------------
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    audio_path = os.path.abspath("voiceover.mp3")
    final_output = os.path.abspath("ChronoTrace_AI_Official_Demo.mp4")

    trim_str = f"{trim_offset:.3f}"
    print(f"[*] Trimming initial {trim_str}s browser startup and multiplexing audio...")

    cmd = [
        ffmpeg,
        "-y",
        "-ss", trim_str,
        "-i", video_path,
        "-i", audio_path,
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "18",
        "-c:a", "aac",
        "-b:a", "192k",
        "-pix_fmt", "yuv420p",
        "-shortest",
        final_output
    ]

    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0:
        file_size_mb = os.path.getsize(final_output) / (1024 * 1024)
        print(f"\n[SUCCESS] Master Demo Video Created: {final_output} ({file_size_mb:.2f} MB)")
    else:
        print("[!] Multiplexing failed:", res.stderr)

if __name__ == "__main__":
    record()
