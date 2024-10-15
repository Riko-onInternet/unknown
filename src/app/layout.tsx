import type { Metadata } from "next";
import "@/assets/css/globals.css";
import "@/assets/css/font.css";

import { Analytics } from "@vercel/analytics/react"

import CookieConsent from "@/assets/components/CookieConsent";
import { CookieProvider } from "@/assets/components/CookieProvider";
import KeyBlocker from "@/assets/components/KeyBlock";
export const metadata: Metadata = {
  title: "Unknown",
  // description: "Unknown",
  robots: "noindex, nofollow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="antialiased dark">
      <body className="margin-menus">
        <CookieProvider>
          <KeyBlocker />
          <CookieConsent />
          {children}
          <Analytics />
        </CookieProvider>
      </body>
    </html>
  );
}
