
// Common types used throughout the application

export interface Tender {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  currency: string;
  publishDate: string;
  deadline: string;
  status: TenderStatus;
  documents: Document[];
  questions: Question[];
  criteria: EvaluationCriteria[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type TenderStatus = 
  | "draft" 
  | "published" 
  | "evaluating" 
  | "awarded" 
  | "canceled" 
  | "archived";

export interface Document {
  id: string;
  name: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  uploadedBy: string;
  version: number;
}

export interface Question {
  id: string;
  question: string;
  askedBy: string;
  askedAt: string;
  answer?: string;
  answeredAt?: string;
  answeredBy?: string;
  isPublic: boolean;
}

export interface EvaluationCriteria {
  id: string;
  name: string;
  description: string;
  weight: number;
  minScore: number;
  maxScore: number;
}

export interface Proposal {
  id: string;
  tenderId: string;
  vendorId: string;
  vendorName: string;
  price: number;
  currency: string;
  documents: Document[];
  submittedAt: string;
  status: ProposalStatus;
  evaluationScores?: EvaluationScore[];
  notes?: string;
}

export type ProposalStatus = 
  | "draft" 
  | "submitted" 
  | "underEvaluation" 
  | "rejected" 
  | "accepted" 
  | "awarded";

export interface EvaluationScore {
  criteriaId: string;
  evaluatorId: string;
  score: number;
  comment?: string;
}

export interface Decision {
  id: string;
  tenderId: string;
  tenderTitle: string;
  type: "award" | "extension" | "cancellation";
  description: string;
  winnerId?: string;
  winnerName?: string;
  contractValue?: number;
  currency?: string;
  approvals: Approval[];
  createdAt: string;
  effectiveDate?: string;
  status: "pending" | "approved" | "rejected";
  documents?: Document[];
}

export interface Approval {
  userId: string;
  userName: string;
  status: "pending" | "approved" | "rejected";
  comment?: string;
  timestamp?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  registrationNumber?: string;
  taxId?: string;
  contactPerson?: string;
  category?: string[];
  status: "active" | "inactive" | "blacklisted";
  verificationStatus: "verified" | "pending" | "rejected";
  joinedDate: string;
  proposalsSubmitted: number;
  proposalsWon: number;
  totalContractValue?: number;
  currency?: string;
  rating?: number;
  description?: string;
  website?: string;
  documents?: Document[];
}

export interface Report {
  id: string;
  title: string;
  description: string;
  type: "procurement" | "vendor" | "compliance" | "financial" | "custom";
  createdBy: string;
  createdAt: string;
  lastUpdated: string;
  status: "draft" | "published";
  data: ReportData;
  parameters?: Record<string, any>;
  permissions: string[];
}

export interface ReportData {
  summary?: ReportSummary;
  charts?: ReportChart[];
  tables?: ReportTable[];
}

export interface ReportSummary {
  totalTenders?: number;
  totalValue?: number;
  currency?: string;
  avgProposalsPerTender?: number;
  successRate?: number;
  highlights?: string[];
}

export interface ReportChart {
  id: string;
  title: string;
  type: "bar" | "line" | "pie" | "area";
  data: any[];
}

export interface ReportTable {
  id: string;
  title: string;
  headers: string[];
  rows: any[][];
}
