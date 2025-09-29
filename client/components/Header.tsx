import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AuthPopup, { AuthMode } from "@/components/AuthPopup";
import { useState } from "react";

export default function Header() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 h-16">
      <div className="mx-auto max-w-7xl px-4 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-[22px]">
          <img src="https://cdn.builder.io/api/v1/image/assets%2F8792f11f5527488eadc821536b2d10df%2Ff121cd1e336f4775ab62ae6b06e163a7?format=webp&width=800" alt="logo" className="h-6 w-6 rounded-sm object-cover shadow-sm" />
          <span>SpendWise</span>
        </Link>
        {pathname !== "/auth" && (
          <div className="flex items-center gap-2">
            <Button variant="secondary" className="hidden sm:inline-flex bg-yellow-100 text-gray-900 hover:bg-yellow-200" onClick={()=>{setAuthMode("login"); setAuthOpen(true);}}>
              Login
            </Button>
            <Button asChild className="bg-yellow-400 text-black hover:bg-yellow-500">
              <Link to="/">+ Add Expense</Link>
            </Button>
          </div>
        )}
      </div>
      <AuthPopup open={authOpen} onOpenChange={setAuthOpen} mode={authMode} />
    </header>
  );
}
