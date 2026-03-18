export type PRDStage = 'discovery' | 'research' | 'jtbd' | 'validation' | 'prd' | 'wireframe' | 'shipped';

export interface ApprovalGates {
  jtbd: boolean;
  research: boolean;
  validation: boolean;
  prd: boolean;
}

export interface PRDWorkflowState {
  feature: string;
  currentStage: PRDStage;
  approvals: ApprovalGates;
  lastUpdated: string;  // ISO datetime
}
