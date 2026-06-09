"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Assessment } from "@/types";
import { exportCSV, exportXLSX, exportAssessmentPDF } from "@/lib/export";

export default function HistoricoPage() {
  const { history, deleteAssessment, clearHistory } = useStore();
  const [filter, setFilter] = useState<"all" | 1 | 2>("all");
  const [exporting, setExporting] = useState<string | null>(null);
  const [showClear, setShowClear] = useState(false);

  const filtered =
    filter === "all" ? history : history.filter((a) => a.period === filter);

  async function handleExportPDF(a: Assessment) {
    setExporting(a.id + "-pdf");
    try {
      await exportAssessmentPDF(a);
    } finally {
      setExporting(null);
    }
  }

  async function handleExportXLSX() {
    setExporting("xlsx");
    try {
      await exportXLSX(filtered);
    } finally {
      setExporting(null);
    }
  }

  function handleExportCSV() {
    exportCSV(filtered);
  }

  const avg =
    filtered.length > 0
      ? filtered.reduce((s, a) => s + (a.score / a.maxScore) * 100, 0) /
        filtered.length
      : 0;

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
        <h1 className="font-bold text-lg text-white flex-1">Histórico</h1>
        {history.length > 0 && (
          <button
            onClick={() => setShowClear(true)}
            className="text-red-400 hover:text-red-300 text-xs px-3 py-1.5 border border-red-900 rounded-lg"
          >
            Limpar
          </button>
        )}
      </div>

      <div className="px-4 pt-5 flex flex-col gap-4 max-w-lg mx-auto w-full">
        {/* Filtros */}
        <div className="flex gap-2">
          {(["all", 1, 2] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-teal-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              {f === "all" ? "Todos" : `${f}º Período`}
            </button>
          ))}
        </div>

        {/* Exportações */}
        {filtered.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm py-2.5 rounded-xl font-medium transition-colors"
            >
              Exportar CSV
            </button>
            <button
              onClick={handleExportXLSX}
              disabled={exporting === "xlsx"}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm py-2.5 rounded-xl font-medium transition-colors"
            >
              {exporting === "xlsx" ? "Gerando..." : "Exportar XLSX"}
            </button>
          </div>
        )}

        {/* Resumo */}
        {filtered.length > 0 && (
          <div className="bg-slate-800 rounded-2xl px-4 py-3 flex justify-between">
            <div className="text-center flex-1">
              <p className="text-2xl font-black text-teal-400">
                {filtered.length}
              </p>
              <p className="text-xs text-slate-400">avaliações</p>
            </div>
            <div className="w-px bg-slate-700" />
            <div className="text-center flex-1">
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
              <p className="text-xs text-slate-400">média geral</p>
            </div>
          </div>
        )}

        {/* Lista */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-12 h-12 text-slate-600"
            >
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="1" />
            </svg>
            <p className="text-slate-500 text-sm">Nenhuma avaliação encontrada.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((a) => {
              const pct = Math.round((a.score / a.maxScore) * 100);
              const scoreColor =
                pct >= 70
                  ? "text-green-400"
                  : pct >= 50
                  ? "text-yellow-400"
                  : "text-red-400";

              return (
                <div
                  key={a.id}
                  className="bg-slate-800 rounded-2xl px-4 py-4 flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">
                        {a.studentName}
                      </p>
                      <p className="text-xs text-slate-400">
                        {a.studentId} · {a.period}º Período · {a.date}
                      </p>
                      <p className="text-sm text-slate-300 mt-1">
                        {a.stationName}
                      </p>
                    </div>
                    <div className="flex flex-col items-end ml-4">
                      <span className={`text-xl font-black ${scoreColor}`}>
                        {pct}%
                      </span>
                      <span className="text-slate-500 text-xs">
                        {a.score.toFixed(2)}/{a.maxScore}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => handleExportPDF(a)}
                      disabled={exporting === a.id + "-pdf"}
                      className="flex-1 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 py-2 rounded-lg transition-colors font-medium"
                    >
                      {exporting === a.id + "-pdf" ? "..." : "PDF"}
                    </button>
                    <button
                      onClick={() => deleteAssessment(a.id)}
                      className="px-3 py-2 text-xs bg-red-900/40 hover:bg-red-900/60 text-red-400 rounded-lg transition-colors"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirm clear */}
      {showClear && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center">
          <div className="bg-slate-800 rounded-t-3xl w-full max-w-lg p-6 flex flex-col gap-4">
            <h2 className="font-bold text-white text-lg">Limpar histórico?</h2>
            <p className="text-slate-400 text-sm">
              Todas as avaliações serão removidas permanentemente.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClear(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3.5 rounded-xl font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  clearHistory();
                  setShowClear(false);
                }}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3.5 rounded-xl font-semibold"
              >
                Limpar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
