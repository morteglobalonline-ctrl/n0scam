export type RiskVerdict = 'ALLOW' | 'WARN' | 'BLOCK' | 'UNKNOWN';

export type RiskSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface RiskEvidence {
  code: string;
  title: string;
  detail: string;
  source: 'ON_DEVICE' | 'THREAT_INTELLIGENCE' | 'CONNECTOR' | 'MODEL';
}

export interface RiskAssessment {
  id: string;
  inputType: 'URL' | 'QR' | 'MESSAGE' | 'EMAIL' | 'PAYMENT';
  displayValue: string;
  verdict: RiskVerdict;
  severity: RiskSeverity;
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  evidence: RiskEvidence[];
  missingData: string[];
  suggestedActions: string[];
  engineVersion: string;
  analyzedAt: string;
  mode: 'LOCAL_PRELIMINARY' | 'LIVE';
}

export type ProtectionState =
  | 'NOT_SUPPORTED'
  | 'NOT_CONFIGURED'
  | 'PERMISSION_REQUIRED'
  | 'CONNECTING'
  | 'ACTIVE'
  | 'DEGRADED'
  | 'EXPIRED'
  | 'ERROR'
  | 'PAUSED';

export interface ProtectionStatus {
  moduleId: string;
  state: ProtectionState;
  lastCheck: string | null;
  coverage: string[];
  gaps: string[];
  verified: boolean;
}

export interface IntegrationState {
  provider: 'GOOGLE' | 'MICROSOFT' | 'SAFARI' | 'SMS' | 'NETWORK';
  state: ProtectionState;
  accountLabel: string | null;
  expiresAt: string | null;
  lastHealthCheck: string | null;
}

export interface Incident {
  id: string;
  source: 'URL' | 'QR' | 'MESSAGE' | 'EMAIL' | 'NETWORK';
  assessmentId: string;
  title: string;
  summary: string;
  action: 'ALLOWED' | 'WARNED' | 'BLOCKED' | 'DISMISSED';
  createdAt: string;
}
