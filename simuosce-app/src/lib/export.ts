import { Assessment } from "@/types";
import { baremas } from "@/data/baremas";

export function exportCSV(assessments: Assessment[]) {
  const header = [
    "Nome do Aluno",
    "Matrícula",
    "Período",
    "Estação",
    "Data",
    "Nota Obtida",
    "Nota Máxima",
    "Percentual",
  ];

  const rows = assessments.map((a) => [
    a.studentName,
    a.studentId,
    `${a.period}º Período`,
    a.stationName,
    a.date,
    a.score.toFixed(2),
    a.maxScore.toFixed(2),
    `${((a.score / a.maxScore) * 100).toFixed(1)}%`,
  ]);

  const csv = [header, ...rows].map((r) => r.join(";")).join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, "simuosce-avaliacoes.csv");
}

export async function exportXLSX(assessments: Assessment[]) {
  const { utils, writeFile } = await import("xlsx");

  const data = assessments.map((a) => ({
    "Nome do Aluno": a.studentName,
    Matrícula: a.studentId,
    Período: `${a.period}º Período`,
    Estação: a.stationName,
    Data: a.date,
    "Nota Obtida": a.score,
    "Nota Máxima": a.maxScore,
    Percentual: `${((a.score / a.maxScore) * 100).toFixed(1)}%`,
  }));

  const ws = utils.json_to_sheet(data);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, "Avaliações");
  writeFile(wb, "simuosce-avaliacoes.xlsx");
}

export async function exportAssessmentPDF(assessment: Assessment) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF();
  const station = baremas[assessment.period].find(
    (s) => s.id === assessment.stationId
  );

  doc.setFontSize(16);
  doc.text("SIMUOSCE – Avaliação OSCE", 14, 20);
  doc.setFontSize(10);
  doc.text("Centro Acadêmico Sergio Ferreira – Afya Guanambi", 14, 28);

  doc.setFontSize(12);
  doc.text(`Aluno: ${assessment.studentName}`, 14, 40);
  doc.text(`Matrícula: ${assessment.studentId}`, 14, 48);
  doc.text(`Período: ${assessment.period}º Período`, 14, 56);
  doc.text(`Estação ${assessment.stationId}: ${assessment.stationName}`, 14, 64);
  doc.text(`Data: ${assessment.date}`, 14, 72);

  if (station) {
    const tableData = station.criteria.map((c) => [
      c.description,
      c.score.toFixed(2),
      assessment.checkedCriteria.includes(c.id) ? "✓" : "✗",
      assessment.checkedCriteria.includes(c.id) ? c.score.toFixed(2) : "0,00",
    ]);

    autoTable(doc, {
      startY: 80,
      head: [["Critério", "Pontos", "Realizado", "Obtido"]],
      body: tableData,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [20, 184, 166] },
    });
  }

  const finalY = (doc as any).lastAutoTable?.finalY ?? 180;
  const pct = ((assessment.score / assessment.maxScore) * 100).toFixed(1);

  doc.setFontSize(12);
  doc.text(
    `Nota Final: ${assessment.score.toFixed(2)} / ${assessment.maxScore.toFixed(2)} (${pct}%)`,
    14,
    finalY + 12
  );

  doc.save(`simuosce-${assessment.studentId}-${assessment.stationId}.pdf`);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
