import React from 'react';
import useAppStore from './store/useConstructStore';

// Components
import BootSequence from './components/boot/BootSequence';
import Terminal from './components/terminal/Terminal';
import ConstructEnvironment from './components/construct/ConstructEnvironment';
import AudioController from './components/audio/AudioController';
import GlitchEffect from './components/effects/GlitchEffect';
import MatrixCodeRain from './components/effects/MatrixCodeRain';

function App() {
  const { mode } = useAppStore();

  // Render based on current mode
  return (
    <div className="font-mono text-green-500">
      {/* Audio Controller (no visual component) */}
      <AudioController />

      {/* Visual effects */}
      <GlitchEffect />
      <MatrixCodeRain />

      {/* Mode-based UI */}
      {mode === 'booting' && <BootSequence />}
      {mode === 'idle' && <Terminal />}
      {mode === 'construct' && <ConstructEnvironment />}
      {mode === 'classroom' && <ConstructEnvironment />}
    </div>
  );
}

export default App;