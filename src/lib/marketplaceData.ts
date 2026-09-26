export interface MarketStokvel {
  id: string;
  name: string;
  category: "Savings" | "Burial" | "Investment" | "Grocery" | "Education";
  location: string;
  members: number;
  capacity: number;
  contribution: number;
  frequency: "Monthly" | "Weekly";
  feePct: number;
  interestPct: number;
  rating: number;
  verified: boolean;
  description: string;
  admin: string;
}

export const marketStokvels: MarketStokvel[] = [
  { id: "ms1", name: "Soweto Savers Circle", category: "Savings", location: "Soweto, GP", members: 18, capacity: 25, contribution: 500, frequency: "Monthly", feePct: 2, interestPct: 6, rating: 4.8, verified: true, description: "Active community savings club paying out every December.", admin: "Nomsa Khumalo" },
  { id: "ms2", name: "Khayelitsha Burial Society", category: "Burial", location: "Khayelitsha, WC", members: 42, capacity: 60, contribution: 200, frequency: "Monthly", feePct: 1.5, interestPct: 0, rating: 4.6, verified: true, description: "Dignified burial cover for members and immediate family.", admin: "Sipho Ndlovu" },
  { id: "ms3", name: "Tembisa Investment Club", category: "Investment", location: "Tembisa, GP", members: 12, capacity: 15, contribution: 1500, frequency: "Monthly", feePct: 3, interestPct: 9, rating: 4.9, verified: true, description: "Pooled JSE-linked investment with quarterly reviews.", admin: "Lerato Pule" },
  { id: "ms4", name: "Mamelodi Grocery Stokvel", category: "Grocery", location: "Mamelodi, GP", members: 22, capacity: 30, contribution: 350, frequency: "Monthly", feePct: 1, interestPct: 0, rating: 4.4, verified: false, description: "Year-end bulk grocery payout for member households.", admin: "Bongani Dlamini" },
  { id: "ms5", name: "Umlazi Education Fund", category: "Education", location: "Umlazi, KZN", members: 9, capacity: 20, contribution: 800, frequency: "Monthly", feePct: 2.5, interestPct: 4, rating: 4.7, verified: true, description: "Helps members fund children's school fees and books.", admin: "Zanele Mahlangu" },
];
