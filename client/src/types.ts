
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "evaluator" | "vendor";
  organization?: string;
}

export interface Tender {
  id: string;
  title: string;
  description: string;
  type: "RFP" | "RFQ" | "ITB";
  status: "draft" | "published" | "evaluating" | "awarded" | "archived";
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  deadline: string;
  budget?: number;
  documents: Document[];
  requirements: Requirement[];
  evaluation?: EvaluationCriteria[];
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
  size: number;
}

export interface Requirement {
  id: string;
  title: string;
  description: string;
  required: boolean;
}

export interface EvaluationCriteria {
  id: string;
  name: string;
  description: string;
  weight: number;
}

export interface Proposal {
  id: string;
  tenderId: string;
  vendorId: string;
  vendorName: string;
  title: string;
  description: string;
  submittedAt: string;
  status: "submitted" | "under_review" | "accepted" | "rejected";
  documents: Document[];
  evaluations?: Evaluation[];
}

export interface Evaluation {
  criteriaId: string;
  criteriaName: string;
  score: number;
  comment?: string;
  evaluatorId: string;
  evaluatorName: string;
}

export interface Decision {
  id: string;
  tenderId: string;
  tenderTitle: string;
  winningProposalId: string;
  winnerName: string;
  decisionDate: string;
  justification: string;
  approvals: Approval[];
}

export interface Approval {
  userId: string;
  userName: string;
  role: string;
  status: "pending" | "approved" | "rejected";
  date?: string;
  comment?: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  type: "tender_summary" | "vendor_performance" | "budget_analysis" | "compliance";
  createdAt: string;
  createdBy: string;
  data: any; // This would be report-specific data
}

export interface Vendor {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  registrationNumber: string;
  taxId: string;
  industry: string[];
  status: "active" | "inactive" | "blacklisted";
  profile: {
    description: string;
    yearFounded: number;
    employeeCount: number;
    website?: string;
    previousExperience?: string[];
    certifications?: string[];
  }
}
