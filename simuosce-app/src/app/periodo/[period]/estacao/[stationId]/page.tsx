import { baremas } from "@/data/baremas";
import { Period } from "@/types";
import AssessmentClient from "./AssessmentClient";

export function generateStaticParams() {
  return ([1, 2, 3, 5] as const).flatMap((p) =>
    baremas[p].map((s) => ({ period: String(p), stationId: s.id }))
  );
}

type Props = { params: Promise<{ period: string; stationId: string }> };

export default async function AssessmentPage({ params }: Props) {
  const { period, stationId } = await params;
  const periodNum = Number(period) as Period;
  const station = baremas[periodNum]?.find((s) => s.id === stationId) ?? null;
  return <AssessmentClient periodNum={periodNum} station={station} />;
}
