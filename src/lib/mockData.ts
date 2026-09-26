// Centralized mock data for UbuntuPay demo (no backend)
export type Role = "admin" | "treasurer" | "member";

export interface Member {
  id: string;
  name: string;
  initials: string;
  phone: string;
  email: string;
  role: Role;
  joined: string;
  paidThisMonth: boolean;
  totalContributed: number;
}

export interface Contribution {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  date: string;
  method: "EFT" | "Cash" | "Card" | "Mobile";
  reference?: string;
}

export interface Loan {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  remaining: number;
  interest: number;
  monthsLeft: number;
  totalMonths: number;
  status: "Active" | "Paid" | "Pending";
  dueDate: string;
}

export interface Transaction {
  id: string;
  date: string;
  member: string;
  type: "Contribution" | "Loan Repayment" | "Loan Disbursement" | "Withdrawal" | "Fee";
  amount: number;
  balance: number;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
  type: "info" | "success" | "warning";
}

export const currentUser = {
  id: "u1",
  name: "Thabo Mokoena",
  initials: "TM",
  email: "thabo@example.co.za",
  phone: "+27 82 555 0142",
  role: "admin" as Role,
};

export const stokvel = {
  id: "g1",
  name: "Ubuntu Savings Group",
  contributionAmount: 1000,
  frequency: "Monthly",
  payoutCycle: "Annual",
  memberCount: 8,
  balance: 45230,
  monthlyTarget: 8000,
  monthlyCollected: 6500,
  nextContribution: "2026-05-25",
  createdAt: "2024-01-15",
};

export const members: Member[] = [
  { id: "m1", name: "Thabo Mokoena", initials: "TM", phone: "+27 82 555 0142", email: "thabo@example.co.za", role: "admin", joined: "2024-01-15", paidThisMonth: true, totalContributed: 16000 },
  { id: "m2", name: "Nomsa Khumalo", initials: "NK", phone: "+27 83 444 0211", email: "nomsa@example.co.za", role: "treasurer", joined: "2024-01-15", paidThisMonth: true, totalContributed: 16000 },
  { id: "m3", name: "Sipho Ndlovu", initials: "SN", phone: "+27 71 333 0982", email: "sipho@example.co.za", role: "member", joined: "2024-02-01", paidThisMonth: true, totalContributed: 15000 },
  { id: "m4", name: "Thandi Mthembu", initials: "TM", phone: "+27 84 222 7733", email: "thandi@example.co.za", role: "member", joined: "2024-02-15", paidThisMonth: false, totalContributed: 14000 },
  { id: "m5", name: "Lerato Pule", initials: "LP", phone: "+27 76 111 4422", email: "lerato@example.co.za", role: "member", joined: "2024-03-01", paidThisMonth: true, totalContributed: 13000 },
  { id: "m6", name: "Bongani Dlamini", initials: "BD", phone: "+27 79 888 5511", email: "bongani@example.co.za", role: "member", joined: "2024-03-15", paidThisMonth: false, totalContributed: 12000 },
  { id: "m7", name: "Zanele Mahlangu", initials: "ZM", phone: "+27 81 666 2299", email: "zanele@example.co.za", role: "member", joined: "2024-04-01", paidThisMonth: true, totalContributed: 11000 },
  { id: "m8", name: "Mandla Zulu", initials: "MZ", phone: "+27 73 555 8866", email: "mandla@example.co.za", role: "member", joined: "2024-05-01", paidThisMonth: true, totalContributed: 10000 },
];

export const contributions: Contribution[] = [
  { id: "c1", memberId: "m1", memberName: "Thabo Mokoena", amount: 1000, date: "2026-04-25", method: "EFT", reference: "April" },
  { id: "c2", memberId: "m2", memberName: "Nomsa Khumalo", amount: 1000, date: "2026-04-25", method: "EFT", reference: "April" },
  { id: "c3", memberId: "m3", memberName: "Sipho Ndlovu", amount: 1000, date: "2026-04-24", method: "Mobile", reference: "April" },
  { id: "c4", memberId: "m5", memberName: "Lerato Pule", amount: 1000, date: "2026-04-23", method: "Cash", reference: "April" },
  { id: "c5", memberId: "m7", memberName: "Zanele Mahlangu", amount: 1000, date: "2026-04-22", method: "EFT", reference: "April" },
  { id: "c6", memberId: "m8", memberName: "Mandla Zulu", amount: 1000, date: "2026-04-21", method: "Mobile", reference: "April" },
  { id: "c7", memberId: "m1", memberName: "Thabo Mokoena", amount: 1000, date: "2026-03-25", method: "EFT", reference: "March" },
  { id: "c8", memberId: "m2", memberName: "Nomsa Khumalo", amount: 1000, date: "2026-03-25", method: "EFT", reference: "March" },
];

export const loans: Loan[] = [
  { id: "l1", memberId: "m3", memberName: "Sipho Ndlovu", amount: 5000, remaining: 3200, interest: 5, monthsLeft: 4, totalMonths: 6, status: "Active", dueDate: "2026-09-30" },
  { id: "l2", memberId: "m4", memberName: "Thandi Mthembu", amount: 2000, remaining: 0, interest: 5, monthsLeft: 0, totalMonths: 3, status: "Paid", dueDate: "2026-02-28" },
  { id: "l3", memberId: "m6", memberName: "Bongani Dlamini", amount: 3500, remaining: 3500, interest: 5, monthsLeft: 6, totalMonths: 6, status: "Pending", dueDate: "2026-10-31" },
];

export const transactions: Transaction[] = [
  { id: "t1", date: "2026-04-25", member: "Nomsa Khumalo", type: "Contribution", amount: 1000, balance: 45230 },
  { id: "t2", date: "2026-04-25", member: "Thabo Mokoena", type: "Contribution", amount: 1000, balance: 44230 },
  { id: "t3", date: "2026-04-24", member: "Sipho Ndlovu", type: "Loan Repayment", amount: 900, balance: 43230 },
  { id: "t4", date: "2026-04-23", member: "Lerato Pule", type: "Contribution", amount: 1000, balance: 42330 },
  { id: "t5", date: "2026-04-20", member: "Bongani Dlamini", type: "Loan Disbursement", amount: -3500, balance: 41330 },
  { id: "t6", date: "2026-04-15", member: "Stokvel", type: "Fee", amount: -50, balance: 44830 },
];

export const notifications: Notification[] = [
  { id: "n1", title: "Contribution received", body: "Nomsa Khumalo paid R 1,000.", date: "2026-04-25", read: false, type: "success" },
  { id: "n2", title: "Loan approved", body: "Bongani Dlamini's R 3,500 loan was approved.", date: "2026-04-20", read: false, type: "info" },
  { id: "n3", title: "Contribution due", body: "Reminder: April contributions due by month-end.", date: "2026-04-18", read: true, type: "warning" },
];

// Monthly contribution chart data
export const monthlyChart = [
  { month: "Nov", amount: 7000 },
  { month: "Dec", amount: 8000 },
  { month: "Jan", amount: 7500 },
  { month: "Feb", amount: 8000 },
  { month: "Mar", amount: 7800 },
  { month: "Apr", amount: 6500 },
];

export const formatZAR = (n: number) =>
  `R ${n.toLocaleString("en-ZA", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
