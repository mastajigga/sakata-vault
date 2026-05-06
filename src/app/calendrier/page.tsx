"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { Calendar, MapPin, Users, Plus, ChevronLeft, ChevronRight } from "lucide-react";

interface CulturalEvent {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location?: string;
  type: string;
  is_public: boolean;
}

const EVENT_TYPES = [
  "Fête traditionnelle", "Cérémonie", "Anniversaire de chef",
  "Événement diaspora", "Naissance", "Mariage", "Deuil", "Autre",
];

const MOIS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

export default function CalendrierPage() {
  const { user } = useAuth() as any;
  const [events, setEvents] = useState<CulturalEvent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [form, setForm] = useState({
    title: "", description: "", event_date: "", location: "", type: "Fête traditionnelle",
  });

  const fetchEvents = async () => {
    if (!user) return;
    const startDate = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-01`;
    const endMonth = currentMonth + 2 > 12 ? 1 : currentMonth + 2;
    const endYear = currentMonth + 2 > 12 ? currentYear + 1 : currentYear;
    const endDate = `${endYear}-${String(endMonth).padStart(2,'0')}-01`;

    const { data } = await supabase
      .from("cultural_events")
      .select("*")
      .or(`user_id.eq.${user.id},is_public.eq.true`)
      .gte("event_date", startDate)
      .lt("event_date", endDate)
      .order("event_date", { ascending: true });
    if (data) setEvents(data as CulturalEvent[]);
  };

  useEffect(() => { if (user) fetchEvents(); }, [user, currentMonth, currentYear]);

  const addEvent = async () => {
    if (!user || !form.title || !form.event_date) return;
    const { error } = await supabase.from("cultural_events").insert({
      user_id: user.id, title: form.title, description: form.description,
      event_date: form.event_date, location: form.location || null,
      type: form.type, is_public: false,
    });
    if (!error) {
      await fetchEvents();
      setForm({ title: "", description: "", event_date: "", location: "", type: "Fête traditionnelle" });
      setShowForm(false);
    }
  };

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y-1); }
    else setCurrentMonth(m => m-1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y+1); }
    else setCurrentMonth(m => m+1);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--foret-nocturne)] flex items-center justify-center">
        <p className="text-[rgba(212,221,215,0.6)]">Connectez-vous pour voir votre calendrier.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--foret-nocturne)] py-32 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <span className="text-xs text-[var(--or-ancestral)] uppercase tracking-widest">Calendrier</span>
          <h1 className="text-3xl font-display font-bold text-[var(--ivoire-ancien)] mt-2">Mon Calendrier Culturel</h1>
          <p className="text-[rgba(212,221,215,0.6)] mt-2 text-sm">
            Notez les dates qui comptent : fêtes, cérémonies, anniversaires de chefs.
          </p>
        </motion.div>

        {/* Navigation mois */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={prevMonth} className="p-2 text-[rgba(212,221,215,0.5)] hover:text-[var(--or-ancestral)]">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-display text-[var(--ivoire-ancien)]">
            {MOIS[currentMonth]} {currentYear}
          </h2>
          <button onClick={nextMonth} className="p-2 text-[rgba(212,221,215,0.5)] hover:text-[var(--or-ancestral)]">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Ajouter */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-[rgba(196,160,53,0.2)] rounded-xl text-[rgba(196,160,53,0.6)] hover:border-[rgba(196,160,53,0.4)] transition-all mb-8"
        >
          <Plus className="w-4 h-4" /> Ajouter un événement
        </button>

        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 rounded-xl border border-[rgba(196,160,53,0.15)] bg-[rgba(10,31,21,0.6)] space-y-4">
            <input type="text" placeholder="Titre de l'événement" value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
              className="w-full rounded-lg border border-[rgba(212,221,215,0.1)] bg-[rgba(0,0,0,0.3)] px-4 py-2.5 text-white text-sm focus:border-[var(--or-ancestral)] outline-none" />
            <textarea placeholder="Description (optionnelle)" value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              rows={2}
              className="w-full rounded-lg border border-[rgba(212,221,215,0.1)] bg-[rgba(0,0,0,0.3)] px-4 py-2.5 text-white text-sm focus:border-[var(--or-ancestral)] outline-none resize-none" />
            <div className="grid grid-cols-2 gap-3">
              <input type="date" value={form.event_date}
                onChange={e => setForm({...form, event_date: e.target.value})}
                className="rounded-lg border border-[rgba(212,221,215,0.1)] bg-[rgba(0,0,0,0.3)] px-3 py-2.5 text-white text-sm focus:border-[var(--or-ancestral)] outline-none" />
              <select value={form.type}
                onChange={e => setForm({...form, type: e.target.value})}
                className="rounded-lg border border-[rgba(212,221,215,0.1)] bg-[rgba(0,0,0,0.3)] px-3 py-2.5 text-white text-sm focus:border-[var(--or-ancestral)] outline-none">
                {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <input type="text" placeholder="Lieu (optionnel)" value={form.location}
              onChange={e => setForm({...form, location: e.target.value})}
              className="w-full rounded-lg border border-[rgba(212,221,215,0.1)] bg-[rgba(0,0,0,0.3)] px-4 py-2.5 text-white text-sm focus:border-[var(--or-ancestral)] outline-none" />
            <div className="flex gap-3">
              <button onClick={addEvent}
                className="flex-1 py-2.5 rounded-lg bg-[var(--or-ancestral)]/20 border border-[var(--or-ancestral)]/30 text-[var(--or-ancestral)] text-sm font-semibold hover:bg-[var(--or-ancestral)]/30 transition-all">
                Ajouter
              </button>
              <button onClick={() => setShowForm(false)}
                className="px-4 py-2.5 rounded-lg border border-[rgba(212,221,215,0.1)] text-[rgba(212,221,215,0.6)] text-sm">Annuler</button>
            </div>
          </motion.div>
        )}

        {/* Liste des événements */}
        <div className="space-y-3">
          {events.length === 0 ? (
            <div className="text-center py-8 text-[rgba(212,221,215,0.4)] text-sm">Aucun événement ce mois-ci.</div>
          ) : (
            events.map(evt => {
              const date = new Date(evt.event_date);
              return (
                <div key={evt.id}
                  className="flex items-start gap-4 p-4 rounded-xl border border-[rgba(212,221,215,0.06)] bg-[rgba(10,31,21,0.4)] hover:border-[rgba(196,160,53,0.15)] transition-all">
                  <div className="w-12 h-12 rounded-xl bg-[rgba(196,160,53,0.1)] border border-[rgba(196,160,53,0.15)] flex flex-col items-center justify-center shrink-0">
                    <span className="text-lg font-bold text-[var(--or-ancestral)] leading-none">{date.getDate()}</span>
                    <span className="text-[9px] text-[rgba(196,160,53,0.5)]">{MOIS[date.getMonth()].substring(0,3)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--ivoire-ancien)]">{evt.title}</p>
                    {evt.description && <p className="text-xs text-[rgba(212,221,215,0.5)] mt-0.5">{evt.description}</p>}
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-[rgba(212,221,215,0.35)]">
                      <span className="px-2 py-0.5 rounded-full bg-[rgba(196,160,53,0.08)]">{evt.type}</span>
                      {evt.location && <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{evt.location}</span>}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
