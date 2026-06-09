"use client";

import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-dvh overflow-hidden select-none">

      {/* ── HERO ── teal exato do cartaz */}
      <div className="relative flex flex-col bg-simu px-5 pt-safe-top overflow-hidden"
           style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>

        {/* Blobs decorativos (luz ambiente do cartaz) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full"
               style={{ background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)" }} />
          <div className="absolute top-1/3 -left-16 w-56 h-56 rounded-full"
               style={{ background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)" }} />
          <div className="absolute bottom-16 right-8 w-40 h-40 rounded-full"
               style={{ background: "radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)" }} />
        </div>

        {/* Barra de topo: logo + badge */}
        <div className="relative z-10 flex items-center justify-between pt-12 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white shadow-lg shadow-black/20 overflow-hidden flex items-center justify-center p-0.5">
              <Image
                src="/logo-casf.svg"
                alt="Chapa Sérgio Ferreira"
                width={56}
                height={56}
                unoptimized
              />
            </div>
            <div>
              <p className="text-white/60 text-[10px] font-semibold tracking-widest uppercase">
                Centro Acadêmico
              </p>
              <p className="text-white text-sm font-black leading-tight tracking-wide">
                Sérgio Ferreira
              </p>
            </div>
          </div>

          <div className="rounded-full border border-white/30 bg-white/15 backdrop-blur-sm px-3 py-1.5">
            <p className="text-white text-[11px] font-bold tracking-widest">AFYA GUANAMBI</p>
          </div>
        </div>

        {/* Título central — estilo cartaz */}
        <div className="relative z-10 flex flex-col items-center text-center pt-8 pb-4 gap-1">

          {/* "2ª edição" badge */}
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-xl bg-black/20 backdrop-blur-sm
                          border border-white/20 px-4 py-1.5">
            <span className="text-[#F5E96A] font-black text-sm tracking-wide"
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>
              2ª
            </span>
            <span className="text-white/80 text-xs font-semibold tracking-wider">EDIÇÃO · 2026</span>
          </div>

          {/* "Simu" — itálico bold, sombra dupla como no cartaz */}
          <div className="leading-none"
               style={{
                 fontFamily: "'Georgia', 'Times New Roman', serif",
                 fontStyle: "italic",
                 fontWeight: 900,
                 fontSize: "clamp(56px, 18vw, 80px)",
                 color: "#FFFFFF",
                 textShadow: "3px 3px 0px rgba(0,0,0,0.25), 0 6px 24px rgba(0,0,0,0.15)",
                 letterSpacing: "-1px",
               }}>
            Simu
          </div>

          {/* "OSCE" — gradiente vertical pink→peach, shadow escura como no cartaz */}
          <div className="leading-none -mt-2 text-osce-gradient"
               style={{
                 fontSize: "clamp(72px, 24vw, 104px)",
                 fontWeight: 900,
                 letterSpacing: "-2px",
                 filter: "drop-shadow(3px 4px 0px rgba(0,0,0,0.35)) drop-shadow(0 8px 20px rgba(240,24,106,0.3))",
               }}>
            OSCE
          </div>
        </div>

        {/* Datas */}
        <div className="relative z-10 flex justify-center gap-3 pb-10">
          <div className="flex items-center gap-2 rounded-full bg-black/20 backdrop-blur-sm
                          border border-white/20 px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-[#F5E96A]" />
            <span className="text-white text-xs font-semibold">10 jun · 1º Período</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-black/20 backdrop-blur-sm
                          border border-white/20 px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-[#F5956A]" />
            <span className="text-white text-xs font-semibold">11 jun · 2º Período</span>
          </div>
        </div>

        {/* Wave de saída */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: "48px" }}>
          <svg viewBox="0 0 390 48" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0 24 C65 0, 130 48, 195 24 C260 0, 325 48, 390 24 L390 48 L0 48 Z"
                  fill="white"/>
          </svg>
        </div>
      </div>

      {/* ── BOTÕES ── */}
      <div className="flex flex-col gap-4 px-5 pt-5 pb-10 bg-white max-w-sm mx-auto w-full">
        <p className="text-center text-[11px] font-bold text-[#8A9BB0] tracking-[0.18em] uppercase mb-1">
          Selecione o período
        </p>

        {/* 1º Período */}
        <Link href="/periodo/1" className="btn-press block rounded-[20px] overflow-hidden shadow-lg"
              style={{ boxShadow: "0 8px 28px rgba(46,201,196,0.40)" }}>
          <div className="bg-simu relative overflow-hidden px-6 py-5 flex items-center justify-between">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10" />
              <div className="absolute right-8 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/10" />
            </div>
            <div className="relative z-10">
              <p className="text-white font-black text-2xl leading-tight">1º Período</p>
              <p className="text-white/65 text-sm mt-0.5 font-medium">6 estações · 10 de junho</p>
            </div>
            <div className="relative z-10 w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-5 h-5">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </div>
          </div>
        </Link>

        {/* 2º Período */}
        <Link href="/periodo/2" className="btn-press block rounded-[20px] overflow-hidden shadow-lg"
              style={{ boxShadow: "0 8px 28px rgba(240,24,106,0.35)" }}>
          <div className="bg-osce relative overflow-hidden px-6 py-5 flex items-center justify-between">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10" />
              <div className="absolute right-8 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/10" />
            </div>
            <div className="relative z-10">
              <p className="text-white font-black text-2xl leading-tight">2º Período</p>
              <p className="text-white/65 text-sm mt-0.5 font-medium">6 estações · 11 de junho</p>
            </div>
            <div className="relative z-10 w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-5 h-5">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </div>
          </div>
        </Link>

        <p className="text-center text-[#8A9BB0] text-xs mt-1">
          Barema digital oficial · SIMUOSCE 2026
        </p>
      </div>
    </main>
  );
}
