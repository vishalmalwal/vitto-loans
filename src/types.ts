export interface Application {
  id: string;
  name: string;
  mobile: string;
  amount: number;
  purpose: string;
  language: "Hindi" | "Tamil" | "Telugu" | "Marathi" | "English";
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export interface Summary {
  total: number;
  totalAmount: number;
  byStatus: {
    pending: number;
    approved: number;
    rejected: number;
  };
}

export interface DatabaseStatus {
  status: string;
  environment: string;
  fallbackActive: boolean;
  storageType: string;
}
