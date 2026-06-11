"use client";

import { Station, Period } from "@/types";
import { periodThemes } from "@/lib/themes";
import { fmt, formatTime } from "@/lib/format";

type Props = {
  periodNum:  Period;
  station:    Station;
  checked:    Set<string>;
  timestamps: Record<string, number>;
  timeLeft:   number;
  duration:   number;
  score:      number;
  maxScore:   number;
  pct:        number;
  onToggle:   (id: string) => void;
  onClear:    () => void;
  onConclude: () => void;
  onExit:     () => void;
};

export default function FocusMode({
  periodNum, station, checked, timestamps,
  timeLeft, duration, score, maxScore, pct,
  onToggle, onClear, onConclude, onExit,
}: Props) {
  const { accent, accentBg, checkGlow } =
    periodThemes[periodNum] ?? periodThemes[1];

  const warnThreshold   = Math.round(duration / 3);
  const dangerThreshold = Math.round(duration / 10);
  const timerState  = timeLeft >= warnThreshold ? "normal"
                    : timeLeft >= dangerThreshold ? "warn" : "danger";
  const timerColor  = timerState === "normal" ? accent
                    : timerState === "warn"   ? "#F59E0B" : "#EF4444";
  const timerPulse  = timerState === "danger" ? "animate-pulse" : "";

  const label      = pct >= 70 ? "Aprovado" : pct >= 50 ? "Regular" : pct > 0 ? "Insuficiente" : null;
  const labelBg    = pct >= 70 ? "rgba(16,185,129,0.12)"
                   : pct >= 50 ? "rgba(245,158,11,0.12)"
                   : "rgba(239,68,68,0.12)";
  const labelColor = pct >= 70 ? "#10B981" : pct >= 50 ? "#F59E0B" : "#EF4444";

  const criteriaRatio = checked.size / (station.criteria.length || 1);
  const elapsed       = duration - timeLeft;

  return (
    <main className="anim-fade-in flex flex-col min-h-dvh bg-white select-none">

      {/* ── HEADER COMPACTO ── */}
      <div className="sticky top-0 z-40 bg-white"
           style={{
             paddingTop:  "env(safe-area-inset-top, 0px)",
             boxShadow:   "0 1px 0 rgba(0,0,0,0.07)",
           }}>
        <div className="max-w-lg mx-auto px-4">

          <div className="flex items-center gap-3 py-3">
            {/* Botão sair */}
            <button
              onClick={onExit}
              className="pressable flex-shrink-0 -ml-1 w-9 h-9 rounded-full flex items-center
                         justify-center text-[#9CA3AF] hover:text-[#4B5563]
                         hover:bg-[#F3F4F6] transition-colors"
              aria-label="Sair do Modo Foco"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                   className="w-4 h-4" aria-hidden="true">
                <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3
                         M8 21H5a2 2 0 0 0-2-2v-3M21 16v3a2 2 0 0 0-2 2h-3"/>
              </svg>
            </button>

            {/* Nome da estação */}
            <div className="flex-1 min-w-0">
              <p className="overline text-[#9CA3AF]">Estação {station.number}</p>
              <p className="font-bold text-[#1F2937] text-[14px] leading-tight truncate">
                {station.name}
              </p>
            </div>

            {/* Cronômetro */}
            <div className={`flex-shrink-0 text-right ${timerPulse}`}
                 role="status" aria-live="polite" aria-atomic="true">
              <p className="font-black text-[26px] tabular-nums leading-none"
                 style={{ color: timerColor }}>
                {formatTime(timeLeft)}
              </p>
              {timeLeft === 0 ? (
                <p className="text-[10px] font-bold mt-0.5" style={{ color: "#EF4444" }}>
                  Encerrado
                </p>
              ) : (
                <p className="overline text-[#9CA3AF] mt-0.5">
                  de {duration / 60}min
                </p>
              )}
            </div>
          </div>

          {/* Barra de progresso de critérios */}
          <div className="h-[2px] bg-[#F3F4F6] overflow-hidden">
            <div className="h-full transition-all duration-300"
                 style={{ width: `${criteriaRatio * 100}%`, backgroundColor: accent }}/>
          </div>
        </div>
      </div>

      {/* ── CRITÉRIOS ── */}
      <div className="flex-1 overflow-y-auto pb-36">

        {timeLeft === 0 && (
          <div className="bg-red-50 border-b border-red-100 px-5 py-2.5">
            <p className="text-[#EF4444] text-sm font-bold text-center">
              Tempo da estação encerrado
            </p>
          </div>
        )}

        <div className="max-w-lg mx-auto">
          {station.criteria.map((criterion) => {
            const on = checked.has(criterion.id);
            const ts = timestamps[criterion.id];
            return (
              <button
                key={criterion.id}
                onClick={() => onToggle(criterion.id)}
                aria-pressed={on}
                className="w-full flex items-center gap-4 text-left py-4 px-5
                           border-b border-[#F3F4F6] transition-colors duration-150"
                style={{ backgroundColor: on ? accentBg : "transparent" }}
              >
                {/* Checkbox */}
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center
                             justify-center transition-all duration-150
                             ${on ? `${checkGlow} check-pop` : ""}`}
                  style={{
                    borderColor:     on ? accent : "#D1D5DB",
                    backgroundColor: on ? accent : "#FAFAFA",
                  }}
                >
                  {on && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"
                         className="w-3 h-3" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>

                {/* Descrição + timestamp */}
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] leading-snug transition-all duration-150"
                     style={{
                       color:      on ? "#1F2937" : "#374151",
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

                {/* Pontuação */}
                <span className="flex-shrink-0 text-[13px] font-bold tabular-nums
                                 transition-colors duration-150"
                      style={{ color: on ? accent : "#D1D5DB" }}>
                  +{fmt(criterion.score)}
                </span>
              </button>
            );
          })}

          {/* Linha de resumo de critérios */}
          <div className="px-5 py-4 flex items-center justify-between">
            <span className="text-[13px] text-[#9CA3AF] font-medium">
              {checked.size} de {station.criteria.length} critérios realizados
            </span>
            <span className="text-[13px] font-bold" style={{ color: accent }}>
              {pct}%
            </span>
          </div>
        </div>
      </div>

      {/* ── RODAPÉ ── */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-white"
           style={{
             paddingBottom: "env(safe-area-inset-bottom, 12px)",
             boxShadow: "0 -1px 0 rgba(0,0,0,0.06), 0 -6px 20px rgba(0,0,0,0.06)",
           }}>
        <div className="max-w-lg mx-auto px-5 pt-3 pb-1 flex items-center gap-4">

          {/* Nota + percentual */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span key={score}
                    className="font-black tabular-nums tracking-tight anim-score-pop"
                    style={{ fontSize: "clamp(32px,10vw,44px)", color: accent }}>
                {fmt(score)}
              </span>
              <span className="text-[#9CA3AF] text-lg font-semibold">/ {maxScore}</span>
              <span className="font-black text-xl ml-auto" style={{ color: accent }}>
                {pct}%
              </span>
            </div>

            {label ? (
              <span className="inline-block mt-1 text-xs font-bold px-3 py-1 rounded-full"
                    style={{ background: labelBg, color: labelColor }}>
                {label}
              </span>
            ) : (
              <p className="text-[#9CA3AF] text-[11px] font-medium mt-1">
                {formatTime(elapsed)} utilizados
              </p>
            )}
          </div>

          {/* Ações */}
          <div className="flex flex-col gap-1.5 flex-shrink-0">
            <button
              onClick={onConclude}
              className="pressable rounded-[14px] py-3 px-5 font-black text-sm text-white"
              style={{
                background:  accent,
                boxShadow:   `0 4px 14px ${accent}44`,
              }}
            >
              Concluir
            </button>
            <button
              onClick={onClear}
              disabled={checked.size === 0 || timeLeft === 0}
              className="pressable rounded-[12px] py-2 px-5 font-bold text-xs
                         text-[#9CA3AF] border border-[#E5E7EB] disabled:opacity-35 transition-all"
            >
              Limpar
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
