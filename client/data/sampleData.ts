export type Expense = {
  id: number;
  title: string;
  category: string;
  amount: number;
  date: string; // ISO string
  note?: string;
  paymentMethod?: "Cash" | "UPI" | "Card";
  tag?: "Need" | "Want";
};

export const expenses: Expense[] = [
  { id: 1, title: "Grocery", category: "Food", amount: 520, date: "2025-09-18", note: "Weekly groceries", paymentMethod: "UPI", tag: "Need" },
  { id: 2, title: "Coffee", category: "Food", amount: 120, date: "2025-09-19", note: "Cafe", paymentMethod: "Cash", tag: "Want" },
  { id: 3, title: "Transport", category: "Commute", amount: 80, date: "2025-09-20", note: "Metro", paymentMethod: "Card", tag: "Need" },
  { id: 4, title: "Dining", category: "Food", amount: 280, date: "2025-09-21", note: "Pasta Corner", paymentMethod: "UPI", tag: "Want" },
  { id: 5, title: "Movies", category: "Leisure", amount: 350, date: "2025-09-22", note: "Cinema", paymentMethod: "Card", tag: "Want" },
  { id: 6, title: "Snacks", category: "Food", amount: 60, date: "2025-09-23", note: "Evening", paymentMethod: "Cash", tag: "Want" },
  { id: 7, title: "Gym", category: "Health", amount: 700, date: "2025-09-24", note: "Monthly", paymentMethod: "Card", tag: "Need" },
  { id: 8, title: "Taxi", category: "Transport", amount: 140, date: "2025-09-25", note: "RideShare", paymentMethod: "Cash", tag: "Need" }
];

export type StreakDay = { date: string; spent: number };
export const streaks = {
  currentStreak: 6,
  bestStreak: 14,
  days: [
    { date: "2025-09-01", spent: 0 },
    { date: "2025-09-02", spent: 36 },
    { date: "2025-09-03", spent: 42 },
    { date: "2025-09-04", spent: 95 },
    { date: "2025-09-05", spent: 38 },
    { date: "2025-09-06", spent: 40 },
    { date: "2025-09-07", spent: 22 },
    { date: "2025-09-08", spent: 31 },
    { date: "2025-09-09", spent: 27 },
    { date: "2025-09-10", spent: 44 },
    { date: "2025-09-11", spent: 120 },
    { date: "2025-09-12", spent: 32 },
    { date: "2025-09-13", spent: 19 },
    { date: "2025-09-14", spent: 40 },
    { date: "2025-09-15", spent: 22 },
    { date: "2025-09-16", spent: 88 },
    { date: "2025-09-17", spent: 35 },
    { date: "2025-09-18", spent: 0 },
    { date: "2025-09-19", spent: 0 },
    { date: "2025-09-20", spent: 20 },
    { date: "2025-09-21", spent: 50 },
    { date: "2025-09-22", spent: 40 },
    { date: "2025-09-23", spent: 110 },
    { date: "2025-09-24", spent: 0 },
    { date: "2025-09-25", spent: 20 },
    { date: "2025-09-26", spent: 0 },
    { date: "2025-09-27", spent: 0 },
    { date: "2025-09-28", spent: 26 },
    { date: "2025-09-29", spent: 0 },
    { date: "2025-09-30", spent: 96 }
  ] as StreakDay[],
};

export const savings = {
  current: 1120,
  target: 2000,
  name: "Goa Trip",
  deadline: "2025-12-31",
};
