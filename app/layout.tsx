import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MotionRoot from "@/components/MotionRoot";
import "./globals.css";

/* Archivo carries a width axis, which the display sizes use at 110 for a
   semi-expanded setting. Self-hosted by next/font, so there is no
   render-blocking request to a third party. */
const archivo = Archivo({
  subsets: ["latin"],
  /* Loaded as a variable font so the width axis is available: next/font
     only exposes `axes` when no fixed weight is requested. */
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ziagoods.com"),
  title: "Zia Goods & Carriage Contractor",
  description:
    "Bulk liquid haulage across Pakistan since 1991. Edible oil, molasses, chemicals and containerised finished goods.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

/* Schema.org with both addresses, per the PRD's technical SEO section.
   Head office, site office and the Punjab branch are separate locations. */
const schema = {
  "@context": "https://schema.org",
  "@type": "MovingCompany",
  name: "Zia Goods & Carriage Contractor",
  description:
    "Bulk liquid haulage across Pakistan since 1991. Edible oil, molasses, chemicals and containerised finished goods.",
  foundingDate: "1991",
  url: "https://ziagoods.com",
  email: "ziagoodsncarriage@gmail.com",
  areaServed: { "@type": "Country", name: "Pakistan" },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Plot 290, Main National Highway, Razzakabad, Bin Qasim",
    addressLocality: "Karachi",
    addressRegion: "Sindh",
    addressCountry: "PK",
  },
  location: [
    {
      "@type": "Place",
      name: "Head office — Karachi",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Karachi",
        addressRegion: "Sindh",
        addressCountry: "PK",
      },
    },
    {
      "@type": "Place",
      name: "Site office — Port Qasim",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Plot 290, Main National Highway, Razzakabad, Bin Qasim",
        addressLocality: "Karachi",
        addressRegion: "Sindh",
        addressCountry: "PK",
      },
    },
    {
      "@type": "Place",
      name: "Branch — Sargodha",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Sargodha",
        addressRegion: "Punjab",
        addressCountry: "PK",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexMono.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            /* Set before paint so elements JS will animate can start
               hidden without risking a blank page when the script never
               arrives. */
            __html: `document.documentElement.classList.add("js")`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="skip-link btn-base absolute left-2 top-2 z-100 -translate-y-[200%] focus-visible:translate-y-0"
        >
          Skip to content
        </a>

        {/* ScrollSmoother requires exactly this nesting. Nothing but
            #smooth-content may sit inside the wrapper. */}
        <div id="smooth-wrapper">
          <div id="smooth-content">
            <Nav />
            <main id="main">{children}</main>
            <Footer />
          </div>
        </div>

        <MotionRoot />
      </body>
    </html>
  );
}
