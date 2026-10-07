import type { Metadata } from "next";
import { Cormorant_Garamond, Bricolage_Grotesque, Red_Hat_Mono, Dancing_Script, Caveat } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display-var",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif-var",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-handwriting",
  display: "swap",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-script",
  display: "swap",
});

/* Micro-labels — echoes the mono captions on microsoft.ai */
const redHatMono = Red_Hat_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-var",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yassine Moumoun — Portfolio",
  description:
    "Portfolio of Yassine MOUMOUN — engineering student in Computer Science & Cybersecurity at INSA Hauts-de-France. Defensive security, SOC operations, SIEM and incident detection.",
  keywords: ["Cybersecurity", "SOC", "SIEM", "Blue Team", "Wazuh", "Splunk", "Incident Response"],
  authors: [{ name: "Yassine MOUMOUN", url: "https://github.com/yassine674" }],
  openGraph: {
    title: "Yassine Moumoun — Portfolio",
    description:
      "Defensive security, SOC operations and incident detection.",
    type: "website",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${cormorant.variable} ${redHatMono.variable} ${dancingScript.variable} ${caveat.variable}`}>
      <body className={`${dancingScript.variable} ${caveat.variable}`}><LanguageProvider>{children}</LanguageProvider></body>
    </html>
  );
}
