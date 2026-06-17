"use client";

import Link from "next/link";
import { Station, Period } from "@/types";
import { getTheme } from "@/lib/themes";
import { getDurationMin } from "@/lib/timer";

type Props = { periodNum: Period; stations: Station[] };

export default function PeriodClient({ periodNum, stations }: Props) {
  const { headerClass, accent, accentBg, numGradient, shadowBtn } = getTheme(periodNum);

  return (
    <main className="flex flex-col min-h-dvh bg-surface-dim select-none">

      {/* ── Header ── */}
      <div className={`relative overflow-hidden ${headerClass}`}
           style={{ paddingTop: "calc(env(safe-area-inset-top,0px) + 44px)", paddingBottom: "54px" }}>

        {/* Blob */}
        <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full"
             style={{ background: "radial-gradient(circle,rgba(255,255,255,0.13) 0%,transparent 70%)" }}/>

        <div className="relative z-10 max-w-lg mx-auto px-5">
          <Link href="/"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-5 transition-colors
                           -mx-2 px-2 py-2.5 -my-2.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"
                 aria-hidden="true">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            <span className="text-sm font-semibold">Início</span>
          </Link>

          <p className="overline text-white/55 mb-2">
            Selecione a estação
          </p>
          <h1 className="text-white font-black text-3xl leading-none tracking-tight">{periodNum}º Período</h1>
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
        {stations.length === 0 && (
          <div className="anim-fade-up card-surface rounded-[20px] px-5 py-8 text-center">
            <p className="text-[#4B5563] font-semibold text-[15px]">
              Nenhuma estação disponível neste período.
            </p>
            <p className="text-[#9CA3AF] text-[13px] mt-1.5">
              As estações serão exibidas assim que o barema for cadastrado.
            </p>
          </div>
        )}
        {stations.map((station, i) => (
          <Link
            key={station.id}
            href={`/periodo/${periodNum}/estacao/${station.id}`}
            className="pressable anim-fade-up card-surface flex items-center gap-4 rounded-[20px] px-5 py-4"
            style={{ animationDelay: `${i * 55}ms` }}
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
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap text-[12px] font-semibold
                              text-[#9CA3AF] leading-none">
                <span style={{ color: accent }}>{station.criteria.length} critérios</span>
                <span aria-hidden="true" className="text-[#D1D5DB]">·</span>
                <span className="inline-flex items-center gap-1">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                       className="w-3 h-3" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  {getDurationMin(station.criteria.length)} min
                </span>
                <span aria-hidden="true" className="text-[#D1D5DB]">·</span>
                <span>{station.maxScore} pts</span>
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
