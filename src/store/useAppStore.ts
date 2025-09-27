import { create } from "zustand";

// violation object
export interface ViolationInstance {
  startTime: number; // timestamp
  endTime: number | null; // null if ongoing
  duration: number; // in seconds
}

// counts violations and holds instances
export interface ViolationCategory {
  count: number;
  instances: ViolationInstance[];
}

// types of violations
export type ViolationType = "NoFace" | "MultipleFaces" | "LookingAway";

interface AppState {
  logs: { message: string; timestamp: string }[];
  isDetectorReady: boolean;
  violations: Record<ViolationType, ViolationCategory>;
  addLog: (message: string) => void;
  setDetectorReady: (isReady: boolean) => void;
  startViolation: (type: ViolationType) => void;
  endViolation: (type: ViolationType) => void;
  resetViolations: () => void;
}

const initialViolations: Record<ViolationType, ViolationCategory> = {
  NoFace: { count: 0, instances: [] },
  MultipleFaces: { count: 0, instances: [] },
  LookingAway: { count: 0, instances: [] },
};

export const useAppStore = create<AppState>((set) => ({
  logs: [],
  isDetectorReady: false,
  violations: { ...initialViolations },

  addLog: (message) =>
    set((state) => ({
      logs: [
        { message, timestamp: new Date().toLocaleTimeString() },
        ...state.logs,
      ],
    })),

  setDetectorReady: (isReady) => set({ isDetectorReady: isReady }),

  startViolation: (type) =>
    set((state) => {
      const category = state.violations[type];
      const lastInstance = category.instances[category.instances.length - 1];

      // start a violation if no other is ongoing
      if (!lastInstance || lastInstance.endTime !== null) {
        const newInstance: ViolationInstance = {
          startTime: Date.now(),
          endTime: null,
          duration: 0,
        };
        return {
          violations: {
            ...state.violations,
            [type]: {
              count: category.count + 1,
              instances: [...category.instances, newInstance],
            },
          },
        };
      }
      return state; // no change if already violating
    }),

  endViolation: (type) =>
    set((state) => {
      const category = state.violations[type];
      const lastInstance = category.instances[category.instances.length - 1];

      // end violation if one is ongoing
      if (lastInstance && lastInstance.endTime === null) {
        const now = Date.now();
        lastInstance.endTime = now;
        lastInstance.duration = (now - lastInstance.startTime) / 1000; // duration in seconds
        return {
          violations: { ...state.violations }, // return to retrigger state update
        };
      }
      return state; // no change if no ongoing violation
    }),

  resetViolations: () => set({ violations: { ...initialViolations } }),
}));
