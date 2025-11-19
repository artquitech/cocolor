import React from 'react';
import useAppStore from '../../store/useConstructStore';
import { Check, Circle } from 'lucide-react';

const ClassHUD: React.FC = () => {
  const { classSession, mode } = useAppStore();

  // Don't show HUD if no class is active
  if (!classSession.isActive) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-30">
      <div className="bg-black bg-opacity-90 border-2 border-green-500 rounded-lg p-4 min-w-[400px] max-w-[600px]">
        {/* Class Title and Mode */}
        <div className="flex items-center justify-between mb-3 border-b border-green-700 pb-2">
          <div>
            <h3 className="text-green-400 font-bold text-sm">{classSession.title}</h3>
            <p className="text-green-600 text-xs">Mode: {mode.toUpperCase()}</p>
          </div>
          <div className="bg-green-900 bg-opacity-50 px-3 py-1 rounded">
            <span className="text-green-300 text-xs font-mono">
              STEP {classSession.currentStep + 1}/{classSession.steps.length}
            </span>
          </div>
        </div>

        {/* Current Step Highlight */}
        <div className="mb-3 p-2 bg-green-900 bg-opacity-30 rounded border-l-4 border-green-400">
          <p className="text-green-300 text-sm font-bold">
            {classSession.steps[classSession.currentStep]}
          </p>
        </div>

        {/* All Steps Progress */}
        <div className="space-y-1">
          {classSession.steps.map((step, index) => {
            const isComplete = index < classSession.currentStep;
            const isCurrent = index === classSession.currentStep;
            const isPending = index > classSession.currentStep;

            return (
              <div
                key={index}
                className={`
                  flex items-center gap-2 text-xs p-1 rounded
                  ${isCurrent ? 'bg-green-900 bg-opacity-30' : ''}
                `}
              >
                {/* Status Icon */}
                {isComplete && <Check size={14} className="text-green-500" />}
                {isCurrent && <Circle size={14} className="text-green-400 animate-pulse" />}
                {isPending && <Circle size={14} className="text-green-800" />}

                {/* Step Text */}
                <span
                  className={`
                    flex-1
                    ${isComplete ? 'text-green-600 line-through' : ''}
                    ${isCurrent ? 'text-green-300 font-bold' : ''}
                    ${isPending ? 'text-green-700' : ''}
                  `}
                >
                  {index + 1}. {step}
                </span>
              </div>
            );
          })}
        </div>

        {/* Navigation Hint */}
        <div className="mt-3 pt-2 border-t border-green-800 text-xs text-green-600 text-center">
          Use "next step" / "previous step" to navigate
        </div>
      </div>
    </div>
  );
};

export default ClassHUD;
