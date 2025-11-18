import React, { useEffect, useState } from 'react';
import useConstructStore from '../../store/useConstructStore';

const GlitchEffect: React.FC = () => {
  const { glitchEffect } = useConstructStore();
  const [intensity, setIntensity] = useState(0);

  // Randomize glitch effect intensity
  useEffect(() => {
    if (!glitchEffect) {
      setIntensity(0);
      return;
    }

    let interval: number;
    
    // Create flickering effect
    const animateGlitch = () => {
      interval = setInterval(() => {
        setIntensity(Math.random() * 20);
      }, 100);
    };
    
    animateGlitch();
    
    return () => {
      clearInterval(interval);
    };
  }, [glitchEffect]);

  if (!glitchEffect) return null;

  // Generate random clip props
  const getClipStyle = () => {
    const skew = Math.random() * 20 - 10;
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    
    return {
      clipPath: `polygon(0 ${top}%, 100% ${top + skew}%, 100% ${top + 10 + skew}%, 0 ${top + 10}%)`,
      left: `${left}%`,
      filter: `hue-rotate(${Math.random() * 360}deg) saturate(${Math.random() * 10})`,
      opacity: Math.random() * 0.8 + 0.2,
    };
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Main glitch overlay */}
      <div 
        className="absolute inset-0 bg-white"
        style={{ 
          mixBlendMode: 'difference',
          opacity: intensity * 0.05,
          transform: `translate(${Math.random() * intensity - intensity/2}px, ${Math.random() * intensity - intensity/2}px)`,
        }}
      />
      
      {/* Horizontal lines */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div 
          key={`h-${i}`}
          className="absolute bg-green-500"
          style={{
            ...getClipStyle(),
            height: '100%',
            width: '100%',
            transform: `translateX(${Math.random() * intensity * 2 - intensity}px)`,
          }}
        />
      ))}
      
      {/* RGB split */}
      {intensity > 10 && (
        <>
          <div className="absolute inset-0 bg-red-500 opacity-50 mix-blend-screen" 
            style={{ transform: `translateX(${-intensity/2}px)` }} 
          />
          <div className="absolute inset-0 bg-blue-500 opacity-50 mix-blend-screen" 
            style={{ transform: `translateX(${intensity/2}px)` }} 
          />
        </>
      )}
    </div>
  );
};

export default GlitchEffect;