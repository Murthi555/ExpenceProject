import { useMemo, useState } from "react";
import { Expense } from "@/data/sampleData";
import ExpenseCard from "@/components/ExpenseCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useExpenses } from "@/state/expenses";

export default function ExpensesPage() {
  const { items, add } = useExpenses();

  const total = useMemo(() => items.reduce((a,b)=>a+b.amount,0), [items]);

  const [form, setForm] = useState<Expense>({ id: Date.now(), title: "", amount: 0, category: "Misc", date: new Date().toISOString().slice(0,10), note: "", paymentMethod: "UPI", tag: "Need" });

  const addExpense = () => {
    add({ ...form, date: new Date(form.date).toISOString().slice(0,10) });
    setForm({ id: Date.now(), title: "", amount: 0, category: "Misc", date: new Date().toISOString().slice(0,10), note: "", paymentMethod: "UPI", tag: "Need" });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold">Expense Overview</h1>
            <p className="text-sm text-gray-500">Track your spending trends over time and gain insights.</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-yellow-400 text-black hover:bg-yellow-500">+ Add Expense</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-2xl">
              <DialogHeader>
                <DialogTitle>Add Expense</DialogTitle>
              </DialogHeader>
              <form className="space-y-3" onSubmit={(e)=>e.preventDefault()}>
                <div>
                  <label className="text-sm text-gray-600">Title</label>
                  <input className="mt-1 w-full rounded-md border px-3 py-2" value={form.title} onChange={(e)=>setForm({...form, title: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-600">Category</label>
                    <input className="mt-1 w-full rounded-md border px-3 py-2" value={form.category} onChange={(e)=>setForm({...form, category: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Amount</label>
                    <input type="number" className="mt-1 w-full rounded-md border px-3 py-2" value={form.amount} onChange={(e)=>setForm({...form, amount: Number(e.target.value||0)})} />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Date</label>
                  <input type="date" className="mt-1 w-full rounded-md border px-3 py-2" value={form.date} onChange={(e)=>setForm({...form, date: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-600">Payment Method</label>
                    <select className="mt-1 w-full rounded-md border px-3 py-2" value={form.paymentMethod} onChange={(e)=>setForm({...form, paymentMethod: e.target.value as any})}>
                      <option>Cash</option>
                      <option>UPI</option>
                      <option>Card</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Tag</label>
                    <select className="mt-1 w-full rounded-md border px-3 py-2" value={form.tag} onChange={(e)=>setForm({...form, tag: e.target.value as any})}>
                      <option>Need</option>
                      <option>Want</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Note</label>
                  <textarea className="mt-1 w-full rounded-md border px-3 py-2" value={form.note} onChange={(e)=>setForm({...form, note: e.target.value})} />
                </div>
                <div className="pt-2">
                  <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-500" onClick={addExpense}>Save</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">All Expenses</h2>
          <div className="text-sm text-gray-500">Total: <span className="font-semibold text-gray-900">${total}</span></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map(item => (
            <ExpenseCard key={item.id} expense={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
