import { Station } from "@/types";

/**
 * Validação estrutural dos baremas — executada no build (SSG).
 * Qualquer inconsistência interrompe o build com erro descritivo,
 * impedindo que dados corrompidos cheguem à produção.
 */
export function validateBaremas(baremas: Record<number, Station[]>): void {
  const errors: string[] = [];
  const seenIds = new Set<string>();

  const registerId = (id: string, context: string) => {
    if (seenIds.has(id)) errors.push(`${context}: id duplicado "${id}"`);
    seenIds.add(id);
  };

  for (const [periodKey, stations] of Object.entries(baremas)) {
    const p = Number(periodKey);
    if (!Number.isInteger(p) || p < 1) {
      errors.push(`Período inválido: "${periodKey}" (deve ser inteiro ≥ 1)`);
      continue;
    }
    if (!Array.isArray(stations) || stations.length === 0) {
      errors.push(`Período ${p}: sem estações`);
      continue;
    }

    stations.forEach((st, i) => {
      const ctx = `Período ${p}, estação ${i + 1} (${st?.id ?? "sem id"})`;

      if (!st.id || !new RegExp(`^p${p}-e\\d+$`).test(st.id))
        errors.push(`${ctx}: id deve seguir o padrão "p${p}-e{N}"`);
      else registerId(st.id, ctx);

      if (!st.name?.trim()) errors.push(`${ctx}: nome vazio`);
      if (!Number.isInteger(st.number) || st.number < 1)
        errors.push(`${ctx}: number inválido (${st.number})`);
      if (typeof st.maxScore !== "number" || st.maxScore <= 0)
        errors.push(`${ctx}: maxScore inválido (${st.maxScore})`);

      if (!Array.isArray(st.criteria) || st.criteria.length === 0) {
        errors.push(`${ctx}: sem critérios`);
        return;
      }

      let sum = 0;
      st.criteria.forEach((c, k) => {
        const cctx = `${ctx}, critério ${k + 1}`;
        if (!c.id || !new RegExp(`^${st.id}-c\\d+$`).test(c.id))
          errors.push(`${cctx}: id deve seguir o padrão "${st.id}-c{K}"`);
        else registerId(c.id, cctx);
        if (!c.description?.trim()) errors.push(`${cctx}: descrição vazia`);
        if (typeof c.score !== "number" || !Number.isFinite(c.score) || c.score <= 0)
          errors.push(`${cctx}: score inválido (${c.score})`);
        else sum += c.score;
      });

      // Tolerância para aritmética de ponto flutuante (ex.: 10× 0.5 + 5× 1.0)
      if (Math.abs(sum - st.maxScore) > 0.001)
        errors.push(
          `${ctx}: soma dos scores (${sum.toFixed(2)}) difere do maxScore (${st.maxScore})`
        );
    });
  }

  if (errors.length > 0) {
    throw new Error(
      `Baremas inválidos — corrija src/data/baremas.ts antes de publicar:\n` +
        errors.map((e) => `  • ${e}`).join("\n")
    );
  }
}
