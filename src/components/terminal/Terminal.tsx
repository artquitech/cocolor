import React, { useState, useEffect, useRef } from 'react';
import useAppStore from '../../store/useConstructStore';
import TypingEffect from '../effects/TypingEffect';
import { getLessonById, getLessonList } from '../../data/lessons';

const Terminal: React.FC = () => {
  const {
    logs,
    addLog,
    setMode,
    setCurrentLesson,
    currentLesson,
    nextSlide,
    previousSlide,
    setFocusMode,
    clearLogs,
    zones
  } = useAppStore();

  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial intro message
  useEffect(() => {
    const welcomeMessage = [
      "==== TEACHING CONSTRUCT TERMINAL ====",
      "An immersive platform for interactive learning",
      "",
      "Type 'help' for available commands.",
      ""
    ];

    let delay = 300;
    welcomeMessage.forEach((line) => {
      setTimeout(() => {
        addLog(line);
      }, delay);
      delay += 300;
    });
  }, [addLog]);
  
  // Auto-scroll terminal to bottom when new lines are added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);
  
  // Focus input on load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (inputValue.trim() === '') return;

    // Display input in terminal
    addLog(`> ${inputValue}`);

    // Process command
    setIsProcessing(true);
    setTimeout(() => {
      processCommand(inputValue.trim().toLowerCase());
      setInputValue('');
      setIsProcessing(false);
    }, 500);
  };

  const processCommand = (cmd: string) => {
    // Parse command and arguments
    const parts = cmd.split(' ');
    const mainCmd = parts[0];
    const args = parts.slice(1).join(' ');

    // HELP
    if (cmd === 'help') {
      addLog('Available commands:');
      addLog('');
      addLog('Navigation:');
      addLog('  enter construct - Enter the 3D teaching environment');
      addLog('  clear - Clear terminal');
      addLog('');
      addLog('Zones (in Construct):');
      addLog('  list zones - Show all zones in the world');
      addLog('  open zone <id> - Open/activate a zone');
      addLog('  Movement: WASD or Arrow Keys');
      addLog('');
      addLog('Lessons:');
      addLog('  list lessons - Show available lessons');
      addLog('  load lesson <id> - Load a specific lesson');
      addLog('  next slide - Advance to next slide');
      addLog('  previous slide - Go back to previous slide');
      addLog('  exit lesson - Close current lesson');
      addLog('');
      addLog('Display:');
      addLog('  focus on - Enable focus mode (dimmed background)');
      addLog('  focus off - Disable focus mode');
      return;
    }

    // CLEAR
    if (cmd === 'clear') {
      clearLogs();
      // Re-show welcome message
      setTimeout(() => {
        addLog("==== TEACHING CONSTRUCT TERMINAL ====");
        addLog("Terminal cleared. Type 'help' for commands.");
      }, 100);
      return;
    }

    // ENTER CONSTRUCT
    if (cmd === 'enter construct') {
      addLog('[OK] Initializing Teaching Construct...');
      setTimeout(() => {
        setMode('construct');
      }, 1000);
      return;
    }

    // LIST ZONES
    if (cmd === 'list zones') {
      if (zones.length === 0) {
        addLog('[INFO] No zones currently in the construct');
        addLog('Zones will be added when you start a class session');
        return;
      }

      addLog('Available Zones:');
      addLog('');
      zones.forEach(zone => {
        addLog(`  ${zone.id}`);
        addLog(`    ${zone.title}`);
        addLog(`    Type: ${zone.type}`);
        addLog(`    Position: (${zone.position.x.toFixed(1)}, ${zone.position.z.toFixed(1)})`);
        addLog('');
      });
      return;
    }

    // OPEN ZONE
    if (mainCmd === 'open' && parts[1] === 'zone') {
      const zoneId = parts.slice(2).join(' ');
      if (!zoneId) {
        addLog('[ERROR] Please specify a zone ID');
        addLog('Usage: open zone <id>');
        addLog("Try 'list zones' to see available zones");
        return;
      }

      const zone = zones.find(z => z.id === zoneId);
      if (!zone) {
        addLog(`[ERROR] Zone '${zoneId}' not found`);
        addLog("Try 'list zones' to see available zones");
        return;
      }

      addLog(`[OK] Entering zone: ${zone.title}`);

      // Handle different zone types
      if (zone.type === 'lesson') {
        const lesson = getLessonById(zone.payloadId);
        if (lesson) {
          setCurrentLesson({
            id: lesson.id,
            title: lesson.title,
            currentSlide: 0
          });
          addLog(`[OK] Loaded lesson from zone: ${lesson.title}`);
        } else {
          addLog(`[ERROR] Lesson '${zone.payloadId}' not found`);
        }
      } else if (zone.type === 'video') {
        addLog(`[INFO] Video zones not yet implemented`);
        addLog(`Will play video: ${zone.payloadId}`);
      } else if (zone.type === 'image') {
        addLog(`[INFO] Image zones not yet implemented`);
        addLog(`Will display image: ${zone.payloadId}`);
      } else if (zone.type === 'exercise') {
        addLog(`[INFO] Exercise zones not yet implemented`);
        addLog(`Will load exercise: ${zone.payloadId}`);
      }

      return;
    }

    // LIST LESSONS
    if (cmd === 'list lessons') {
      addLog('Available Lessons:');
      addLog('');
      const lessons = getLessonList();
      lessons.forEach(lesson => {
        addLog(`  ${lesson.id}`);
        addLog(`    ${lesson.title}`);
        addLog(`    ${lesson.description}`);
        addLog('');
      });
      return;
    }

    // LOAD LESSON
    if (mainCmd === 'load' && parts[1] === 'lesson') {
      const lessonId = parts.slice(2).join(' ');
      if (!lessonId) {
        addLog('[ERROR] Please specify a lesson ID');
        addLog('Usage: load lesson <id>');
        addLog("Try 'list lessons' to see available lessons");
        return;
      }

      const lesson = getLessonById(lessonId);
      if (!lesson) {
        addLog(`[ERROR] Lesson '${lessonId}' not found`);
        addLog("Try 'list lessons' to see available lessons");
        return;
      }

      setCurrentLesson({
        id: lesson.id,
        title: lesson.title,
        currentSlide: 0
      });
      addLog(`[OK] Loaded lesson: ${lesson.title}`);
      addLog(`[INFO] ${lesson.slides.length} slides available`);
      addLog("Use 'next slide' to begin, or 'enter construct' to view in 3D");
      return;
    }

    // NEXT SLIDE
    if (cmd === 'next slide') {
      if (!currentLesson.id) {
        addLog('[ERROR] No lesson loaded');
        addLog("Use 'load lesson <id>' first");
        return;
      }

      const lesson = getLessonById(currentLesson.id);
      if (!lesson) {
        addLog('[ERROR] Current lesson data not found');
        return;
      }

      if (currentLesson.currentSlide >= lesson.slides.length - 1) {
        addLog('[INFO] Already at last slide');
        return;
      }

      nextSlide();
      const newSlideNum = currentLesson.currentSlide + 1;
      addLog(`[SLIDE ${newSlideNum + 1}/${lesson.slides.length}] ${lesson.slides[newSlideNum].title}`);
      return;
    }

    // PREVIOUS SLIDE
    if (cmd === 'previous slide') {
      if (!currentLesson.id) {
        addLog('[ERROR] No lesson loaded');
        addLog("Use 'load lesson <id>' first");
        return;
      }

      if (currentLesson.currentSlide <= 0) {
        addLog('[INFO] Already at first slide');
        return;
      }

      previousSlide();
      const lesson = getLessonById(currentLesson.id);
      if (lesson) {
        const newSlideNum = currentLesson.currentSlide - 1;
        addLog(`[SLIDE ${newSlideNum + 1}/${lesson.slides.length}] ${lesson.slides[newSlideNum].title}`);
      }
      return;
    }

    // EXIT LESSON
    if (cmd === 'exit lesson') {
      if (!currentLesson.id) {
        addLog('[INFO] No lesson currently loaded');
        return;
      }

      const lessonTitle = currentLesson.title;
      setCurrentLesson({ id: null, title: null, currentSlide: 0 });
      addLog(`[OK] Exited lesson: ${lessonTitle}`);
      return;
    }

    // FOCUS MODE
    if (cmd === 'focus on') {
      setFocusMode(true);
      return;
    }

    if (cmd === 'focus off') {
      setFocusMode(false);
      return;
    }

    // Unknown command
    addLog(`Command not recognized: ${cmd}`);
    addLog("Type 'help' for available commands.");
  };
  
  return (
    <div className="fixed inset-0 bg-black text-green-500 font-mono p-4 flex flex-col">
      {/* Terminal output */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-green-800"
      >
        {logs.map((line, index) => (
          <div key={index} className="mb-1">
            {line}
          </div>
        ))}

        {isProcessing && (
          <TypingEffect
            text="Processing..."
            speed={80}
            className="text-green-300"
          />
        )}
      </div>

      {/* Command input */}
      <form onSubmit={handleSubmit} className="flex items-center border-t border-green-800 pt-2">
        <span className="mr-2">{'>'}</span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isProcessing}
          className="flex-1 bg-transparent outline-none text-green-300"
          autoFocus
        />
      </form>

      {/* Hint text */}
      <div className="mt-2 text-xs text-green-700">
        {currentLesson.id ? (
          <span>
            Lesson loaded: {currentLesson.title} | Slide {currentLesson.currentSlide + 1} |
            Type 'next slide' or 'enter construct'
          </span>
        ) : (
          <span>Type 'help' for commands | 'list lessons' to see available content</span>
        )}
      </div>
    </div>
  );
};

export default Terminal;