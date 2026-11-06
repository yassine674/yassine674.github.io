import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto_Condensed, Chakra_Petch } from "next/font/google";
import "./globals.css";
import "@/components/s1/s1.css";
import Preloader from "@/components/preloader";
import SiteChrome from "@/components/chrome";
import { LangProvider } from "@/components/i18n";
import { LightboxProvider } from "@/components/lightbox";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const condensed = Roboto_Condensed({
  variable: "--font-condensed",
  subsets: ["latin"],
  weight: "700",
});

const display = Chakra_Petch({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "700",
});

export const metadata: Metadata = {
  // the main address: links in the share preview (LinkedIn, WhatsApp...) point here
  metadataBase: new URL("https://yassine-moumoun.vercel.app"),
  title: "Yassine Moumoun — Cybersécurité défensive & Cloud",
  description: "Portfolio : SOC, SIEM/SOAR, automatisation et IA appliquée à la cybersécurité.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} ${condensed.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning><LangProvider>
          <LightboxProvider>
            <Preloader>
              <SiteChrome />
              {children}
            </Preloader>
          </LightboxProvider>
        </LangProvider></body>
    </html>
  );
}
