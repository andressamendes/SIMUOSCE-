"use client";

import Link from "next/link";
import { Station, Period } from "@/types";
import { periodThemes } from "@/lib/themes";
import { fmt, formatTime } from "@/lib/format";

type Props = {
  periodNum: Period;
  station: Station;
  score: number;
  maxScore: number;
  pct: number;
  checkedIds: Set<string>;
  elapsed: number;
  timedOut: boolean;
  onNewAssessment: () => void;
};

export default function SummaryScreen({
  periodNum, station, score, maxScore, pct,
  checkedIds, elapsed, timedOut, onNewAssessment,
}: Props) {
  const { headerClass, accent, accentBg } = periodThemes[periodNum] ?? periodThemes[1];

  const pendingCriteria = station.criteria.filter((c) => !checkedIds.has(c.id));
  const checkedCount    = station.criteria.length - pendingCriteria.length;

  const perfLabel = pct >= 90 ? "Excelente desempenho"
                  : pct >= 70 ? "Bom desempenho"
                  : "Atenção aos critérios não realizados";
  const perfDot   = pct >= 90 ? "🟢" : pct >= 70 ? "🟡" : "🔴";
  const perfColor = pct >= 90 ? "#10B981" : pct >= 70 ? "#F59E0B" : "#EF4444";
  const perfBg    = pct >= 90 ? "rgba(16,185,129,0.10)"
                  : pct >= 70 ? "rgba(245,158,11,0.10)"
                  : "rgba(239,68,68,0.10)";

  return (
    <main className="flex flex-col min-h-dvh bg-[#F4FEFE] select-none">

      {/* ── HEADER ── */}
      <div className={`relative overflow-hidden ${headerClass}`}
           style={{ paddingTop: "calc(env(safe-area-inset-top,0px) + 36px)", paddingBottom: "52px" }}>

        <div className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full"
             style={{ background: "radial-gradient(circle,rgba(255,255,255,0.13) 0%,transparent 70%)" }}/>

        <div className="relative z-10 max-w-lg mx-auto px-5">
          <div className="flex items-center justify-between mb-4">
            <Link href={`/periodo/${periodNum}`}
                  className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors -mx-2 px-2 py-2.5 -my-2.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"
                   aria-hidden="true">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              <span className="text-sm font-semibold">{periodNum}º Período</span>
            </Link>

            <div className="inline-block bg-black/20 backdrop-blur-sm rounded-lg px-2.5 py-1 border border-white/20">
              <span className="text-white/75 text-[10px] font-bold tracking-[0.16em] uppercase">
                Resumo · Est. {station.number}
              </span>
            </div>
          </div>

          <h1 className="text-white font-black text-[19px] leading-snug"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.20)" }}>
            {station.name}
          </h1>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0" style={{ height: "44px" }}>
          <svg viewBox="0 0 390 44" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0 22 C65 0, 130 44, 195 22 C260 0, 325 44, 390 22 L390 44 L0 44 Z" fill="#F4FEFE"/>
          </svg>
        </div>
      </div>

      {/* ── CONTEÚDO ── */}
      <div className="flex-1 overflow-y-auto pb-44">
        <div className="max-w-lg mx-auto px-4 pt-4 flex flex-col gap-3">

          {/* Resultado */}
          <div className="bg-white rounded-[20px] px-5 py-5"
               style={{ boxShadow: "0 2px 14px rgba(0,0,0,0.07), 0 0 0 1.5px rgba(0,0,0,0.04)" }}>
            <p className="text-[#9CA3AF] text-[10px] font-bold tracking-[0.14em] uppercase mb-3">
              Resultado Geral
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-black text-[44px] leading-none" style={{ color: accent }}>
                  {fmt(score)}
                </span>
                <span className="text-[#9CA3AF] text-xl font-semibold">/ {maxScore}</span>
              </div>
              <div className="rounded-full flex items-center justify-center w-16 h-16"
                   style={{ background: accentBg, border: `2px solid ${accent}44` }}>
                <span className="font-black text-xl" style={{ color: accent }}>{pct}%</span>
              </div>
            </div>
          </div>

          {/* Desempenho */}
          <div className="rounded-[16px] px-4 py-3.5 flex items-center gap-3"
               style={{ background: perfBg, border: `1.5px solid ${perfColor}44` }}>
            <span className="text-xl leading-none" aria-hidden="true">{perfDot}</span>
            <span className="font-bold text-[15px]" style={{ color: perfColor }}>{perfLabel}</span>
          </div>

          {/* Critérios + Tempo */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-[16px] px-4 py-4"
                 style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.06), 0 0 0 1.5px rgba(0,0,0,0.04)" }}>
              <p className="text-[#9CA3AF] text-[10px] font-bold tracking-[0.12em] uppercase mb-1.5">
                Critérios
              </p>
              <p className="font-black text-[24px] leading-none text-[#1F2937]">{checkedCount}</p>
              <p className="text-[#9CA3AF] text-[11px] font-medium mt-1">
                de {station.criteria.length} realizados
              </p>
            </div>

            <div className="bg-white rounded-[16px] px-4 py-4"
                 style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.06), 0 0 0 1.5px rgba(0,0,0,0.04)" }}>
              <p className="text-[#9CA3AF] text-[10px] font-bold tracking-[0.12em] uppercase mb-1.5">
                Tempo
              </p>
              {timedOut ? (
                <p className="font-bold text-[13px] leading-snug text-[#EF4444] mt-1">
                  Tempo Limite Atingido
                </p>
              ) : (
                <>
                  <p className="font-black text-[24px] leading-none text-[#1F2937] tabular-nums">
                    {formatTime(elapsed)}
                  </p>
                  <p className="text-[#9CA3AF] text-[11px] font-medium mt-1">utilizados</p>
                </>
              )}
            </div>
          </div>

          {/* Critérios pendentes */}
          {pendingCriteria.length > 0 && (
            <div className="bg-white rounded-[20px] px-5 py-4"
                 style={{ boxShadow: "0 2px 14px rgba(0,0,0,0.07), 0 0 0 1.5px rgba(0,0,0,0.04)" }}>
              <p className="text-[#9CA3AF] text-[10px] font-bold tracking-[0.14em] uppercase mb-3">
                Critérios Pendentes · {pendingCriteria.length}
              </p>
              <div className="flex flex-col gap-2.5">
                {pendingCriteria.map((c) => (
                  <div key={c.id} className="flex items-start gap-2.5">
                    <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-[7px]"
                         style={{ backgroundColor: "#EF4444" }}/>
                    <p className="text-[14px] text-[#4B5563] leading-snug">{c.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="h-2"/>
        </div>
      </div>

      {/* ── FOOTER AÇÕES ── */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-white"
           style={{
             paddingBottom: "env(safe-area-inset-bottom, 16px)",
             boxShadow: "0 -1px 0 rgba(0,0,0,0.06), 0 -6px 20px rgba(0,0,0,0.07)",
           }}>
        <div className="px-5 pt-4 pb-2 max-w-lg mx-auto flex flex-col gap-2.5">
          <button
            onClick={onNewAssessment}
            className="pressable w-full rounded-[16px] py-4 font-black text-[15px] text-white"
            style={{
              background: `linear-gradient(135deg, ${accent} 0%, ${accent}cc 100%)`,
              boxShadow: `0 4px 14px ${accent}44`,
            }}
          >
            Nova Avaliação
          </button>
          <Link
            href={`/periodo/${periodNum}`}
            className="pressable block w-full rounded-[16px] py-4 font-bold text-[15px] text-center transition-colors"
            style={{ background: accentBg, color: accent }}
          >
            Voltar às Estações
          </Link>
        </div>
      </div>
    </main>
  );
}
