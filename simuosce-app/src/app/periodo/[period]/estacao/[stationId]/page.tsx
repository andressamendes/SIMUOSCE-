import { baremas } from "@/data/baremas";
import { Period } from "@/types";
import AssessmentClient from "./AssessmentClient";

// Derived automatically from baremas — no manual update needed when adding periods.
export function generateStaticParams() {
  return (Object.keys(baremas) as string[]).flatMap((pk) =>
    (baremas[Number(pk)] ?? []).map((s) => ({ period: pk, stationId: s.id }))
  );
}

type Props = { params: Promise<{ period: string; stationId: string }> };

export default async function AssessmentPage({ params }: Props) {
  const { period, stationId } = await params;
  const periodNum = Number(period) as Period;
  const station = baremas[periodNum]?.find((s) => s.id === stationId) ?? null;
  return <AssessmentClient periodNum={periodNum} station={station} />;
}
