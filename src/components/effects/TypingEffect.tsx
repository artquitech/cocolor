import React, { useEffect, useState, useRef } from 'react';

interface TypingEffectProps {
  text: string;
  speed?: number;
  glitchProbability?: number;
  onComplete?: () => void;
  className?: string;
}

const TypingEffect: React.FC<TypingEffectProps> = ({
  text,
  speed = 50,
  glitchProbability = 0.1,
  onComplete,
  className = '',
}) => {
  const [displayText, setDisplayText] = useState('');
  const [cursor, setCursor] = useState(true);
  const currentIndex = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Character glitch effect
  const getGlitchChar = () => {
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/\\~`';
    return glitchChars[Math.floor(Math.random() * glitchChars.length)];
  };
  
  useEffect(() => {
    // Reset typing when text changes
    currentIndex.current = 0;
    setDisplayText('');
    
    const typeNextChar = () => {
      // Check if global typing sound function exists
      if (typeof window.playTypeSound === 'function') {
        // Only play sound every 3 characters to avoid too many sounds
        if (currentIndex.current % 3 === 0) {
          window.playTypeSound();
        }
      }
      
      // Determine if we should insert a glitch
      const shouldGlitch = Math.random() < glitchProbability;
      
      if (shouldGlitch) {
        // Insert a glitch character that will be replaced after a short time
        const glitchChar = getGlitchChar();
        setDisplayText(prev => prev + glitchChar);
        
        // Replace glitch after a short delay
        setTimeout(() => {
          setDisplayText(prev => prev.slice(0, -1) + text[currentIndex.current]);
          currentIndex.current += 1;
          
          if (currentIndex.current < text.length) {
            const nextSpeed = speed + Math.random() * speed;
            timeoutRef.current = setTimeout(typeNextChar, nextSpeed);
          } else {
            // Typing complete
            onComplete?.();
          }
        }, 100);
      } else {
        // Normal typing
        setDisplayText(prev => prev + text[currentIndex.current]);
        currentIndex.current += 1;
        
        if (currentIndex.current < text.length) {
          const nextSpeed = speed + Math.random() * speed;
          timeoutRef.current = setTimeout(typeNextChar, nextSpeed);
        } else {
          // Typing complete
          onComplete?.();
        }
      }
    };
    
    // Start typing effect
    timeoutRef.current = setTimeout(typeNextChar, speed);
    
    // Cursor blinking effect
    const cursorInterval = setInterval(() => {
      setCursor(prev => !prev);
    }, 500);
    
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      clearInterval(cursorInterval);
    };
  }, [text, speed, glitchProbability, onComplete]);
  
  return (
    <div className={`font-mono whitespace-pre-wrap ${className}`}>
      {displayText}
      <span className={`${cursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>_</span>
    </div>
  );
};

export default TypingEffect;