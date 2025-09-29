import { Expense } from "@/data/sampleData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function ExpenseCard({ expense }: { expense: Expense }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="group w-full rounded-2xl border bg-white p-4 text-left shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-sm text-gray-500">{expense.category}</div>
              <div className="font-semibold text-gray-900">{expense.title}</div>
              <div className="text-xs text-gray-500">{new Date(expense.date).toDateString()}</div>
            </div>
            <div className="text-lg font-bold text-gray-900">${expense.amount}</div>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{expense.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between"><span className="text-gray-500">Category</span><span className="font-medium">{expense.category}</span></div>
          <div className="flex items-center justify-between"><span className="text-gray-500">Amount</span><span className="font-semibold">${expense.amount}</span></div>
          <div className="flex items-center justify-between"><span className="text-gray-500">Date</span><span>{new Date(expense.date).toLocaleString()}</span></div>
          {expense.note && (<p className="mt-2 text-gray-700">{expense.note}</p>)}
        </div>
      </DialogContent>
    </Dialog>
  );
}
