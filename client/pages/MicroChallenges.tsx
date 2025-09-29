import { useEffect, useMemo, useRef, useState } from "react";
import { useExpenses } from "@/state/expenses";
import { Button } from "@/components/ui/button";

// Time helpers
const startOfDay = (d: Date) => { const x = new Date(d); x.setHours(0,0,0,0); return x; };
const endOfDay = (d: Date) => { const x = startOfDay(d); x.setDate(x.getDate()+1); x.setMilliseconds(-1); return x; };
const startOfWeek = (d: Date) => { const x = new Date(d); const day = x.getDay(); const diff = (day+6)%7; x.setDate(x.getDate()-diff); x.setHours(0,0,0,0); return x; };
const endOfWeek = (d: Date) => { const s = startOfWeek(d); const e = new Date(s); e.setDate(s.getDate()+7); e.setMilliseconds(-1); return e; };

// Challenge types
type ChallengeType = "today" | "week";

type EvalResult = {
  progress: number; // 0..1 visual metric (spend ratio)
  successNow: boolean; // whether success if ends now
  failedNow: boolean; // whether failed now
  context?: string;
};

type ChallengeDef = {
  id: string;
  type: ChallengeType;
  title: (now: Date) => string;
  evaluate: (args: { now: Date; from: Date; to: Date; items: ReturnType<typeof useExpenses>["items"] }) => EvalResult;
};

// Expanded library of challenges
const CHALLENGES: ChallengeDef[] = [
  {
    id: "snacks_under_200_today",
    type: "today",
    title: () => "Spend less than ₹200 on Snacks today 🍫",
    evaluate: ({ from, to, items }) => {
      const spent = items.filter(e => {
        const t = new Date(e.date); if(t < from || t > to) return false;
        return (e.title?.toLowerCase().includes("snack") || e.category?.toLowerCase().includes("snack"));
      }).reduce((a,b)=>a+b.amount,0);
      const limit = 200;
      return { progress: Math.min(1, spent/limit), successNow: spent <= limit, failedNow: spent > limit, context: `₹${spent} / ₹${limit}` };
    },
  },
  {
    id: "wants_under_30_week",
    type: "week",
    title: () => "Keep 'Wants' under 30% this week 🎯",
    evaluate: ({ from, to, items }) => {
      const week = items.filter(e => { const t = new Date(e.date); return t >= from && t <= to; });
      const total = week.reduce((a,b)=>a+b.amount,0) || 1;
      const wants = week.filter(e=>e.tag === 'Want').reduce((a,b)=>a+b.amount,0);
      const ratio = wants/total; // lower is better
      return { progress: Math.min(1, ratio), successNow: ratio <= 0.30, failedNow: false, context: `${Math.round(ratio*100)}% Wants` };
    },
  },
  {
    id: "coffee_under_150_today",
    type: "today",
    title: () => "Keep Coffee spend under ₹150 ☕",
    evaluate: ({ from, to, items }) => {
      const spent = items.filter(e => { const t=new Date(e.date); if(t<from||t>to) return false; return e.title?.toLowerCase().includes("coffee"); }).reduce((a,b)=>a+b.amount,0);
      const limit = 150; return { progress: Math.min(1, spent/limit), successNow: spent <= limit, failedNow: spent>limit, context: `₹${spent} / ₹${limit}` };
    }
  },
  {
    id: "daily_total_under_500_today",
    type: "today",
    title: () => "Spend under ₹500 today 💸",
    evaluate: ({ from, to, items }) => { const spent = items.filter(e=>{const t=new Date(e.date); return t>=from && t<=to;}).reduce((a,b)=>a+b.amount,0); const limit = 500; return { progress: Math.min(1, spent/limit), successNow: spent<=limit, failedNow: spent>limit, context: `₹${spent} / ₹${limit}` }; }
  },
  {
    id: "digital_over_cash_week",
    type: "week",
    title: () => "Use digital more than cash this week 💳",
    evaluate: ({ from, to, items }) => {
      const week = items.filter(e => { const t=new Date(e.date); return t>=from && t<=to; });
      const cash = week.filter(e=>e.paymentMethod==='Cash').reduce((a,b)=>a+b.amount,0);
      const digital = week.reduce((a,b)=>a+(b.paymentMethod==='Cash'?0:b.amount),0);
      const ratio = digital/Math.max(1, cash+digital);
      return { progress: Math.min(1, ratio), successNow: ratio>0.5, failedNow: false, context: `${Math.round(ratio*100)}% Digital` };
    }
  },
  {
    id: "no_dining_out_today",
    type: "today",
    title: () => "No dining out today 🍔",
    evaluate: ({ from, to, items }) => {
        const spent = items.filter(e => {
            const t = new Date(e.date);
            return t >= from && t <= to && e.category?.toLowerCase() === "dining";
        }).reduce((a, b) => a + b.amount, 0);
        return { progress: spent > 0 ? 1 : 0, successNow: spent === 0, failedNow: spent > 0, context: `Spent ₹${spent} on dining` };
    },
  },
  {
      id: "transport_under_1000_week",
      type: "week",
      title: () => "Keep transport costs under ₹1000 this week 🚌",
      evaluate: ({ from, to, items }) => {
          const spent = items.filter(e => {
              const t = new Date(e.date);
              return t >= from && t <= to && (e.category?.toLowerCase() === "commute" || e.category?.toLowerCase() === "transport");
          }).reduce((a, b) => a + b.amount, 0);
          const limit = 1000;
          return { progress: Math.min(1, spent / limit), successNow: spent <= limit, failedNow: spent > limit, context: `₹${spent} / ₹${limit}` };
      },
  },
];

