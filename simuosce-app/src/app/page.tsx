"use client";

import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-dvh overflow-hidden select-none">

      {/* ══════════════════════════════════
          HERO — teal exato do cartaz
      ══════════════════════════════════ */}
      <div className="relative flex flex-col bg-teal-brand overflow-hidden"
           style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>

        {/* Luz ambiente — radiais translúcidos como no cartaz */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full"
               style={{ background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 65%)" }}/>
          <div className="absolute top-1/2 -left-20 w-60 h-60 rounded-full"
               style={{ background: "radial-gradient(circle, rgba(255,255,255,0.10) 0%, transparent 65%)" }}/>
          <div className="absolute bottom-24 right-0 w-48 h-48 rounded-full"
               style={{ background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 65%)" }}/>
        </div>

        {/* ── Top bar: logo + badge ── */}
        <div className="relative z-10 flex items-center justify-between px-5 pt-12 pb-4">
          <div className="flex items-center gap-3">
            {/* Logo CASF em círculo branco */}
            <div className="w-14 h-14 rounded-full bg-white shadow-xl overflow-hidden flex items-center justify-center"
                 style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.20), 0 0 0 2px rgba(255,255,255,0.60)" }}>
              <Image src="/logo-casf.svg" alt="CASF" width={56} height={56} unoptimized priority/>
            </div>
            <div>
              <p className="text-white/60 text-[10px] font-semibold tracking-[0.16em] uppercase leading-tight">
                Centro Acadêmico
              </p>
              <p className="text-white text-[13px] font-black tracking-wide leading-tight">
                Sérgio Ferreira
              </p>
              <p className="text-white/50 text-[10px] font-medium">Afya Guanambi · BA</p>
            </div>
          </div>

          <div className="rounded-full bg-black/25 backdrop-blur-sm border border-white/20 px-3 py-1.5">
            <span className="text-white/90 text-[11px] font-bold tracking-[0.12em]">SIMUOSCE</span>
          </div>
        </div>

        {/* ── Título principal ── */}
        <div className="relative z-10 flex flex-col items-center text-center px-5 pt-4 pb-2">

          {/* Badge "2ª edição" — estilo cartaz: fundo preto com "2ª" dourado */}
          <div className="inline-flex items-center gap-2 rounded-2xl bg-black/30 backdrop-blur-sm
                          border border-white/15 px-5 py-2 mb-4">
            <span className="font-black text-lg leading-none"
                  style={{ color: "#F5E060", textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                           fontStyle: "italic" }}>
              2ª
            </span>
            <span className="text-white/70 text-xs font-semibold tracking-widest">EDIÇÃO · 2026</span>
          </div>

          {/* "Simu" — Dancing Script, idêntico ao cartaz */}
          <div className="leading-none mb-[-8px]"
               style={{
                 fontFamily: "var(--font-script), 'Georgia', cursive",
                 fontSize: "clamp(60px, 19vw, 84px)",
                 fontWeight: 700,
                 color: "#FFFFFF",
                 textShadow: "2px 3px 0 rgba(0,0,0,0.30), 0 6px 20px rgba(0,0,0,0.15)",
                 letterSpacing: "1px",
               }}>
            Simu
          </div>

          {/* "OSCE" — gradiente vertical pink → peach, sombra preta como no cartaz */}
          <div className="leading-none text-osce"
               style={{
                 fontSize: "clamp(76px, 26vw, 112px)",
                 fontWeight: 900,
                 letterSpacing: "-3px",
                 filter: "drop-shadow(2px 4px 0px rgba(0,0,0,0.50)) drop-shadow(0 8px 24px rgba(238,16,104,0.35))",
               }}>
            OSCE
          </div>
        </div>

        {/* ── Subtítulo ── */}
        <p className="relative z-10 text-white/70 text-sm text-center px-8 mt-3 leading-relaxed">
          Ferramenta digital para avaliação prática do OSCE
        </p>

        {/* ── Chips de data ── */}
        <div className="relative z-10 flex justify-center gap-2.5 mt-4 mb-10 px-5">
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

        {/* Wave de transição teal → branco */}
        <div className="relative z-10 -mb-px" style={{ height: "52px" }}>
          <svg viewBox="0 0 390 52" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0 26 C65 0, 130 52, 195 26 C260 0, 325 52, 390 26 L390 52 L0 52 Z"
                  fill="white"/>
          </svg>
        </div>
      </div>

      {/* ══════════════════════════════════
          BOTÕES — fundo branco, cards iOS
      ══════════════════════════════════ */}
      <div className="flex flex-col gap-4 px-5 pt-4 pb-10 bg-white max-w-sm mx-auto w-full">
        <p className="text-center text-[11px] font-bold text-[#9CA3AF] tracking-[0.18em] uppercase mb-1">
          Selecione o período
        </p>

        {/* 1º Período — teal */}
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

        {/* 2º Período — OSCE gradient */}
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
