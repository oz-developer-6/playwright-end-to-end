import { DEMO_USER, SSO_USER } from "@/lib/constants";
import type { Transfer, User } from "@/lib/types";

const users = new Map<string, User>([
  [
    DEMO_USER.email,
    {
      id: DEMO_USER.id,
      name: DEMO_USER.name,
      email: DEMO_USER.email,
      password: DEMO_USER.password,
    },
  ],
  [
    SSO_USER.email,
    {
      id: SSO_USER.id,
      name: SSO_USER.name,
      email: SSO_USER.email,
    },
  ],
]);

const transfers: Transfer[] = [
  {
    id: "tr_aurora",
    recipient: "Aurora Press",
    email: "ap@aurora.press",
    amount: 1840,
    note: "Print run 48",
    status: "settled",
    createdAt: "2026-10-12T14:10:00.000Z",
  },
  {
    id: "tr_keel",
    recipient: "Keel Studio",
    email: "pay@keel.studio",
    amount: 620,
    note: "Retainer — October",
    status: "pending",
    createdAt: "2026-10-21T09:04:00.000Z",
  },
  {
    id: "tr_lumen",
    recipient: "Lumen Freight",
    email: "billing@lumenfreight.test",
    amount: 90,
    note: "Sample shipment",
    status: "failed",
    createdAt: "2026-10-24T18:41:00.000Z",
  },
];

export function getUserByEmail(email: string) {
  return users.get(email.toLowerCase());
}

export function getUserById(id: string) {
  return [...users.values()].find((user) => user.id === id);
}

export function createUser(input: Omit<User, "id">) {
  const existing = getUserByEmail(input.email);
  if (existing) {
    throw new Error("An account with that email already exists.");
  }

  const user: User = {
    id: `user_${crypto.randomUUID().slice(0, 8)}`,
    name: input.name,
    email: input.email.toLowerCase(),
    password: input.password,
  };
  users.set(user.email, user);
  return user;
}

export function upsertSsoUser() {
  const current = getUserByEmail(SSO_USER.email);
  if (current) return current;
  const user: User = { ...SSO_USER };
  users.set(user.email, user);
  return user;
}

export function listTransfers() {
  return [...transfers].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getTransfer(id: string) {
  return transfers.find((transfer) => transfer.id === id);
}

export function createTransfer(input: {
  recipient: string;
  email: string;
  amount: number;
  note: string;
}) {
  const transfer: Transfer = {
    id: `tr_${crypto.randomUUID().slice(0, 8)}`,
    recipient: input.recipient,
    email: input.email.toLowerCase(),
    amount: input.amount,
    note: input.note,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  transfers.unshift(transfer);
  return transfer;
}
