import { io, Socket } from 'socket.io-client';

// Socket.io client instance
let socket: Socket | null = null;

// Server URL - can be configured via environment variable
const SERVER_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

export interface OtherPlayerData {
  id: string;
  name: string;
  position: { x: number; y: number; z: number };
  lookingAtZoneId?: string | null;
  currentLesson?: string | null;
  currentSlide?: number;
}

export interface RoomInfo {
  roomId: string;
  playerCount: number;
}

export interface ChatMessage {
  id: string;
  name: string;
  message: string;
  timestamp: number;
}

// Socket event handlers type
export interface SocketEventHandlers {
  onRoomPlayers?: (players: OtherPlayerData[]) => void;
  onPlayerJoined?: (player: OtherPlayerData) => void;
  onPlayerLeft?: (data: { id: string; name: string }) => void;
  onPlayerMoved?: (data: { id: string; position: { x: number; y: number; z: number } }) => void;
  onPlayerZoneUpdate?: (data: { id: string; lookingAtZoneId: string | null }) => void;
  onPlayerLessonUpdate?: (data: { id: string; lessonId: string; lessonTitle: string; currentSlide: number }) => void;
  onPlayerSlideUpdate?: (data: { id: string; currentSlide: number }) => void;
  onTeacherLessonBroadcast?: (lessonData: any) => void;
  onTeacherSlideBroadcast?: (slideIndex: number) => void;
  onChatMessage?: (message: ChatMessage) => void;
  onRoomInfo?: (info: RoomInfo) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

class SocketService {
  private handlers: SocketEventHandlers = {};

  /**
   * Initialize socket connection
   */
  connect(): void {
    if (socket?.connected) {
      console.log('[SOCKET] Already connected');
      return;
    }

    socket = io(SERVER_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupEventListeners();
    console.log('[SOCKET] Connecting to', SERVER_URL);
  }

  /**
   * Disconnect from socket server
   */
  disconnect(): void {
    if (socket) {
      socket.disconnect();
      socket = null;
      console.log('[SOCKET] Disconnected');
    }
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return socket?.connected || false;
  }

  /**
   * Get socket ID
   */
  getSocketId(): string | null {
    return socket?.id || null;
  }

  /**
   * Setup event listeners for socket
   */
  private setupEventListeners(): void {
    if (!socket) return;

    // Connection events
    socket.on('connect', () => {
      console.log('[SOCKET] Connected with ID:', socket?.id);
      this.handlers.onConnect?.();
    });

    socket.on('disconnect', () => {
      console.log('[SOCKET] Disconnected');
      this.handlers.onDisconnect?.();
    });

    socket.on('connect_error', (error) => {
      console.error('[SOCKET] Connection error:', error);
      this.handlers.onError?.(error);
    });

    // Room events
    socket.on('room-players', (players: OtherPlayerData[]) => {
      console.log('[SOCKET] Received room players:', players);
      this.handlers.onRoomPlayers?.(players);
    });

    socket.on('room-info', (info: RoomInfo) => {
      console.log('[SOCKET] Room info:', info);
      this.handlers.onRoomInfo?.(info);
    });

    // Player events
    socket.on('player-joined', (player: OtherPlayerData) => {
      console.log('[SOCKET] Player joined:', player);
      this.handlers.onPlayerJoined?.(player);
    });

    socket.on('player-left', (data: { id: string; name: string }) => {
      console.log('[SOCKET] Player left:', data);
      this.handlers.onPlayerLeft?.(data);
    });

    socket.on('player-moved', (data: { id: string; position: { x: number; y: number; z: number } }) => {
      this.handlers.onPlayerMoved?.(data);
    });

    socket.on('player-zone-update', (data: { id: string; lookingAtZoneId: string | null }) => {
      this.handlers.onPlayerZoneUpdate?.(data);
    });

    // Lesson events
    socket.on('player-lesson-update', (data: { id: string; lessonId: string; lessonTitle: string; currentSlide: number }) => {
      console.log('[SOCKET] Player lesson update:', data);
      this.handlers.onPlayerLessonUpdate?.(data);
    });

    socket.on('player-slide-update', (data: { id: string; currentSlide: number }) => {
      this.handlers.onPlayerSlideUpdate?.(data);
    });

    // Teacher broadcast events
    socket.on('teacher-lesson-broadcast', (lessonData: any) => {
      console.log('[SOCKET] Teacher lesson broadcast:', lessonData);
      this.handlers.onTeacherLessonBroadcast?.(lessonData);
    });

    socket.on('teacher-slide-broadcast', (slideIndex: number) => {
      console.log('[SOCKET] Teacher slide broadcast:', slideIndex);
      this.handlers.onTeacherSlideBroadcast?.(slideIndex);
    });

    // Chat events
    socket.on('chat-message', (message: ChatMessage) => {
      console.log('[SOCKET] Chat message:', message);
      this.handlers.onChatMessage?.(message);
    });
  }

  /**
   * Register event handlers
   */
  on(handlers: SocketEventHandlers): void {
    this.handlers = { ...this.handlers, ...handlers };
  }

  /**
   * Join a room (class session)
   */
  joinRoom(roomId: string, playerName: string, position: { x: number; y: number; z: number }): void {
    if (!socket?.connected) {
      console.error('[SOCKET] Cannot join room - not connected');
      return;
    }

    socket.emit('join-room', { roomId, playerName, position });
    console.log('[SOCKET] Joining room:', roomId, 'as', playerName);
  }

  /**
   * Emit player position update
   */
  emitPlayerMove(position: { x: number; y: number; z: number }): void {
    if (!socket?.connected) return;
    socket.emit('player-move', position);
  }

  /**
   * Emit player looking at zone
   */
  emitLookingAtZone(zoneId: string | null): void {
    if (!socket?.connected) return;
    socket.emit('player-looking-at-zone', zoneId);
  }

  /**
   * Emit lesson load
   */
  emitLessonLoad(lessonData: { id: string; title: string; currentSlide: number }): void {
    if (!socket?.connected) return;
    socket.emit('lesson-load', lessonData);
    console.log('[SOCKET] Emitting lesson load:', lessonData);
  }

  /**
   * Emit slide change
   */
  emitSlideChange(slideIndex: number): void {
    if (!socket?.connected) return;
    socket.emit('slide-change', slideIndex);
  }

  /**
   * Teacher broadcasts lesson to all students
   */
  teacherBroadcastLesson(lessonData: { id: string; title: string; currentSlide: number }): void {
    if (!socket?.connected) return;
    socket.emit('teacher-broadcast-lesson', lessonData);
    console.log('[SOCKET] Teacher broadcasting lesson:', lessonData);
  }

  /**
   * Teacher broadcasts slide change to all students
   */
  teacherBroadcastSlide(slideIndex: number): void {
    if (!socket?.connected) return;
    socket.emit('teacher-broadcast-slide', slideIndex);
    console.log('[SOCKET] Teacher broadcasting slide:', slideIndex);
  }

  /**
   * Send chat message
   */
  sendChatMessage(message: string): void {
    if (!socket?.connected) return;
    socket.emit('chat-message', message);
  }
}

// Export singleton instance
export const socketService = new SocketService();
