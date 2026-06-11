"use client";

type Props = {
  checked: number;            // critérios realizados
  total:   number;            // total de critérios da estação
  variant: "dark" | "light";  // dark = header com gradiente; light = Modo Foco
  accent?: string;            // cor do período (apenas variant light)
};

/**
 * Progresso de conclusão da estação — baseado em critérios realizados,
 * não na nota (a nota tem seus próprios indicadores).
 * Atualiza em tempo real a cada toggle de critério.
 */
export default function StationProgress({ checked, total, variant, accent = "#2EC9C4" }: Props) {
  const completion = total > 0 ? Math.round((checked / total) * 100) : 0;
  const dark = variant === "dark";

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={checked}
      aria-label={`${checked} de ${total} critérios realizados — ${completion}% concluído`}
    >
      <div className={`${dark ? "h-[6px] bg-white/20" : "h-[4px] bg-[#F3F4F6]"}
                       rounded-full overflow-hidden`}>
        <div className="h-full rounded-full transition-all duration-300"
             style={{
               width: `${completion}%`,
               backgroundColor: dark ? "#FFFFFF" : accent,
             }}/>
      </div>
      <div className="flex items-center justify-between mt-1.5">
        <span className={`text-xs font-medium ${dark ? "text-white/55" : "text-[#9CA3AF]"}`}>
          {checked} de {total} critérios realizados
        </span>
        <span className={`text-xs font-bold ${dark ? "text-white/80" : ""}`}
              style={dark ? undefined : { color: accent }}>
          {completion}% concluído
        </span>
      </div>
    </div>
  );
}
