import React, { useEffect } from 'react';
import useConstructStore from './store/useConstructStore';

// Components
import BootSequence from './components/boot/BootSequence';
import Terminal from './components/terminal/Terminal';
import ConstructEnvironment from './components/construct/ConstructEnvironment';
import AudioController from './components/audio/AudioController';
import GlitchEffect from './components/effects/GlitchEffect';
import MatrixCodeRain from './components/effects/MatrixCodeRain';

function App() {
  const { 
    state, 
    setGlitchEffect,
    setMatrixRain,
    setState
  } = useConstructStore();
  
  // Handle special states
  useEffect(() => {
    if (state === 'redpill') {
      // Activate glitch effect
      setGlitchEffect(true);
      
      // After a delay, show matrix code rain
      setTimeout(() => {
        setMatrixRain(true);
        
        // After another delay, return to terminal
        setTimeout(() => {
          setGlitchEffect(false);
          setMatrixRain(false);
          setState('terminal');
        }, 5000);
      }, 2000);
    }
    
    if (state === 'whiterabbit') {
      // Activate glitch effect
      setGlitchEffect(true);
      
      // After a delay, return to construct
      setTimeout(() => {
        setGlitchEffect(false);
        setState('construct');
      }, 3000);
    }
  }, [state, setGlitchEffect, setMatrixRain, setState]);
  
  // Render current state
  return (
    <div className="font-mono text-green-500">
      {/* Audio Controller (no visual component) */}
      <AudioController />
      
      {/* Visual effects */}
      <GlitchEffect />
      <MatrixCodeRain />
      
      {/* State-based UI */}
      {state === 'booting' && <BootSequence />}
      {state === 'terminal' && <Terminal />}
      {state === 'construct' && <ConstructEnvironment />}
      {state === 'redpill' && <div className="fixed inset-0 bg-black" />}
      {state === 'whiterabbit' && <div className="fixed inset-0 bg-black" />}
    </div>
  );
}

export default App;