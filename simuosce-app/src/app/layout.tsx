import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SIMUOSCE – Centro Acadêmico Sergio Ferreira",
  description: "Sistema de avaliação OSCE – Afya Guanambi",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-900 text-slate-50">
        {children}
      </body>
    </html>
  );
}
