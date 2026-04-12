# Sakata Digital Hub - Codebase Analysis (April 2026)

## 1. System Architecture
The platform is built on **Next.js 16.2.2 (App Router)** with **Turbopack**, utilizing a serverless infrastructure powered by **Supabase**.

### Core Infrastructure
*   **Database & Auth**: Supabase (PostgreSQL).
*   **Analytics**: Custom `site_analytics` table + specialized RPCs (`increment_article_reads`).
*   **Vector Memory**: Pinecone index `sakata` with 768d vectors (E5 Multilingual).
*   **Edge Functions**: Content enrichment pipeline (Netlify/Supabase).

## 2. Global Services (Providers)
Located in `src/components/`, these services manage state across the application:
*   [AuthProvider.tsx](file:///C:/Users/Fortuné/Projects/Sakata/src/components/AuthProvider.tsx): Handles session management, user roles (`admin`, `contributor`, etc.), and `subscriptionTier`.
*   [LanguageProvider.tsx](file:///C:/Users/Fortuné/Projects/Sakata/src/components/LanguageProvider.tsx): Manages i18n/multilingual support (French, Lingala, English).
*   [AnalyticsProvider.tsx](file:///C:/Users/Fortuné/Projects/Sakata/src/components/AnalyticsProvider.tsx): Captures telemetry (session, device, language) on route changes.

## 3. Modular Functional Blocks

### A. Mboka (Forum) — `/src/app/forum`
*   **Structure**: `/forum/[category_slug]/[thread_slug]`.
*   **Logic**: Uses `forum_categories` and `forum_threads` tables with RLS enables.
*   **Visuals**: Icon mapping (Lucide), glassmorphism panels, and GSAP micro-animations.

### B. L'Ecole (Education) — `/src/app/ecole`
*   **Tech**: MDX lessons, KaTeX/MathLive for interactive math rendering.
*   **Pedagogy**: Primary and secondary curriculum adapted to the Sakata context.
*   **Progression**: Ready for pupil tracking via Supabase.

### C. Géo-Souveraineté — `/src/app/geographie`
*   **Features**: Interactive cards for territory analytics.
*   **Telemetry**: Real-time visiting stats by region/country using IP-to-country resolution via Edge Functions.

### D. Savoir & Paywall — `/src/app/savoir`
*   **Logic**: `is_premium` articles are gated in `[slug]/page.tsx`.
*   **Access**: Unrestricted for admins/staff or 'premium'/'elite' tiers; others see a 500-character preview + modal.

## 4. Admin Command Center V2 — `/src/app/admin`
*   **Layout**: Bento Grid design using premium markers.
*   **Visualizations**: Recharts for:
    *   **Audience Evolution**: Visits per day.
    *   **Language Distribution**: Engagement by locale.
    *   **Article Popularity**: Atomic read count tracking.

## 5. Memory Integration (Infinite Knowledge)
*   [pinecone_cli.py](file:///C:/Users/Fortuné/Projects/Sakata/scripts/pinecone_cli.py): Python tool for semantic search within the cultural PDF corpus.
*   [vectorize_sakata.py](file:///C:/Users/Fortuné/Projects/Sakata/scripts/vectorize_sakata.py): Pre-processing pipeline for embedding large documents into the `sakata` vector space.

## 6. Database Schema (Supabase)
The database uses a relational structure with strict RLS (Row Level Security) on sensitive tables:
*   **`profiles`**: Manages user metadata, roles (`admin`, `contributor`, etc.), and `subscription_tier` (free/premium).
*   **`articles`**: Content storage with `is_premium` flag and atomic counters (`reads_count`, `likes_count`).
*   **`site_analytics`**: Detailed telemetry capturing `session_id`, `ip_address`, `language`, and `device_type`.
*   **`forum_*`**: A three-tiered structure (`categories` > `threads` > `posts`) powering the community forum.

## 7. Design System: "Brume de la Rivière" (V1)
*   **Colors**: `--foret-nocturne` (#04110D), `--or-ancestral` (#B59551), `--ivoire-ancien` (#F2EEDB).
*   **Typography**: *Outfit* (headings), *Inter* (body), *Schibsted Grotesk* (metrics).
*   **Animations**: Heavy GSAP usage (ScrollTrigger, Context) for a high-end cinematic feel.

---
*Last update: 2026-04-10*
