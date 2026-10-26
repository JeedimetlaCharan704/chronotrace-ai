export interface FrameData {
  time: number; // in seconds
  label: string;
  cursor: { x: number; y: number }; // percentage 0-100
  highlightBox?: { x: number; y: number; width: number; height: number }; // percentage
  domElement: string;
  actionState: string;
  isAnomaly?: boolean;
}

export interface RootCauseData {
  file: string;
  line: number;
  component: string;
  astNodeType: string;
  exceptionType: string;
  explanation: string;
  codeSnippet: {
    lineStart: number;
    lines: {
      number: number;
      code: string;
      isFault: boolean;
    }[];
  };
}

export interface ReproductionTestData {
  framework: 'playwright';
  filename: string;
  code: string;
  failureLog: {
    timestamp: string;
    level: 'info' | 'warn' | 'error' | 'pass';
    message: string;
  }[];
  successLog: {
    timestamp: string;
    level: 'info' | 'warn' | 'error' | 'pass';
    message: string;
  }[];
}

export interface PatchData {
  summary: string;
  filename: string;
  originalLines: string[];
  patchedLines: string[];
  unifiedDiff: string;
}

export interface BugScenario {
  id: string;
  title: string;
  subtitle: string;
  category: 'State Mutation' | 'Layout & Stacking' | 'Concurrency & Boundary';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  description: string;
  duration: number; // in seconds
  canvasSimulation: {
    appType: 'ecommerce' | 'modal' | 'counter';
    appTitle: string;
  };
  frames: FrameData[];
  rootCause: RootCauseData;
  reproductionTest: ReproductionTestData;
  patch: PatchData;
}
