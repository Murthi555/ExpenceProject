import { createContext, useContext, useMemo, useState } from "react";
import { expenses as seed, Expense } from "@/data/sampleData";

export type ExpensesContextValue = {
  items: Expense[];
  add: (e: Omit<Expense, "id">) => void;
};

const ExpensesContext = createContext<ExpensesContextValue | null>(null);

export function ExpensesProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Expense[]>(seed);

  const add = (e: Omit<Expense, "id">) => {
    setItems((prev) => [{ ...e, id: Date.now() }, ...prev]);
  };

  const value = useMemo(() => ({ items, add }), [items]);
  return <ExpensesContext.Provider value={value}>{children}</ExpensesContext.Provider>;
}

export function useExpenses() {
  const ctx = useContext(ExpensesContext);
  if (!ctx) throw new Error("useExpenses must be used within ExpensesProvider");
  return ctx;
}
