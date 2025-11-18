import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  Environment, 
  OrbitControls, 
  PerspectiveCamera, 
  useTexture 
} from '@react-three/drei';
import * as THREE from 'three';
import useConstructStore from '../../store/useConstructStore';
import Grid from './Grid';
import WeaponsRack from './WeaponsRack';
import TrainingProgram from './TrainingProgram';
import CitySimulation from './CitySimulation';
import { Terminal as TerminalIcon, Volume2, VolumeX } from 'lucide-react';

const ConstructEnvironment: React.FC = () => {
  const { 
    environment, 
    executeCommand, 
    setState, 
    audioEnabled, 
    toggleAudio 
  } = useConstructStore();
  const [showCommands, setShowCommands] = useState(false);
  
  useEffect(() => {
    // Show welcome message
    const timer = setTimeout(() => {
      setShowCommands(true);
    }, 2000);
    
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
        
        {/* Base grid */}
        <Grid />
        
        {/* Current environment */}
        {environment === 'weapons' && <WeaponsRack />}
        {environment === 'training' && <TrainingProgram />}
        {environment === 'city' && <CitySimulation />}
      </Canvas>
      
      {/* UI Overlay */}
      <div className="fixed bottom-0 left-0 right-0 p-4 text-gray-900 font-mono">
        {showCommands && (
          <div className="p-4 bg-black bg-opacity-80 text-green-500 max-w-md mx-auto rounded-lg">
            <p className="mb-2">This is the Construct. It's our loading program.</p>
            {environment === 'void' ? (
              <p>Type commands to load environments:</p>
            ) : (
              <p>Current environment: {environment}</p>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
              <button 
                onClick={() => executeCommand('load weapons')} 
                className="px-3 py-1 bg-black border border-green-500 text-green-500 rounded hover:bg-green-900"
              >
                Load Weapons
              </button>
              <button 
                onClick={() => executeCommand('load training')} 
                className="px-3 py-1 bg-black border border-green-500 text-green-500 rounded hover:bg-green-900"
              >
                Load Training
              </button>
              <button 
                onClick={() => executeCommand('load city')} 
                className="px-3 py-1 bg-black border border-green-500 text-green-500 rounded hover:bg-green-900"
              >
                Load City
              </button>
              <button 
                onClick={() => executeCommand('exit construct')} 
                className="px-3 py-1 bg-black border border-green-500 text-green-500 rounded hover:bg-green-900"
              >
                Exit Construct
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Terminal Button */}
      <button 
        onClick={() => setState('terminal')}
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