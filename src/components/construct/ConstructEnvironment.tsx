import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from '@react-three/drei';
import useAppStore from '../../store/useConstructStore';
import Grid from './Grid';
import { Terminal as TerminalIcon, Volume2, VolumeX } from 'lucide-react';

const ConstructEnvironment: React.FC = () => {
  const {
    mode,
    setMode,
    audioEnabled,
    toggleAudio
  } = useAppStore();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Show welcome message
    const timer = setTimeout(() => {
      setShowWelcome(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  
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
        <PerspectiveCamera makeDefault position={[0, 1.7, 5]} fov={60} />
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          maxPolarAngle={Math.PI / 2 - 0.1}
          minDistance={2}
          maxDistance={20}
        />

        {/* Environment */}
        <Environment preset="city" />

        {/* Base grid - the white void */}
        <Grid />

        {/* Zones and content will be added in Phase 3 */}
      </Canvas>

      {/* UI Overlay */}
      <div className="fixed bottom-0 left-0 right-0 p-4 text-gray-900 font-mono">
        {showWelcome && (
          <div className="p-4 bg-black bg-opacity-80 text-green-500 max-w-md mx-auto rounded-lg">
            <p className="mb-2 text-lg">Welcome to the Teaching Construct</p>
            <p className="text-sm mb-3">
              {mode === 'classroom'
                ? 'Class session active. Zones and lessons will appear here.'
                : 'This is your 3D learning environment.'}
            </p>
            <p className="text-xs text-green-400">
              Phase 2 will add lessons and zones. Phase 3 will add player movement.
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