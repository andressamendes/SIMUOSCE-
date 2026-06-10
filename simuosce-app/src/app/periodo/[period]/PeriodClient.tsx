"use client";

import Link from "next/link";
import { Station, Period } from "@/types";
import { periodThemes } from "@/lib/themes";
import { getDurationMin } from "@/lib/timer";

type Props = { periodNum: Period; stations: Station[] };

export default function PeriodClient({ periodNum, stations }: Props) {
  const { headerClass, accent, accentBg, numGradient, shadowBtn } =
    periodThemes[periodNum] ?? periodThemes[1];

  return (
    <main className="flex flex-col min-h-dvh bg-[#F4FEFE] select-none">

      {/* ── Header ── */}
      <div className={`relative overflow-hidden ${headerClass}`}
           style={{ paddingTop: "calc(env(safe-area-inset-top,0px) + 44px)", paddingBottom: "54px" }}>

        {/* Blob */}
        <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full"
             style={{ background: "radial-gradient(circle,rgba(255,255,255,0.13) 0%,transparent 70%)" }}/>

        <div className="relative z-10 max-w-lg mx-auto px-5">
          <Link href="/"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-5 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"
                 aria-hidden="true">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            <span className="text-sm font-semibold">Início</span>
          </Link>

          <p className="text-white/55 text-[10px] font-bold tracking-[0.18em] uppercase mb-2">
            Selecione a estação
          </p>
          <h1 className="text-white font-black text-3xl leading-none">{periodNum}º Período</h1>
          <p className="text-white/55 text-sm mt-1.5 font-medium">
            {stations.length} estações disponíveis
          </p>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0" style={{ height: "44px" }}>
          <svg viewBox="0 0 390 44" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0 22 C65 0, 130 44, 195 22 C260 0, 325 44, 390 22 L390 44 L0 44 Z"
                  fill="#F4FEFE"/>
          </svg>
        </div>
      </div>

      {/* ── Cards ── */}
      <div className="flex flex-col gap-3 px-4 pt-2 pb-10 max-w-lg mx-auto w-full">
        {stations.map((station, i) => (
          <Link
            key={station.id}
            href={`/periodo/${periodNum}/estacao/${station.id}`}
            className="pressable anim-fade-up flex items-center gap-4 bg-white rounded-[20px] px-5 py-4"
            style={{
              boxShadow: "0 2px 14px rgba(0,0,0,0.06), 0 0 0 1.5px rgba(0,0,0,0.04)",
              animationDelay: `${i * 55}ms`,
            }}
          >
            {/* Número */}
            <div className="flex-shrink-0 w-12 h-12 rounded-[14px] flex items-center justify-center"
                 style={{
                   background: numGradient,
                   boxShadow: `0 4px 14px ${shadowBtn}`,
                 }}>
              <span className="text-white font-black text-lg">{station.number}</span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#1F2937] text-[15px] leading-snug">
                {station.name}
              </p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                      style={{ background: accentBg, color: accent }}>
                  {station.criteria.length} critérios
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F3F4F6] text-[#6B7280]">
                  ⏱ {getDurationMin(station.criteria.length)}min
                </span>
                <span className="text-[#9CA3AF] text-[11px] font-semibold">
                  {station.maxScore} pts
                </span>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                 style={{ background: accentBg }}>
              <svg viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5"
                   className="w-4 h-4" aria-hidden="true">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
