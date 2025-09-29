import { NavLink } from "react-router-dom";

const item = (
  label: string,
  to: string,
) => (
  <NavLink
    key={to}
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
        isActive
          ? "bg-yellow-200 text-gray-900 shadow-inner"
          : "text-gray-700 hover:bg-yellow-100"
      }`}
  >
    {label}
  </NavLink>
);

export default function Sidebar() {
  return (
    <aside className="hidden md:block sticky top-16 self-start min-h-[calc(100vh-4rem)] w-60 shrink-0 border-r bg-yellow-50/80 px-3 py-4">
      <div className="space-y-1">
        {item("Expenses", "/")}
        {item("Daily Streaks", "/streaks")}
        {item("Savings Jar", "/savings")}
        {item("Quick Split Mode", "/quick-split")}
        {item("Micro-Challenges", "/challenges")}
        {item("Finance Fusion", "/fusion")}
        {item("Weekly Report", "/weekly-report")}
        {item("Budget vs Expense", "/budget")}
      </div>
    </aside>
  );
}