import type { Metadata } from "next";
import { Outfit, Schibsted_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { LoadingProvider } from "@/components/LoadingProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import WelcomeModal from "@/components/WelcomeModal";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-satoshi",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kisakata.com | Brume de la Rivière — Patrimoine Sakata",
  description: "Portail de transmission des savoirs, de la langue et de la sagesse du peuple Sakata (Mai-Ndombe).",
};

import { AnalyticsProvider } from "@/components/AnalyticsProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${outfit.variable} ${schibsted.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <AuthProvider>
          <LanguageProvider>
            <LoadingProvider>
              <AnalyticsProvider>
                <WelcomeModal />
                {children}
              </AnalyticsProvider>
            </LoadingProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
