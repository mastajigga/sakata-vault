import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SectionCard from "@/components/SectionCard";
import Mission from "@/components/Mission";
import CommunityCallout from "@/components/CommunityCallout";
import { ARTICLES } from "@/data/articles";


export default function Home() {
  return (
    <main className="grain-overlay">
      <Navbar />
      <Hero />
      <Mission />

      {/* Knowledge Grid */}
      <section
        id="savoir"
        className="section-container"
        style={{ paddingTop: "6rem", paddingBottom: "8rem" }}
      >
        <div className="mb-16">
          <span className="eyebrow mb-6 block">
            Patrimoine Vivant
          </span>
          <h2
            className="font-display font-bold"
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              color: "var(--ivoire-ancien)",
            }}
          >
            Explorer les Savoirs
          </h2>
        </div>

        {/* Asymmetric grid: 60/40 then 40/60 */}
        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: "repeat(1, 1fr)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-7">
              <SectionCard
                category="Histoire"
                title={ARTICLES[0].title}
                description={ARTICLES[0].summary}
                href={`/savoir/${ARTICLES[0].slug}`}
                image={ARTICLES[0].image}
              />
            </div>
            <div className="md:col-span-5 md:mt-24">
              <SectionCard
                category="Culture"
                title={ARTICLES[1].title}
                description={ARTICLES[1].summary}
                href={`/savoir/${ARTICLES[1].slug}`}
                image={ARTICLES[1].image}
              />
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-12">
            <div className="md:col-span-4">
              <SectionCard
                category="Histoire"
                title={ARTICLES[2].title}
                description={ARTICLES[2].summary}
                href={`/savoir/${ARTICLES[2].slug}`}
                image={ARTICLES[2].image}
              />
            </div>

            <div className="md:col-span-8 md:pl-12">
              <SectionCard
                category="Communaute"
                title="Le Forum des Enfants du Village"
                description="Un lieu de rencontre pour les descendants, chercheurs et passionnes. Partagez vos souvenirs, vos questions et vos savoirs."
              />
            </div>
          </div>
        </div>
      </section>

      <CommunityCallout />
      <Footer />
    </main>
  );
}

const Footer = () => (
  <footer
    className="section-container"
    style={{
      paddingTop: "4rem",
      paddingBottom: "4rem",
      borderTop: "1px solid var(--bordure-brume)",
      background: "var(--foret-nocturne)",
    }}
  >
    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="flex flex-col gap-2">
        <span className="font-display font-bold text-xl" style={{ color: "var(--or-ancestral)" }}>
          KISAKATA
        </span>
        <p className="font-body text-xs opacity-40" style={{ color: "var(--ivoire-ancien)" }}>
          © 2026 — Brume de la Riviere. Tous droits reserves.
        </p>
      </div>
      <div className="flex gap-8">
        {["CULTURE", "LANGUE", "HISTOIRE", "FORUM"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="font-mono text-[10px] tracking-widest opacity-40 hover:opacity-100 transition-opacity hover:text-or"
            style={{ color: "var(--ivoire-ancien)" }}
          >
            {item}
          </a>
        ))}
      </div>
    </div>
  </footer>
);
