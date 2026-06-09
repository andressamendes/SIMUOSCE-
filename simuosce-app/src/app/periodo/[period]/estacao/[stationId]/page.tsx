"use client";

import { use, useState, useCallback } from "react";
import Link from "next/link";
import { baremas } from "@/data/baremas";
import { Period } from "@/types";

type Props = { params: Promise<{ period: string; stationId: string }> };

export default function AssessmentPage({ params }: Props) {
  const { period, stationId } = use(params);
  const periodNum = Number(period) as Period;
  const station = baremas[periodNum]?.find((s) => s.id === stationId);

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

  const clear = () => setChecked(new Set());

  if (!station) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh gap-3">
        <p className="text-slate-400">Estação não encontrada.</p>
        <Link href="/" className="text-teal-400">Voltar</Link>
      </div>
    );
  }

  const isTeal = periodNum === 1;
  const checkBg = isTeal ? "bg-teal-500 border-teal-500" : "bg-pink-500 border-pink-500";
  const checkIdle = "border-slate-600";
  const rowChecked = isTeal ? "bg-teal-950/50 border-teal-800/60" : "bg-pink-950/50 border-pink-800/60";
  const scoreColor = pct >= 70 ? "text-green-400" : pct >= 50 ? "text-yellow-400" : "text-red-400";
  const barColor = pct >= 70 ? "bg-green-500" : pct >= 50 ? "bg-yellow-500" : "bg-red-500";
  const clearBtnCls = isTeal
    ? "bg-teal-600 hover:bg-teal-500 active:bg-teal-700"
    : "bg-pink-600 hover:bg-pink-500 active:bg-pink-700";

  return (
    <main className="flex flex-col min-h-dvh bg-slate-900 text-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-900/98 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center gap-3">
        <Link
          href={`/periodo/${periodNum}`}
          className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-500 font-medium">
            {periodNum}º Período · Estação {station.number}
          </p>
          <p className="font-bold text-white text-sm leading-tight truncate">
            {station.name}
          </p>
        </div>
        {/* Nota no header */}
        <div className="flex-shrink-0 text-right">
          <p className={`text-2xl font-black leading-none ${scoreColor}`}>
            {score % 1 === 0 ? score.toFixed(0) : score.toFixed(2)}
          </p>
          <p className="text-slate-500 text-xs">/ {maxScore}</p>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="h-1 w-full bg-slate-800">
        <div
          className={`h-full transition-all duration-200 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Lista de critérios */}
      <div className="flex-1 overflow-y-auto pb-40">
        {station.criteria.map((criterion, idx) => {
          const on = checked.has(criterion.id);
          return (
            <button
              key={criterion.id}
              onClick={() => toggle(criterion.id)}
              className={`w-full flex items-start gap-4 px-4 py-4 text-left border-b transition-colors ${
                on ? `${rowChecked} border-transparent` : "border-slate-800/60 active:bg-slate-800"
              }`}
            >
              {/* Checkbox */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all ${
                  on ? checkBg : checkIdle
                }`}
              >
                {on && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-4 h-4">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>

              {/* Texto */}
              <div className="flex-1 min-w-0">
                <p className={`text-base leading-snug ${on ? "text-white font-medium" : "text-slate-300"}`}>
                  {criterion.description}
                </p>
                <p className={`text-xs mt-0.5 font-semibold ${on ? "text-green-400" : "text-slate-500"}`}>
                  {criterion.score % 1 === 0
                    ? `${criterion.score.toFixed(0)} ponto${criterion.score !== 1 ? "s" : ""}`
                    : `${criterion.score.toFixed(2)} pontos`}
                </p>
              </div>

              {/* Índice */}
              <span className="flex-shrink-0 text-xs text-slate-600 mt-1">
                {idx + 1}/{station.criteria.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Rodapé fixo */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/98 backdrop-blur border-t border-slate-800 safe-area-pb">
        {/* Barra de progresso */}
        <div className="h-1 w-full bg-slate-800">
          <div
            className={`h-full transition-all duration-200 ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="px-4 pt-3 pb-4 max-w-lg mx-auto flex items-center gap-3">
          {/* Score display */}
          <div className="flex-1 bg-slate-800 rounded-xl px-4 py-2.5">
            <div className="flex items-baseline gap-1.5">
              <span className={`text-3xl font-black leading-none ${scoreColor}`}>
                {score % 1 === 0 ? score.toFixed(0) : score.toFixed(2)}
              </span>
              <span className="text-slate-500 text-sm font-medium">/ {maxScore}</span>
              <span className={`ml-auto text-lg font-black ${scoreColor}`}>{pct}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1.5">
              <div
                className={`h-full rounded-full transition-all ${barColor}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Limpar */}
          <button
            onClick={clear}
            className={`flex-shrink-0 px-5 py-4 rounded-xl font-bold text-white text-sm transition-all active:scale-95 ${clearBtnCls}`}
          >
            Limpar
          </button>
        </div>
      </div>
    </main>
  );
}
