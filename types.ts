
export interface DimensionScore {
  name: string;
  score: number; // 0-100
  weight: string; // e.g. "20%"
  description: string;
  status: 'Good' | 'Neutral' | 'Warning' | 'Critical';
}

export interface RiskAlert {
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
  evidenceLevel: 'Tier 1' | 'Tier 2' | 'Tier 3';
  logic: string;
}

export interface MarketData {
  price: string;
  change24h: string;
  marketCap: string;
  fdv: string;
  volume24h: string;
  tvl?: string;
  holders?: string;
  currency: string;
}

export interface Competitor {
  name: string;
  comparison: string; 
}

export interface Catalyst {
  name: string;
  date?: string;
  type: 'Unlock' | 'Upgrade' | 'Listing' | 'Event' | 'Other';
  impact: 'Positive' | 'Negative' | 'Neutral';
}

export interface HealthIndicator {
  label: string;
  status: 'Healthy' | 'Warning' | 'Neutral'; 
  valueDisplay: string; 
  assessment: string;
}

// --- V11.0 Credibility Hierarchy Types ---

export type EvidenceTier = 'Tier 1' | 'Tier 2' | 'Tier 3';

export interface AuditEvidence {
  id: string;
  type: 'On-Chain' | 'GitHub' | 'Audit Report' | 'Media/News' | 'Evaluation';
  content: string;
  url?: string;
  tier: EvidenceTier;
  isReferenceOnly: boolean; // Tier 3 items are true
}

export interface ManualReviewTrigger {
  triggerName: string;
  severity: 'Critical' | 'High';
  description: string;
  recommendedAction: 'Pause Trading' | 'Legal Review' | 'Deep Dive';
}

export interface ConfidenceFactor {
  factor: string;
  impact: 'Positive' | 'Negative';
  scoreDelta: number;
}

// --- Deep Dive Components ---
export interface AddressProfile {
  type: 'Staking' | 'CEX' | 'Team' | 'DAO' | 'Bridge' | 'Whale' | 'Unknown';
  percentage: number;
  description: string;
}

export interface LogicPath {
  signal: string; 
  tier1Check: string; 
  tier2Check: string; 
  conclusion: string; 
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface CodeAudit {
  contractVerified: boolean;
  bytecodeMatch: boolean;
  ownerStatus: 'Renounced' | 'Timelock' | 'Multisig' | 'EOA' | 'Unknown';
  vulnerabilitiesFound: number;
  audits: Array<{ firm: string; date: string; status: 'Passed' | 'Issues Fixed' | 'Issues Pending' }>;
  githubTrust: 'High' | 'Medium' | 'Low' | 'N/A';
}

export interface AntiCheatCheck {
  checkName: string;
  status: 'Passed' | 'Failed' | 'Warning';
  details: string;
}

// V14.0 Info Harvesting Trace (Updated)
export interface HarvestingTrace {
  category: 'Whitepaper' | 'Website' | 'GitHub' | 'Socials' | 'Audit';
  status: 'Confirmed' | 'Probable' | 'Missing';
  discoveryPath: string; // e.g. "Path #1: Contract Metadata"
  sourceUrl: string;
  evidenceTier: 'L1' | 'L2' | 'L3' | 'L4' | 'L5'; // V14.0 Hierarchy
  evidenceSnapshot: string; // e.g. "Found in Etherscan Contract Info field"
}

export interface ResourceProbe {
  resourceName: string;
  status: 'Found' | 'Missing' | 'Hidden';
  discoveryLayer: 'Tier 1 Source' | 'Tier 2 Audit' | 'Tier 3 Media';
  url?: string;
  details: string;
  discoveryPath?: string; // V13.0 New: e.g., "On-chain Metadata", "DNS TXT Record"
}

// V12.1 Intent-Implementation Alignment
export interface VerifiedMechanism {
  mechanismName: string; // e.g. "Mint Function"
  technicalRisk: string; // e.g. "Unlimited Minting Privilege"
  businessIntent: string; // e.g. "Required for P2E Game Rewards"
  implementationStatus: 'Secured by Timelock' | 'Secured by Multisig' | 'Contract Logic' | 'Unsecured EOA (Warning)';
  matchConfidence: 'High' | 'Medium' | 'Low';
  source: string; // e.g., "Whitepaper Section 3.2"
}

// V15.0 Whitepaper Alignment v2.0 (Deep Reasoning & Counter-Evidence)
export interface MechanismDeviation {
  category: string; // e.g. "Bridge", "DAO", "Tokenomics", "Liquidity"
  signal: string; // e.g., "Infinite Mint Permission"
  whitepaperJustification: string; // e.g., "Used for Elastic Supply Rebase"
  assessment: 'Mechanism-Expected Behavior' | 'Mechanism-Aligned but Watchlist' | 'Mechanism-Deviation Risk';
  deviationScore: number; // 0-100 (0 is aligned, 100 is deviation)
  details: string;
  
