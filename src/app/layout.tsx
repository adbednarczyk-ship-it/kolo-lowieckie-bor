import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { club } from "@/data/content";
import { siteUrl } from "@/lib/site";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getSessionUser } from "@/lib/supabase/server";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
  display: "swap",
});

const title = `${club.name} — gospodarka łowiecka i tradycja`;
const description = `${club.name}: zrównoważona gospodarka łowiecka, ochrona zwierzyny i wspólnota myśliwych od ${club.founded} roku. ${club.pzl}.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s · ${club.name}`,
  },
  description,
  keywords: [
    "koło łowieckie",
    "Bór",
    "łowiectwo",
    "PZŁ",
    "polowania",
    "gospodarka łowiecka",
    "myśliwi",
  ],
  authors: [{ name: club.name }],
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: siteUrl,
    siteName: club.name,
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsOrganization",
  name: club.name,
  legalName: club.fullLegalName,
  foundingDate: String(club.founded),
  email: club.email,
  telephone: club.phone,
  url: siteUrl,
  sport: "Hunting",
  address: {
    "@type": "PostalAddress",
    streetAddress: club.address.line2,
    addressLocality: club.address.city,
    postalCode: club.address.postal,
    addressCountry: "PL",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSessionUser();

  return (
    <html lang="pl">
      <body
        className={`${inter.variable} ${playfair.variable} bg-charcoal font-sans text-cream antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#tresc"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-gold focus:px-4 focus:py-2 focus:text-charcoal"
        >
          Przejdź do treści
        </a>
        <Header userEmail={user?.email} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
