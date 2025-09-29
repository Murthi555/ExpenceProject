import { useState } from "react";
import { Button } from "@/components/ui/button";

const EMOJIS = ["🧑🏻","🧑🏽","🧑🏾","🧑🏼","🧑🏿","🧑","🧔","👩","🧕","🧑‍🎓","🧑‍💻","🧑‍🍳","🧑‍🎨","🧑‍🚀","🧑‍🔧","🧑‍🔬","🧑‍⚕️","🧑‍🏫"];

function formatCurrency(n: number) {
  return `₹ ${n.toFixed(2)}`;
}

export default function QuickSplit() {
  const [total, setTotal] = useState<number | "">("");
  const [friends, setFriends] = useState(3);
  const [splitAmount, setSplitAmount] = useState(0);
  const [showSplit, setShowSplit] = useState(false);
  const [seed] = useState(() => Math.floor(Math.random() * 100000));

  const handleSplit = () => {
    if (typeof total === "number" && total > 0 && friends >= 1) {
      setSplitAmount(+(total / friends).toFixed(2));
      setShowSplit(true);
    }
  };

  const reset = () => {
    setShowSplit(false);
    setTotal("");
    setFriends(3);
    setSplitAmount(0);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Quick Split Summary',
        text: `Total Amount: ${formatCurrency(total as number)}\nNumber of Friends: ${friends}\nEach person pays: ${formatCurrency(splitAmount)}`,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      alert("Web Share API is not supported in your browser.");
    }
  };


  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border bg-gradient-to-tr from-yellow-300 via-yellow-300/80 to-amber-300 p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-gray-900">Quick Split Mode</div>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_auto]">
          <div className="rounded-[16px] border bg-white/90 px-4 py-3">
            <div className="text-xs text-gray-600">Total Amount</div>
            <div className="mt-1 flex items-center gap-2">
              <span className="opacity-60">₹</span>
              <input
                className="w-full bg-transparent text-lg font-semibold outline-none"
                inputMode="decimal"
                value={total}
                onChange={(e) => {
                  const v = e.target.value.trim();
                  if (v === "") setTotal("");
                  else setTotal(Number(v));
                }}
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="rounded-[16px] border bg-white/90 px-4 py-3">
            <div className="text-xs text-gray-600">Number of Friends</div>
            <div className="mt-1 flex items-center justify-between gap-3">
              <button
                className="grid size-8 place-items-center rounded-full border text-gray-700 hover:bg-gray-50"
                onClick={() => setFriends((n) => Math.max(1, n - 1))}
              >
                -
              </button>
              <div className="text-lg font-semibold">{friends}</div>
              <button
                className="grid size-8 place-items-center rounded-full border text-gray-700 hover:bg-gray-50"
                onClick={() => setFriends((n) => n + 1)}
              >
                +
              </button>
            </div>
          </div>
          <div className="flex items-end">
            <Button
              disabled={!(typeof total === "number" && total > 0 && friends >= 1)}
              onClick={handleSplit}
              className="h-[52px] w-full rounded-full bg-yellow-400 text-base font-semibold text-black hover:bg-yellow-500 md:w-40"
            >
              Split Now!
            </Button>
          </div>
        </div>
      </div>

      {showSplit && (
        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <div className="rounded-[18px] border bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-medium">Friends & Amounts</div>
              <button onClick={reset} className="text-sm font-medium text-gray-600 hover:underline">
                Reset
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: friends }).map((_, i) => {
                const emoji = EMOJIS[(seed + i) % EMOJIS.length];
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-[16px] border bg-white px-3 py-3 shadow-sm"
                  >
                    <div className="grid size-10 place-items-center rounded-full bg-yellow-100 text-lg">
                      {emoji}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">Friend {i + 1}</div>
                      <div className="text-xs text-gray-600">{formatCurrency(splitAmount)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[18px] border bg-white p-4 shadow-sm">
            <div className="text-sm font-medium">Summary</div>
            <div className="mt-4 text-center">
              <div className="text-3xl font-bold">{formatCurrency(splitAmount)}</div>
              <div className="text-sm text-gray-500">per person</div>
            </div>
            <div className="mt-4 flex justify-center">
              <Button onClick={handleShare} variant="secondary" className="rounded-full bg-yellow-100 text-gray-900 hover:bg-yellow-200">
                Share Summary
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}