  // V15.0 New Fields
  reasoning?: string; // Explains "Why did they design it this way?"
  counterEvidence?: string; // The specific proof used to dismiss the risk (e.g. "Mint locked by Staking Contract")
  tokenFlow?: string; // Description of funds flow (e.g., "User -> Tax -> LP")
  lifecycleCheck?: 'Consistent' | 'Deviating' | 'N/A'; // Early vs Late stage behavior check
  riskLayer?: 'Structural' | 'Behavioral' | 'Deviation'; // Which layer triggered the verdict
}

export interface DeepDiveAnalysis {
  addressProfile: AddressProfile[]; 
  logicPaths: LogicPath[]; 
  antiCheat: AntiCheatCheck[];
  codeAudit: CodeAudit;
  resourceProbes: ResourceProbe[];
  verifiedMechanisms?: VerifiedMechanism[]; // V12.1 Legacy
  mechanismDeviations?: MechanismDeviation[]; // V15.0 New
  harvestingTrace?: HarvestingTrace[]; // V14.0 New
}

// --- 15-Section Structure Data Types ---

export interface ProjectProfile {
  name: string;
  symbol: string;
  contractAddress: string;
  website: string[]; // Updated to array for V14 Multi-source
  whitepaper: string;
  socials: { platform: string; url: string }[];
  sector: string;
  status: string;
  teamLocation: string;
}

export interface ProjectOverview {
  whatIsIt: string;
  vision: string;
  achievements: string;
}

export interface ProductTech {
  features: string;
  architecture: string;
  scalability: string;
  dependencies: string;
  githubActivity: string;
  securitySummary: string; // Summary of audits
}

export interface TokenomicsDeep {
  baseInfo: {
    totalSupply: string;
    circulatingSupply: string;
    inflationMechanism: string;
    vestingSchedule: string;
  };
  distribution: string;
  utility: string;
  riskAnalysis: string; // V12 logic description
}

// V12.5 Liquidity Analysis
export interface LiquidityAnalysis {
  holderBreakdown: {
    contracts: number; // % held by contracts (Staking, Bridge, etc.)
    exchanges: number; // % held by CEX
    whales: number; // % held by individuals (EOA)
  };
  lpStatus: {
    isLocked: boolean;
    lockDuration: string;
    owner: 'Protocol Owned' | 'Community' | 'Developer' | 'Unknown';
  };
  concentrationVerdict: 'Safe (Mechanism)' | 'Warning' | 'Critical (Whale Manipulation)';
  explanation: string;
}

export interface TeamBackerInfo {
  coreTeam: string;
  investors: string;
  advisors: string;
}

export interface SocialStats {
  twitterFollowers: string;
  communityActivity: string;
  sentiment: string;
}

export interface RegulatoryCheck {
  securitiesRisk: string;
  geoRestrictions: string;
  kycRequirements: string;
}

export interface RoadmapItem {
  period: string;
  goal: string;
  status: 'Completed' | 'In Progress' | 'Planned' | 'Delayed';
}

export interface ReportSections {
  // 1. Basic Info
  profile: ProjectProfile;
  // 2. Overview
  overview: ProjectOverview;
  // 3. Product & Tech
  productTech: ProductTech;
  // 4. Market
  marketAnalysis: string;
  // 5. Tokenomics
  tokenomics: TokenomicsDeep;
  // 6. On-chain
  onChainSummary: string;
  liquidityAnalysis?: LiquidityAnalysis; // V12.5 New
  // 7. Team
  teamInfo: TeamBackerInfo;
  // 8. Social
  socialAnalysis: SocialStats;
  // 9. Black Swan Risks (Handled by risks array + logicPaths)
  // 10. Regulation
  compliance: RegulatoryCheck;
  // 11. Roadmap
  roadmap: RoadmapItem[];
  // 12. Strengths
  strengths: string[];
  // 13. Risks (General)
  generalRisks: string[];
  // 14. Conclusion (Verdict/Score/DimensionScores)
  // 15. Appendix (EvidencePack/Sources)
}

export interface ResearchReport {
  tokenName: string;
  tokenSymbol: string;
  generatedAt: string;
  engineVersion: string; 
  language?: 'en' | 'zh'; // Added for V14 Language System
  
  marketData: MarketData;
  
  // Scoring & Verdict (Section 14)
  totalScore: number;
  verdict: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
  confidenceScore: number; // 0-100
  
  // Core Sections Data (1-15)
  reportSections: ReportSections;

  // V11 Fields
  confidenceFactors: ConfidenceFactor[];
  evidencePack: AuditEvidence[]; // Section 15
  manualReviewTriggers: ManualReviewTrigger[];

  dimensionScores: DimensionScore[]; // Section 14
  
  // Deep Dive Modules
  deepDive: DeepDiveAnalysis;

  // Advanced Modules
  competitors: Competitor[]; // Section 4 Detail
  catalysts: Catalyst[];
  healthIndicators: HealthIndicator[];
  risks: RiskAlert[]; // Section 9 & 13
  sources: Array<{ title: string; uri: string }>; // Section 15
}

export interface LoadingState {
  status: 'idle' | 'searching' | 'analyzing' | 'generating' | 'complete' | 'error';
  message?: string;
}

export interface NewToken {
  name: string;
  symbol: string;
  price?: string;
  launchDate?: string;
  platform: string;
  description: string;
  trend?: 'Up' | 'Down' | 'New';
}

export interface MarketIntelligence {
  generatedAt: string;
  newListings: NewToken[];
  upcomingProjects: NewToken[];
}
