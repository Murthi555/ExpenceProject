import { useEffect, useMemo, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import type { SavingsState } from "./SavingsJar";

const STORAGE_KEY = "savings-jar";

export default function SavingsJarStacked({ initial }: { initial: SavingsState }) {
  const [state, setState] = useState<SavingsState>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : initial;
  });
  const [amount, setAmount] = useState(100);
  const pct = useMemo(() => Math.max(0, Math.min(100, (state.current / Math.max(1, state.target)) * 100)), [state]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }, [state]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Savings Challenge Jar</h2>
          <div className="text-sm text-gray-500">{state.name}</div>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="order-2 md:order-1 md:col-span-2">
            <div className="relative mx-auto h-64 w-48 rounded-[28px] border border-yellow-200 bg-white shadow-inner">
              <div className="absolute inset-x-2 bottom-2 rounded-b-[24px] overflow-hidden">
                <div className="h-60 w-full origin-bottom rounded-b-[24px] bg-gradient-to-b from-yellow-200 via-yellow-300 to-yellow-400 transition-transform duration-700" style={{ transform: `translateY(${100 - pct}%)` }} />
              </div>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 shadow">{state.name}</div>
            </div>
          </div>
          <div className="order-1 md:order-2 space-y-3">
            <div className="flex items-center justify-between text-sm"><span className="text-gray-500">Saved</span><span className="font-semibold">${state.current.toLocaleString()}</span></div>
            <div className="flex items-center justify-between text-sm"><span className="text-gray-500">Goal</span><span className="font-semibold">${state.target.toLocaleString()}</span></div>
            <Progress value={pct} className="h-2 bg-yellow-100 [&>div]:bg-yellow-400" />
            <div className="flex gap-2 pt-2">
              <Button className="bg-yellow-400 text-black hover:bg-yellow-500" onClick={() => setState(s => ({ ...s, current: Math.min(s.target, s.current + amount) }))}>Add Money</Button>
              <Button variant="secondary" className="bg-yellow-100 text-gray-900 hover:bg-yellow-200" onClick={() => setState(s => ({ ...s, target: Math.max(s.current + 1, s.target + 100) }))}>Adjust Goal</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Create / Edit Jar</h3>
        <form className="space-y-3" onSubmit={(e)=>e.preventDefault()}>
          <label className="block text-sm font-medium">Jar name<input className="mt-1 w-full rounded-md border px-3 py-2" value={state.name} onChange={(e)=>setState(s=>({...s, name: e.target.value}))}/></label>
          <label className="block text-sm font-medium">Target amount<input type="number" className="mt-1 w-full rounded-md border px-3 py-2" value={state.target} onChange={(e)=>setState(s=>({...s, target: Number(e.target.value||0)}))}/></label>
          <label className="block text-sm font-medium">Current saved<input type="number" className="mt-1 w-full rounded-md border px-3 py-2" value={state.current} onChange={(e)=>setState(s=>({...s, current: Number(e.target.value||0)}))}/></label>
          <label className="block text-sm font-medium">Deadline<input type="date" className="mt-1 w-full rounded-md border px-3 py-2" value={state.deadline} onChange={(e)=>setState(s=>({...s, deadline: e.target.value}))}/></label>
          <div className="flex items-center gap-2 pt-2">
            <input type="number" min={1} className="h-10 w-28 rounded-md border px-2" value={amount} onChange={(e)=>setAmount(Number(e.target.value||0))}/>
            <Button className="bg-yellow-400 text-black hover:bg-yellow-500" onClick={()=>setState(s=>({...s, current: Math.min(s.target, s.current + amount)}))}>Add Money</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
