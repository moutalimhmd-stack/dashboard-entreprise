import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Système Décisionnel Entreprise",
  description: "Analyse décisionnelle ",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="fr">
      <body className="antialiased bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}