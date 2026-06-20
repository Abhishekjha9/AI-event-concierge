export interface EventProposal {
  _id: string;
  query: string;
  venueName: string;
  location: string;
  estimatedCost: string;
  justification: string;
  createdAt: Date | string;
}

export interface GenerateRequest {
  query: string;
}

export interface GenerateResponse {
  success: boolean;
  data?: EventProposal;
  error?: string;
}

export interface HistoryResponse {
  success: boolean;
  data?: EventProposal[];
  error?: string;
}

export interface DeleteResponse {
  success: boolean;
  error?: string;
}

export interface GeminiProposalResult {
  venueName: string;
  location: string;
  estimatedCost: string;
  justification: string;
}
