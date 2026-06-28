export type Criterion = {
  id: string;
  description: string;
  score: number;
};

export type Station = {
  id: string;
  number: number;
  name: string;
  criteria: Criterion[];
  maxScore: number;
};

// Period is any positive integer. Not a closed union — new periods can be
// added to baremas.ts and themes.ts without touching this type.
export type Period = number;
