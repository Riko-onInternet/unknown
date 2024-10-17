import type { Metadata } from "next";
import "@/assets/css/globals.css";
import "@/assets/css/font.css";

import CookieConsent from "@/assets/components/CookieConsent";
import { CookieProvider } from "@/assets/components/CookieProvider";
import KeyBlocker from "@/assets/components/KeyBlock";
import LoadingOverlay from "@/assets/components/loadingOverlay";

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
      <body className="relative">
        <LoadingOverlay />
        <CookieProvider>
          <main className="margin-menus">
            <KeyBlocker />
            <CookieConsent />
            {children}
          </main>
        </CookieProvider>
      </body>
    </html>
  );
}
