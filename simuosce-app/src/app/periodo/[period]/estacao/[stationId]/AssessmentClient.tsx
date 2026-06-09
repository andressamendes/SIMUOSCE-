"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Station, Period } from "@/types";

type Props = { periodNum: Period; station: Station | null };

const fmt = (n: number) =>
  n % 1 === 0 ? `${n}` : n.toFixed(2).replace(".", ",");

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
        <p className="text-[#8A9BB0]">Estação não encontrada.</p>
        <Link href="/" className="font-bold text-[#2EC9C4]">Voltar</Link>
      </div>
    );
  }

  const isTeal = periodNum === 1;
  const headerClass = isTeal ? "bg-simu" : "bg-osce";
  const checkColor = isTeal ? "#2EC9C4" : "#F0186A";
  const checkBg    = isTeal ? "rgba(46,201,196,0.10)" : "rgba(240,24,106,0.08)";
  const pillBg     = isTeal ? "#2EC9C4" : "#F0186A";
  const shadowHdr  = isTeal
    ? "0 4px 24px rgba(46,201,196,0.30)"
    : "0 4px 24px rgba(240,24,106,0.30)";

  /* Score feedback label */
  const label =
    pct >= 70 ? "Aprovado" : pct >= 50 ? "Regular" : pct > 0 ? "Insuficiente" : null;
  const labelColor =
    pct >= 70 ? "#10B981" : pct >= 50 ? "#F59E0B" : "#EF4444";

  return (
    <main className="flex flex-col min-h-dvh bg-[#F5FEFE] select-none">

      {/* ── HEADER ── */}
      <div className={`relative overflow-hidden px-5 ${headerClass}`}
           style={{
             paddingTop: "calc(env(safe-area-inset-top, 0px) + 40px)",
             paddingBottom: "52px",
             boxShadow: shadowHdr,
           }}>

        {/* Blob */}
        <div className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full"
             style={{ background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)" }} />

        <div className="relative z-10 max-w-lg mx-auto">
          {/* Back */}
          <Link href={`/periodo/${periodNum}`}
                className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-4 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            <span className="text-sm font-semibold">{periodNum}º Período</span>
          </Link>

          {/* Title row */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-lg
                              px-2.5 py-1 mb-2 border border-white/25">
                <span className="text-white/80 text-[10px] font-bold tracking-widest uppercase">
                  Estação {station.number}
                </span>
              </div>
              <h1 className="text-white font-black text-xl leading-snug pr-2"
                  style={{ textShadow: "0 1px 6px rgba(0,0,0,0.2)" }}>
                {station.name}
              </h1>
            </div>

            {/* Score card glassmorphism */}
            <div className="flex-shrink-0 bg-white/20 backdrop-blur-md rounded-2xl
                            px-4 py-3 text-center min-w-[72px] border border-white/30">
              <p className="text-white font-black text-3xl leading-none"
                 style={{ textShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                {fmt(score)}
              </p>
              <p className="text-white/55 text-xs mt-0.5 font-medium">/ {maxScore}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-300"
                 style={{ width: `${pct}%` }} />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-white/55 text-xs">
              {checked.size} / {station.criteria.length} critérios
            </span>
            <span className="text-white/80 text-xs font-bold">{pct}%</span>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: "44px" }}>
          <svg viewBox="0 0 390 44" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0 22 C65 0, 130 44, 195 22 C260 0, 325 44, 390 22 L390 44 L0 44 Z"
                  fill="#F5FEFE"/>
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
                className="w-full flex items-center gap-3.5 text-left py-3 px-3.5 rounded-xl mb-1
                           transition-all duration-150"
                style={{
                  backgroundColor: on ? checkBg : "transparent",
                }}
              >
                {/* Checkbox */}
                <div
                  className="flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center
                             justify-center transition-all duration-150"
                  style={{
                    borderColor: on ? checkColor : "#CBD5E0",
                    backgroundColor: on ? checkColor : "white",
                    boxShadow: on ? `0 2px 8px ${checkColor}55` : "none",
                  }}
                >
                  {on && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"
                         className="w-3.5 h-3.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>

                {/* Descrição */}
                <p className="flex-1 text-[15px] leading-snug transition-all duration-150"
                   style={{
                     color: on ? "#1A1A2E" : "#4A5568",
                     fontWeight: on ? "600" : "400",
                   }}>
                  {criterion.description}
                </p>

                {/* Score pill */}
                <div
                  className="flex-shrink-0 rounded-full px-2.5 py-1 transition-all duration-150"
                  style={{
                    backgroundColor: on ? pillBg : "#EEF2F7",
                  }}
                >
                  <span className="text-xs font-bold"
                        style={{ color: on ? "white" : "#8A9BB0" }}>
                    +{fmt(criterion.score)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── FOOTER FIXO ── */}
      <div className={`fixed bottom-0 inset-x-0 ${headerClass}`}
           style={{
             paddingBottom: "env(safe-area-inset-bottom, 16px)",
             boxShadow: `0 -4px 24px ${isTeal ? "rgba(46,201,196,0.30)" : "rgba(240,24,106,0.30)"}`,
           }}>

        {/* Wave topo do footer */}
        <div className="absolute -top-7 left-0 right-0 pointer-events-none" style={{ height: "28px" }}>
          <svg viewBox="0 0 390 28" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0 14 C65 28, 130 0, 195 14 C260 28, 325 0, 390 14 L390 28 L0 28 Z"
                  fill={isTeal ? "#2EC9C4" : "#F0186A"} fillOpacity="0.4"/>
          </svg>
        </div>

        <div className="px-5 pt-4 pb-2 max-w-lg mx-auto">
          <div className="flex items-center gap-4">

            {/* Nota */}
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-white font-black leading-none"
                      style={{ fontSize: "clamp(38px, 11vw, 52px)" }}>
                  {fmt(score)}
                </span>
                <span className="text-white/55 text-xl font-semibold">/ {maxScore}</span>
                <span className="text-white font-black text-2xl ml-1">{pct}%</span>
              </div>
              {label && (
                <span className="inline-block mt-1 text-xs font-bold px-2.5 py-0.5
                                 rounded-full bg-white/25 text-white">
                  {label}
                </span>
              )}
            </div>

            {/* Botão Limpar */}
            <button
              onClick={() => setChecked(new Set())}
              disabled={checked.size === 0}
              className="btn-press flex-shrink-0 rounded-2xl py-3.5 px-6 font-black text-sm
                         text-white transition-all disabled:opacity-35"
              style={{
                background: "rgba(255,255,255,0.22)",
                border: "2px solid rgba(255,255,255,0.40)",
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
