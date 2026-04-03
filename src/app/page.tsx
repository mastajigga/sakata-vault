import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CustomCursor from "@/components/CustomCursor";
import SectionCard from "@/components/SectionCard";

export default function Home() {
  return (
    <main>
      <CustomCursor />
      <Navbar />
      <Hero />
      
      {/* Knowledge Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="mb-16">
          <span className="text-[var(--sakata-gold)] text-xs font-black uppercase tracking-[0.3em]">Patrimoine Vivant</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4">Explorer les Savoirs</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <SectionCard 
            category="Langue"
            title="L'Art du Kisakata"
            description="Explorez la richesse de notre langue maternelle. Des contes traditionnels aux subtilités grammaticales, apprenez à parler avec le cœur de nos ancêtres."
          />
          <SectionCard 
            category="Culture"
            title="Sagesse & Rites"
            description="Découvrez les rythmes des danses traditionnelles, les récits des anciens et l'histoire fascinante de la région du Mai-Ndombe."
          />
          <SectionCard 
            category="Spiritualité"
            title="Équilibre & Croyances"
            description="Plongez dans les fondements spirituels du peuple Sakata. Un héritage de sagesse pour naviguer dans le monde moderne."
          />
        </div>
      </section>

      {/* Community Callout */}
      <section className="h-[60vh] flex items-center justify-center bg-[var(--sakata-green-deep)] px-6 relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
         <div className="max-w-4xl text-center relative z-10">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 text-gradient">Un pont entre hier et demain</h2>
            <p className="text-xl opacity-80 leading-relaxed mb-12">
               Ici, chaque contribution enrichit notre patrimoine. Que vous soyez 
               à Inongo ou dans la diaspora, Kisakata.com est votre espace de 
               réseau, d'échange et de réappropriation culturelle.
            </p>
            <button className="bg-white text-black px-10 py-5 rounded-full font-black uppercase tracking-widest hover:scale-110 transition-transform">
               Ouvrir une discussion
            </button>
         </div>
      </section>
    </main>
  );
}
