"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, Edit2, X, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export function AdminNotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch("/api/admin/notes", {
        headers: {
          "Authorization": `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch notes");
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;

    try {
      setSaving(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      if (editingId) {
        const response = await fetch(`/api/admin/notes/${editingId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ title, content }),
        });

        if (!response.ok) throw new Error("Failed to update note");
      } else {
        const response = await fetch("/api/admin/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ title, content }),
        });

        if (!response.ok) throw new Error("Failed to create note");
      }

      setTitle("");
      setContent("");
      setEditingId(null);
      setShowForm(false);
      fetchNotes();
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette note ?")) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`/api/admin/notes/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete note");
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Erreur lors de la suppression");
    }
  };

  const handleEdit = (note: Note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setShowForm(false);
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8 text-stone-500">Chargement...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Mes Notes</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          <Plus size={18} />
          Nouvelle note
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-6 bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 shadow-md">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Titre..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-500"
            />
            <textarea
              placeholder="Contenu..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-500 resize-none"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                <Check size={18} />
                {saving ? "Sauvegarde..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-500"
        />
      </div>

      {filteredNotes.length === 0 ? (
        <div className="text-center py-12 text-stone-500">
          {notes.length === 0 ? "Aucune note pour le moment" : "Aucune note ne correspond"}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="p-4 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-stone-900 dark:text-stone-100 line-clamp-2">{note.title}</h3>
                <div className="flex gap-1 ml-2">
                  <button
                    onClick={() => handleEdit(note)}
                    className="p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded transition-colors"
                    aria-label="Modifier"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-colors"
                    aria-label="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-stone-600 dark:text-stone-400 line-clamp-3 mb-3">{note.content}</p>
              <p className="text-xs text-stone-400">
                {new Date(note.created_at).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
