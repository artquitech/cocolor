const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST"]
  }
});

// Store active players and rooms
const players = new Map(); // socketId -> player data
const rooms = new Map(); // roomId -> Set of socketIds

// Player connection
io.on('connection', (socket) => {
  console.log(`[CONNECT] Player connected: ${socket.id}`);

  // Player joins a room (class session)
  socket.on('join-room', (data) => {
    const { roomId, playerName, position } = data;

    // Leave previous rooms
    Array.from(socket.rooms).forEach(room => {
      if (room !== socket.id) {
        socket.leave(room);
      }
    });

    // Join new room
    socket.join(roomId);

    // Initialize or get room
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    rooms.get(roomId).add(socket.id);

    // Store player data
    players.set(socket.id, {
      id: socket.id,
      name: playerName || 'Student',
      position: position || { x: 0, y: 1.7, z: 5 },
      roomId,
      currentLesson: null,
      currentSlide: 0
    });

    console.log(`[JOIN] ${playerName} joined room: ${roomId}`);

    // Send current players in room to new player
    const playersInRoom = [];
    rooms.get(roomId).forEach(playerId => {
      if (playerId !== socket.id && players.has(playerId)) {
        playersInRoom.push(players.get(playerId));
      }
    });

    socket.emit('room-players', playersInRoom);

    // Notify others in room about new player
    socket.to(roomId).emit('player-joined', players.get(socket.id));

    // Send room info
    socket.emit('room-info', {
      roomId,
      playerCount: rooms.get(roomId).size
    });
  });

  // Player position update
  socket.on('player-move', (position) => {
    if (players.has(socket.id)) {
      const player = players.get(socket.id);
      player.position = position;

      // Broadcast to room
      if (player.roomId) {
        socket.to(player.roomId).emit('player-moved', {
          id: socket.id,
          position
        });
      }
    }
  });

  // Player looking at zone
  socket.on('player-looking-at-zone', (zoneId) => {
    if (players.has(socket.id)) {
      const player = players.get(socket.id);
      player.lookingAtZoneId = zoneId;

      if (player.roomId) {
        socket.to(player.roomId).emit('player-zone-update', {
          id: socket.id,
          lookingAtZoneId: zoneId
        });
      }
    }
  });

  // Lesson state sync
  socket.on('lesson-load', (lessonData) => {
    if (players.has(socket.id)) {
      const player = players.get(socket.id);
      player.currentLesson = lessonData.id;
      player.currentSlide = lessonData.currentSlide || 0;

      if (player.roomId) {
        socket.to(player.roomId).emit('player-lesson-update', {
          id: socket.id,
          lessonId: lessonData.id,
          lessonTitle: lessonData.title,
          currentSlide: lessonData.currentSlide
        });
      }
    }
  });

  // Slide navigation sync
  socket.on('slide-change', (slideIndex) => {
    if (players.has(socket.id)) {
      const player = players.get(socket.id);
      player.currentSlide = slideIndex;

      if (player.roomId) {
        socket.to(player.roomId).emit('player-slide-update', {
          id: socket.id,
          currentSlide: slideIndex
        });
      }
    }
  });

  // Teacher broadcasts lesson to all students
  socket.on('teacher-broadcast-lesson', (lessonData) => {
    if (players.has(socket.id)) {
      const player = players.get(socket.id);

      if (player.roomId) {
        console.log(`[BROADCAST] Teacher broadcasting lesson in room: ${player.roomId}`);
        socket.to(player.roomId).emit('teacher-lesson-broadcast', lessonData);
      }
    }
  });

  // Teacher broadcasts slide change to all students
  socket.on('teacher-broadcast-slide', (slideIndex) => {
    if (players.has(socket.id)) {
      const player = players.get(socket.id);

      if (player.roomId) {
        console.log(`[BROADCAST] Teacher changing slide to ${slideIndex} in room: ${player.roomId}`);
        socket.to(player.roomId).emit('teacher-slide-broadcast', slideIndex);
      }
    }
  });

  // Chat message
  socket.on('chat-message', (message) => {
    if (players.has(socket.id)) {
      const player = players.get(socket.id);

      if (player.roomId) {
        io.to(player.roomId).emit('chat-message', {
          id: socket.id,
          name: player.name,
          message,
          timestamp: Date.now()
        });
      }
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`[DISCONNECT] Player disconnected: ${socket.id}`);

    if (players.has(socket.id)) {
      const player = players.get(socket.id);

      // Notify room
      if (player.roomId) {
        socket.to(player.roomId).emit('player-left', {
          id: socket.id,
          name: player.name
        });

        // Remove from room
        if (rooms.has(player.roomId)) {
          rooms.get(player.roomId).delete(socket.id);

          // Delete empty rooms
          if (rooms.get(player.roomId).size === 0) {
            rooms.delete(player.roomId);
          }
        }
      }

      // Remove player
      players.delete(socket.id);
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    players: players.size,
    rooms: rooms.size
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`\n🚀 Teaching Construct Multiplayer Server`);
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`👥 Ready for connections\n`);
});
