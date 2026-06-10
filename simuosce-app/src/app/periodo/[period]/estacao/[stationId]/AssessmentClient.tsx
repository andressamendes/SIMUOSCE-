"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Station, Period } from "@/types";
import { periodThemes } from "@/lib/themes";
import { fmt } from "@/lib/format";

type Props = { periodNum: Period; station: Station | null };

export default function AssessmentClient({ periodNum, station }: Props) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const score = station
    ? station.criteria
        .filter((c) => checked.has(c.id))
        .reduce((s, c) => s + c.score, 0)
    : 0;
  const maxScore = station?.maxScore ?? 10;
  const pct = Math.round((score / maxScore) * 100);

  const toggle = useCallback((id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  if (!station) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh gap-3 bg-white">
        <p className="text-[#9CA3AF]">Estação não encontrada.</p>
        <Link href="/" className="font-bold text-[#2EC9C4]">Voltar</Link>
      </div>
    );
  }

  const { headerClass, accent, accentBg, checkGlow, footerShadow } =
    periodThemes[periodNum] ?? periodThemes[1];

  /* Feedback de nota */
  const label       = pct >= 70 ? "Aprovado" : pct >= 50 ? "Regular" : pct > 0 ? "Insuficiente" : null;
  const labelBg     = pct >= 70 ? "rgba(16,185,129,0.22)" : pct >= 50 ? "rgba(245,158,11,0.22)" : "rgba(239,68,68,0.22)";
  const labelColor  = pct >= 70 ? "#10B981" : pct >= 50 ? "#F59E0B" : "#EF4444";

  return (
    <main className="flex flex-col min-h-dvh bg-white select-none">

      {/* ── HEADER ── */}
      <div className={`relative overflow-hidden ${headerClass}`}
           style={{
             paddingTop: "calc(env(safe-area-inset-top,0px) + 36px)",
             paddingBottom: "52px",
           }}>

        <div className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full"
             style={{ background: "radial-gradient(circle,rgba(255,255,255,0.13) 0%,transparent 70%)" }}/>

        <div className="relative z-10 max-w-lg mx-auto px-5">

          {/* Back */}
          <Link href={`/periodo/${periodNum}`}
                className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-4 transition-colors
                           -mx-2 px-2 py-2.5 -my-2.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"
                 aria-hidden="true">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            <span className="text-sm font-semibold">{periodNum}º Período</span>
          </Link>

          {/* Título + Score */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="inline-block bg-black/20 backdrop-blur-sm rounded-lg px-2.5 py-1 mb-2
                              border border-white/20">
                <span className="text-white/75 text-[10px] font-bold tracking-[0.16em] uppercase">
                  Estação {station.number}
                </span>
              </div>
              <h1 className="text-white font-black text-[19px] leading-snug pr-3"
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,0.20)" }}>
                {station.name}
              </h1>
            </div>

            {/* Score card — glass */}
            <div className="flex-shrink-0 bg-white/22 backdrop-blur-md rounded-[18px]
                            px-4 py-3 text-center min-w-[72px] border border-white/30">
              <p className="text-white font-black text-3xl leading-none"
                 style={{ textShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                {fmt(score)}
              </p>
              <p className="text-white/50 text-xs mt-0.5 font-semibold">/ {maxScore}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4 h-[6px] bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-300"
                 style={{ width: `${pct}%` }}/>
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-white/50 text-xs font-medium">
              {checked.size} / {station.criteria.length} critérios
            </span>
            <span className="text-white/80 text-xs font-bold">{pct}%</span>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0" style={{ height: "44px" }}>
          <svg viewBox="0 0 390 44" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0 22 C65 0, 130 44, 195 22 C260 0, 325 44, 390 22 L390 44 L0 44 Z"
                  fill="white"/>
          </svg>
        </div>
      </div>

      {/* ── CRITÉRIOS ── */}
      <div className="flex-1 overflow-y-auto pb-36">
        <div className="max-w-lg mx-auto px-4 pt-2">
          {station.criteria.map((criterion) => {
            const on = checked.has(criterion.id);
            return (
              <button
                key={criterion.id}
                onClick={() => toggle(criterion.id)}
                className="w-full flex items-center gap-3.5 text-left py-3.5 px-3.5 rounded-xl mb-1
                           transition-colors duration-150"
                style={{ backgroundColor: on ? accentBg : "transparent" }}
              >
                {/* Checkbox circular */}
                <div
                  className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center
                             justify-center transition-all duration-150 ${on ? checkGlow : ""}`}
                  style={{
                    borderColor: on ? accent : "#D1D5DB",
                    backgroundColor: on ? accent : "#FAFAFA",
                  }}
                >
                  {on && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"
                         className="w-3.5 h-3.5" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>

                {/* Texto */}
                <p className="flex-1 text-[15px] leading-snug transition-all duration-150"
                   style={{
                     color: on ? "#1F2937" : "#4B5563",
                     fontWeight: on ? "600" : "400",
                   }}>
                  {criterion.description}
                </p>

                {/* Pill de pontuação */}
                <div className="flex-shrink-0 rounded-full px-2.5 py-1 transition-all duration-150"
                     style={{
                       backgroundColor: on ? accent : "#F3F4F6",
                     }}>
                  <span className="text-xs font-bold transition-colors duration-150"
                        style={{ color: on ? "white" : "#9CA3AF" }}>
                    +{fmt(criterion.score)}
                  </span>
                </div>
              </button>
            );
          })}

          {/* Espaço para o footer */}
          <div className="h-6"/>
        </div>
      </div>

      {/* ── FOOTER FIXO ── */}
      <div
        className={`fixed bottom-0 inset-x-0 z-50 ${headerClass}`}
        style={{
          paddingBottom: "env(safe-area-inset-bottom, 16px)",
          boxShadow: footerShadow,
        }}
      >
        {/* Wave topo */}
        <div className="absolute -top-7 left-0 right-0 pointer-events-none" style={{ height: "28px" }}>
          <svg viewBox="0 0 390 28" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0 14 C65 28, 130 0, 195 14 C260 28, 325 0, 390 14 L390 28 L0 28 Z"
                  fill={accent} fillOpacity="0.45"/>
          </svg>
        </div>

        <div className="px-5 pt-4 pb-2 max-w-lg mx-auto">
          <div className="flex items-center gap-4">
            {/* Nota */}
            <div className="flex-1">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-white font-black leading-none"
                      style={{ fontSize: "clamp(36px, 11vw, 50px)" }}>
                  {fmt(score)}
                </span>
                <span className="text-white/50 text-xl font-semibold">/ {maxScore}</span>
                <span className="text-white font-black text-2xl ml-auto">{pct}%</span>
              </div>
              {label && (
                <span className="inline-block mt-1.5 text-xs font-bold px-3 py-1 rounded-full"
                      style={{ background: labelBg, color: labelColor,
                               backdropFilter: "blur(4px)" }}>
                  {label}
                </span>
              )}
            </div>

            {/* Botão Limpar */}
            <button
              onClick={() => setChecked(new Set())}
              disabled={checked.size === 0}
              className="pressable flex-shrink-0 rounded-[16px] py-4 px-6 font-black text-sm
                         text-white disabled:opacity-35 transition-all"
              style={{
                background: "rgba(255,255,255,0.20)",
                border: "2px solid rgba(255,255,255,0.38)",
                backdropFilter: "blur(8px)",
              }}
            >
              Limpar
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
