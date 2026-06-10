"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { Station, Period } from "@/types";
import { periodThemes } from "@/lib/themes";
import { fmt, formatTime } from "@/lib/format";
import { getDuration } from "@/lib/timer";
import SummaryScreen from "./SummaryScreen";

type Props = { periodNum: Period; station: Station | null };

export default function AssessmentClient({ periodNum, station }: Props) {
  const DURATION = station ? getDuration(station.criteria.length) : 300;

  const [checked, setChecked]       = useState<Set<string>>(new Set());
  const [timestamps, setTimestamps] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft]     = useState(DURATION);
  const [resetCount, setResetCount] = useState(0);
  const [showSummary, setShowSummary]     = useState(false);
  const [concludedData, setConcludedData] = useState({ elapsed: 0, timedOut: false });

  // Ref lets toggle() read the latest timeLeft without re-creating the callback
  const timeLeftRef = useRef(DURATION);
  timeLeftRef.current = timeLeft;

  // Wall-clock countdown — accurate even when tab is backgrounded
  const startRef   = useRef(Date.now());
  const timerIdRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    clearTimeout(timerIdRef.current);
    startRef.current = Date.now();
    setTimeLeft(DURATION);
    const tick = () => {
      const elapsed    = Date.now() - startRef.current;
      const remaining  = Math.max(0, DURATION - Math.floor(elapsed / 1000));
      setTimeLeft(remaining);
      if (remaining > 0) timerIdRef.current = setTimeout(tick, 250);
    };
    timerIdRef.current = setTimeout(tick, 250);
    return () => clearTimeout(timerIdRef.current);
  }, [resetCount]);

  const score    = station
    ? station.criteria.filter((c) => checked.has(c.id)).reduce((s, c) => s + c.score, 0)
    : 0;
  const maxScore = station?.maxScore ?? 10;
  const pct      = Math.round((score / maxScore) * 100);
  const elapsed  = DURATION - timeLeft;

  const toggle = useCallback((id: string) => {
    const ts = DURATION - timeLeftRef.current;
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    setTimestamps((prev) => {
      if (id in prev) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: ts };
    });
  }, []);

  const clearAll = useCallback(() => {
    setChecked(new Set());
    setTimestamps({});
    setResetCount((c) => c + 1);
  }, []);

  const concludeStation = useCallback(() => {
    const duration = station ? getDuration(station.criteria.length) : 300;
    setConcludedData({
      elapsed:  duration - timeLeftRef.current,
      timedOut: timeLeftRef.current === 0,
    });
    setShowSummary(true);
  }, [station]);

  const handleNewAssessment = useCallback(() => {
    setChecked(new Set());
    setTimestamps({});
    setResetCount((c) => c + 1);
    setShowSummary(false);
  }, []);

  if (!station) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh gap-3 bg-white">
        <p className="text-[#9CA3AF]">Estação não encontrada.</p>
        <Link href="/" className="font-bold text-[#2EC9C4]">Voltar</Link>
      </div>
    );
  }

  if (showSummary) {
    return (
      <SummaryScreen
        periodNum={periodNum}
        station={station}
        score={score}
        maxScore={maxScore}
        pct={pct}
        checkedIds={checked}
        elapsed={concludedData.elapsed}
        timedOut={concludedData.timedOut}
        onNewAssessment={handleNewAssessment}
      />
    );
  }

  const { headerClass, accent, accentBg, checkGlow, footerShadow } =
    periodThemes[periodNum] ?? periodThemes[1];

  const durationMin      = DURATION / 60;
  const warnThreshold    = Math.round(DURATION / 3);  // ~33% remaining
  const dangerThreshold  = Math.round(DURATION / 10); // ~10% remaining

  // Timer visual state
  const timerState  = timeLeft >= warnThreshold ? "normal" : timeLeft >= dangerThreshold ? "warn" : "danger";
  const timerColor  = timerState === "normal" ? "rgba(255,255,255,0.92)"
                    : timerState === "warn"   ? "#FCD34D"
                    : "#F87171";
  const timerPulse  = timerState === "danger" ? "animate-pulse" : "";

  // Score feedback
  const label      = pct >= 70 ? "Aprovado" : pct >= 50 ? "Regular" : pct > 0 ? "Insuficiente" : null;
  const labelBg    = pct >= 70 ? "rgba(16,185,129,0.22)" : pct >= 50 ? "rgba(245,158,11,0.22)" : "rgba(239,68,68,0.22)";
  const labelColor = pct >= 70 ? "#10B981" : pct >= 50 ? "#F59E0B" : "#EF4444";

  return (
    <main className="flex flex-col min-h-dvh bg-white select-none">

      {/* ── HEADER ── */}
      {/* Header sits outside the scroll container — always visible */}
      <div className={`relative overflow-hidden ${headerClass}`}
           style={{
             paddingTop: "calc(env(safe-area-inset-top,0px) + 36px)",
             paddingBottom: "52px",
           }}>

        <div className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full"
             style={{ background: "radial-gradient(circle,rgba(255,255,255,0.13) 0%,transparent 70%)" }}/>

        <div className="relative z-10 max-w-lg mx-auto px-5">

          {/* Back + Timer */}
          <div className="flex items-center justify-between mb-4">
            <Link href={`/periodo/${periodNum}`}
                  className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors
                             -mx-2 px-2 py-2.5 -my-2.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"
                   aria-hidden="true">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              <span className="text-sm font-semibold">{periodNum}º Período</span>
            </Link>

            {/* Timer — card glass com barra de progresso */}
            <div className="flex flex-col items-end rounded-2xl bg-black/20 backdrop-blur-md
                            border border-white/15 px-3.5 py-2"
                 role="status" aria-live="polite" aria-atomic="true">
              <span className="text-white/50 text-[9px] font-bold tracking-[0.14em] uppercase leading-none mb-1">
                ⏱ Tempo da Estação
              </span>
              <span className={`font-black text-2xl tabular-nums leading-none ${timerPulse}`}
                    style={{ color: timerColor }}>
                {formatTime(timeLeft)}
              </span>
              <div className="w-full h-[3px] rounded-full bg-white/15 overflow-hidden mt-1.5"
                   aria-hidden="true">
                <div className="h-full rounded-full"
                     style={{
                       width: `${(timeLeft / DURATION) * 100}%`,
                       backgroundColor: timerColor,
                       transition: "width 0.3s linear, background-color 0.4s ease",
                     }}/>
              </div>
              {timeLeft === 0 ? (
                <span className="text-[9px] font-semibold leading-none mt-1.5"
                      style={{ color: "#F87171" }}>
                  Encerrado
                </span>
              ) : (
                <span className="text-white/35 text-[9px] font-medium leading-none mt-1.5">
                  {station.criteria.length} critérios · {durationMin}min
                </span>
              )}
            </div>
          </div>

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

            {/* Score card */}
            <div className="flex-shrink-0 bg-white/22 backdrop-blur-md rounded-[18px]
                            px-4 py-3 text-center min-w-[72px] border border-white/30">
              <p key={score} className="text-white font-black text-3xl leading-none anim-score-pop"
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
      <div className="flex-1 overflow-y-auto pb-44">
        <div className="anim-fade-in max-w-lg mx-auto px-4 pt-2">

          {/* Aviso de tempo encerrado */}
          {timeLeft === 0 && (
            <div className="anim-fade-up rounded-xl bg-red-50 border border-red-100 px-4 py-2.5 mb-2 mt-1">
              <p className="text-red-500 text-sm font-bold text-center">
                Tempo da estação encerrado
              </p>
            </div>
          )}

          {station.criteria.map((criterion) => {
            const on = checked.has(criterion.id);
            const ts = timestamps[criterion.id];
            return (
              <button
                key={criterion.id}
                onClick={() => toggle(criterion.id)}
                aria-pressed={on}
                className="w-full flex items-center gap-3.5 text-left py-3.5 px-3.5 rounded-xl mb-1
                           transition-colors duration-150"
                style={{ backgroundColor: on ? accentBg : "transparent" }}
              >
                {/* Checkbox */}
                <div
                  className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center
                             justify-center transition-all duration-150 ${on ? `${checkGlow} check-pop` : ""}`}
                  style={{
                    borderColor:     on ? accent : "#D1D5DB",
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

                {/* Texto + timestamp */}
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] leading-snug transition-all duration-150"
                     style={{
                       color:      on ? "#1F2937" : "#4B5563",
                       fontWeight: on ? "600" : "400",
                     }}>
                    {criterion.description}
                  </p>
                  {on && ts !== undefined && (
                    <p className="text-[11px] font-medium text-[#9CA3AF] mt-0.5">
                      Executado em: {formatTime(ts)}
                    </p>
                  )}
                </div>

                {/* Pill de pontuação */}
                <div className="flex-shrink-0 rounded-full px-2.5 py-1 transition-all duration-150"
                     style={{ backgroundColor: on ? accent : "#F3F4F6" }}>
                  <span className="text-xs font-bold transition-colors duration-150"
                        style={{ color: on ? "white" : "#9CA3AF" }}>
                    +{fmt(criterion.score)}
                  </span>
                </div>
              </button>
            );
          })}

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
            {/* Nota + tempo utilizado */}
            <div className="flex-1">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span key={score} className="text-white font-black leading-none anim-score-pop"
                      style={{ fontSize: "clamp(36px, 11vw, 50px)" }}>
                  {fmt(score)}
                </span>
                <span className="text-white/50 text-xl font-semibold">/ {maxScore}</span>
                <span className="text-white font-black text-2xl ml-auto">{pct}%</span>
              </div>
              {label && (
                <span className="inline-block mt-1.5 text-xs font-bold px-3 py-1 rounded-full"
                      style={{ background: labelBg, color: labelColor, backdropFilter: "blur(4px)" }}>
                  {label}
                </span>
              )}
              <p className="text-white/55 text-[11px] font-medium mt-1">
                Tempo utilizado: {formatTime(elapsed)}
              </p>
            </div>

            {/* Ações */}
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              <button
                onClick={concludeStation}
                className="pressable rounded-[14px] py-3 px-5 font-black text-sm"
                style={{
                  background: "rgba(255,255,255,0.95)",
                  color: accent,
                  boxShadow: timeLeft === 0
                    ? "0 0 0 2px rgba(255,255,255,0.7), 0 0 0 4px rgba(255,255,255,0.3)"
                    : undefined,
                }}
              >
                Concluir
              </button>
              <button
                onClick={clearAll}
                disabled={checked.size === 0 || timeLeft === 0}
                className="pressable rounded-[12px] py-2 px-5 font-bold text-xs
                           text-white/65 disabled:opacity-35 transition-all"
                style={{
                  background:     "rgba(255,255,255,0.15)",
                  border:         "1px solid rgba(255,255,255,0.25)",
                  backdropFilter: "blur(8px)",
                }}
              >
                Limpar
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
