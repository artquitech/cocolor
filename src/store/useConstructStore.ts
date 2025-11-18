import { create } from 'zustand';

export type ConstructState = 'booting' | 'terminal' | 'construct' | 'redpill' | 'whiterabbit';
export type Environment = 'void' | 'weapons' | 'training' | 'city';
export type Command = 'help' | 'load weapons' | 'load training' | 'load city' | 'exit construct' | 'redpill' | 'follow white rabbit';

interface ConstructStore {
  state: ConstructState;
  environment: Environment;
  bootProgress: number;
  terminalLines: string[];
  audioEnabled: boolean;
  glitchEffect: boolean;
  matrixRain: boolean;
  cameraPosition: [number, number, number];
  
  setState: (state: ConstructState) => void;
  setEnvironment: (env: Environment) => void;
  incrementBootProgress: () => void;
  addTerminalLine: (line: string) => void;
  clearTerminal: () => void;
  toggleAudio: () => void;
  executeCommand: (cmd: Command) => void;
  setGlitchEffect: (enabled: boolean) => void;
  setMatrixRain: (enabled: boolean) => void;
  setCameraPosition: (position: [number, number, number]) => void;
}

const useConstructStore = create<ConstructStore>((set, get) => ({
  state: 'booting',
  environment: 'void',
  bootProgress: 0,
  terminalLines: [],
  audioEnabled: true,
  glitchEffect: false,
  matrixRain: false,
  cameraPosition: [0, 1.7, 5],
  
  setState: (state) => set({ state }),
  
  setEnvironment: (environment) => set({ environment }),
  
  incrementBootProgress: () => set((state) => ({ 
    bootProgress: Math.min(state.bootProgress + 1, 100) 
  })),
  
  addTerminalLine: (line) => set((state) => ({ 
    terminalLines: [...state.terminalLines, line] 
  })),
  
  clearTerminal: () => set({ terminalLines: [] }),
  
  toggleAudio: () => set((state) => ({ 
    audioEnabled: !state.audioEnabled 
  })),
  
  executeCommand: (cmd) => {
    const { addTerminalLine, setEnvironment, setState } = get();
    
    switch (cmd) {
      case 'help':
        addTerminalLine('Available commands:');
        addTerminalLine('> load weapons - Load the weapons rack');
        addTerminalLine('> load training - Load martial arts training program');
        addTerminalLine('> load city - Load urban simulation');
        addTerminalLine('> exit construct - Return to terminal');
        break;
        
      case 'load weapons':
        addTerminalLine('Loading weapons rack...');
        setEnvironment('weapons');
        break;
        
      case 'load training':
        addTerminalLine('Loading martial arts training program...');
        setEnvironment('training');
        break;
        
      case 'load city':
        addTerminalLine('Loading urban simulation...');
        setEnvironment('city');
        break;
        
      case 'exit construct':
        addTerminalLine('Exiting Construct...');
        setState('terminal');
        setEnvironment('void');
        break;
        
      case 'redpill':
        addTerminalLine('WARNING: System collapse imminent');
        setState('redpill');
        break;
        
      case 'follow white rabbit':
        addTerminalLine('Initiating special sequence...');
        setState('whiterabbit');
        break;
        
      default:
        addTerminalLine('Command not recognized. Type "help" for available commands.');
    }
  },
  
  setGlitchEffect: (enabled) => set({ glitchEffect: enabled }),
  
  setMatrixRain: (enabled) => set({ matrixRain: enabled }),
  
  setCameraPosition: (position) => set({ cameraPosition: position })
}));

export default useConstructStore;