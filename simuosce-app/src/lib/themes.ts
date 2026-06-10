import { Period } from "@/types";

export type PeriodTheme = {
  headerClass:  string;
  accent:       string;
  accentBg:     string;
  checkGlow:    string;
  numGradient:  string;
  shadowBtn:    string;
  footerShadow: string;
  dotColor:     string;
  cardShadow:   string;
};

export const periodThemes: Record<Period, PeriodTheme> = {
  1: {
    headerClass:  "bg-teal-brand",
    accent:       "#2EC9C4",
    accentBg:     "rgba(46,201,196,0.10)",
    checkGlow:    "check-glow-teal",
    numGradient:  "linear-gradient(135deg,#2EC9C4 0%,#178785 100%)",
    shadowBtn:    "rgba(46,201,196,0.35)",
    footerShadow: "0 -4px 24px rgba(46,201,196,0.28)",
    dotColor:     "rgba(255,255,255,0.80)",
    cardShadow:   "0 8px 28px rgba(46,201,196,0.38), 0 2px 8px rgba(0,0,0,0.06)",
  },
  2: {
    headerClass:  "bg-osce",
    accent:       "#EE1068",
    accentBg:     "rgba(238,16,104,0.08)",
    checkGlow:    "check-glow-osce",
    numGradient:  "linear-gradient(135deg,#EE1068 0%,#F5956A 100%)",
    shadowBtn:    "rgba(238,16,104,0.28)",
    footerShadow: "0 -4px 24px rgba(238,16,104,0.25)",
    dotColor:     "#F5956A",
    cardShadow:   "0 8px 28px rgba(238,16,104,0.32), 0 2px 8px rgba(0,0,0,0.06)",
  },
  3: {
    headerClass:  "bg-period3",
    accent:       "#7C3AED",
    accentBg:     "rgba(124,58,237,0.08)",
    checkGlow:    "check-glow-period3",
    numGradient:  "linear-gradient(135deg,#7C3AED 0%,#A78BFA 100%)",
    shadowBtn:    "rgba(124,58,237,0.32)",
    footerShadow: "0 -4px 24px rgba(124,58,237,0.25)",
    dotColor:     "#A78BFA",
    cardShadow:   "0 8px 28px rgba(124,58,237,0.30), 0 2px 8px rgba(0,0,0,0.06)",
  },
};
