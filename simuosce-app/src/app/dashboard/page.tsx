"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { baremas } from "@/data/baremas";

export default function DashboardPage() {
  const { history } = useStore();
  const [period, setPeriod] = useState<"all" | 1 | 2>("all");

  const filtered =
    period === "all" ? history : history.filter((a) => a.period === period);

  const totalStudents = new Set(filtered.map((a) => a.studentId)).size;
  const avg =
    filtered.length > 0
      ? filtered.reduce((s, a) => s + (a.score / a.maxScore) * 100, 0) /
        filtered.length
      : 0;

  // Per-station stats
  const stationStats = [
    ...(period !== 2 ? baremas[1] : []),
    ...(period !== 1 ? baremas[2] : []),
  ].map((station) => {
    const stationHistory = filtered.filter((a) => a.stationId === station.id);
    const stationAvg =
      stationHistory.length > 0
        ? stationHistory.reduce(
            (s, a) => s + (a.score / a.maxScore) * 100,
            0
          ) / stationHistory.length
        : null;
    return {
      station,
      count: stationHistory.length,
      avg: stationAvg,
    };
  });

  // Per-student stats
  const studentMap: Record<
    string,
    { name: string; count: number; totalPct: number }
  > = {};
  filtered.forEach((a) => {
    if (!studentMap[a.studentId]) {
      studentMap[a.studentId] = {
        name: a.studentName,
        count: 0,
        totalPct: 0,
      };
    }
    studentMap[a.studentId].count++;
    studentMap[a.studentId].totalPct += (a.score / a.maxScore) * 100;
  });
  const studentStats = Object.entries(studentMap)
    .map(([id, s]) => ({
      id,
      name: s.name,
      count: s.count,
      avg: s.totalPct / s.count,
    }))
    .sort((a, b) => b.avg - a.avg);

  return (
    <main className="flex flex-col min-h-dvh bg-slate-900 text-slate-50 pb-10">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center gap-3">
        <Link href="/" className="text-slate-400 hover:text-white p-1">
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
        <h1 className="font-bold text-lg text-white flex-1">Dashboard</h1>
      </div>

      <div className="px-4 pt-5 flex flex-col gap-5 max-w-lg mx-auto w-full">
        {/* Filtros */}
        <div className="flex gap-2">
          {(["all", 1, 2] as const).map((f) => (
            <button
              key={f}
              onClick={() => setPeriod(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                period === f
                  ? "bg-teal-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              {f === "all" ? "Todos" : `${f}º Período`}
            </button>
          ))}
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-800 rounded-2xl p-3 text-center">
            <p className="text-2xl font-black text-teal-400">
              {filtered.length}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">avaliações</p>
          </div>
          <div className="bg-slate-800 rounded-2xl p-3 text-center">
            <p className="text-2xl font-black text-purple-400">
              {totalStudents}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">alunos</p>
          </div>
          <div className="bg-slate-800 rounded-2xl p-3 text-center">
            <p
              className={`text-2xl font-black ${
                avg >= 70
                  ? "text-green-400"
                  : avg >= 50
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              {avg.toFixed(1)}%
            </p>
            <p className="text-xs text-slate-400 mt-0.5">média</p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-12 h-12 text-slate-600"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <p className="text-slate-500 text-sm">
              Nenhuma avaliação registrada.
            </p>
            <Link href="/" className="text-teal-400 text-sm hover:underline">
              Iniciar avaliação
            </Link>
          </div>
        ) : (
          <>
            {/* Desempenho por estação */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
                Desempenho por Estação
              </p>
              {stationStats
                .filter((s) => s.count > 0)
                .map(({ station, count, avg: sAvg }) => {
                  const pct = sAvg ?? 0;
                  const barColor =
                    pct >= 70
                      ? "bg-green-500"
                      : pct >= 50
                      ? "bg-yellow-500"
                      : "bg-red-500";
                  const textColor =
                    pct >= 70
                      ? "text-green-400"
                      : pct >= 50
                      ? "text-yellow-400"
                      : "text-red-400";
                  return (
                    <div
                      key={station.id}
                      className="bg-slate-800 rounded-2xl px-4 py-3"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-xs text-slate-500">
                            Est. {station.number} · {count} aval.
                          </p>
                          <p className="font-medium text-white text-sm">
                            {station.name}
                          </p>
                        </div>
                        <span className={`text-lg font-black ${textColor}`}>
                          {pct.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${barColor} transition-all`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Ranking de alunos */}
            {studentStats.length > 0 && (
              <div className="flex flex-col gap-3">
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
                  Desempenho por Aluno
                </p>
                {studentStats.map((s, idx) => {
                  const color =
                    s.avg >= 70
                      ? "text-green-400"
                      : s.avg >= 50
                      ? "text-yellow-400"
                      : "text-red-400";
                  return (
                    <div
                      key={s.id}
                      className="bg-slate-800 rounded-2xl px-4 py-3 flex items-center gap-3"
                    >
                      <span className="text-slate-500 font-bold w-5 text-center text-sm">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">
                          {s.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {s.id} · {s.count} estação
                          {s.count !== 1 ? "ões" : ""}
                        </p>
                      </div>
                      <span className={`text-lg font-black ${color}`}>
                        {s.avg.toFixed(1)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
