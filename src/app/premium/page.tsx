"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import { Check, Star, Shield, ArrowRight, Loader2, Lock } from 'lucide-react';
import Link from 'next/link';
import { getStripe } from '@/lib/stripe-client';
import { supabase } from '@/lib/supabase';

const PremiumPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Configurer NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID dans les variables d'env Netlify + .env.local
  const PREMIUM_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID || "";

  const handleCheckout = async () => {
    if (!user) {
      window.location.href = '/connexion';
      return;
    }
    
    if (!PREMIUM_PRICE_ID) {
      alert("Le système de paiement n'est pas encore configuré. Veuillez réessayer plus tard.");
      return;
    }

    try {
      setLoading(true);

      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ priceId: PREMIUM_PRICE_ID }),
      });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Erreur serveur :", data.error);
        alert(data.error || "Une erreur est survenue");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#F4F4F5] font-sans selection:bg-[#E5D5C5] selection:text-black">
      <Navbar />
      
      <main className="pt-32 pb-24 px-6 relative max-w-7xl mx-auto">
        <div className="absolute inset-0 max-w-lg mx-auto opacity-20 pointer-events-none mix-blend-screen blur-3xl">
           <div className="w-full h-[500px] bg-gradient-to-r from-orange-900 via-[#8F4E24] to-black rounded-full" />
        </div>

        <div className="relative text-center max-w-3xl mx-auto space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-3 py-1 bg-[#111110] border border-[#262626] rounded-full"
          >
            <Star className="w-4 h-4 text-[#C16B34]" />
            <span className="text-xs tracking-widest text-[#A1A1AA] uppercase">Sakata Digital Hub</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-light tracking-tight"
          >
            L&apos;Héritage Sans <span className="font-serif italic text-white">Limites</span>.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[#A1A1AA] max-w-xl mx-auto leading-relaxed"
          >
            Débloquez les secrets de nos ancêtres. L&apos;abonnement Premium offre un accès illimité 
            aux archives cachées, aux récits profonds, et à un soutien direct pour la communauté.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-16 max-w-lg mx-auto bg-[#1A1A1A]/60 backdrop-blur-md border border-[#333333] rounded-2xl p-8 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <Shield className="w-32 h-32" />
          </div>

          <div className="relative">
            <h2 className="text-2xl font-semibold mb-2">Passeport Premium</h2>
            <div className="flex items-end space-x-2 mb-8">
              <span className="text-5xl font-light">4.99€</span>
              <span className="text-[#A1A1AA] mb-1">/ mois</span>
            </div>

            <ul className="space-y-4 mb-8 text-[#A1A1AA]">
              <li className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-[#C16B34] shrink-0" />
                <span>Accès total et illimité à tous les articles culturels et dossiers cachés.</span>
              </li>
              <li className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-[#C16B34] shrink-0" />
                <span>Badge de soutien spécial sur votre profil "Gardien de l&apos;Héritage".</span>
              </li>
              <li className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-[#C16B34] shrink-0" />
                <span>Naviguez sans la moindre distraction (zéro pub).</span>
              </li>
              <li className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-[#C16B34] shrink-0" />
                <span>Contribution financière directe à préservation de la culture Sakata.</span>
              </li>
            </ul>

            <button 
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-[#E5D5C5] text-black py-4 rounded-xl flex items-center justify-center space-x-3 hover:bg-white transition-colors duration-300 font-medium"
            >
              {loading ? (
                <>
                   <Loader2 className="w-5 h-5 animate-spin" />
                   <span>Ouverture du portail...</span>
                </>
              ) : (
                <>
                  {user ? <span>Déverrouiller l'accès</span> : <span>Connectez-vous pour Déverrouiller</span>}
                  <Lock className="w-4 h-4 ml-1 opacity-50" />
                </>
              )}
            </button>
            <p className="text-center text-xs text-[#555] mt-4">
               Paiement sécurisé par Stripe. Annulable à tout moment.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default PremiumPage;
