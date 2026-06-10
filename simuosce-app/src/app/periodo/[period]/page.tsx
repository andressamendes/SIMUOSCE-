import { baremas } from "@/data/baremas";
import { Period } from "@/types";
import PeriodClient from "./PeriodClient";

export function generateStaticParams() {
  return [{ period: "1" }, { period: "2" }, { period: "3" }];
}

type Props = { params: Promise<{ period: string }> };

export default async function PeriodPage({ params }: Props) {
  const { period } = await params;
  const periodNum = Number(period) as Period;
  const stations = baremas[periodNum] ?? [];
  return <PeriodClient periodNum={periodNum} stations={stations} />;
}
