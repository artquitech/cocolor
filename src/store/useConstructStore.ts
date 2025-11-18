import { create } from 'zustand';

// ============================================================================
// TYPES - Teaching Construct System
// ============================================================================

export type Mode = "idle" | "booting" | "construct" | "classroom";

export interface LessonRef {
  id: string | null;
  title: string | null;
  currentSlide: number;
}

export interface ClassSession {
  title: string | null;
  isActive: boolean;
  currentStep: number;
  steps: string[];
}

export interface PlayerState {
  position: { x: number; y: number; z: number };
  lookingAtZoneId: string | null;
}

export type ZoneType = "lesson" | "video" | "image" | "exercise";

export interface ZoneDefinition {
  id: string;
  title: string;
  position: { x: number; y: number; z: number };
  type: ZoneType;
  payloadId: string; // lesson id, video id, etc.
}

// ============================================================================
// STORE INTERFACE
// ============================================================================

interface AppState {
  // Core state
  mode: Mode;
  bootProgress: number;

  // Class system
  classSession: ClassSession;

  // Lesson system
  currentLesson: LessonRef;
  focusMode: boolean;

  // World system
  zones: ZoneDefinition[];
  player: PlayerState;

  // Terminal & UI
  logs: string[];
  audioEnabled: boolean;

  // Visual effects (keep for transitions)
  glitchEffect: boolean;
  matrixRain: boolean;

  // ========== ACTIONS ==========

  // Mode management
  setMode: (mode: Mode) => void;
  incrementBootProgress: () => void;

  // Class session management
  startClassSession: (title: string, steps: string[], zones: ZoneDefinition[]) => void;
  endClassSession: () => void;
  nextStep: () => void;
  previousStep: () => void;

  // Lesson management
  setCurrentLesson: (lesson: LessonRef) => void;
  nextSlide: () => void;
  previousSlide: () => void;
  setFocusMode: (enabled: boolean) => void;

  // World management
  setZones: (zones: ZoneDefinition[]) => void;
  addZone: (zone: ZoneDefinition) => void;
  setPlayerPosition: (position: { x: number; y: number; z: number }) => void;
  setLookingAtZone: (zoneId: string | null) => void;

  // Terminal
  addLog: (message: string) => void;
  clearLogs: () => void;

  // Audio & Effects
  toggleAudio: () => void;
  setGlitchEffect: (enabled: boolean) => void;
  setMatrixRain: (enabled: boolean) => void;

  // Utility
  reset: () => void;
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState = {
  mode: "booting" as Mode,
  bootProgress: 0,

  classSession: {
    title: null,
    isActive: false,
    currentStep: 0,
    steps: [],
  },

  currentLesson: {
    id: null,
    title: null,
    currentSlide: 0,
  },
  focusMode: false,

  zones: [] as ZoneDefinition[],
  player: {
    position: { x: 0, y: 1.7, z: 5 },
    lookingAtZoneId: null,
  },

  logs: [] as string[],
  audioEnabled: true,

  glitchEffect: false,
  matrixRain: false,
};

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

const useAppStore = create<AppState>((set, get) => ({
  ...initialState,

  // Mode management
  setMode: (mode) => {
    set({ mode });
    get().addLog(`[MODE] Switched to ${mode}`);
  },

  incrementBootProgress: () => set((state) => ({
    bootProgress: Math.min(state.bootProgress + 1, 100)
  })),

  // Class session management
  startClassSession: (title, steps, zones) => {
    set({
      classSession: {
        title,
        isActive: true,
        currentStep: 0,
        steps
      },
      zones,
      mode: 'classroom'
    });
    get().addLog(`[CLASS] Started: ${title}`);
    get().addLog(`[CLASS] ${steps.length} steps in this session`);
  },

  endClassSession: () => {
    const { classSession } = get();
    set({
      classSession: {
        title: null,
        isActive: false,
        currentStep: 0,
        steps: []
      },
      mode: 'construct'
    });
    get().addLog(`[CLASS] Ended: ${classSession.title}`);
  },

  nextStep: () => {
    const { classSession } = get();
    if (classSession.isActive && classSession.currentStep < classSession.steps.length - 1) {
      set({
        classSession: {
          ...classSession,
          currentStep: classSession.currentStep + 1
        }
      });
      const nextStepText = classSession.steps[classSession.currentStep + 1];
      get().addLog(`[STEP ${classSession.currentStep + 2}/${classSession.steps.length}] ${nextStepText}`);
    }
  },

  previousStep: () => {
    const { classSession } = get();
    if (classSession.isActive && classSession.currentStep > 0) {
      set({
        classSession: {
          ...classSession,
          currentStep: classSession.currentStep - 1
        }
      });
      const prevStepText = classSession.steps[classSession.currentStep - 1];
      get().addLog(`[STEP ${classSession.currentStep}/${classSession.steps.length}] ${prevStepText}`);
    }
  },

  // Lesson management
  setCurrentLesson: (lesson) => {
    set({ currentLesson: lesson });
    if (lesson.id) {
      get().addLog(`[LESSON] Loaded: ${lesson.title}`);
    }
  },

  nextSlide: () => {
    const { currentLesson } = get();
    if (currentLesson.id) {
      set({
        currentLesson: {
          ...currentLesson,
          currentSlide: currentLesson.currentSlide + 1
        }
      });
      get().addLog(`[SLIDE] Advanced to slide ${currentLesson.currentSlide + 1}`);
    }
  },

  previousSlide: () => {
    const { currentLesson } = get();
    if (currentLesson.id && currentLesson.currentSlide > 0) {
      set({
        currentLesson: {
          ...currentLesson,
          currentSlide: currentLesson.currentSlide - 1
        }
      });
      get().addLog(`[SLIDE] Moved back to slide ${currentLesson.currentSlide - 1}`);
    }
  },

  setFocusMode: (enabled) => {
    set({ focusMode: enabled });
    get().addLog(`[FOCUS] ${enabled ? 'Enabled' : 'Disabled'}`);
  },

  // World management
  setZones: (zones) => set({ zones }),

  addZone: (zone) => set((state) => ({
    zones: [...state.zones, zone]
  })),

  setPlayerPosition: (position) => set((state) => ({
    player: { ...state.player, position }
  })),

  setLookingAtZone: (zoneId) => set((state) => ({
    player: { ...state.player, lookingAtZoneId: zoneId }
  })),

  // Terminal
  addLog: (message) => set((state) => ({
    logs: [...state.logs, message]
  })),

  clearLogs: () => set({ logs: [] }),

  // Audio & Effects
  toggleAudio: () => set((state) => ({
    audioEnabled: !state.audioEnabled
  })),

  setGlitchEffect: (enabled) => set({ glitchEffect: enabled }),

  setMatrixRain: (enabled) => set({ matrixRain: enabled }),

  // Utility
  reset: () => set(initialState),
}));

export default useAppStore;