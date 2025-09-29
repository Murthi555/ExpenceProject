import StreakCalendar from "@/components/StreakCalendar";
import { Button } from "@/components/ui/button";

export default function StreaksPage(){
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-yellow-300 text-xl font-bold">12</div>
            <div>
              <div className="font-semibold">Current Spend Streak</div>
              <div className="text-sm text-gray-600">12 days within budget</div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border bg-white p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="font-semibold">Great job staying on track!</div>
            <div className="text-sm text-gray-600">You're building a healthy spending habit.</div>
          </div>
          <Button variant="secondary" className="bg-yellow-100 text-gray-900 hover:bg-yellow-200">Adjust Budget</Button>
        </div>
      </div>
      <StreakCalendar />
    </div>
  );
}
