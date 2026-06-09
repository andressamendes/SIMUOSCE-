"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";

export default function HomePage() {
  const setCurrentPeriod = useStore((s) => s.setCurrentPeriod);

  return (
    <main className="flex flex-col min-h-dvh bg-slate-900 text-slate-50">
      <div className="flex flex-col flex-1 items-center justify-center px-6 py-10 gap-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-full bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.8"
              className="w-10 h-10"
            >
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
              <path d="M12 8v4l3 3" />
              <path d="M8 12H4" />
              <path d="M20 12h-4" />
            </svg>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white">
            <span className="text-teal-400">SIMU</span>
            <span className="text-pink-400">OSCE</span>
          </h1>
          <p className="text-slate-400 text-sm text-center leading-5">
            Centro Acadêmico Sergio Ferreira
            <br />
            Afya Guanambi
          </p>
        </div>

        {/* Seleção de Período */}
        <div className="w-full max-w-sm flex flex-col gap-4">
          <p className="text-slate-300 text-center text-base font-medium">
            Selecione o período
          </p>

          <Link
            href="/periodo/1"
            onClick={() => setCurrentPeriod(1)}
            className="flex items-center justify-between w-full bg-teal-600 hover:bg-teal-500 active:bg-teal-700 transition-colors rounded-2xl px-6 py-5 shadow-lg shadow-teal-900/40"
          >
            <div>
              <p className="text-lg font-bold text-white">1º Período</p>
              <p className="text-teal-200 text-sm">6 estações · 10 jun</p>
            </div>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-6 h-6 text-teal-200"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>

          <Link
            href="/periodo/2"
            onClick={() => setCurrentPeriod(2)}
            className="flex items-center justify-between w-full bg-pink-600 hover:bg-pink-500 active:bg-pink-700 transition-colors rounded-2xl px-6 py-5 shadow-lg shadow-pink-900/40"
          >
            <div>
              <p className="text-lg font-bold text-white">2º Período</p>
              <p className="text-pink-200 text-sm">6 estações · 11 jun</p>
            </div>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-6 h-6 text-pink-200"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
        </div>

        {/* Links */}
        <div className="flex gap-6 text-sm text-slate-500">
          <Link
            href="/historico"
            className="flex items-center gap-1 hover:text-slate-300 transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-4 h-4"
            >
              <path d="M12 8v4l3 3" />
              <circle cx="12" cy="12" r="9" />
            </svg>
            Histórico
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-1 hover:text-slate-300 transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-4 h-4"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
