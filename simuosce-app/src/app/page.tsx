"use client";

import Link from "next/link";
import Image from "next/image";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-dvh overflow-hidden select-none">

      {/* ── HERO — teal gradient ── */}
      <div className="relative flex flex-col bg-teal-brand overflow-hidden"
           style={{ paddingTop: "calc(env(safe-area-inset-top,0px) + 48px)", paddingBottom: "0" }}>

        {/* Radiais de luz ambiente */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full"
               style={{ background: "radial-gradient(circle, rgba(255,255,255,0.13) 0%, transparent 65%)" }}/>
          <div className="absolute top-1/2 -left-20 w-60 h-60 rounded-full"
               style={{ background: "radial-gradient(circle, rgba(255,255,255,0.09) 0%, transparent 65%)" }}/>
        </div>

        {/* ── Conteúdo centrado ── */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 pb-2">

          {/* Logo — elemento visual principal */}
          <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm border border-white/30
                          overflow-hidden mb-5 p-0.5"
               style={{ boxShadow: "0 6px 32px rgba(0,0,0,0.22), 0 0 0 3px rgba(255,255,255,0.35)" }}>
            <Image src={`${BASE}/logo-casf.jpg`} alt="Chapa Sérgio Ferreira"
                   width={112} height={112} unoptimized priority
                   className="w-full h-full rounded-full"
                   style={{ objectFit: "cover", objectPosition: "center 20%" }}/>
          </div>

          {/* Badge edição */}
          <div className="inline-flex items-center gap-2 rounded-2xl bg-black/25 backdrop-blur-sm
                          border border-white/15 px-4 py-1.5 mb-3">
            <span className="font-black text-base leading-none"
                  style={{ color: "#F5E060", fontStyle: "italic" }}>2ª</span>
            <span className="text-white/70 text-[11px] font-bold tracking-widest">EDIÇÃO · 2026</span>
          </div>

          {/* Simu + OSCE */}
          <div className="leading-none mb-[-6px]"
               style={{
                 fontFamily: "var(--font-script), 'Georgia', cursive",
                 fontSize: "clamp(52px, 17vw, 76px)",
                 fontWeight: 700,
                 color: "#FFFFFF",
                 textShadow: "2px 3px 0 rgba(0,0,0,0.28), 0 6px 18px rgba(0,0,0,0.14)",
                 letterSpacing: "1px",
               }}>
            Simu
          </div>
          <div className="leading-none text-osce"
               style={{
                 fontSize: "clamp(68px, 24vw, 100px)",
                 fontWeight: 900,
                 letterSpacing: "-3px",
                 filter: "drop-shadow(2px 4px 0px rgba(0,0,0,0.48)) drop-shadow(0 8px 22px rgba(238,16,104,0.32))",
               }}>
            OSCE
          </div>

          {/* Instituição */}
          <p className="text-white font-bold text-[15px] mt-4 leading-snug">
            Centro Acadêmico Sérgio Ferreira
          </p>
          <p className="text-white/55 text-[11px] font-medium mt-1 leading-snug">
            Afya Faculdade de Ciências Médicas de Guanambi
          </p>

          {/* Subtítulo */}
          <p className="text-white/60 text-xs mt-2.5 leading-relaxed">
            Ferramenta digital para avaliação prática do OSCE
          </p>

          {/* Chips de data */}
          <div className="flex flex-wrap justify-center gap-2 mt-4 mb-10">
            <div className="flex items-center gap-2 rounded-full bg-black/20 backdrop-blur-sm
                            border border-white/20 px-4 py-2">
              <div className="w-2 h-2 rounded-full bg-white/80" />
              <span className="text-white/80 text-xs font-semibold">10 jun · 1º Período</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-black/20 backdrop-blur-sm
                            border border-white/20 px-4 py-2">
              <div className="w-2 h-2 rounded-full" style={{ background: "#F5956A" }} />
              <span className="text-white/80 text-xs font-semibold">11 jun · 2º Período</span>
            </div>
          </div>
        </div>

        {/* Wave de transição */}
        <div className="relative z-10 -mb-px" style={{ height: "52px" }}>
          <svg viewBox="0 0 390 52" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0 26 C65 0, 130 52, 195 26 C260 0, 325 52, 390 26 L390 52 L0 52 Z"
                  fill="white"/>
          </svg>
        </div>
      </div>

      {/* ── BOTÕES DE PERÍODO ── */}
      <div className="flex flex-col gap-4 px-5 pt-4 pb-10 bg-white max-w-sm mx-auto w-full">
        <p className="text-center text-[11px] font-bold text-[#9CA3AF] tracking-[0.18em] uppercase mb-1">
          Selecione o período
        </p>

        {/* 1º Período */}
        <Link href="/periodo/1"
              className="pressable block rounded-[22px] overflow-hidden"
              style={{ boxShadow: "0 8px 28px rgba(46,201,196,0.38), 0 2px 8px rgba(0,0,0,0.06)" }}>
          <div className="bg-teal-brand relative overflow-hidden px-6 py-5 flex items-center justify-between">
            <div className="pointer-events-none absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/10"/>
            <div className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white/10"/>
            <div className="relative z-10">
              <p className="text-white font-black text-[22px] leading-tight">1º Período</p>
              <p className="text-white/65 text-sm mt-0.5 font-medium">6 estações · 10 de junho</p>
            </div>
            <div className="relative z-10 w-10 h-10 rounded-full bg-white/20 border border-white/30
                            flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-5 h-5">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </div>
          </div>
        </Link>

        {/* 2º Período */}
        <Link href="/periodo/2"
              className="pressable block rounded-[22px] overflow-hidden"
              style={{ boxShadow: "0 8px 28px rgba(238,16,104,0.32), 0 2px 8px rgba(0,0,0,0.06)" }}>
          <div className="bg-osce relative overflow-hidden px-6 py-5 flex items-center justify-between">
            <div className="pointer-events-none absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/10"/>
            <div className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white/10"/>
            <div className="relative z-10">
              <p className="text-white font-black text-[22px] leading-tight">2º Período</p>
              <p className="text-white/65 text-sm mt-0.5 font-medium">6 estações · 11 de junho</p>
            </div>
            <div className="relative z-10 w-10 h-10 rounded-full bg-white/20 border border-white/30
                            flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-5 h-5">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </div>
          </div>
        </Link>

        <p className="text-center text-[#9CA3AF] text-[11px] mt-1 leading-relaxed">
          Barema digital oficial · SIMUOSCE 2026<br/>
          <span className="opacity-60">Centro Acadêmico Sérgio Ferreira</span>
        </p>
      </div>
    </main>
  );
}
