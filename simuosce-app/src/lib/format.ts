export const fmt = (n: number): string =>
  n % 1 === 0 ? `${n}` : n.toFixed(2).replace(/0+$/, "").replace(".", ",");
