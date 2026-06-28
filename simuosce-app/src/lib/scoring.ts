import { Criterion } from "@/types";

export type StatusLabel = {
  label: string;
  color: string;
  bg:    string;
} | null;

// Returns Aprovado/Regular/Insuficiente label with colors, or null when score is zero.
// bgAlpha controls background opacity: 0.22 for normal mode, 0.12 for Focus Mode.
export function getStatusLabel(pct: number, bgAlpha = 0.12): StatusLabel {
  if (pct === 0) return null;
  if (pct >= 70) return { label: "Aprovado",     color: "#10B981", bg: `rgba(16,185,129,${bgAlpha})` };
  if (pct >= 50) return { label: "Regular",      color: "#F59E0B", bg: `rgba(245,158,11,${bgAlpha})` };
  return               { label: "Insuficiente",  color: "#EF4444", bg: `rgba(239,68,68,${bgAlpha})` };
}

export type PerfBadge = {
  word:  string;
  desc:  string;
  color: string;
  bg:    string;
};

// Returns the performance badge used in the Summary Screen.
export function getPerfBadge(pct: number): PerfBadge {
  if (pct >= 90) return { word: "Excelente", desc: "Desempenho excelente na estação",    color: "#10B981", bg: "rgba(16,185,129,0.09)" };
  if (pct >= 70) return { word: "Bom",       desc: "Bom desempenho na estação",          color: "#F59E0B", bg: "rgba(245,158,11,0.09)" };
  return               { word: "Atenção",    desc: "Revise os critérios não realizados", color: "#EF4444", bg: "rgba(239,68,68,0.09)" };
}

export function calculateScore(criteria: Criterion[], checked: Set<string>): number {
  return criteria
    .filter((c) => checked.has(c.id))
    .reduce((sum, c) => sum + c.score, 0);
}

export function calculatePct(score: number, maxScore: number): number {
  return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
}

export function getPendingCriteria(criteria: Criterion[], checkedIds: Set<string>): Criterion[] {
  return criteria.filter((c) => !checkedIds.has(c.id));
}
