"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { baremas } from "@/data/baremas";
import { useStore } from "@/lib/store";
import { Period } from "@/types";

type Props = { params: Promise<{ period: string }> };

export default function PeriodPage({ params }: Props) {
  const { period } = use(params);
  const periodNum = Number(period) as Period;
  const stations = baremas[periodNum] ?? [];
  const router = useRouter();

  const { currentStudentName, currentStudentId, setStudentInfo } = useStore();
  const [name, setName] = useState(currentStudentName);
  const [id, setId] = useState(currentStudentId);
  const [error, setError] = useState("");

  const periodColor = periodNum === 1 ? "teal" : "pink";
  const colorCls = {
    teal: {
      badge: "bg-teal-500/20 text-teal-300 border border-teal-500/30",
      btn: "bg-teal-600 hover:bg-teal-500 active:bg-teal-700",
      ring: "focus:ring-teal-500",
      card: "hover:bg-teal-900/30 border-slate-700 hover:border-teal-600",
    },
    pink: {
      badge: "bg-pink-500/20 text-pink-300 border border-pink-500/30",
      btn: "bg-pink-600 hover:bg-pink-500 active:bg-pink-700",
      ring: "focus:ring-pink-500",
      card: "hover:bg-pink-900/30 border-slate-700 hover:border-pink-600",
    },
  }[periodColor];

  function handleSelectStation(stationId: string) {
    if (!name.trim() || !id.trim()) {
      setError("Preencha o nome e a matrícula do aluno.");
      return;
    }
    setStudentInfo(name.trim(), id.trim());
    router.push(`/periodo/${periodNum}/estacao/${stationId}`);
  }

  return (
    <main className="flex flex-col min-h-dvh bg-slate-900 text-slate-50 pb-10">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center gap-3">
        <Link
          href="/"
          className="text-slate-400 hover:text-white transition-colors p-1"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-5 h-5"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Link>
        <h1 className="font-bold text-lg text-white flex-1">
          {periodNum}º Período
        </h1>
        <span className={`text-xs px-2 py-1 rounded-full ${colorCls.badge}`}>
          {stations.length} estações
        </span>
      </div>

      <div className="px-4 pt-6 flex flex-col gap-6 max-w-lg mx-auto w-full">
        {/* Dados do aluno */}
        <div className="bg-slate-800 rounded-2xl p-4 flex flex-col gap-3">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
            Dados do Aluno
          </p>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">
                Nome completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                placeholder="Nome do aluno"
                className={`w-full bg-slate-700 text-white rounded-xl px-4 py-3 text-base placeholder-slate-500 outline-none focus:ring-2 ${colorCls.ring} transition`}
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">
                Matrícula
              </label>
              <input
                type="text"
                value={id}
                onChange={(e) => {
                  setId(e.target.value);
                  setError("");
                }}
                placeholder="Nº de matrícula"
                className={`w-full bg-slate-700 text-white rounded-xl px-4 py-3 text-base placeholder-slate-500 outline-none focus:ring-2 ${colorCls.ring} transition`}
              />
            </div>
          </div>
          {error && (
            <p className="text-red-400 text-sm font-medium">{error}</p>
          )}
        </div>

        {/* Estações */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
            Selecione a Estação
          </p>
          {stations.map((station) => (
            <button
              key={station.id}
              onClick={() => handleSelectStation(station.id)}
              className={`flex items-center justify-between w-full bg-slate-800 border rounded-2xl px-5 py-4 transition-colors ${colorCls.card} text-left`}
            >
              <div>
                <p className="text-xs text-slate-500 mb-0.5">
                  Estação {station.number}
                </p>
                <p className="font-semibold text-white text-base leading-snug">
                  {station.name}
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  {station.criteria.length} critérios · {station.maxScore} pts
                </p>
              </div>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-5 h-5 text-slate-500 flex-shrink-0 ml-3"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
