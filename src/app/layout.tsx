import type { Metadata } from "next";
import "@/assets/css/globals.css";
import "@/assets/css/font.css";

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
        {children}
      </body>
    </html>
  );
}
