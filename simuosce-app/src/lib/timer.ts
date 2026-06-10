/* Regra oficial: 5-10 critérios = 3min · 11-15 = 4min · >15 = 5min */
export const getDuration = (criteriaCount: number): number => {
  if (criteriaCount <= 10) return 180;
  if (criteriaCount <= 15) return 240;
  return 300;
};

export const getDurationMin = (criteriaCount: number): number =>
  getDuration(criteriaCount) / 60;
