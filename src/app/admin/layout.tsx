"use client";

import React from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { LayoutDashboard, Users, FileText, BarChart3, Settings, LogOut } from "lucide-react";
import Link from "next/link";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, role, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && (!user || !["admin", "manager", "contributor"].includes(role || ""))) {
      router.push("/auth");
    }
  }, [user, role, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-[100dvh] bg-foret-nocturne flex items-center justify-center">
        <div className="animate-pulse text-or-ancestral font-mono tracking-widest uppercase">
          Lecture des parchemins...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#050C09] text-ivoire-ancien font-body">
      <Navbar />
      
      <div className="pt-24 flex min-h-[100dvh] overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/5 bg-[var(--foret-nocturne)]/50 backdrop-blur-md hidden md:flex flex-col p-6 space-y-8">
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold ml-4">
              Menu Principal
            </p>
            <nav className="space-y-1">
              <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-sm group">
                <LayoutDashboard className="w-4 h-4 text-or-ancestral opacity-60 group-hover:opacity-100" />
                Tableau de Bord
              </Link>
              <Link href="/admin/content" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-sm group">
                <FileText className="w-4 h-4 text-or-ancestral opacity-60 group-hover:opacity-100" />
                Articles
              </Link>
              {role === "admin" && (
                <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-sm group">
                  <Users className="w-4 h-4 text-or-ancestral opacity-60 group-hover:opacity-100" />
                  Utilisateurs
                </Link>
              )}
            </nav>
          </div>

          <div className="space-y-2 mt-auto">
             <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-sm group opacity-60">
                <Settings className="w-4 h-4" />
                Paramètres
              </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8 md:p-12 scrollbar-hide">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
