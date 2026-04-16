import React from "react";
import Navbar from "@/components/Navbar";
import SectionCard from "@/components/SectionCard";
import SavoirClientContent from "./SavoirClientContent";
import { supabasePublic } from "@/lib/supabase/admin";
import { ARTICLES } from "@/data/articles";

export const revalidate = 60; // ISR: revalidate every 60 seconds

async function getSavoirArticles() {
  try {
    const { data, error } = await supabasePublic
      .from("articles")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      console.warn("No articles in DB, using static data.");
      return ARTICLES;
    }

    console.log("Articles loaded from DB:", data.length);
    return data;
  } catch (err) {
    console.error("Fetch error:", err);
    return ARTICLES;
  }
}

export default async function SavoirIndex() {
  const articles = await getSavoirArticles();

  return (
    <main className="grain-overlay min-h-[100dvh] bg-foret-nocturne pb-24">
      <Navbar />
      <SavoirClientContent articles={articles} />
    </main>
  );
}
