"use client";

import { use, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { baremas } from "@/data/baremas";
import { useStore } from "@/lib/store";
import { Period, Assessment } from "@/types";
import { exportAssessmentPDF } from "@/lib/export";

type Props = { params: Promise<{ period: string; stationId: string }> };

export default function AssessmentPage({ params }: Props) {
  const { period, stationId } = use(params);
  const periodNum = Number(period) as Period;
  const station = baremas[periodNum]?.find((s) => s.id === stationId);
  const router = useRouter();

  const { currentStudentName, currentStudentId, saveAssessment } = useStore();

  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [exporting, setExporting] = useState(false);

  const score = station
    ? station.criteria
        .filter((c) => checked.has(c.id))
        .reduce((sum, c) => sum + c.score, 0)
    : 0;

  const maxScore = station?.maxScore ?? 10;
  const pct = Math.round((score / maxScore) * 100);

  const toggle = useCallback((id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  if (!station) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh gap-4">
        <p className="text-slate-400">Estação não encontrada.</p>
        <Link href="/" className="text-teal-400 underline">
          Voltar
        </Link>
      </div>
    );
  }

  const periodColor = periodNum === 1 ? "teal" : "pink";
  const scoreColor =
    pct >= 70 ? "text-green-400" : pct >= 50 ? "text-yellow-400" : "text-red-400";

  function buildAssessment(): Assessment {
    return {
      id: `${currentStudentId}-${stationId}-${Date.now()}`,
      studentName: currentStudentName,
      studentId: currentStudentId,
      period: periodNum,
      stationId,
      stationName: station!.name,
      date: new Date().toLocaleDateString("pt-BR"),
      checkedCriteria: Array.from(checked),
      score,
      maxScore,
    };
  }

  function handleSave() {
    const assessment = buildAssessment();
    saveAssessment(assessment);
    setSaved(true);
    setShowSummary(true);
  }

  async function handleExportPDF() {
    setExporting(true);
    try {
      await exportAssessmentPDF(buildAssessment());
    } finally {
      setExporting(false);
    }
  }

  const missedCriteria = station.criteria.filter((c) => !checked.has(c.id));

  if (showSummary) {
    return (
      <main className="flex flex-col min-h-dvh bg-slate-900 text-slate-50 pb-10">
        <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setShowSummary(false)}
            className="text-slate-400 hover:text-white p-1"
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
          </button>
          <h1 className="font-bold text-lg text-white flex-1">Resumo Final</h1>
        </div>

        <div className="px-4 pt-6 flex flex-col gap-5 max-w-lg mx-auto w-full">
          {/* Score card */}
          <div className="bg-slate-800 rounded-2xl p-6 flex flex-col items-center gap-2">
            <p className="text-slate-400 text-sm">{station.name}</p>
            <p className={`text-6xl font-black ${scoreColor}`}>
              {score.toFixed(2)}
            </p>
            <p className="text-slate-400 text-lg">
              de {maxScore.toFixed(2)} pontos
            </p>
            <div className="w-full bg-slate-700 rounded-full h-3 mt-2">
              <div
                className={`h-3 rounded-full transition-all ${
                  pct >= 70
                    ? "bg-green-500"
                    : pct >= 50
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className={`text-2xl font-bold ${scoreColor}`}>{pct}%</p>
          </div>

          {/* Aluno */}
          <div className="bg-slate-800 rounded-2xl px-4 py-3 flex justify-between text-sm">
            <div>
              <p className="text-slate-400 text-xs">Aluno</p>
              <p className="font-semibold text-white">{currentStudentName}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-xs">Matrícula</p>
              <p className="font-semibold text-white">{currentStudentId}</p>
            </div>
          </div>

          {/* Critérios não realizados */}
          {missedCriteria.length > 0 && (
            <div className="bg-slate-800 rounded-2xl p-4 flex flex-col gap-2">
              <p className="text-sm font-semibold text-red-400">
                Critérios Não Realizados ({missedCriteria.length})
              </p>
              {missedCriteria.map((c) => (
                <div key={c.id} className="flex justify-between text-sm">
                  <span className="text-slate-300 leading-snug flex-1 pr-4">
                    {c.description}
                  </span>
                  <span className="text-red-400 font-medium whitespace-nowrap">
                    -{c.score.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Ações */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className="w-full bg-slate-700 hover:bg-slate-600 active:bg-slate-800 transition-colors rounded-2xl py-4 font-semibold text-white flex items-center justify-center gap-2"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-5 h-5"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              {exporting ? "Gerando PDF..." : "Exportar PDF"}
            </button>

            <Link
              href={`/periodo/${periodNum}`}
              className="w-full bg-teal-600 hover:bg-teal-500 active:bg-teal-700 transition-colors rounded-2xl py-4 font-semibold text-white flex items-center justify-center gap-2"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-5 h-5"
              >
                <path d="M12 5v14M5 12l7-7 7 7" />
              </svg>
              Nova Avaliação
            </Link>

            <Link
              href="/historico"
              className="w-full text-center text-slate-400 hover:text-white py-3 text-sm transition-colors"
            >
              Ver Histórico
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-dvh bg-slate-900 text-slate-50 pb-28">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center gap-3">
        <Link
          href={`/periodo/${periodNum}`}
          className="text-slate-400 hover:text-white p-1"
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
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-400">
            Estação {station.number} · {currentStudentName || "Aluno"}
          </p>
          <p className="font-bold text-white text-sm leading-tight truncate">
            {station.name}
          </p>
        </div>
        {/* Score badge */}
        <div className="flex flex-col items-end">
          <span className={`text-2xl font-black ${scoreColor}`}>
            {score.toFixed(2)}
          </span>
          <span className="text-slate-500 text-xs">/ {maxScore}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-800 h-1.5">
        <div
          className={`h-1.5 transition-all duration-200 ${
            pct >= 70 ? "bg-green-500" : pct >= 50 ? "bg-yellow-500" : "bg-red-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Criteria list */}
      <div className="flex flex-col gap-0 max-w-lg mx-auto w-full">
        {station.criteria.map((criterion, idx) => {
          const isChecked = checked.has(criterion.id);
          return (
            <button
              key={criterion.id}
              onClick={() => toggle(criterion.id)}
              className={`flex items-start gap-4 px-4 py-4 text-left transition-colors border-b border-slate-800 ${
                isChecked
                  ? periodColor === "teal"
                    ? "bg-teal-900/30"
                    : "bg-pink-900/30"
                  : "bg-slate-900 active:bg-slate-800"
              }`}
            >
              {/* Checkbox */}
              <div
                className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center mt-0.5 transition-colors ${
                  isChecked
                    ? periodColor === "teal"
                      ? "bg-teal-500 border-teal-500"
                      : "bg-pink-500 border-pink-500"
                    : "border-slate-600"
                }`}
              >
                {isChecked && (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    className="w-4 h-4"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <span
                  className={`text-xs text-slate-500 font-medium`}
                >
                  {idx + 1}/{station.criteria.length}
                </span>
                <p
                  className={`text-base leading-snug mt-0.5 ${
                    isChecked ? "text-white font-medium" : "text-slate-300"
                  }`}
                >
                  {criterion.description}
                </p>
              </div>
              {/* Score */}
              <span
                className={`flex-shrink-0 text-sm font-bold mt-1 ${
                  isChecked ? "text-green-400" : "text-slate-500"
                }`}
              >
                {criterion.score.toFixed(2)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur border-t border-slate-800 px-4 py-3 flex gap-3 max-w-lg mx-auto">
        <div className="flex-1 bg-slate-800 rounded-xl px-4 py-2 flex items-center gap-3">
          <div>
            <p className="text-xs text-slate-400">Marcados</p>
            <p className="font-bold text-white text-sm">
              {checked.size}/{station.criteria.length}
            </p>
          </div>
          <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                periodColor === "teal" ? "bg-teal-500" : "bg-pink-500"
              }`}
              style={{
                width: `${(checked.size / station.criteria.length) * 100}%`,
              }}
            />
          </div>
        </div>
        <button
          onClick={handleSave}
          className={`flex-shrink-0 px-6 py-3 rounded-xl font-bold text-white transition-colors ${
            periodColor === "teal"
              ? "bg-teal-600 hover:bg-teal-500 active:bg-teal-700"
              : "bg-pink-600 hover:bg-pink-500 active:bg-pink-700"
          }`}
        >
          {saved ? "Atualizar" : "Finalizar"}
        </button>
      </div>
    </main>
  );
}
