import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Assessment, Period } from "@/types";

type AppState = {
  currentPeriod: Period | null;
  currentStudentName: string;
  currentStudentId: string;
  history: Assessment[];
  setCurrentPeriod: (period: Period | null) => void;
  setStudentInfo: (name: string, id: string) => void;
  saveAssessment: (assessment: Assessment) => void;
  deleteAssessment: (id: string) => void;
  clearHistory: () => void;
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      currentPeriod: null,
      currentStudentName: "",
      currentStudentId: "",
      history: [],
      setCurrentPeriod: (period) => set({ currentPeriod: period }),
      setStudentInfo: (name, id) =>
        set({ currentStudentName: name, currentStudentId: id }),
      saveAssessment: (assessment) =>
        set((state) => ({
          history: [
            assessment,
            ...state.history.filter((a) => a.id !== assessment.id),
          ],
        })),
      deleteAssessment: (id) =>
        set((state) => ({
          history: state.history.filter((a) => a.id !== id),
        })),
      clearHistory: () => set({ history: [] }),
    }),
    { name: "simuosce-storage" }
  )
);
