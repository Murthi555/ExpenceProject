import { useMemo, useState, useEffect } from "react";
import { useExpenses } from "@/state/expenses";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const BUDGET_STORAGE_KEY = "budgets";

export default function BudgetVsExpense() {
  const { items: expenses } = useExpenses();
  const [budgets, setBudgets] = useState<{
    daily: number;
    weekly: number;
    monthly: number;
  }>(() => {
    const savedBudgets = localStorage.getItem(BUDGET_STORAGE_KEY);
    return savedBudgets
      ? JSON.parse(savedBudgets)
      : { daily: 0, weekly: 0, monthly: 0 };
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    dailyExpenses,
    weeklyExpenses,
    monthlyExpenses,
    totalBudget,
    totalExpenses,
  } = useMemo(() => {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const daily = expenses
      .filter((e) => e.date === today)
      .reduce((sum, e) => sum + e.amount, 0);

    const weekly = expenses
      .filter((e) => new Date(e.date) >= startOfWeek)
      .reduce((sum, e) => sum + e.amount, 0);

    const monthly = expenses
      .filter((e) => new Date(e.date) >= startOfMonth)
      .reduce((sum, e) => sum + e.amount, 0);

    const totalBudget = budgets.daily + budgets.weekly + budgets.monthly;
    const totalExpenses = daily + weekly + monthly;

    return {
      dailyExpenses: daily,
      weeklyExpenses: weekly,
      monthlyExpenses: monthly,
      totalBudget,
      totalExpenses,
    };
  }, [expenses, budgets]);

  useEffect(() => {
    localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(budgets));
  }, [budgets]);

  const getProgressColor = (value: number) => {
    if (value > 100) return "bg-red-500";
    if (value > 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const ProgressBar = ({
    label,
    current,
    total,
  }: {
    label: string;
    current: number;
    total: number;
  }) => {
    if (total === 0) {
      return (
        <div>
          <div className="flex justify-between">
            <span>{label}</span>
            <span className="text-gray-500">No budget set</span>
          </div>
          <Progress value={0} />
          <p className="text-sm text-gray-500 mt-1">
            Set a budget to track progress
          </p>
        </div>
      );
    }
    const percentage = (current / total) * 100;
    return (
      <div>
        <div className="flex justify-between">
          <span>{label}</span>
          <span>
            {formatCurrency(current)} / {formatCurrency(total)}
          </span>
        </div>
        <Progress
          value={Math.min(100, percentage)}
          className={`w-full [&>div]:${getProgressColor(percentage)}`}
        />
        <p className="text-sm text-gray-500 mt-1">
          {percentage.toFixed(0)}% of budget used
        </p>
      </div>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Budget vs Expense</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>Adjust Budget</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Budgets</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label>Daily Budget</label>
                <Input
                  type="number"
                  value={budgets.daily}
                  onChange={(e) =>
                    setBudgets({ ...budgets, daily: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <label>Weekly Budget</label>
                <Input
                  type="number"
                  value={budgets.weekly}
                  onChange={(e) =>
                    setBudgets({ ...budgets, weekly: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <label>Monthly Budget</label>
                <Input
                  type="number"
                  value={budgets.monthly}
                  onChange={(e) =>
                    setBudgets({ ...budgets, monthly: Number(e.target.value) })
                  }
                />
              </div>
              <Button onClick={() => setIsModalOpen(false)}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-8">
        <ProgressBar
          label="Total"
          current={totalExpenses}
          total={totalBudget}
        />
        <ProgressBar
          label="Daily Limit"
          current={dailyExpenses}
          total={budgets.daily}
        />
        <ProgressBar
          label="Weekly Limit"
          current={weeklyExpenses}
          total={budgets.weekly}
        />
        <ProgressBar
          label="Monthly Limit"
          current={monthlyExpenses}
          total={budgets.monthly}
        />
      </div>
    </div>
  );
}