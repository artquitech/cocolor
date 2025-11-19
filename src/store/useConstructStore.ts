import { create } from 'zustand';
import { socketService, OtherPlayerData as SocketOtherPlayerData } from '../lib/socket';

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

// Multiplayer types
export interface OtherPlayerData {
  id: string;
  name: string;
  position: { x: number; y: number; z: number };
  lookingAtZoneId?: string | null;
  currentLesson?: string | null;
  currentSlide?: number;
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

  // Multiplayer system
  multiplayer: {
    isConnected: boolean;
    roomId: string | null;
    playerName: string;
    isTeacher: boolean;
    otherPlayers: Map<string, OtherPlayerData>;
  };

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

  // Multiplayer management
  joinRoom: (roomId: string, playerName: string, isTeacher: boolean) => void;
  leaveRoom: () => void;
  updateOtherPlayer: (playerId: string, data: Partial<OtherPlayerData>) => void;
  removeOtherPlayer: (playerId: string) => void;
  setMultiplayerConnected: (connected: boolean) => void;

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

  multiplayer: {
    isConnected: false,
    roomId: null,
    playerName: 'Student',
    isTeacher: false,
    otherPlayers: new Map<string, OtherPlayerData>(),
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

      // Emit lesson load to server
      const { multiplayer } = get();
      if (multiplayer.isConnected && lesson.id && lesson.title) {
        socketService.emitLessonLoad({
          id: lesson.id,
          title: lesson.title,
          currentSlide: lesson.currentSlide
        });
      }
    }
  },

  nextSlide: () => {
    const { currentLesson, multiplayer } = get();
    if (currentLesson.id) {
      const newSlide = currentLesson.currentSlide + 1;
      set({
        currentLesson: {
          ...currentLesson,
          currentSlide: newSlide
        }
      });
      get().addLog(`[SLIDE] Advanced to slide ${newSlide + 1}`);

      // Emit slide change to server
      if (multiplayer.isConnected) {
        socketService.emitSlideChange(newSlide);

        // If teacher, broadcast to all students
        if (multiplayer.isTeacher) {
          socketService.teacherBroadcastSlide(newSlide);
        }
      }
    }
  },

  previousSlide: () => {
    const { currentLesson, multiplayer } = get();
    if (currentLesson.id && currentLesson.currentSlide > 0) {
      const newSlide = currentLesson.currentSlide - 1;
      set({
        currentLesson: {
          ...currentLesson,
          currentSlide: newSlide
        }
      });
      get().addLog(`[SLIDE] Moved back to slide ${newSlide + 1}`);

      // Emit slide change to server
      if (multiplayer.isConnected) {
        socketService.emitSlideChange(newSlide);

        // If teacher, broadcast to all students
        if (multiplayer.isTeacher) {
          socketService.teacherBroadcastSlide(newSlide);
        }
      }
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

  // Multiplayer management
  joinRoom: (roomId, playerName, isTeacher) => {
    const { player } = get();

    // Connect to socket if not already connected
    if (!socketService.isConnected()) {
      socketService.connect();
    }

    // Setup socket event handlers
    socketService.on({
      onConnect: () => {
        get().setMultiplayerConnected(true);
        get().addLog('[MULTIPLAYER] Connected to server');

        // Join the room after connection
        socketService.joinRoom(roomId, playerName, player.position);
      },

      onDisconnect: () => {
        get().setMultiplayerConnected(false);
        get().addLog('[MULTIPLAYER] Disconnected from server');
      },

      onRoomPlayers: (players) => {
        // Add all existing players in the room
        players.forEach(p => {
          get().updateOtherPlayer(p.id, p);
        });
        get().addLog(`[ROOM] ${players.length} other player(s) in room`);
      },

      onPlayerJoined: (player) => {
        get().updateOtherPlayer(player.id, player);
        get().addLog(`[ROOM] ${player.name} joined`);
      },

      onPlayerLeft: (data) => {
        get().removeOtherPlayer(data.id);
        get().addLog(`[ROOM] ${data.name} left`);
      },

      onPlayerMoved: (data) => {
        get().updateOtherPlayer(data.id, { position: data.position });
      },

      onPlayerZoneUpdate: (data) => {
        get().updateOtherPlayer(data.id, { lookingAtZoneId: data.lookingAtZoneId });
      },

      onPlayerLessonUpdate: (data) => {
        get().updateOtherPlayer(data.id, {
          currentLesson: data.lessonId,
          currentSlide: data.currentSlide
        });
      },

      onPlayerSlideUpdate: (data) => {
        get().updateOtherPlayer(data.id, { currentSlide: data.currentSlide });
      },

      onTeacherLessonBroadcast: (lessonData) => {
        // Student receives teacher's lesson
        if (!get().multiplayer.isTeacher) {
          get().setCurrentLesson({
            id: lessonData.id,
            title: lessonData.title,
            currentSlide: lessonData.currentSlide
          });
          get().addLog('[TEACHER] Lesson broadcast received');
        }
      },

      onTeacherSlideBroadcast: (slideIndex) => {
        // Student receives teacher's slide change
        if (!get().multiplayer.isTeacher) {
          const { currentLesson } = get();
          get().setCurrentLesson({
            ...currentLesson,
            currentSlide: slideIndex
          });
          get().addLog(`[TEACHER] Slide changed to ${slideIndex + 1}`);
        }
      },

      onRoomInfo: (info) => {
        get().addLog(`[ROOM] ${info.playerCount} total player(s)`);
      },
    });

    // Update local state
    set((state) => ({
      multiplayer: {
        ...state.multiplayer,
        roomId,
        playerName,
        isTeacher,
      }
    }));

    get().addLog(`[MULTIPLAYER] Joining room: ${roomId} as ${playerName}`);

    // If already connected, join immediately
    if (socketService.isConnected()) {
      socketService.joinRoom(roomId, playerName, player.position);
    }
  },

  leaveRoom: () => {
    socketService.disconnect();
    set((state) => ({
      multiplayer: {
        ...state.multiplayer,
        isConnected: false,
        roomId: null,
        otherPlayers: new Map(),
      }
    }));
    get().addLog('[MULTIPLAYER] Left room');
  },

  updateOtherPlayer: (playerId, data) => {
    set((state) => {
      const newOtherPlayers = new Map(state.multiplayer.otherPlayers);
      const existing = newOtherPlayers.get(playerId);

      if (existing) {
        // Update existing player
        newOtherPlayers.set(playerId, { ...existing, ...data });
      } else {
        // Add new player
        newOtherPlayers.set(playerId, data as OtherPlayerData);
      }

      return {
        multiplayer: {
          ...state.multiplayer,
          otherPlayers: newOtherPlayers,
        }
      };
    });
  },

  removeOtherPlayer: (playerId) => {
    set((state) => {
      const newOtherPlayers = new Map(state.multiplayer.otherPlayers);
      newOtherPlayers.delete(playerId);

      return {
        multiplayer: {
          ...state.multiplayer,
          otherPlayers: newOtherPlayers,
        }
      };
    });
  },

  setMultiplayerConnected: (connected) => {
    set((state) => ({
      multiplayer: {
        ...state.multiplayer,
        isConnected: connected,
      }
    }));
  },

  // Utility
  reset: () => set(initialState),
}));

export default useAppStore;