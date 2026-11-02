export type TransferStatus = "settled" | "pending" | "failed";

export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
};

export type SessionUser = {
  id: string;
  name: string;
  email: string;
};

export type Transfer = {
  id: string;
  recipient: string;
  email: string;
  amount: number;
  note: string;
  status: TransferStatus;
  createdAt: string;
};

export type MswScenario = "live" | "server-error" | "slow";
