import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout(){
  return (
    <div className="min-h-screen bg-[#fafaf7] text-gray-900">
      <Header />
      <div className="mx-auto flex items-start max-w-7xl gap-6 px-4 py-6">
        <Sidebar />
        <main className="flex-1 pb-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
