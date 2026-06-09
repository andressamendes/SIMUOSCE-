"use client";

import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-dvh no-select overflow-hidden">
      {/* ── Hero: teal gradient ── */}
      <div className="relative flex flex-col flex-1 gradient-teal-bg px-6 pt-12 pb-0">

        {/* Decorative blobs */}
        <div className="absolute top-[-80px] right-[-80px] w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[120px] left-[-60px] w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute top-[40%] right-[-40px] w-32 h-32 rounded-full bg-white/8 blur-2xl pointer-events-none" />

        {/* Top: CA Logo + badge */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo-casf.svg"
              alt="Centro Acadêmico Sérgio Ferreira"
              width={52}
              height={52}
              className="drop-shadow-lg"
              unoptimized
            />
            <div>
              <p className="text-white/90 text-[10px] font-semibold tracking-widest uppercase leading-tight">
                Centro Acadêmico
              </p>
              <p className="text-white text-xs font-bold tracking-wide leading-tight">
                Sérgio Ferreira
              </p>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/30">
            <p className="text-white text-xs font-bold tracking-wide">AFYA GUANAMBI</p>
          </div>
        </div>

        {/* Main title */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="text-center">
            {/* 2ª badge */}
            <div className="inline-flex items-center justify-center bg-white/25 backdrop-blur rounded-xl px-3 py-1 mb-3 border border-white/30">
              <span className="text-white text-sm font-black tracking-wide">2ª edição · 2026</span>
            </div>

            {/* SIMUOSCE */}
            <div className="flex flex-col items-center">
              <span
                className="text-white font-black tracking-tight leading-none"
                style={{ fontSize: "clamp(52px, 16vw, 72px)", fontStyle: "italic", textShadow: "0 4px 24px rgba(0,0,0,0.15)" }}
              >
                Simu
              </span>
              <span
                className="font-black tracking-tight leading-none gradient-osce"
                style={{
                  fontSize: "clamp(64px, 20vw, 88px)",
                  filter: "drop-shadow(0 4px 16px rgba(255,46,122,0.4))",
                }}
              >
                OSCE
              </span>
            </div>
          </div>

          <p className="text-white/80 text-sm text-center leading-relaxed max-w-xs">
            Ferramenta digital para avaliação prática do OSCE
          </p>
        </div>

        {/* Date chips */}
        <div className="flex gap-2 justify-center mb-8">
          <div className="bg-white/20 rounded-full px-4 py-1.5 flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-white/80" />
            <span className="text-white text-xs font-semibold">10 jun · 1º Período</span>
          </div>
          <div className="bg-white/20 rounded-full px-4 py-1.5 flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-white/80" />
            <span className="text-white text-xs font-semibold">11 jun · 2º Período</span>
          </div>
        </div>

        {/* Wave transition to white */}
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none">
          <svg viewBox="0 0 390 64" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0 32 C98 0, 292 64, 390 32 L390 64 L0 64 Z" fill="white" />
          </svg>
        </div>
      </div>

      {/* ── Buttons section: white background ── */}
      <div className="bg-white px-6 pt-4 pb-10 flex flex-col gap-4 max-w-lg mx-auto w-full">
        <p className="text-center text-xs font-semibold text-[#9CA3AF] uppercase tracking-widest mb-1">
          Selecione o período
        </p>

        {/* 1º Período */}
        <Link
          href="/periodo/1"
          className="relative overflow-hidden flex items-center justify-between rounded-2xl px-6 py-5 shadow-lg active:scale-[0.97] transition-transform"
          style={{
            background: "linear-gradient(135deg, #3DC9C9 0%, #2AABAB 100%)",
            boxShadow: "0 8px 24px rgba(61,201,201,0.35)",
          }}
        >
          {/* Decorative circle */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white/10" />
          <div className="absolute right-10 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/10" />

          <div className="relative z-10">
            <p className="text-2xl font-black text-white">1º Período</p>
            <p className="text-white/75 text-sm mt-0.5">6 estações · 10 de junho</p>
          </div>
          <div className="relative z-10 bg-white/20 rounded-full p-2.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-5 h-5">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </div>
        </Link>

        {/* 2º Período */}
        <Link
          href="/periodo/2"
          className="relative overflow-hidden flex items-center justify-between rounded-2xl px-6 py-5 active:scale-[0.97] transition-transform"
          style={{
            background: "linear-gradient(135deg, #FF2E7A 0%, #FF6B6B 50%, #FFB38A 100%)",
            boxShadow: "0 8px 24px rgba(255,46,122,0.35)",
          }}
        >
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white/10" />
          <div className="absolute right-10 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/10" />

          <div className="relative z-10">
            <p className="text-2xl font-black text-white">2º Período</p>
            <p className="text-white/75 text-sm mt-0.5">6 estações · 11 de junho</p>
          </div>
          <div className="relative z-10 bg-white/20 rounded-full p-2.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-5 h-5">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </div>
        </Link>

        {/* Footer note */}
        <p className="text-center text-[#9CA3AF] text-xs mt-2 leading-relaxed">
          Barema digital oficial · SIMUOSCE 2026
        </p>
      </div>
    </main>
  );
}
