import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ExpensesProvider } from "@/state/expenses";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ExpensesPage from "./pages/Expenses";
import StreaksPage from "./pages/Streaks";
import SavingsJarPage from "./pages/SavingsJarPage";
import QuickSplit from "./pages/QuickSplit";
import MicroChallenges from "./pages/MicroChallenges";
import FinanceFusion from "./pages/FinanceFusion";
import PlaceholderAuth from "./pages/PlaceholderAuth";
import NotFound from "./pages/NotFound";
import WeeklyReport from "./pages/WeeklyReport";
import BudgetVsExpense from "./pages/BudgetVsExpense";

const App = () => (
  <>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ExpensesProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<ExpensesPage />} />
              <Route path="/streaks" element={<StreaksPage />} />
              <Route path="/savings" element={<SavingsJarPage />} />
              <Route path="/quick-split" element={<QuickSplit />} />
              <Route path="/challenges" element={<MicroChallenges />} />
              <Route path="/fusion" element={<FinanceFusion />} />
              <Route path="/auth" element={<PlaceholderAuth />} />
              <Route path="/weekly-report" element={<WeeklyReport />} />
              <Route path="/budget" element={<BudgetVsExpense />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ExpensesProvider>
      </BrowserRouter>
    </TooltipProvider>
  </>
);

createRoot(document.getElementById("root")!).render(<App />);