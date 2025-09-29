import { useEffect, useMemo, useState } from "react";
import { useExpenses } from "@/state/expenses";
import { Button } from "@/components/ui/button";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import FusionCard from "@/components/FusionCard";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Expense } from "@/data/sampleData";

export default function FinanceFusion() {
  const { items: expenses } = useExpenses();
  const [stockData, setStockData] = useState<Record<
    string,
    { latestClose: number; changePercent: number }
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingsAmount, setSavingsAmount] = useState<number | "">("");
  const [expenseStockMap, setExpenseStockMap] = useState<Record<number, string>>(
    {}
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const availableStocks = useMemo(() => {
    if (!stockData) return [];
    return Object.keys(stockData);
  }, [stockData]);

  const fetchStockData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const symbols =
        "NIFTY_50.BSE,TCS.BSE,HDFCBANK.BSE,INFY.BSE,HINDUNILVR.BSE,RELIANCE.BSE,INDIGO.BSE,DMART.BSE";
      const response = await fetch(
        `http://localhost:8080/api/stocks/batch?symbols=${symbols}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch stock data");
      }
      const data = await response.json();
      setStockData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  const totalExpenses = useMemo(
    () => expenses.reduce((acc, e) => acc + e.amount, 0),
    [expenses]
  );

  useEffect(() => {
    if (totalExpenses > 0 && savingsAmount === "") {
      setSavingsAmount(totalExpenses);
    }
  }, [totalExpenses, savingsAmount]);

  const { shares, simulatedValue } = useMemo(() => {
    if (
      !stockData ||
      typeof savingsAmount !== "number" ||
      !stockData["INFY.BSE"]
    ) {
      return { shares: 0, simulatedValue: 0 };
    }
    const shares = savingsAmount / stockData["INFY.BSE"].latestClose;
    const simulatedValue =
      savingsAmount * (1 + stockData["INFY.BSE"].changePercent / 100);
    return { shares, simulatedValue };
  }, [savingsAmount, stockData]);

  const chartData = useMemo(() => {
    const weeklyData: Record<string, { expenses: number; invested: number }> = {};
    expenses.forEach((expense) => {
      const weekStartDate = new Date(expense.date);
      weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay());
      const weekKey = weekStartDate.toISOString().slice(0, 10);

      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { expenses: 0, invested: 0 };
      }
      weeklyData[weekKey].expenses += expense.amount;

      const stockSymbol = expenseStockMap[expense.id];
      if (stockSymbol && stockData?.[stockSymbol]) {
        const stock = stockData[stockSymbol];
        weeklyData[weekKey].invested +=
          expense.amount * (1 + stock.changePercent / 100);
      } else {
        weeklyData[weekKey].invested += expense.amount;
      }
    });
    return Object.entries(weeklyData)
      .map(([date, data]) => ({
        date: date.slice(5),
        expenses: data.expenses,
        invested: +data.invested.toFixed(2),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [expenses, expenseStockMap, stockData]);

  const handleMapStock = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const handleSelectStock = (stockSymbol: string) => {
    if (selectedExpense) {
      setExpenseStockMap((prev) => ({
        ...prev,
        [selectedExpense.id]: stockSymbol,
      }));
    }
    setIsModalOpen(false);
    setSelectedExpense(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchStockData} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[18px] border bg-white p-4 shadow-sm">
        <label
          htmlFor="savingsAmount"
          className="block text-sm font-medium text-gray-700"
        >
          Enter Savings Amount
        </label>
        <Input
          type="number"
          id="savingsAmount"
          value={savingsAmount}
          onChange={(e) => setSavingsAmount(Number(e.target.value) || "")}
          className="mt-1 w-full"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="text-xs text-gray-500">Could've bought</div>
          <div className="mt-2 text-2xl font-extrabold text-gray-900">
            {shares.toFixed(1)} shares • INFY
          </div>
        </div>
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="text-xs text-gray-500">Current Value</div>
          <div
            className={`mt-2 text-2xl font-extrabold ${
              simulatedValue >= (savingsAmount || 0)
                ? "text-emerald-600"
                : "text-red-600"
            }`}
          >
            ₹
            {simulatedValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {expenses.map((expense) => (
          <FusionCard
            key={expense.id}
            expense={expense}
            stockSymbol={expenseStockMap[expense.id]}
            stockData={stockData}
            onMapStock={() => handleMapStock(expense)}
          />
        ))}
      </div>

      <div className="rounded-[18px] border bg-white p-4 shadow-sm">
        <div className="mb-2 text-sm font-semibold">
          Expenses vs. Simulated Investment
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip
                formatter={(value: number) =>
                  `₹${value.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                }
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#f59e0b"
                fillOpacity={1}
                fill="url(#colorExpenses)"
              />
              <Area
                type="monotone"
                dataKey="invested"
                stroke="#22c55e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorInvested)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Map "{selectedExpense?.title}" to a Stock
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2">
            {availableStocks.map((stock) => (
              <Button
                key={stock}
                variant="outline"
                onClick={() => handleSelectStock(stock)}
              >
                {stock}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}