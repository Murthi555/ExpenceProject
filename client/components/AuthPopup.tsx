import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export type AuthMode = "login" | "signup";

export default function AuthPopup({ open, onOpenChange, mode: initialMode }: { open: boolean; onOpenChange: (v: boolean) => void; mode: AuthMode }) {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  const switchMode = (m: AuthMode) => setMode(m);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl overflow-hidden rounded-3xl p-0">
        <DialogTitle className="sr-only">Expense Tracker Authentication</DialogTitle>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="hidden md:flex flex-col items-center justify-center gap-4 bg-yellow-400 p-10 text-white">
            <div className="text-3xl">✦</div>
            <div className="text-2xl font-extrabold tracking-wide">EXPENSE TRACKER</div>
            <div className="text-center text-sm opacity-90">
              {mode === "login" ? "Track your expenses with ease" : "Join us and start tracking your expenses"}
            </div>
          </div>
          <div className="p-8">
            <div className="mb-6 text-center">
              <div className="text-2xl font-bold">{mode === "login" ? "Log in Form" : "Sign Up Form"}</div>
              {mode === "signup" && (
                <div className="text-sm text-gray-500">Create New Account</div>
              )}
            </div>

            {mode === "login" ? (
              <form className="space-y-3" onSubmit={(e)=>e.preventDefault()}>
                <label className="block">
                  <span className="sr-only">Username</span>
                  <div className="flex items-center rounded-lg border px-3 py-2 focus-within:ring-2 focus-within:ring-yellow-400">
                    <span className="mr-2 opacity-60">👤</span>
                    <input placeholder="Username" className="w-full bg-transparent outline-none" />
                  </div>
                </label>
                <label className="block">
                  <span className="sr-only">Password</span>
                  <div className="flex items-center rounded-lg border px-3 py-2 focus-within:ring-2 focus-within:ring-yellow-400">
                    <span className="mr-2 opacity-60">🔒</span>
                    <input type="password" placeholder="Password" className="w-full bg-transparent outline-none" />
                  </div>
                </label>
                <Button className="mt-2 w-full bg-yellow-400 text-black hover:bg-yellow-500">Log In</Button>
                <div className="space-y-2 pt-2 text-center text-sm text-gray-600">
                  <div>
                    Forgot Password?
                  </div>
                  <div>
                    Don't have an account? <button type="button" className="font-semibold text-yellow-600 underline-offset-2 hover:underline" onClick={()=>switchMode("signup")}>Sign Up</button>
                  </div>
                  <div className="text-xs opacity-70">By continuing you agree to our Terms and Privacy Policy.</div>
                </div>
              </form>
            ) : (
              <form className="space-y-3" onSubmit={(e)=>e.preventDefault()}>
                <label className="block">
                  <div className="flex items-center rounded-lg border px-3 py-2 focus-within:ring-2 focus-within:ring-yellow-400">
                    <span className="mr-2 opacity-60">👤</span>
                    <input placeholder="Username" className="w-full bg-transparent outline-none" />
                  </div>
                </label>
                <label className="block">
                  <div className="flex items-center rounded-lg border px-3 py-2 focus-within:ring-2 focus-within:ring-yellow-400">
                    <span className="mr-2 opacity-60">✉️</span>
                    <input placeholder="Email" className="w-full bg-transparent outline-none" />
                  </div>
                </label>
                <label className="block">
                  <div className="flex items-center rounded-lg border px-3 py-2 focus-within:ring-2 focus-within:ring-yellow-400">
                    <span className="mr-2 opacity-60">🔒</span>
                    <input type="password" placeholder="Password" className="w-full bg-transparent outline-none" />
                  </div>
                </label>
                <label className="block">
                  <div className="flex items-center rounded-lg border px-3 py-2 focus-within:ring-2 focus-within:ring-yellow-400">
                    <span className="mr-2 opacity-60">🔒</span>
                    <input type="password" placeholder="Confirm Password" className="w-full bg-transparent outline-none" />
                  </div>
                </label>
                <Button className="mt-2 w-full bg-yellow-400 text-black hover:bg-yellow-500">Sign Up</Button>
                <div className="space-y-2 pt-2 text-center text-sm text-gray-600">
                  <div>
                    Already have an account? <button type="button" className="font-semibold text-yellow-600 underline-offset-2 hover:underline" onClick={()=>switchMode("login")}>Log In</button>
                  </div>
                  <div className="text-xs opacity-70">By continuing you agree to our Terms and Privacy Policy.</div>
                </div>
              </form>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
