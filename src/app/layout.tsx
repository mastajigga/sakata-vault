import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Kisakata.com | Le Portail Culturel Sakata",
  description: "Découvrez le savoir, la langue et la spiritualité du peuple Sakata (Mai-Ndombe). Un espace moderne d'échange et de transmission.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={outfit.variable}>
      <body>
        {children}
      </body>
    </html>
  );
}
