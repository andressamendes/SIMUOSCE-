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

export type Period = 1 | 2 | 3 | 5;
