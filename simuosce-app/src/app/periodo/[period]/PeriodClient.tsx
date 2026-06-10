"use client";

import Link from "next/link";
import Image from "next/image";
import { Station, Period } from "@/types";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Props = { periodNum: Period; stations: Station[] };

export default function PeriodClient({ periodNum, stations }: Props) {
  const themes = {
    1: {
      headerClass: "bg-teal-brand",
      shadowBtn:   "rgba(46,201,196,0.35)",
      accentColor: "#2EC9C4",
      accentBg:    "rgba(46,201,196,0.10)",
      numGradient: "linear-gradient(135deg,#2EC9C4 0%,#178785 100%)",
    },
    2: {
      headerClass: "bg-osce",
      shadowBtn:   "rgba(238,16,104,0.28)",
      accentColor: "#EE1068",
      accentBg:    "rgba(238,16,104,0.08)",
      numGradient: "linear-gradient(135deg,#EE1068 0%,#F5956A 100%)",
    },
    3: {
      headerClass: "bg-period3",
      shadowBtn:   "rgba(124,58,237,0.32)",
      accentColor: "#7C3AED",
      accentBg:    "rgba(124,58,237,0.08)",
      numGradient: "linear-gradient(135deg,#7C3AED 0%,#A78BFA 100%)",
    },
  } as const;
  const { headerClass, shadowBtn, accentColor, accentBg, numGradient } =
    themes[periodNum] ?? themes[1];

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

          <div className="flex items-end justify-between">
            <div>
              <p className="text-white/55 text-[10px] font-bold tracking-[0.18em] uppercase mb-2">
                Selecione a estação
              </p>
              <h1 className="text-white font-black text-3xl leading-none">{periodNum}º Período</h1>
              <p className="text-white/55 text-sm mt-1.5 font-medium">
                {stations.length} estações disponíveis
              </p>
            </div>

            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30
                            overflow-hidden flex items-center justify-center p-0.5">
              <Image src={`${BASE}/logo-casf.jpg`} alt="Chapa Sérgio Ferreira" width={44} height={44}
                     unoptimized style={{ objectFit: "cover", objectPosition: "center 20%" }}/>
            </div>
          </div>
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
        {stations.map((station) => (
          <Link
            key={station.id}
            href={`/periodo/${periodNum}/estacao/${station.id}`}
            className="pressable flex items-center gap-4 bg-white rounded-[20px] px-5 py-4"
            style={{
              boxShadow: "0 2px 14px rgba(0,0,0,0.06), 0 0 0 1.5px rgba(0,0,0,0.04)",
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
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                      style={{ background: accentBg, color: accentColor }}>
                  {station.criteria.length} critérios
                </span>
                <span className="text-[#9CA3AF] text-[11px] font-semibold">
                  {station.maxScore} pts máx.
                </span>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                 style={{ background: accentBg }}>
              <svg viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5"
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
