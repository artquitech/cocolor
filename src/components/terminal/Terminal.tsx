import React, { useState, useEffect, useRef } from 'react';
import useAppStore from '../../store/useConstructStore';
import TypingEffect from '../effects/TypingEffect';

const Terminal: React.FC = () => {
  const {
    logs,
    addLog,
    setMode
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
    // Basic commands for Phase 1 (will expand in Phase 2)
    if (cmd === 'help') {
      addLog('Available commands:');
      addLog('  help - Show this help message');
      addLog('  enter construct - Enter the 3D teaching environment');
      addLog('  clear - Clear terminal');
      addLog('');
      addLog('More commands coming in Phase 2...');
      return;
    }

    if (cmd === 'clear') {
      // Clear logs except welcome message (we'll improve this later)
      return;
    }

    if (cmd === 'enter construct') {
      addLog('[OK] Initializing Teaching Construct...');
      setTimeout(() => {
        setMode('construct');
      }, 1000);
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
        Type 'enter construct' to enter the Teaching Construct.
      </div>
    </div>
  );
};

export default Terminal;