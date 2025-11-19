import React, { useEffect, useState } from 'react';
import useAppStore from '../../store/useConstructStore';
import TypingEffect from '../effects/TypingEffect';

const BootSequence: React.FC = () => {
  const { bootProgress, incrementBootProgress, setMode } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);

  const bootSteps = [
    "Initializing Teaching Construct...",
    "Loading educational modules...",
    "Establishing neural interface...",
    "Connecting to knowledge base...",
    "Preparing learning environment...",
    "Loading lesson system...",
    "Initializing zones...",
    "Establishing player controls...",
    "Ready to teach...",
  ];

  useEffect(() => {
    // Start boot sequence automatically
    const bootInterval = setInterval(() => {
      if (bootProgress < 100) {
        incrementBootProgress();
      } else {
        clearInterval(bootInterval);
        // Short delay before moving to idle/terminal
        setTimeout(() => {
          setMode('idle');
        }, 1000);
      }
    }, 100);

    return () => clearInterval(bootInterval);
  }, [bootProgress, incrementBootProgress, setMode]);
  
  // Advance to next boot step based on progress
  useEffect(() => {
    const stepSize = 100 / bootSteps.length;
    const currentStepIndex = Math.min(
      Math.floor(bootProgress / stepSize),
      bootSteps.length - 1
    );
    
    setCurrentStep(currentStepIndex);
  }, [bootProgress, bootSteps.length]);
  
  return (
    <div className="fixed inset-0 bg-black text-green-500 font-mono p-8 flex flex-col">
      <div className="mb-8">
        <div className="text-2xl mb-4">TEACHING CONSTRUCT SYSTEM</div>
        <div className="text-sm opacity-80">v2.0.0 - Educational Platform</div>
      </div>
      
      {/* Boot messages */}
      <div className="flex-1">
        {bootSteps.slice(0, currentStep + 1).map((step, index) => (
          <div key={index} className="mb-2">
            {index < currentStep ? (
              <div>
                <span className="mr-2">[OK]</span>
                {step}
              </div>
            ) : (
              <TypingEffect 
                text={`> ${step}`} 
                speed={30}
                glitchProbability={0.15}
              />
            )}
          </div>
        ))}
      </div>
      
      {/* Progress bar */}
      <div className="mt-auto">
        <div className="w-full bg-gray-800 h-2 mb-2">
          <div 
            className="bg-green-500 h-full transition-all duration-100"
            style={{ width: `${bootProgress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs">
          <span>LOADING CONSTRUCT</span>
          <span>{bootProgress}%</span>
        </div>
      </div>
    </div>
  );
};

export default BootSequence;