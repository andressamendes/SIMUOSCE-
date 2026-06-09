"use client";

import Link from "next/link";
import Image from "next/image";
import { Station, Period } from "@/types";

type Props = { periodNum: Period; stations: Station[] };

export default function PeriodClient({ periodNum, stations }: Props) {
  const isTeal = periodNum === 1;

  const headerClass = isTeal ? "bg-simu" : "bg-osce";
  const shadowColor = isTeal
    ? "rgba(46,201,196,0.35)"
    : "rgba(240,24,106,0.30)";
  const accentColor = isTeal ? "#2EC9C4" : "#F0186A";
  const accentBg = isTeal ? "rgba(46,201,196,0.10)" : "rgba(240,24,106,0.08)";

  return (
    <main className="flex flex-col min-h-dvh bg-[#F5FEFE] select-none">

      {/* Header */}
      <div className={`relative overflow-hidden px-5 ${headerClass}`}
           style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 48px)", paddingBottom: "56px" }}>

        {/* Blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full"
               style={{ background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)" }} />
        </div>

        <div className="relative z-10 max-w-lg mx-auto">
          <Link href="/"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-5 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            <span className="text-sm font-semibold">Início</span>
          </Link>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-white/60 text-xs font-bold tracking-widest uppercase mb-1">
                Selecione a estação
              </p>
              <h1 className="text-white font-black text-3xl leading-none">
                {periodNum}º Período
              </h1>
              <p className="text-white/60 text-sm mt-1">
                {stations.length} estações disponíveis
              </p>
            </div>

            {/* Mini logo */}
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm
                            border border-white/30 overflow-hidden flex items-center justify-center p-0.5">
              <Image src="/logo-casf.svg" alt="CASF" width={44} height={44} unoptimized />
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: "40px" }}>
          <svg viewBox="0 0 390 40" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0 20 C65 0, 130 40, 195 20 C260 0, 325 40, 390 20 L390 40 L0 40 Z"
                  fill="#F5FEFE"/>
          </svg>
        </div>
      </div>

      {/* Station cards */}
      <div className="flex flex-col gap-3 px-4 pt-2 pb-10 max-w-lg mx-auto w-full">
        {stations.map((station) => (
          <Link
            key={station.id}
            href={`/periodo/${periodNum}/estacao/${station.id}`}
            className="btn-press flex items-center gap-4 bg-white rounded-2xl px-5 py-4"
            style={{
              boxShadow: "0 2px 12px rgba(0,0,0,0.06), 0 0 0 1.5px rgba(0,0,0,0.04)",
            }}
          >
            {/* Número */}
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center"
                 style={{ background: isTeal
                   ? "linear-gradient(135deg, #2EC9C4 0%, #25ABA7 100%)"
                   : "linear-gradient(135deg, #F0186A 0%, #F5956A 100%)",
                   boxShadow: `0 4px 12px ${shadowColor}` }}>
              <span className="text-white font-black text-lg">{station.number}</span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#1A1A2E] text-[15px] leading-snug">
                {station.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: accentBg, color: accentColor }}>
                  {station.criteria.length} critérios
                </span>
                <span className="text-xs text-[#8A9BB0] font-medium">
                  {station.maxScore} pts
                </span>
              </div>
            </div>

            {/* Arrow */}
            <svg viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5"
                 className="w-5 h-5 flex-shrink-0">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </Link>
        ))}
      </div>
    </main>
  );
}
