"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, Edit2, X, Check, Folder, FolderPlus } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Note {
  id: string;
  title: string;
  content: string;
  folder_id: string | null;
  created_at: string;
  updated_at: string;
}

interface NoteFolder {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export function AdminNotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<NoteFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showFolderForm, setShowFolderForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [folderName, setFolderName] = useState("");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    try {
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
    }
  }, []);

  const fetchFolders = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch("/api/admin/notes/folders", {
        headers: {
          "Authorization": `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch folders");
      const data = await response.json();
      setFolders(data);
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchNotes(), fetchFolders()]).finally(() => setLoading(false));
  }, [fetchNotes, fetchFolders]);

  const handleSaveNote = async () => {
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
          body: JSON.stringify({ title, content, folder_id: selectedFolderId }),
        });

        if (!response.ok) throw new Error("Failed to update note");
      } else {
        const response = await fetch("/api/admin/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ title, content, folder_id: selectedFolderId }),
        });

        if (!response.ok) throw new Error("Failed to create note");
      }

      setTitle("");
      setContent("");
      setSelectedFolderId(null);
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

  const handleSaveFolder = async () => {
    if (!folderName.trim()) return;

    try {
      setSaving(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      if (editingFolderId) {
        const response = await fetch(`/api/admin/notes/folders/${editingFolderId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ name: folderName }),
        });

        if (!response.ok) throw new Error("Failed to update folder");
      } else {
        const response = await fetch("/api/admin/notes/folders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ name: folderName }),
        });

        if (!response.ok) throw new Error("Failed to create folder");
      }

      setFolderName("");
      setEditingFolderId(null);
      setShowFolderForm(false);
      fetchFolders();
    } catch (error) {
      console.error("Error saving folder:", error);
      alert("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
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

  const handleDeleteFolder = async (id: string) => {
    const notesInFolder = notes.filter(n => n.folder_id === id);
    const confirmMsg = notesInFolder.length > 0
      ? `Ce dossier contient ${notesInFolder.length} note(s). Elles seront déplacées hors du dossier. Continuer ?`
      : "Supprimer ce dossier ?";

    if (!confirm(confirmMsg)) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`/api/admin/notes/folders/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete folder");

      if (selectedFolderId === id) {
        setSelectedFolderId(null);
      }

      fetchFolders();
      fetchNotes();
    } catch (error) {
      console.error("Error deleting folder:", error);
      alert("Erreur lors de la suppression");
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setSelectedFolderId(note.folder_id || null);
    setShowForm(true);
  };

  const handleEditFolder = (folder: NoteFolder) => {
    setEditingFolderId(folder.id);
    setFolderName(folder.name);
    setShowFolderForm(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setSelectedFolderId(null);
    setShowForm(false);
  };

  const handleCancelFolder = () => {
    setEditingFolderId(null);
    setFolderName("");
    setShowFolderForm(false);
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase());
    const matchesFolder = selectedFolderId === null
      ? note.folder_id === null
      : note.folder_id === selectedFolderId;
    return matchesSearch && matchesFolder;
  });

  const unfiledNotes = notes.filter(n => n.folder_id === null);

  if (loading) {
    return <div className="text-center py-8 text-stone-500">Chargement...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex gap-6">
        {/* Sidebar avec dossiers */}
        <div className="w-64 flex-shrink-0">
          <div className="sticky top-24">
            <div className="mb-4">
              <button
                onClick={() => setShowFolderForm(!showFolderForm)}
                className="flex items-center gap-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <FolderPlus size={16} />
                Nouveau dossier
              </button>
            </div>

            {showFolderForm && (
              <div className="mb-4 p-4 bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700">
                <input
                  type="text"
                  placeholder="Nom du dossier..."
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-500 text-sm mb-2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCancelFolder}
                    className="flex-1 px-3 py-2 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors text-sm"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSaveFolder}
                    disabled={saving}
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
                  >
                    {saving ? "Création..." : "Créer"}
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-1">
              {/* Toutes les notes */}
              <button
                onClick={() => setSelectedFolderId(null)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors text-sm ${
                  selectedFolderId === null
                    ? "bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-stone-100 font-medium"
                    : "text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                }`}
              >
                📝 Toutes les notes
              </button>

              {/* Notes sans dossier */}
              {unfiledNotes.length > 0 && (
                <button
                  onClick={() => setSelectedFolderId(null)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors text-sm ${
                    selectedFolderId === null
                      ? "bg-stone-200 dark:bg-stone-700"
                      : "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
                  }`}
                >
                  <span className="text-xs">Sans dossier ({unfiledNotes.length})</span>
                </button>
              )}

              {/* Dossiers */}
              {folders.length > 0 && (
                <div className="border-t border-stone-200 dark:border-stone-700 mt-4 pt-4">
                  {folders.map(folder => (
                    <div
                      key={folder.id}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg group transition-colors ${
                        selectedFolderId === folder.id
                          ? "bg-amber-100 dark:bg-amber-900"
                          : "hover:bg-stone-100 dark:hover:bg-stone-800"
                      }`}
                    >
                      <button
                        onClick={() => setSelectedFolderId(folder.id)}
                        className="flex-1 text-left flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300"
                      >
                        <Folder size={16} className="text-amber-600" />
                        <span className="truncate">{folder.name}</span>
                      </button>
                      <button
                        onClick={() => handleEditFolder(folder)}
                        className="p-1 opacity-0 group-hover:opacity-100 hover:bg-stone-200 dark:hover:bg-stone-700 rounded transition-all"
                      >
                        <Edit2 size={14} className="text-stone-600 dark:text-stone-400" />
                      </button>
                      <button
                        onClick={() => handleDeleteFolder(folder.id)}
                        className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-all"
                      >
                        <Trash2 size={14} className="text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
              {selectedFolderId
                ? folders.find(f => f.id === selectedFolderId)?.name
                : "Toutes les notes"}
            </h2>
            <button
              onClick={() => {
                setTitle("");
                setContent("");
                setSelectedFolderId(null);
                setEditingId(null);
                setShowForm(!showForm);
              }}
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
                <select
                  value={selectedFolderId || ""}
                  onChange={(e) => setSelectedFolderId(e.target.value || null)}
                  className="w-full px-4 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100"
                >
                  <option value="">Sans dossier</option>
                  {folders.map(folder => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSaveNote}
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

          <div className="grid gap-4">
            {filteredNotes.length === 0 ? (
              <div className="text-center py-8 text-stone-500">
                Aucune note trouvée
              </div>
            ) : (
              filteredNotes.map(note => (
                <div
                  key={note.id}
                  className="p-4 bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-lg">
                      {note.title}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditNote(note)}
                        className="p-2 hover:bg-stone-100 dark:hover:bg-stone-700 rounded transition-colors"
                      >
                        <Edit2 size={18} className="text-stone-600 dark:text-stone-400" />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                      >
                        <Trash2 size={18} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                  <p className="text-stone-600 dark:text-stone-400 text-sm mb-2 line-clamp-2">
                    {note.content}
                  </p>
                  <p className="text-xs text-stone-500">
                    {new Date(note.updated_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
