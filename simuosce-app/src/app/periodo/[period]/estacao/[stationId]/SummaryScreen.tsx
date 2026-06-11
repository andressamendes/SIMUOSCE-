"use client";

import Link from "next/link";
import { Station, Period } from "@/types";
import { periodThemes } from "@/lib/themes";
import { fmt, formatTime } from "@/lib/format";
import { getDuration } from "@/lib/timer";

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
  const duration = getDuration(station.criteria.length);

  const pendingCriteria = station.criteria.filter((c) => !checkedIds.has(c.id));
  const checkedCount    = station.criteria.length - pendingCriteria.length;

  const perfWord  = pct >= 90 ? "Excelente" : pct >= 70 ? "Bom" : "Atenção";
  const perfDesc  = pct >= 90 ? "Desempenho excelente na estação"
                  : pct >= 70 ? "Bom desempenho na estação"
                  : "Revise os critérios não realizados";
  const perfColor = pct >= 90 ? "#10B981" : pct >= 70 ? "#F59E0B" : "#EF4444";
  const perfBg    = pct >= 90 ? "rgba(16,185,129,0.09)"
                  : pct >= 70 ? "rgba(245,158,11,0.09)"
                  : "rgba(239,68,68,0.09)";

  // Tempo médio por critério (só quando há critérios marcados e sem timeout)
  const avgPerCriterion = !timedOut && checkedCount > 0
    ? Math.round(elapsed / checkedCount) : null;

  // Percentual de conclusão (critérios, não nota)
  const completionPct = station.criteria.length > 0
    ? Math.round((checkedCount / station.criteria.length) * 100) : 0;

  // Anel: raio 34 (88px viewBox)
  const RING_R = 34;
  const RING_C = 2 * Math.PI * RING_R;

  return (
    <main className="flex flex-col min-h-dvh bg-surface-dim select-none">

      {/* ── HEADER ── */}
      <div className={`relative overflow-hidden ${headerClass}`}
           style={{ paddingTop: "calc(env(safe-area-inset-top,0px) + 36px)", paddingBottom: "52px" }}>

        <div className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full"
             style={{ background: "radial-gradient(circle,rgba(255,255,255,0.13) 0%,transparent 70%)" }}/>

        <div className="relative z-10 max-w-lg mx-auto px-5">
          <div className="flex items-center justify-between mb-4">
            <Link href={`/periodo/${periodNum}`}
                  className="inline-flex items-center gap-2 text-white/70 hover:text-white
                             transition-colors -mx-2 px-2 py-2.5 -my-2.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                   className="w-4 h-4" aria-hidden="true">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              <span className="text-sm font-semibold">{periodNum}º Período</span>
            </Link>

            <div className="inline-block bg-black/20 backdrop-blur-sm rounded-lg
                            px-2.5 py-1 border border-white/20">
              <span className="overline text-white/75">Estação {station.number}</span>
            </div>
          </div>

          <p className="overline text-white/55 mb-1.5">Resumo da Avaliação</p>
          <h1 className="text-white font-black text-[19px] leading-snug"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.20)" }}>
            {station.name}
          </h1>
        </div>

        <div className="absolute bottom-0 left-0 right-0" style={{ height: "44px" }}>
          <svg viewBox="0 0 390 44" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0 22 C65 0, 130 44, 195 22 C260 0, 325 44, 390 22 L390 44 L0 44 Z"
                  fill="#F4FEFE"/>
          </svg>
        </div>
      </div>

      {/* ── CONTEÚDO ── */}
      <div className="flex-1 overflow-y-auto pb-44">
        <div className="max-w-lg mx-auto px-4 pt-4 flex flex-col gap-3">

          {/* ── CARD HERO: NOTA PROTAGONISTA ── */}
          <div className="anim-fade-up card-surface rounded-[24px] px-5 pt-5 pb-4">
            <p className="overline text-[#9CA3AF] mb-4">Resultado</p>

            {/* Nota + anel percentual */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="font-black tracking-tight tabular-nums leading-none"
                      style={{ fontSize: "clamp(56px, 18vw, 72px)", color: accent }}>
                  {fmt(score)}
                </span>
                <p className="text-[#9CA3AF] text-[13px] font-semibold mt-1.5">
                  de {maxScore} pontos
                </p>
              </div>

              {/* Anel maior (88px) */}
              <div className="relative w-[88px] h-[88px] flex-shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 88 88" className="absolute inset-0 w-full h-full -rotate-90"
                     aria-hidden="true">
                  <circle cx="44" cy="44" r={RING_R} fill="none" stroke={accentBg} strokeWidth="7"/>
                  <circle cx="44" cy="44" r={RING_R} fill="none"
                          className="anim-ring"
                          stroke={accent} strokeWidth="7" strokeLinecap="round"
                          strokeDasharray={RING_C}
                          strokeDashoffset={(1 - pct / 100) * RING_C}
                          style={{ ["--ring-circumference" as string]: `${RING_C}` }}/>
                </svg>
                <span className="font-black text-[20px] tabular-nums" style={{ color: accent }}>
                  {pct}%
                </span>
              </div>
            </div>

            {/* Badge de desempenho — integrado ao card hero */}
            <div className="flex items-center justify-between rounded-[14px] px-4 py-2.5"
                 style={{ background: perfBg }}>
              <p className="text-[13px] font-medium leading-snug" style={{ color: perfColor }}>
                {perfDesc}
              </p>
              <span className="flex-shrink-0 inline-flex items-center gap-1.5
                               font-bold text-[12px] ml-3"
                    style={{ color: perfColor }}>
                <span className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: perfColor }} aria-hidden="true"/>
                {perfWord}
              </span>
            </div>
          </div>

          {/* ── GRID: TEMPO + CRITÉRIOS ── */}
          <div className="anim-fade-up grid grid-cols-2 gap-3" style={{ animationDelay: "80ms" }}>

            {/* Tempo */}
            <div className="card-surface rounded-[20px] px-4 py-4">
              <p className="overline text-[#9CA3AF] mb-3">Tempo</p>
              {timedOut ? (
                <p className="font-bold text-[13px] leading-snug text-[#EF4444] mt-1">
                  Limite atingido
                </p>
              ) : (
                <>
                  <p className="font-black text-[24px] leading-none text-[#1F2937] tabular-nums">
                    {formatTime(elapsed)}
                  </p>
                  <p className="text-[#9CA3AF] text-[11px] font-medium mt-1">
                    de {formatTime(duration)} previstos
                  </p>
                  {avgPerCriterion !== null && avgPerCriterion > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#F3F4F6]">
                      <p className="overline text-[#9CA3AF] mb-0.5">Média / critério</p>
                      <p className="font-bold text-[14px] text-[#4B5563] tabular-nums">
                        {formatTime(avgPerCriterion)}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Critérios */}
            <div className="card-surface rounded-[20px] px-4 py-4">
              <p className="overline text-[#9CA3AF] mb-3">Critérios</p>
              <p className="font-black text-[24px] leading-none text-[#1F2937] tabular-nums">
                {checkedCount}
              </p>
              <p className="text-[#9CA3AF] text-[11px] font-medium mt-1">
                de {station.criteria.length} realizados
              </p>
              {/* Mini barra de conclusão */}
              <div className="mt-3 h-[4px] bg-[#F3F4F6] rounded-full overflow-hidden">
                <div className="h-full rounded-full"
                     style={{ width: `${completionPct}%`, backgroundColor: accent }}/>
              </div>
            </div>
          </div>

          {/* ── CRITÉRIOS NÃO REALIZADOS ── */}
          {pendingCriteria.length > 0 && (
            <div className="anim-fade-up card-surface rounded-[20px] px-5 py-4"
                 style={{ animationDelay: "160ms" }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"
                       className="w-3.5 h-3.5" aria-hidden="true">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                    <rect x="8" y="2" width="8" height="4" rx="1"/>
                    <path d="M9 12h6M9 16h6"/>
                  </svg>
                  <p className="overline text-[#9CA3AF]">Não Realizados</p>
                </div>
                <span className="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                      style={{ background: "rgba(239,68,68,0.10)", color: "#EF4444" }}>
                  {pendingCriteria.length}
                </span>
              </div>
              <ul className="flex flex-col gap-3 list-none">
                {pendingCriteria.map((c) => (
                  <li key={c.id} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-2 h-2 rounded-full mt-[6px]"
                         style={{ backgroundColor: "#D1D5DB" }}/>
                    <span className="text-[14px] text-[#4B5563] leading-snug">{c.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="h-2"/>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className="anim-fade-in fixed bottom-0 inset-x-0 z-50 bg-white"
           style={{
             paddingBottom: "env(safe-area-inset-bottom, 16px)",
             boxShadow: "0 -1px 0 rgba(0,0,0,0.06), 0 -6px 20px rgba(0,0,0,0.07)",
             animationDelay: "200ms",
           }}>
        <div className="px-5 pt-4 pb-2 max-w-lg mx-auto flex flex-col gap-2.5">
          <button
            onClick={onNewAssessment}
            className="pressable w-full rounded-[16px] py-4 font-black text-[15px] text-white"
            style={{
              background: `linear-gradient(135deg, ${accent} 0%, ${accent}cc 100%)`,
              boxShadow:  `0 4px 14px ${accent}44`,
            }}
          >
            Nova Avaliação
          </button>
          <Link
            href={`/periodo/${periodNum}`}
            className="pressable block w-full rounded-[16px] py-4 font-bold text-[15px]
                       text-center transition-colors"
            style={{ background: accentBg, color: accent }}
          >
            Voltar às Estações
          </Link>
        </div>
      </div>
    </main>
  );
}