const STORAGE_ACTIVE = "micro-challenge-active";
const STORAGE_HISTORY = "micro-challenge-history";

type HistoryItem = { id: string; title: string; result: "success"|"failed"; endedAt: string };

type ActiveChallenge = { id: string; type: ChallengeType; title: string; from: string; to: string };

function pickChallenge(now: Date): ActiveChallenge {
  const def = CHALLENGES[Math.floor(Math.random()*CHALLENGES.length)];
  const from = def.type === 'today' ? startOfDay(now) : startOfWeek(now);
  const to = def.type === 'today' ? endOfDay(now) : endOfWeek(now);
  return { id: def.id, type: def.type, title: def.title(now), from: from.toISOString(), to: to.toISOString() };
}

function Confetti({ show }: { show: boolean }){
  const pieces = 40;
  return (
    <div className={`pointer-events-none fixed inset-0 ${show?'' : 'hidden'}`}> {
      Array.from({ length: pieces }).map((_, i) => (
        <div key={i} className="absolute size-2 rounded-sm" style={{
          left: `${(i*73)%100}%`, top: `-10%`, background: ["#f59e0b","#84cc16","#22c55e","#a78bfa","#60a5fa"][i%5],
          animation: `fall ${1200 + (i%5)*200}ms ease-out ${(i%10)*50}ms forwards`
        }} />
      ))
    } </div>
  );
}

