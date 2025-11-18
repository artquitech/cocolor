import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Environment,
  PerspectiveCamera,
} from '@react-three/drei';
import useAppStore from '../../store/useConstructStore';
import Grid from './Grid';
import LessonPanel from '../lesson/LessonPanel';
import Zone from '../zones/Zone';
import PlayerController from '../player/PlayerController';
import PlayerAvatar from '../player/PlayerAvatar';
import ClassHUD from '../ui/ClassHUD';
import { Terminal as TerminalIcon, Volume2, VolumeX } from 'lucide-react';

const ConstructEnvironment: React.FC = () => {
  const {
    mode,
    setMode,
    audioEnabled,
    toggleAudio,
    currentLesson,
    focusMode,
    zones,
    setZones,
    player,
    setCurrentLesson
  } = useAppStore();
  const [showWelcome, setShowWelcome] = useState(false);

  // Initialize zones when entering construct for the first time
  useEffect(() => {
    if (zones.length === 0) {
      // Create initial zones
      const initialZones = [
        {
          id: 'zone_intro_ai',
          title: 'AI Introduction',
          position: { x: -5, y: 0, z: -3 },
          type: 'lesson' as const,
          payloadId: 'ai_intro_001'
        },
        {
          id: 'zone_demo_1',
          title: 'Demo Zone',
          position: { x: 5, y: 0, z: -3 },
          type: 'video' as const,
          payloadId: 'demo_video_001'
        },
        {
          id: 'zone_exercise_1',
          title: 'Practice Exercise',
          position: { x: 0, y: 0, z: -8 },
          type: 'exercise' as const,
          payloadId: 'exercise_001'
        }
      ];

      setZones(initialZones);
    }
  }, [zones.length, setZones]);

  useEffect(() => {
    // Show welcome message
    const timer = setTimeout(() => {
      setShowWelcome(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handle zone activation via 'E' key when near a zone
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'e' && player.lookingAtZoneId) {
        const zone = zones.find(z => z.id === player.lookingAtZoneId);
        if (zone && zone.type === 'lesson') {
          // Auto-load lesson from nearby zone
          const lessonId = zone.payloadId;
          setCurrentLesson({
            id: lessonId,
            title: zone.title,
            currentSlide: 0
          });
        }
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [player.lookingAtZoneId, zones, setCurrentLesson]);
  
  return (
    <div className="fixed inset-0 bg-white">
      {/* 3D Scene */}
      <Canvas shadows>
        <fog attach="fog" args={['#ffffff', 10, 50]} />
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize={1024}
        />

        {/* Camera */}
        <PerspectiveCamera makeDefault position={[player.position.x, player.position.y, player.position.z]} fov={60} />

        {/* Player Controller - handles WASD movement */}
        <PlayerController />

        {/* Environment */}
        <Environment preset="city" />

        {/* Base grid - the white void */}
        <Grid />

        {/* Player Avatar - Phase 4 */}
        <PlayerAvatar />

        {/* Zones - Phase 3 */}
        {zones.map((zone) => (
          <Zone
            key={zone.id}
            zone={zone}
            isPlayerNearby={player.lookingAtZoneId === zone.id}
          />
        ))}

        {/* Lesson Panel - Phase 2 */}
        <LessonPanel />
      </Canvas>

      {/* Class HUD - Phase 5 */}
      <ClassHUD />

      {/* Focus Mode Overlay */}
      {focusMode && (
        <div className="fixed inset-0 bg-black bg-opacity-60 pointer-events-none z-10 transition-opacity duration-300" />
      )}

      {/* UI Overlay */}
      <div className="fixed bottom-0 left-0 right-0 p-4 text-gray-900 font-mono z-20">
        {showWelcome && !currentLesson.id && !player.lookingAtZoneId && (
          <div className="p-4 bg-black bg-opacity-80 text-green-500 max-w-md mx-auto rounded-lg">
            <p className="mb-2 text-lg">Welcome to the Teaching Construct</p>
            <p className="text-sm mb-3">
              {mode === 'classroom'
                ? 'Class session active. Walk to zones to begin.'
                : 'Your 3D learning environment is ready.'}
            </p>
            <p className="text-xs text-green-400 mb-2">
              <strong>Controls:</strong> WASD or Arrow Keys to move
            </p>
            <p className="text-xs text-green-600">
              Walk near a zone and press E to activate
            </p>
          </div>
        )}

        {/* Zone proximity indicator */}
        {player.lookingAtZoneId && !currentLesson.id && (
          <div className="p-3 bg-black bg-opacity-90 text-green-500 max-w-sm mx-auto rounded-lg border border-green-700 animate-pulse">
            <p className="text-sm font-bold mb-1">
              {zones.find(z => z.id === player.lookingAtZoneId)?.title}
            </p>
            <p className="text-xs text-green-400">
              Press E to enter | Type "open zone {player.lookingAtZoneId}"
            </p>
          </div>
        )}

        {/* Lesson info when loaded */}
        {currentLesson.id && (
          <div className="p-3 bg-black bg-opacity-90 text-green-500 max-w-sm mx-auto rounded-lg border border-green-700">
            <p className="text-xs font-bold mb-1">{currentLesson.title}</p>
            <p className="text-xs text-green-400">
              Slide {currentLesson.currentSlide + 1} |
              {focusMode ? ' FOCUS MODE ON' : ' Use "focus on" to dim background'}
            </p>
          </div>
        )}
      </div>

      {/* Terminal Button */}
      <button
        onClick={() => setMode('idle')}
        className="fixed top-4 left-4 p-2 bg-black bg-opacity-80 text-green-500 rounded-full hover:bg-green-900 transition-colors"
        title="Return to Terminal"
      >
        <TerminalIcon size={24} />
      </button>

      {/* Audio Toggle */}
      <button
        onClick={toggleAudio}
        className="fixed top-4 right-4 p-2 bg-black bg-opacity-80 text-green-500 rounded-full hover:bg-green-900 transition-colors"
        title={audioEnabled ? "Mute Audio" : "Enable Audio"}
      >
        {audioEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>
    </div>
  );
};

export default ConstructEnvironment;