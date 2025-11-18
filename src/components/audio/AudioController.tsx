import React, { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import useConstructStore from '../../store/useConstructStore';

const AudioController: React.FC = () => {
  const { state, environment, audioEnabled } = useConstructStore();
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

  // Control ambient sound based on state
  useEffect(() => {
    if (!ambientRef.current) return;

    if (audioEnabled && (state === 'construct' || state === 'terminal')) {
      ambientRef.current.play();
    } else {
      ambientRef.current.pause();
    }
  }, [state, audioEnabled]);

  // Play sound effects based on state changes
  useEffect(() => {
    if (!audioEnabled || !effectsRef.current) return;

    if (state === 'booting') {
      effectsRef.current.boot.play();
    } else if (state === 'redpill' || state === 'whiterabbit') {
      effectsRef.current.glitch.play();
    }
  }, [state, audioEnabled]);

  // Play sound when environment changes
  useEffect(() => {
    if (!audioEnabled || !effectsRef.current) return;
    
    if (environment !== 'void' && state === 'construct') {
      effectsRef.current.load.play();
      
      // Play Morpheus voice line when entering construct
      if (environment === 'void') {
        setTimeout(() => {
          effectsRef.current.morpheus?.play();
        }, 1000);
      }
    }
  }, [environment, state, audioEnabled]);

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