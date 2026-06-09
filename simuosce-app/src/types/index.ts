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

export type Period = 1 | 2;

export type Assessment = {
  id: string;
  studentName: string;
  studentId: string;
  period: Period;
  stationId: string;
  stationName: string;
  date: string;
  checkedCriteria: string[];
  score: number;
  maxScore: number;
};