export default function MicroChallenges(){
  const { items } = useExpenses();
  const [active, setActive] = useState<ActiveChallenge | null>(() => {
    const raw = localStorage.getItem(STORAGE_ACTIVE);
    if(!raw) return null; try { return JSON.parse(raw); } catch { return null; }
  });
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const raw = localStorage.getItem(STORAGE_HISTORY); if(!raw) return []; try { return JSON.parse(raw); } catch { return []; }
  });
  const [now, setNow] = useState(new Date());
  const [celebrate, setCelebrate] = useState(false);

  // tick per second for timer
  useEffect(()=>{ const id = setInterval(()=> setNow(new Date()), 1000); return ()=>clearInterval(id); }, []);

  // ensure active challenge exists & rolls over
  useEffect(()=>{
    if (!active || new Date(active.to) < now) {
      if (active) {
        const def = CHALLENGES.find(c => c.id === active.id);
        if (def) {
          const range = { from: new Date(active.from), to: new Date(active.to) };
          const evalRes = def.evaluate({ now, from: range.from, to: range.to, items });
          const result = evalRes.successNow && !evalRes.failedNow ? "success" : "failed";
          const newHistoryItem: HistoryItem = { id: active.id, title: active.title, result, endedAt: new Date().toISOString() };
          const updatedHistory = [newHistoryItem, ...history];
          setHistory(updatedHistory);
          localStorage.setItem(STORAGE_HISTORY, JSON.stringify(updatedHistory));
        }
      }
      const newChallenge = pickChallenge(now);
      setActive(newChallenge);
      localStorage.setItem(STORAGE_ACTIVE, JSON.stringify(newChallenge));
    }
  }, [now, active, history, items]);

  const def = useMemo(()=> CHALLENGES.find(c=>c.id===active?.id), [active]);

  const range = useMemo(()=> active ? { from: new Date(active.from), to: new Date(active.to) } : { from: now, to: now }, [active, now]);

  const evalRes = useMemo(()=>{
    if(!def || !active) return { progress: 0, successNow: false, failedNow: false, context: "" } as EvalResult;
    return def.evaluate({ now, from: range.from, to: range.to, items });
  }, [def, active, items, now, range]);

  // handle completion/expiry
  const status: "pending"|"success"|"failed" = (()=>{
    if(!active) return "pending";
    if(now < range.to){
      return evalRes.failedNow ? "failed" : "pending"; // can fail mid-period when over limit
    }
    return evalRes.successNow && !evalRes.failedNow ? "success" : "failed";
  })();

  const timeLeftMs = Math.max(0, (range.to.getTime() - now.getTime()));
  const hrs = Math.floor(timeLeftMs/3600000), mins = Math.floor((timeLeftMs%3600000)/60000), secs = Math.floor((timeLeftMs%60000)/1000);

  useEffect(()=>{
    if(status === 'success' && !celebrate){ setCelebrate(true); const t=setTimeout(()=>setCelebrate(false), 2000); return ()=>clearTimeout(t); }
  }, [status, celebrate]);

  const pct = Math.round(evalRes.progress*100);

  return (
    <div className="relative space-y-6">
      <style>
        {`@keyframes fall { to { transform: translateY(120vh) rotate(360deg); opacity: 0.8; } }`}
      </style>
      <Confetti show={celebrate} />

      <div className="rounded-[28px] bg-gradient-to-br from-yellow-200 via-yellow-200/80 to-amber-200 p-1">
        <div className="rounded-[26px] bg-white/70 p-5 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <div className="text-lg font-extrabold text-gray-900">Micro-Challenges</div>
            <div className="text-xs font-medium text-gray-600">{active?.type === 'today' ? 'Today' : 'This Week'} • {hrs.toString().padStart(2,'0')}:{mins.toString().padStart(2,'0')}:{secs.toString().padStart(2,'0')} left</div>
          </div>

          <div className="mt-4 rounded-2xl border bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold text-gray-900">{active?.title}</div>
            <div className="mt-3 h-4 w-full rounded-full bg-gray-100">
              <div className={`h-full rounded-full`} style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #22c55e, #facc15, #f43f5e)', transition: 'width 600ms ease' }} />
            </div>
            <div className="mt-2 text-xs text-gray-600">{evalRes.context}</div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border bg-white p-4 text-center shadow-sm">
              {status === 'success' ? (
                <div className="space-y-2">
                  <div className="mx-auto grid size-16 place-items-center rounded-full bg-yellow-100 text-3xl">🏆</div>
                  <div className="text-sm font-semibold text-emerald-600">Challenge Completed!</div>
                </div>
              ) : status === 'failed' ? (
                <div className="space-y-2">
                  <div className="mx-auto grid size-16 place-items-center rounded-full bg-red-100 text-3xl">😵‍💫</div>
                  <div className="text-sm font-semibold text-red-600">Game Over — try again tomorrow!</div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="mx-auto grid size-16 place-items-center rounded-full bg-blue-100 text-3xl">⏳</div>
                  <div className="text-sm font-semibold text-blue-600">In Progress…</div>
                </div>
              )}
            </div>

            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="mb-2 text-sm font-semibold">Challenge History</div>
              <ul className="space-y-2 text-sm">
                {history.length === 0 && <li className="text-gray-500">No past challenges yet.</li>}
                {history.map((h,i)=> (
                  <li key={i} className="flex items-center justify-between rounded-xl border bg-white px-3 py-2 shadow-sm">
                    <span className="truncate pr-2">{h.title}</span>
                    <span className={`grid size-6 place-items-center rounded-full text-xs ${h.result==='success'?'bg-emerald-100 text-emerald-700':'bg-red-100 text-red-700'}`}>{h.result==='success'?'✔️':'❌'}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="secondary" className="rounded-full bg-yellow-100 text-gray-900 hover:bg-yellow-200" onClick={()=>{ const next = pickChallenge(new Date()); setActive(next); localStorage.setItem(STORAGE_ACTIVE, JSON.stringify(next)); }}>New Random Challenge</Button>
      </div>
    </div>
  );
}