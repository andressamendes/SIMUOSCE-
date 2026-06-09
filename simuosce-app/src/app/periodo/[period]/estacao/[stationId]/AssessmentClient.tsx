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
      <div className="flex flex-col items-center justify-center min-h-dvh gap-3 bg-slate-900">
        <p className="text-slate-400">Estação não encontrada.</p>
        <Link href="/" className="text-teal-400">Voltar</Link>
      </div>
    );
  }

  const isTeal = periodNum === 1;
  const checkBg = isTeal ? "bg-teal-500 border-teal-500" : "bg-pink-500 border-pink-500";
  const rowChecked = isTeal ? "bg-teal-950/50" : "bg-pink-950/50";
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
          <p className="font-bold text-white text-sm leading-tight truncate">{station.name}</p>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className={`text-2xl font-black leading-none ${scoreColor}`}>{fmt(score)}</p>
          <p className="text-slate-500 text-xs">/ {maxScore}</p>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="h-1 w-full bg-slate-800">
        <div className={`h-full transition-all duration-200 ${barColor}`} style={{ width: `${pct}%` }} />
      </div>

      {/* Critérios */}
      <div className="flex-1 overflow-y-auto pb-32">
        {station.criteria.map((criterion) => {
          const on = checked.has(criterion.id);
          return (
            <button
              key={criterion.id}
              onClick={() => toggle(criterion.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left border-b transition-colors ${
                on
                  ? `${rowChecked} border-transparent`
                  : "border-slate-800/60 active:bg-slate-800/50"
              }`}
            >
              {/* Checkbox */}
              <div
                className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                  on ? checkBg : "border-slate-600"
                }`}
              >
                {on && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" className="w-3.5 h-3.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>

              {/* Descrição */}
              <p className={`flex-1 text-[15px] leading-snug ${on ? "text-white font-medium" : "text-slate-300"}`}>
                {criterion.description}
              </p>

              {/* Pontuação */}
              <span className={`flex-shrink-0 text-sm font-bold ml-2 ${on ? "text-green-400" : "text-slate-500"}`}>
                +{fmt(criterion.score)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Rodapé fixo */}
      <div className="fixed bottom-0 inset-x-0 bg-slate-900/98 backdrop-blur border-t border-slate-800">
        <div className="h-1 w-full bg-slate-800">
          <div className={`h-full transition-all duration-200 ${barColor}`} style={{ width: `${pct}%` }} />
        </div>
        <div className="px-4 pt-3 pb-5 max-w-lg mx-auto flex items-center gap-3">
          <div className="flex-1 flex items-baseline gap-2">
            <span className={`text-4xl font-black leading-none ${scoreColor}`}>{fmt(score)}</span>
            <span className="text-slate-500 text-base">/ {maxScore}</span>
            <span className={`ml-auto text-xl font-black ${scoreColor}`}>{pct}%</span>
          </div>
          <button
            onClick={() => setChecked(new Set())}
            disabled={checked.size === 0}
            className={`flex-shrink-0 px-6 py-3.5 rounded-xl font-bold text-white text-sm transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${clearBtnCls}`}
          >
            Limpar
          </button>
        </div>
      </div>
    </main>
  );
}
