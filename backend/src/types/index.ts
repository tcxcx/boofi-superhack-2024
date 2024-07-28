import { Wallet, VerifiedCredential } from "@/domain/models/User";

export interface IUser {
  id: string;
  email: string;
  wallets: Wallet[];
  verifiedCredentials: VerifiedCredential[];
  worldIdVerified: boolean;
  alias: string;
  firstName: string;
  lastName: string;
  username: string | null;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFinancialData {
  id: string;
  userId: string;
  dataType: "BANK" | "CRYPTO";
  data: Record<string, unknown>;
  timestamp: Date;
}

export interface ICreditScore {
  id: string;
  userId: string;
  score: number;
  timestamp: Date;
}

export interface ILoanRequest {
  id: string;
  userId: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
  updatedAt: Date;
}

export interface ILoanPayment {
  id: string;
  loanRequestId: string;
  amount: number;
  timestamp: Date;
}
