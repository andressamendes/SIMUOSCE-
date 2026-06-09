"use client";

import Link from "next/link";
import { Station, Period } from "@/types";

type Props = { periodNum: Period; stations: Station[] };

export default function PeriodClient({ periodNum, stations }: Props) {
  const isTeal = periodNum === 1;
  const badgeCls = isTeal
    ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
    : "bg-pink-500/20 text-pink-300 border border-pink-500/30";
  const cardHover = isTeal
    ? "hover:border-teal-600 hover:bg-teal-950/40"
    : "hover:border-pink-600 hover:bg-pink-950/40";
  const numBg = isTeal ? "bg-teal-600" : "bg-pink-600";

  return (
    <main className="flex flex-col min-h-dvh bg-slate-900 text-slate-50 pb-6">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center gap-3">
        <Link href="/" className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Link>
        <h1 className="font-black text-xl text-white flex-1">{periodNum}º Período</h1>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${badgeCls}`}>
          {stations.length} estações
        </span>
      </div>

      {/* Lista de estações */}
      <div className="flex flex-col gap-3 px-4 pt-5 max-w-lg mx-auto w-full">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-1">
          Selecione a estação
        </p>

        {stations.map((station) => (
          <Link
            key={station.id}
            href={`/periodo/${periodNum}/estacao/${station.id}`}
            className={`flex items-center gap-4 bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 transition-all active:scale-95 ${cardHover}`}
          >
            <div className={`flex-shrink-0 w-10 h-10 rounded-full ${numBg} flex items-center justify-center`}>
              <span className="text-white font-black text-sm">{station.number}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-base leading-snug">{station.name}</p>
              <p className="text-slate-500 text-xs mt-0.5">
                {station.criteria.length} critérios · {station.maxScore} pontos
              </p>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-slate-600 flex-shrink-0">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
        ))}
      </div>
    </main>
  );
}
