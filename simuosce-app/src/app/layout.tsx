import type { Metadata, Viewport } from "next";
import { Dancing_Script } from "next/font/google";
import "./globals.css";
import PWARegister from "@/components/PWARegister";

/* Dancing Script — baixado no build, disponível offline */
const dancingScript = Dancing_Script({
  weight: ["700"],
  subsets: ["latin"],
  variable: "--font-script",
  display: "block",
});

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "SIMUOSCE",
  description: "Barema digital oficial do OSCE – Centro Acadêmico Sérgio Ferreira · Afya Guanambi",
  manifest: `${BASE}/manifest.json`,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SIMUOSCE",
  },
  other: { "mobile-web-app-capable": "yes" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#2EC9C4",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`h-full ${dancingScript.variable}`}>
      <head>
        <link rel="apple-touch-icon" href={`${BASE}/icons/icon-512.png`} />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-full flex flex-col bg-white select-none">
        <PWARegister />
        {children}
      </body>
    </html>
  );
}
