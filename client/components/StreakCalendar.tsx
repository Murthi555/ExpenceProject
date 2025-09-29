import { useMemo, useState } from "react";
import { streaks as defaultStreaks } from "@/data/sampleData";

const dayOfWeek = (date: Date) => (date.getDay());

function DayCell({ date, amount }: { date: Date; amount: number }) {
  const status = amount === 0 ? "no" : amount > 60 ? "over" : "in";
  return (
    <div className="rounded-xl border bg-white p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
        <span>{date.getDate()}</span>
        <span className={status === "over" ? "text-red-500" : status === "in" ? "text-emerald-600" : "text-gray-400"}>
          {status === "over" ? "Over" : status === "in" ? "In budget" : "No spend"}
        </span>
      </div>
      <div className="text-lg font-semibold">${amount}</div>
      {status !== "no" && (
        <div className={`mt-3 h-1.5 rounded-full ${status === "over" ? "bg-red-300" : "bg-emerald-300"}`} />
      )}
    </div>
  );
}

export default function StreakCalendar() {
  const [month, setMonth] = useState(8); // 0-indexed, 8 => September
  const [year, setYear] = useState(2025);

  const monthDays = useMemo(() => {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const prefix = Array(dayOfWeek(first)).fill(null);
    const days = Array.from({ length: last.getDate() }, (_, i) => new Date(year, month, i + 1));
    return [...prefix, ...days];
  }, [month, year]);

  const amounts = useMemo(() => {
    const map = new Map<string, number>();
    defaultStreaks.days.forEach(d => map.set(d.date, d.spent));
    return map;
  }, []);

  return (
    <div className="rounded-3xl border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="rounded-lg border px-3 py-1 text-sm" onClick={()=> setMonth(m => (m-1+12)%12)}>&lt; Prev</button>
          <div className="rounded-lg border px-3 py-1 text-sm">{new Date(year, month, 1).toLocaleString(undefined, { month: "long", year: "numeric" })}</div>
          <button className="rounded-lg border px-3 py-1 text-sm" onClick={()=> setMonth(m => (m+1)%12)}>Next &gt;</button>
        </div>
        <div className="hidden md:flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1"><span className="inline-block size-2 rounded-full bg-emerald-500"/> Within budget</div>
          <div className="flex items-center gap-1"><span className="inline-block size-2 rounded-full bg-red-500"/> Over budget</div>
          <div className="flex items-center gap-1"><span className="inline-block size-2 rounded-full bg-gray-400"/> No spend</div>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-3">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=> <div key={d} className="px-1 text-xs font-medium text-gray-500">{d}</div>)}
        {monthDays.map((d, i) => (
          <div key={i} className="min-h-24">
            {d ? (
              <DayCell date={d} amount={amounts.get(d.toISOString().slice(0,10)) ?? 0} />
            ) : (
              <div />
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="text-sm text-gray-500">This Month</div>
          <div className="mt-2 text-2xl font-bold">$1,024 spent</div>
          <ul className="mt-3 space-y-1 text-sm text-gray-600">
            <li>12-day streak</li>
            <li>21 days in budget</li>
            <li>5 over-budget days</li>
          </ul>
        </div>
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="text-sm text-gray-500">Tips</div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
            <li>Batch grocery shopping once a week.</li>
            <li>Set category budgets.</li>
            <li>Enable daily budget reminders.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
