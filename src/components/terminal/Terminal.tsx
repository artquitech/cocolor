import React, { useState, useEffect, useRef } from 'react';
import useConstructStore from '../../store/useConstructStore';
import TypingEffect from '../effects/TypingEffect';
import { Command } from '../../store/useConstructStore';

const Terminal: React.FC = () => {
  const { 
    terminalLines, 
    addTerminalLine, 
    executeCommand, 
    setState 
  } = useConstructStore();
  
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Initial intro message
  useEffect(() => {
    const welcomeMessage = [
      "==== THE MATRIX CONSTRUCT TERMINAL ====",
      "A program for loading simulated realities",
      "",
      "Type 'help' for available commands.",
      ""
    ];
    
    let delay = 300;
    welcomeMessage.forEach((line) => {
      setTimeout(() => {
        addTerminalLine(line);
      }, delay);
      delay += 300;
    });
  }, [addTerminalLine]);
  
  // Auto-scroll terminal to bottom when new lines are added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);
  
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
    addTerminalLine(`> ${inputValue}`);
    
    // Process command
    setIsProcessing(true);
    setTimeout(() => {
      processCommand(inputValue.trim().toLowerCase());
      setInputValue('');
      setIsProcessing(false);
    }, 500);
  };
  
  const processCommand = (cmd: string) => {
    // Handle special command to enter construct
    if (cmd === 'enter construct') {
      addTerminalLine('Initializing Construct environment...');
      setTimeout(() => {
        setState('construct');
      }, 1500);
      return;
    }
    
    // Check if command matches any known command
    const knownCommands: Record<string, Command> = {
      'help': 'help',
      'load weapons': 'load weapons',
      'load training': 'load training',
      'load city': 'load city',
      'exit construct': 'exit construct',
      'redpill': 'redpill',
      'follow white rabbit': 'follow white rabbit'
    };
    
    if (cmd in knownCommands) {
      executeCommand(knownCommands[cmd]);
    } else {
      addTerminalLine(`Command not recognized: ${cmd}`);
      addTerminalLine("Type 'help' for available commands.");
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black text-green-500 font-mono p-4 flex flex-col">
      {/* Terminal output */}
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-green-800"
      >
        {terminalLines.map((line, index) => (
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
        Type 'enter construct' to initialize the Construct program.
      </div>
    </div>
  );
};

export default Terminal;