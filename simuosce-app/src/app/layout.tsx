import type { Metadata, Viewport } from "next";
import "./globals.css";
import PWARegister from "@/components/PWARegister";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "SIMUOSCE",
  description: "Barema digital OSCE – Centro Acadêmico Sergio Ferreira · Afya Guanambi",
  manifest: `${BASE}/manifest.json`,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SIMUOSCE",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#14b8a6",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full">
      <head>
        <link rel="apple-touch-icon" href={`${BASE}/icons/icon-512.png`} />
      </head>
      <body className="min-h-full flex flex-col bg-slate-900 text-slate-50 select-none">
        <PWARegister />
        {children}
      </body>
    </html>
  );
}
