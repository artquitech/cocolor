import React, { useRef } from 'react';
import { Html } from '@react-three/drei';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import useAppStore from '../../store/useConstructStore';
import { getLessonById } from '../../data/lessons';

const LessonPanel: React.FC = () => {
  const {
    currentLesson,
    focusMode,
    nextSlide,
    previousSlide,
    setCurrentLesson
  } = useAppStore();

  // Don't render if no lesson is loaded
  if (!currentLesson.id) return null;

  const lesson = getLessonById(currentLesson.id);
  if (!lesson) return null;

  const currentSlideData = lesson.slides[currentLesson.currentSlide];
  const isFirstSlide = currentLesson.currentSlide === 0;
  const isLastSlide = currentLesson.currentSlide === lesson.slides.length - 1;

  const handleNext = () => {
    if (!isLastSlide) {
      nextSlide();
    }
  };

  const handlePrevious = () => {
    if (!isFirstSlide) {
      previousSlide();
    }
  };

  const handleClose = () => {
    setCurrentLesson({ id: null, title: null, currentSlide: 0 });
  };

  return (
    <Html
      position={[0, 1.5, -2]}
      transform
      occlude
      distanceFactor={1.5}
      style={{
        transition: 'all 0.3s ease',
        pointerEvents: 'auto'
      }}
    >
      <div
        className={`
          bg-black border-2 border-green-500 rounded-lg shadow-2xl
          ${focusMode ? 'w-[800px]' : 'w-[700px]'}
          ${focusMode ? 'opacity-100' : 'opacity-95'}
          font-mono text-green-500
        `}
        style={{
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Header */}
        <div className="bg-green-900 bg-opacity-30 px-4 py-3 border-b border-green-500 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-green-300">{lesson.title}</h2>
            <p className="text-xs text-green-600">
              Slide {currentLesson.currentSlide + 1} of {lesson.slides.length}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-green-800 rounded transition-colors"
            title="Close lesson"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className={`p-6 ${focusMode ? 'min-h-[500px]' : 'min-h-[400px]'}`}>
          {/* Slide content rendered as HTML */}
          <div
            className="prose prose-invert prose-green max-w-none"
            dangerouslySetInnerHTML={{ __html: currentSlideData.content }}
          />
        </div>

        {/* Footer Navigation */}
        <div className="bg-green-900 bg-opacity-30 px-4 py-3 border-t border-green-500 flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={isFirstSlide}
            className={`
              flex items-center gap-2 px-3 py-2 rounded transition-colors
              ${isFirstSlide
                ? 'opacity-30 cursor-not-allowed'
                : 'hover:bg-green-800 cursor-pointer'
              }
            `}
          >
            <ChevronLeft size={16} />
            <span className="text-sm">Previous</span>
          </button>

          <div className="text-xs text-green-600">
            <span className="font-bold">{currentSlideData.title}</span>
          </div>

          <button
            onClick={handleNext}
            disabled={isLastSlide}
            className={`
              flex items-center gap-2 px-3 py-2 rounded transition-colors
              ${isLastSlide
                ? 'opacity-30 cursor-not-allowed'
                : 'hover:bg-green-800 cursor-pointer'
              }
            `}
          >
            <span className="text-sm">Next</span>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Focus mode indicator */}
        {focusMode && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <div className="bg-green-500 text-black px-3 py-1 rounded-full text-xs font-bold animate-pulse">
              FOCUS MODE
            </div>
          </div>
        )}
      </div>
    </Html>
  );
};

export default LessonPanel;
