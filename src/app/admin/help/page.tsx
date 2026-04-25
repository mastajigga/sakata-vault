"use client";

import Link from "next/link";
import { BookOpen, FileText } from "lucide-react";

export default function AdminHelpPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-8">Admin Help Center</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Notes Section */}
        <Link href="/admin/help/notes">
          <div className="p-6 bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 hover:shadow-lg hover:border-amber-600 transition-all cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <FileText className="text-amber-600" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">Personal Notes</h2>
                <p className="text-sm text-stone-600 dark:text-stone-400">Create and manage your personal notes for quick reference and reminders.</p>
              </div>
            </div>
          </div>
        </Link>

        {/* Documentation Section (Future) */}
        <div className="p-6 bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 opacity-50 cursor-not-allowed">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-stone-100 dark:bg-stone-700 rounded-lg">
              <BookOpen className="text-stone-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-500 dark:text-stone-400 mb-2">Documentation</h2>
              <p className="text-sm text-stone-500 dark:text-stone-500">Coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
