"use client";

import Link from "next/link";
import Image from "next/image";
import { Period } from "@/types";
import { periodThemes } from "@/lib/themes";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const periods: { num: Period; label: string; subtitle: string }[] = [
  { num: 1, label: "1º Período", subtitle: "6 estações" },
  { num: 2, label: "2º Período", subtitle: "5 estações" },
  { num: 3, label: "3º Período", subtitle: "4 estações" },
];

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
        <div className="relative z-10 flex flex-col items-center text-center px-6 pb-10">

          {/* Logo */}
          <div className="anim-fade-up w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm border border-white/30
                          overflow-hidden mb-5 p-0.5"
               style={{ boxShadow: "0 6px 32px rgba(0,0,0,0.22), 0 0 0 3px rgba(255,255,255,0.35)" }}>
            <Image src={`${BASE}/logo-casf.jpg`} alt="Logo do Centro Acadêmico Sérgio Ferreira"
                   width={112} height={112} unoptimized priority
                   className="w-full h-full rounded-full"
                   style={{ objectFit: "cover", objectPosition: "center 20%" }}/>
          </div>

          {/* Badge edição */}
          <div className="anim-fade-up inline-flex items-center gap-2 rounded-2xl bg-black/25 backdrop-blur-sm
                          border border-white/15 px-4 py-1.5 mb-3"
               style={{ animationDelay: "70ms" }}>
            <span className="font-black text-base leading-none"
                  style={{ color: "#F5E060", fontStyle: "italic" }}>2ª</span>
            <span className="text-white/70 text-[11px] font-bold tracking-widest">EDIÇÃO · 2026</span>
          </div>

          {/* Simu + OSCE */}
          <div className="anim-fade-up leading-none mb-[-6px]"
               style={{
                 animationDelay: "130ms",
                 fontFamily: "var(--font-script), 'Georgia', cursive",
                 fontSize: "clamp(52px, 17vw, 76px)",
                 fontWeight: 700,
                 color: "#FFFFFF",
                 textShadow: "0 2px 10px rgba(0,0,0,0.30), 0 8px 24px rgba(0,0,0,0.12)",
                 letterSpacing: "1px",
               }}>
            Simu
          </div>
          <div className="anim-fade-up leading-none text-osce"
               style={{
                 animationDelay: "190ms",
                 fontSize: "clamp(68px, 24vw, 100px)",
                 fontWeight: 900,
                 letterSpacing: "-3px",
                 filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.32)) drop-shadow(0 10px 28px rgba(238,16,104,0.28))",
               }}>
            OSCE
          </div>

          {/* Instituição */}
          <p className="anim-fade-up text-white font-bold text-[15px] mt-4 leading-snug"
             style={{ animationDelay: "250ms" }}>
            Centro Acadêmico Sérgio Ferreira
          </p>
          <p className="anim-fade-up text-white/55 text-[11px] font-medium mt-1 leading-snug"
             style={{ animationDelay: "290ms" }}>
            Afya Faculdade de Ciências Médicas de Guanambi
          </p>
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
      <div className="flex flex-col gap-4 px-5 pt-4 pb-4 bg-white max-w-sm mx-auto w-full">
        <p className="overline text-center text-[#9CA3AF] mb-1">
          Selecione o período
        </p>

        {periods.map(({ num, label, subtitle }, i) => {
          const { headerClass, cardShadow } = periodThemes[num];
          return (
            <Link key={num} href={`/periodo/${num}`}
                  className="pressable anim-fade-up block rounded-[22px] overflow-hidden"
                  style={{ boxShadow: cardShadow, animationDelay: `${320 + i * 75}ms` }}>
              <div className={`${headerClass} relative overflow-hidden px-6 py-5 flex items-center justify-between`}>
                <div className="pointer-events-none absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/10"/>
                <div className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white/10"/>
                <div className="relative z-10">
                  <p className="text-white font-black text-[22px] leading-tight">{label}</p>
                  <p className="text-white/65 text-sm mt-0.5 font-medium">{subtitle}</p>
                </div>
                <div className="relative z-10 w-10 h-10 rounded-full bg-white/20 border border-white/30
                                flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-5 h-5"
                       aria-hidden="true">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <footer className="bg-white text-center px-5 pt-4 pb-10">
        <p className="text-[11px] font-semibold text-[#9CA3AF] leading-snug">
          Centro Acadêmico Sérgio Ferreira · © 2026
        </p>
        <p className="text-[10px] font-medium text-[#C4C9D0] mt-1 leading-snug">
          Desenvolvido por Andressa Souza · Afya Guanambi
        </p>
      </footer>
    </main>
  );
}
