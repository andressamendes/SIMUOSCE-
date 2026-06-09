"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-dvh bg-slate-900 items-center justify-center px-6 gap-10">
      {/* Logo */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-2xl shadow-teal-900/60">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" className="w-12 h-12">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </div>
        <h1 className="text-5xl font-black tracking-tight">
          <span className="text-teal-400">SIMU</span><span className="text-pink-400">OSCE</span>
        </h1>
        <p className="text-slate-400 text-sm text-center leading-relaxed">
          Centro Acadêmico Sergio Ferreira<br />
          Afya Guanambi
        </p>
      </div>

      {/* Botões de período */}
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <Link
          href="/periodo/1"
          className="flex items-center justify-between bg-teal-600 hover:bg-teal-500 active:scale-95 transition-all rounded-2xl px-7 py-6 shadow-lg shadow-teal-900/40"
        >
          <div>
            <p className="text-2xl font-black text-white">1º Período</p>
            <p className="text-teal-200 text-sm mt-0.5">6 estações · 10 de junho</p>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-7 h-7 text-teal-200">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>

        <Link
          href="/periodo/2"
          className="flex items-center justify-between bg-pink-600 hover:bg-pink-500 active:scale-95 transition-all rounded-2xl px-7 py-6 shadow-lg shadow-pink-900/40"
        >
          <div>
            <p className="text-2xl font-black text-white">2º Período</p>
            <p className="text-pink-200 text-sm mt-0.5">6 estações · 11 de junho</p>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-7 h-7 text-pink-200">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>
      </div>
    </main>
  );
}
