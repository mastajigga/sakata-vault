import type { Metadata, Viewport } from "next";
import { Outfit, Schibsted_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
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

export const viewport: Viewport = {
  themeColor: "#C4A035",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://sakata.com"),
  title: {
    default: "Sakata — Patrimoine & Langue Basakata | Brume de la Rivière",
    template: "%s | Sakata",
  },
  description:
    "Portail de transmission des savoirs, de la langue Kisakata et de la sagesse du peuple Sakata (Mai-Ndombe, RDC). Encyclopédie vivante, cours de langue, carte interactive et forum communautaire.",
  keywords: [
    "Sakata", "Basakata", "Kisakata", "langue sakata", "Mai-Ndombe",
    "RDC", "Congo", "patrimoine", "culture bantoue", "langue bantoue",
    "histoire précoloniale", "Lukenie", "encyclopédie africaine",
    "cours de langue africaine", "préservation culturelle",
  ],
  authors: [{ name: "Sakata" }],
  creator: "Sakata",
  publisher: "Sakata",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  openGraph: {
    type: "website",
    siteName: "Sakata",
    title: "Sakata — Patrimoine & Langue Basakata",
    description:
      "Arche numérique du patrimoine Sakata : langue Kisakata, histoire, traditions, carte interactive et forum communautaire.",
    url: "https://sakata.com",
    locale: "fr_FR",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sakata — Brume de la Rivière",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sakata — Patrimoine & Langue Basakata",
    description:
      "Arche numérique du patrimoine Sakata : langue, histoire, traditions du peuple Basakata (RDC).",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://sakata.com",
  },
};

import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { ChatUnreadProvider } from "@/contexts/ChatUnreadContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NetworkStatus from "@/components/NetworkStatus";
import { PageAnimate } from "@/components/ui/PageAnimate";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      data-scroll-behavior="smooth"
      className={`${outfit.variable} ${schibsted.variable} ${geistMono.variable}`}
    >
      <head>
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Sakata",
              alternateName: "Brume de la Rivière",
              url: "https://sakata.com",
              description:
                "Portail de transmission des savoirs et de la langue du peuple Sakata (Mai-Ndombe, RDC).",
              inLanguage: ["fr", "kis"],
              about: {
                "@type": "Thing",
                name: "Culture Basakata",
                description: "Patrimoine culturel, langue et traditions du peuple Sakata",
              },
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://sakata.com/savoir?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        {/* PWA meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Sakata" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <NetworkStatus />
        <AuthProvider>
          <LanguageProvider>
            <ChatUnreadProvider>
              <LoadingProvider>
                <Navbar />
                <main className="flex-1">
                  <PageAnimate>{children}</PageAnimate>
                </main>
                <Footer />
                <WelcomeModal />
              </LoadingProvider>
            </ChatUnreadProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
