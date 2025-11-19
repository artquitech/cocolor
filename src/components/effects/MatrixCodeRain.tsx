import React, { useEffect, useRef } from 'react';
import useAppStore from '../../store/useConstructStore';

const MatrixCodeRain: React.FC = () => {
  const { matrixRain } = useAppStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!matrixRain || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Matrix rain characters
    const chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    // Matrix rain drops
    const drops: number[] = [];
    
    // Initialize drops at random x positions
    for (let i = 0; i < canvas.width / 20; i++) {
      drops[i] = Math.random() * -100;
    }
    
    const draw = () => {
      if (!ctx) return;
      
      // Add semi-transparent black rectangle on top to create fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#0F0'; // Matrix green
      ctx.font = '18px monospace';
      
      // Loop through drops and draw chars
      for (let i = 0; i < drops.length; i++) {
        // Get random character
        const char = chars[Math.floor(Math.random() * chars.length)];
        
        // Draw character
        ctx.fillText(char, i * 20, drops[i]);
        
        // Move drop down
        drops[i] += 20;
        
        // Reset drop to top with random delay if it exceeds canvas height
        if (drops[i] > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
      }
    };
    
    // Animation loop
    let animationId: number;
    const animate = () => {
      draw();
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [matrixRain]);
  
  if (!matrixRain) return null;
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-40"
    />
  );
};

export default MatrixCodeRain;