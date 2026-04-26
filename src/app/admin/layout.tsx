"use client";

import React from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { LayoutDashboard, Users, FileText, BarChart3, Settings, LogOut, Bell, Sparkles, MessageSquare, Image, ShieldCheck, Notebook } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminPresentationModal } from "@/components/admin/AdminPresentationModal";
import AdminHelpModal from "@/components/admin/AdminHelpModal";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, role, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

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

  const navItems = [
    { name: "Tableau de Bord", href: "/admin", icon: LayoutDashboard, roles: ["admin", "manager", "contributor"] },
    { name: "Articles", href: "/admin/content", icon: FileText, roles: ["admin", "manager", "contributor"] },
    { name: "Orchestration IA", href: "/admin/ai", icon: Sparkles, roles: ["admin", "manager"] },
    { name: "Modération Forum", href: "/admin/forum", icon: MessageSquare, roles: ["admin", "manager"] },
    { name: "Médiathèque", href: "/admin/media", icon: Image, roles: ["admin", "manager", "contributor"] },
    { name: "Notifications", href: "/admin/notifications", icon: Bell, roles: ["admin", "manager"] },
    { name: "Aide", href: "/admin/help", icon: Notebook, roles: ["admin", "manager"] },
    { name: "Membres", href: "/admin/users", icon: Users, roles: ["admin"] },
  ];

  return (
    <div className="min-h-[100dvh] bg-[#050C09] text-ivoire-ancien font-body">
      <Navbar />
      <AdminPresentationModal />
      
      <div className="pt-24 flex min-h-[100dvh] overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/5 bg-[var(--foret-nocturne)]/50 backdrop-blur-md hidden md:flex flex-col p-6 space-y-8">
          <div className="space-y-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold ml-4 mb-4">
                Command Center
              </p>
              <nav className="space-y-1">
                {navItems.filter(item => item.roles.includes(role || "")).map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link 
                      key={item.href}
                      href={item.href} 
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm group ${isActive ? 'bg-or-ancestral/10 text-or-ancestral border border-or-ancestral/20' : 'hover:bg-white/5 opacity-60 hover:opacity-100'}`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-or-ancestral' : 'text-ivoire-ancien opacity-60 group-hover:opacity-100'}`} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
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
