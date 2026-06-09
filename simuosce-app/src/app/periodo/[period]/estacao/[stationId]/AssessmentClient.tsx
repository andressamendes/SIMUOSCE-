"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Station, Period } from "@/types";

type Props = { periodNum: Period; station: Station | null };

const fmt = (n: number) => (n % 1 === 0 ? `${n}` : n.toFixed(2).replace(".", ","));

export default function AssessmentClient({ periodNum, station }: Props) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const score = station
    ? station.criteria.filter((c) => checked.has(c.id)).reduce((s, c) => s + c.score, 0)
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
        <p className="text-[#6B7280]">Estação não encontrada.</p>
        <Link href="/" className="font-semibold" style={{ color: "#3DC9C9" }}>Voltar</Link>
      </div>
    );
  }

  const isTeal = periodNum === 1;

  const headerGradient = isTeal
    ? "linear-gradient(135deg, #3DC9C9 0%, #2AABAB 100%)"
    : "linear-gradient(135deg, #FF2E7A 0%, #FF6B6B 50%, #FFB38A 100%)";

  const footerGradient = isTeal
    ? "linear-gradient(135deg, #3DC9C9 0%, #2AABAB 100%)"
    : "linear-gradient(135deg, #FF2E7A 0%, #FF6B6B 50%, #FFB38A 100%)";

  const checkColor = isTeal ? "#3DC9C9" : "#FF2E7A";
  const checkBg = isTeal ? "rgba(61,201,201,0.12)" : "rgba(255,46,122,0.1)";

  const scoreLabel =
    pct >= 70 ? "Aprovado" : pct >= 50 ? "Regular" : pct > 0 ? "Insuficiente" : "";

  const scoreLabelColor =
    pct >= 70 ? "#10B981" : pct >= 50 ? "#F59E0B" : "#EF4444";

  return (
    <main className="flex flex-col min-h-dvh bg-[#F8FEFE] no-select">
      {/* ── Header ── */}
      <div
        className="relative overflow-hidden px-4 pt-10 pb-7"
        style={{ background: headerGradient }}
      >
        {/* Decorative circles */}
        <div className="absolute top-[-30px] right-[-30px] w-32 h-32 rounded-full bg-white/8 pointer-events-none" />

        <div className="relative z-10 max-w-lg mx-auto">
          <Link
            href={`/periodo/${periodNum}`}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span className="text-sm font-medium">{periodNum}º Período</span>
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white/60 text-xs font-semibold uppercase tracking-wider">
                  Estação {station.number}
                </span>
              </div>
              <h1 className="text-xl font-black text-white leading-snug">
                {station.name}
              </h1>
            </div>

            {/* Live score in header */}
            <div className="flex-shrink-0 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2.5 text-center min-w-[72px] border border-white/25">
              <p className="text-white font-black text-2xl leading-none">{fmt(score)}</p>
              <p className="text-white/60 text-xs mt-0.5">/ {maxScore}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-white transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-white/60 text-xs">
              {checked.size}/{station.criteria.length} marcados
            </span>
            <span className="text-white/80 text-xs font-semibold">{pct}%</span>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-6 pointer-events-none">
          <svg viewBox="0 0 390 24" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0 12 C98 0, 292 24, 390 12 L390 24 L0 24 Z" fill="#F8FEFE" />
          </svg>
        </div>
      </div>

      {/* ── Criteria list ── */}
      <div className="flex-1 overflow-y-auto pb-36 max-w-lg mx-auto w-full px-4 pt-3">
        {station.criteria.map((criterion, idx) => {
          const on = checked.has(criterion.id);
          return (
            <button
              key={criterion.id}
              onClick={() => toggle(criterion.id)}
              className="criterion-row w-full flex items-center gap-3.5 py-3.5 text-left border-b border-gray-100 last:border-0"
              style={{
                backgroundColor: on ? checkBg : "transparent",
                borderRadius: on ? "12px" : "0",
                paddingLeft: "12px",
                paddingRight: "12px",
                marginBottom: on ? "4px" : "0",
                borderBottom: on ? "none" : undefined,
              }}
            >
              {/* Checkbox */}
              <div
                className="flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-150"
                style={{
                  borderColor: on ? checkColor : "#D1D5DB",
                  backgroundColor: on ? checkColor : "transparent",
                }}
              >
                {on && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" className="w-3.5 h-3.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-[15px] leading-snug transition-colors duration-150"
                  style={{
                    color: on ? "#1F2937" : "#374151",
                    fontWeight: on ? "600" : "400",
                  }}
                >
                  {criterion.description}
                </p>
              </div>

              {/* Score pill */}
              <div
                className="flex-shrink-0 rounded-full px-2.5 py-1 transition-all duration-150"
                style={{
                  backgroundColor: on ? checkColor : "#F3F4F6",
                }}
              >
                <span
                  className="text-xs font-bold"
                  style={{ color: on ? "white" : "#9CA3AF" }}
                >
                  +{fmt(criterion.score)}
                </span>
              </div>
            </button>
          );
        })}

        {/* Padding for footer */}
        <div className="h-4" />
      </div>

      {/* ── Fixed Footer ── */}
      <div className="fixed bottom-0 inset-x-0" style={{ background: footerGradient }}>
        {/* Wave top of footer */}
        <div className="absolute top-0 left-0 right-0 h-5 -translate-y-full pointer-events-none">
          <svg viewBox="0 0 390 20" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0 10 C98 20, 292 0, 390 10 L390 20 L0 20 Z"
              fill={isTeal ? "#3DC9C9" : "#FF2E7A"}
              fillOpacity="0.3"
            />
          </svg>
        </div>

        <div className="px-5 pt-4 pb-6 max-w-lg mx-auto">
          <div className="flex items-center gap-4">
            {/* Score display */}
            <div className="flex-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-white font-black" style={{ fontSize: "clamp(36px, 10vw, 48px)", lineHeight: 1 }}>
                  {fmt(score)}
                </span>
                <span className="text-white/60 text-lg font-medium">/ {maxScore}</span>
                <span className="text-white font-black text-2xl ml-2">{pct}%</span>
              </div>
              {scoreLabel && (
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 text-white mt-1 inline-block"
                >
                  {scoreLabel}
                </span>
              )}
            </div>

            {/* Clear button */}
            <button
              onClick={() => setChecked(new Set())}
              disabled={checked.size === 0}
              className="flex-shrink-0 rounded-2xl py-3.5 px-6 font-black text-sm transition-all active:scale-95 disabled:opacity-40"
              style={{
                backgroundColor: "rgba(255,255,255,0.25)",
                color: "white",
                border: "2px solid rgba(255,255,255,0.4)",
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
