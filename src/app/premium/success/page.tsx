"use client";

import React, { Suspense, useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';

function PremiumSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { session, isLoading: authLoading, refreshProfile } = useAuth() as any;

  const [status, setStatus] = useState<'loading' | 'verified' | 'error'>('loading');

  useEffect(() => {
    if (authLoading) return;
    
    if (!sessionId) {
      setStatus('error');
      return;
    }

    let cancelled = false;

    const verifyPayment = async (token: string) => {
      try {
        const res = await fetch(`/api/stripe/verify-session?session_id=${sessionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!cancelled) {
          if (data.verified) {
            setStatus('verified');
            if (typeof refreshProfile === 'function') refreshProfile();
          } else {
            setStatus('error');
          }
        }
      } catch {
        if (!cancelled) setStatus('error');
      }
    };

    if (session?.access_token) {
      verifyPayment(session.access_token);
    } else {
      // Si après le chargement initial on n'a toujours pas de session, c'est une erreur d'auth
      setStatus('error');
    }

    return () => { cancelled = true; };
  }, [sessionId, authLoading, session]);

  return (
    <div className="min-h-screen bg-black text-[#F4F4F5]">
      <Navbar />
      <main className="pt-40 pb-24 px-6 flex flex-col items-center justify-center text-center">

        {status === 'loading' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-[#C16B34] animate-spin" />
            </div>
            <p className="text-[#A1A1AA]">Vérification du paiement en cours…</p>
          </motion.div>
        )}

        {status === 'verified' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="w-20 h-20 rounded-full bg-[#C16B34]/20 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-[#C16B34]" />
            </div>
            <h1 className="text-4xl font-light">Bienvenue, Gardien.</h1>
            <p className="text-[#A1A1AA] max-w-md mx-auto">
              Votre paiement a été confirmé. Vous avez désormais un accès illimité
              à la culture et à la sagesse des anciens.
            </p>
            <div className="flex gap-4 mt-4">
              <Link href="/savoir">
                <span className="inline-flex h-12 items-center justify-center rounded-md bg-[#C16B34] px-8 text-sm font-medium text-white hover:bg-[#a85a2a] transition-colors duration-200">
                  Accéder aux archives
                </span>
              </Link>
              <Link href="/profil">
                <span className="inline-flex h-12 items-center justify-center rounded-md bg-[#1A1A1A] px-8 text-sm font-medium border border-[#333] hover:bg-[#E5D5C5] hover:text-black hover:border-transparent transition-all duration-300">
                  Mon profil
                </span>
              </Link>
            </div>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-400" />
            </div>
            <h1 className="text-3xl font-light">Impossible de confirmer le paiement</h1>
            <p className="text-[#A1A1AA] max-w-md mx-auto">
              Si vous avez été débité, votre accès sera activé sous quelques minutes
              via notre système de vérification automatique.
            </p>
            <p className="text-[#555] text-xs">
              Problème persistant ? Contactez-nous en mentionnant l'ID : <code className="text-[#A1A1AA]">{sessionId || "—"}</code>
            </p>
            <div className="flex gap-4 mt-2">
              <Link href="/profil">
                <span className="inline-flex h-12 items-center justify-center rounded-md bg-[#1A1A1A] px-8 text-sm font-medium border border-[#333] hover:bg-white/10 transition-colors">
                  Vérifier mon profil
                </span>
              </Link>
              <Link href="/">
                <span className="inline-flex h-12 items-center justify-center rounded-md bg-transparent px-8 text-sm opacity-50 hover:opacity-100 transition-opacity">
                  Retour à l'accueil
                </span>
              </Link>
            </div>
          </motion.div>
        )}

      </main>
    </div>
  );
}

export default function PremiumSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-[#F4F4F5] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#C16B34] animate-spin" />
      </div>
    }>
      <PremiumSuccessContent />
    </Suspense>
  );
}
