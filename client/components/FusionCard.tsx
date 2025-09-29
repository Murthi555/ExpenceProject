import { useMemo } from "react";
import type { Expense } from "@/data/sampleData";
import { Button } from "./ui/button";

type StockData = {
  latestClose: number;
  changePercent: number;
};

type FusionCardProps = {
  expense: Expense;
  stockSymbol: string | undefined;
  stockData: Record<string, StockData> | null;
  onMapStock: () => void;
};

export default function FusionCard({
  expense,
  stockSymbol,
  stockData,
  onMapStock,
}: FusionCardProps) {
  const { ifInvested, changeIndicator, color } = useMemo(() => {
    if (!stockSymbol || !stockData || !stockData[stockSymbol]) {
      return {
        ifInvested: expense.amount,
        changeIndicator: "",
        color: "text-gray-500",
      };
    }

    const stock = stockData[stockSymbol];
    const ifInvested =
      expense.amount * (1 + (stock.changePercent || 0) / 100);
    const changeIndicator = stock.changePercent >= 0 ? "▲" : "▼";
    const color =
      stock.changePercent >= 0 ? "text-emerald-600" : "text-red-600";
    return { ifInvested, changeIndicator, color };
  }, [expense.amount, stockSymbol, stockData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="mb-2 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 font-semibold">
          {expense.title}
        </div>
      </div>
      <div className="grid gap-1 text-sm">
        <div className="flex items-center justify-between text-gray-600">
          <span>Spent</span>
          <span className="font-semibold">{formatCurrency(expense.amount)}</span>
        </div>
        <div className="flex items-center justify-between text-gray-600">
          <span>Mapped Stock</span>
          <span className="font-semibold">{stockSymbol || "N/A"}</span>
        </div>
        <div className="flex items-center justify-between text-gray-600">
          <span>If Invested</span>
          <span className={`font-semibold ${color}`}>
            {changeIndicator} {formatCurrency(ifInvested)}
          </span>
        </div>
      </div>
      <Button onClick={onMapStock} className="mt-4 w-full" size="sm">
        Map to Stock
      </Button>
    </div>
  );
}