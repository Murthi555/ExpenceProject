import { useMemo, useState, useRef } from "react";
import { useExpenses } from "@/state/expenses";
import { Button } from "@/components/ui/button";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const COLORS = {
  Needs: "#22c55e", // Green for Needs
  Wants: "#f97316", // Orange for Wants
  Cash: "#3b82f6",
  Digital: "#8b5cf6",
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const total = data.Needs + data.Wants;
    const needsPercent = total > 0 ? ((data.Needs / total) * 100).toFixed(0) : 0;
    const wantsPercent = total > 0 ? ((data.Wants / total) * 100).toFixed(0) : 0;

    return (
      <div className="bg-white p-2 border rounded shadow-lg">
        <p className="font-bold">{label}</p>
        <p style={{ color: COLORS.Needs }}>
          Needs: {formatCurrency(data.Needs)} ({needsPercent}%)
        </p>
        <p style={{ color: COLORS.Wants }}>
          Wants: {formatCurrency(data.Wants)} ({wantsPercent}%)
        </p>
      </div>
    );
  }
  return null;
};

export default function WeeklyReport() {
  const { items: expenses } = useExpenses();
  const [weekOffset, setWeekOffset] = useState(0);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleExport = () => {
    if (reportRef.current) {
      html2canvas(reportRef.current).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const width = pdf.internal.pageSize.getWidth();
        const height = (canvas.height * width) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, width, height);
        pdf.save("weekly-report.pdf");
      });
    }
  };

  const { totalExpenses, dailyData, cashTotal, digitalTotal } = useMemo(() => {
    const today = new Date();
    const currentDay = today.getDay();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - currentDay - 7 * weekOffset);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 7);

    const weeklyExpenses = expenses.filter((e) => {
      const expenseDate = new Date(e.date);
      return expenseDate >= startDate && expenseDate < endDate;
    });

    const totalExpenses = weeklyExpenses.reduce(
      (acc, e) => acc + e.amount,
      0
    );

    const cashTotal = weeklyExpenses
      .filter((e) => e.paymentMethod === "Cash")
      .reduce((acc, e) => acc + e.amount, 0);
    const digitalTotal = totalExpenses - cashTotal;

    const dailyData = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      const dayExpenses = weeklyExpenses.filter(
        (e) => new Date(e.date).getDay() === day.getDay()
      );
      return {
        name: day.toLocaleDateString("en-US", { weekday: "short" }),
        Wants: dayExpenses
          .filter((e) => e.tag === "Want")
          .reduce((acc, e) => acc + e.amount, 0),
        Needs: dayExpenses
          .filter((e) => e.tag === "Need")
          .reduce((acc, e) => acc + e.amount, 0),
      };
    });

    return {
      totalExpenses,
      dailyData,
      cashTotal,
      digitalTotal,
    };
  }, [expenses, weekOffset]);

  const pieData = [
    { name: "Digital", value: digitalTotal, color: COLORS.Digital },
    { name: "Cash", value: cashTotal, color: COLORS.Cash },
  ];

  return (
    <div className="space-y-6" ref={reportRef}>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Weekly Report</h1>
        <div className="text-lg">
          Total Weekly Expenses:{" "}
          <span className="font-bold">{formatCurrency(totalExpenses)}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Needs vs Wants</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="Needs" stackId="a" fill={COLORS.Needs} />
              <Bar dataKey="Wants" stackId="a" fill={COLORS.Wants} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Cash vs Digital</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={handleExport}>Export as PDF</Button>
      </div>
    </div>
  );
}