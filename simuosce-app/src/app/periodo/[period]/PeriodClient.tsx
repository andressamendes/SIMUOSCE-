"use client";

import Link from "next/link";
import { Station, Period } from "@/types";

type Props = { periodNum: Period; stations: Station[] };

export default function PeriodClient({ periodNum, stations }: Props) {
  const isTeal = periodNum === 1;

  const headerGradient = isTeal
    ? "linear-gradient(135deg, #3DC9C9 0%, #2AABAB 100%)"
    : "linear-gradient(135deg, #FF2E7A 0%, #FF6B6B 50%, #FFB38A 100%)";

  const numberBg = isTeal
    ? "linear-gradient(135deg, #3DC9C9 0%, #2AABAB 100%)"
    : "linear-gradient(135deg, #FF2E7A 0%, #FFB38A 100%)";

  const borderHover = isTeal ? "#3DC9C9" : "#FF2E7A";

  return (
    <main className="flex flex-col min-h-dvh bg-white no-select">
      {/* Header */}
      <div
        className="relative overflow-hidden px-4 pt-12 pb-8"
        style={{ background: headerGradient }}
      >
        {/* Decorative */}
        <div className="absolute top-[-40px] right-[-40px] w-40 h-40 rounded-full bg-white/8 pointer-events-none" />
        <div className="absolute bottom-[-20px] left-10 w-24 h-24 rounded-full bg-white/8 pointer-events-none" />

        <div className="relative z-10 max-w-lg mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-5 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span className="text-sm font-medium">Início</span>
          </Link>

          <h1 className="text-3xl font-black text-white">{periodNum}º Período</h1>
          <p className="text-white/70 text-sm mt-1">
            {stations.length} estações · Selecione para avaliar
          </p>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none">
          <svg viewBox="0 0 390 32" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0 16 C98 0, 292 32, 390 16 L390 32 L0 32 Z" fill="white" />
          </svg>
        </div>
      </div>

      {/* Station list */}
      <div className="flex flex-col gap-3 px-4 pt-4 pb-10 max-w-lg mx-auto w-full">
        {stations.map((station) => (
          <Link
            key={station.id}
            href={`/periodo/${periodNum}/estacao/${station.id}`}
            className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 active:scale-[0.97] transition-all border-2 border-transparent"
            style={{
              boxShadow: "0 2px 12px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = borderHover;
              (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px rgba(0,0,0,0.08), 0 0 0 1px ${borderHover}`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "transparent";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)";
            }}
          >
            {/* Number bubble */}
            <div
              className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center shadow-sm"
              style={{ background: numberBg }}
            >
              <span className="text-white font-black text-base">{station.number}</span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#1F2937] text-base leading-snug">{station.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[#9CA3AF] text-xs">{station.criteria.length} critérios</span>
                <span className="text-[#D1D5DB] text-xs">·</span>
                <span className="text-[#9CA3AF] text-xs font-medium">{station.maxScore} pontos</span>
              </div>
            </div>

            <div
              className="flex-shrink-0 rounded-full p-1.5"
              style={{ background: isTeal ? "rgba(61,201,201,0.12)" : "rgba(255,46,122,0.1)" }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke={isTeal ? "#3DC9C9" : "#FF2E7A"}
                strokeWidth="2.5"
                className="w-4 h-4"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
