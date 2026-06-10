export const fmt = (n: number): string =>
  n % 1 === 0 ? `${n}` : n.toFixed(2).replace(/0+$/, "").replace(".", ",");

export const formatTime = (s: number): string => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};
