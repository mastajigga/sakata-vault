"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminNotesApp } from "@/components/admin/AdminNotesApp";

export default function AdminNotesPage() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      <div className="max-w-4xl mx-auto p-6">
        <Link
          href="/admin/help"
          className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          Retour
        </Link>

        <AdminNotesApp />
      </div>
    </div>
  );
}
