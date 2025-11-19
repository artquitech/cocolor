import React, { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import useAppStore from '../../store/useConstructStore';

const AudioController: React.FC = () => {
  const { mode, audioEnabled } = useAppStore();
  const ambientRef = useRef<Howl | null>(null);
  const effectsRef = useRef<Record<string, Howl>>({});

  // Initialize sounds
  useEffect(() => {
    // Ambient background hum
    ambientRef.current = new Howl({
      src: ['https://assets.codepen.io/217233/ambienthum.mp3'],
      loop: true,
      volume: 0.2,
      autoplay: false,
    });

    // Sound effects
    effectsRef.current = {
      boot: new Howl({
        src: ['https://assets.codepen.io/217233/boot.mp3'],
        volume: 0.5,
      }),
      type: new Howl({
        src: ['https://assets.codepen.io/217233/keystroke.mp3'],
        volume: 0.2,
      }),
      glitch: new Howl({
        src: ['https://assets.codepen.io/217233/glitch.mp3'],
        volume: 0.4,
      }),
      load: new Howl({
        src: ['https://assets.codepen.io/217233/teleport.mp3'],
        volume: 0.5,
      }),
      morpheus: new Howl({
        src: ['https://cdn.freesound.org/previews/411/411090_5121236-lq.mp3'],
        volume: 0.7,
      }),
    };

    return () => {
      // Cleanup sounds
      if (ambientRef.current) {
        ambientRef.current.stop();
      }
      Object.values(effectsRef.current).forEach(sound => sound.stop());
    };
  }, []);

  // Control ambient sound based on mode
  useEffect(() => {
    if (!ambientRef.current) return;

    if (audioEnabled && (mode === 'construct' || mode === 'classroom' || mode === 'idle')) {
      ambientRef.current.play();
    } else {
      ambientRef.current.pause();
    }
  }, [mode, audioEnabled]);

  // Play sound effects based on mode changes
  useEffect(() => {
    if (!audioEnabled || !effectsRef.current) return;

    if (mode === 'booting') {
      effectsRef.current.boot.play();
    } else if (mode === 'construct' || mode === 'classroom') {
      effectsRef.current.load.play();
    }
  }, [mode, audioEnabled]);

  // Helper function to play typing sound (exposed to window for global access)
  useEffect(() => {
    if (!effectsRef.current) return;
    
    // @ts-ignore - Add to window for global access
    window.playTypeSound = () => {
      if (audioEnabled) {
        effectsRef.current.type.play();
      }
    };
    
    return () => {
      // @ts-ignore - Clean up
      delete window.playTypeSound;
    };
  }, [audioEnabled]);

  return null; // Audio controller has no visual component
};

export default AudioController;