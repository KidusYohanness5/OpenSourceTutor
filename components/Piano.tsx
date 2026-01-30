'use client';

import { useState, useEffect, useRef } from 'react';

interface PianoProps {
  onNotePlay: (note: string, velocity: number) => void;
  highlightedNotes?: string[];
}

interface Key {
  note: string;
  midiNote: number;
  isBlack: boolean;
  keyBinding?: string;
}

export default function Piano({ onNotePlay, highlightedNotes = [] }: PianoProps) {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeNotesRef = useRef<Map<string, OscillatorNode>>(new Map());

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    return () => {
      // Cleanup
      activeNotesRef.current.forEach(osc => osc.stop());
      activeNotesRef.current.clear();
    };
  }, []);

  // Define keys from C4 to G5 with number row shortcuts
  const keys: Key[] = [
    { note: 'C4', midiNote: 60, isBlack: false, keyBinding: 'q' },
    { note: 'C#4', midiNote: 61, isBlack: true, keyBinding: '2' },
    { note: 'D4', midiNote: 62, isBlack: false, keyBinding: 'w' },
    { note: 'D#4', midiNote: 63, isBlack: true, keyBinding: '3' },
    { note: 'E4', midiNote: 64, isBlack: false, keyBinding: 'e' },
    { note: 'F4', midiNote: 65, isBlack: false, keyBinding: 'r' },
    { note: 'F#4', midiNote: 66, isBlack: true, keyBinding: '5' },
    { note: 'G4', midiNote: 67, isBlack: false, keyBinding: 't' },
    { note: 'G#4', midiNote: 68, isBlack: true, keyBinding: '6' },
    { note: 'A4', midiNote: 69, isBlack: false, keyBinding: 'y' },
    { note: 'A#4', midiNote: 70, isBlack: true, keyBinding: '7' },
    { note: 'B4', midiNote: 71, isBlack: false, keyBinding: 'u' },
    { note: 'C5', midiNote: 72, isBlack: false, keyBinding: 'i' },
    { note: 'C#5', midiNote: 73, isBlack: true, keyBinding: '9' },
    { note: 'D5', midiNote: 74, isBlack: false, keyBinding: 'o' },
    { note: 'D#5', midiNote: 75, isBlack: true, keyBinding: '0' },
    { note: 'E5', midiNote: 76, isBlack: false, keyBinding: 'p' },
    { note: 'F5', midiNote: 77, isBlack: false, keyBinding: '[' },
    { note: 'F#5', midiNote: 78, isBlack: true, keyBinding: '=' },
    { note: 'G5', midiNote: 79, isBlack: false, keyBinding: ']' },
  ];

  // Convert note to frequency
  const noteToFrequency = (midiNote: number): number => {
    return 440 * Math.pow(2, (midiNote - 69) / 12);
  };

  // Play note with Web Audio API
  const playNote = (note: string, midiNote: number, velocity: number = 80) => {
    if (!audioContextRef.current) return;

    const audioContext = audioContextRef.current;
    const frequency = noteToFrequency(midiNote);

    // Create oscillator
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;

    // Set volume based on velocity
    const volume = velocity / 127;
    gainNode.gain.value = volume * 0.3; // Max 30% volume

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Start the sound
    oscillator.start();

    // Fade out
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    oscillator.stop(audioContext.currentTime + 0.5);

    // Store active note
    activeNotesRef.current.set(note, oscillator);

    // Callback
    onNotePlay(note, velocity);

    // Visual feedback
    setPressedKeys(prev => new Set(prev).add(note));
    setTimeout(() => {
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(note);
        return newSet;
      });
      activeNotesRef.current.delete(note);
    }, 500);
  };

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return; // Ignore repeated key events
      
      const key = keys.find(k => k.keyBinding === e.key.toLowerCase());
      if (key && !pressedKeys.has(key.note)) {
        playNote(key.note, key.midiNote);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keys, pressedKeys]);

  return (
    <div className="bg-gray-900 p-8 rounded-lg">
      <div className="flex justify-center">
        <div className="relative inline-block">
          {/* White keys */}
          <div className="flex">
            {keys.filter(k => !k.isBlack).map((key) => {
              const isPressed = pressedKeys.has(key.note);
              const isHighlighted = highlightedNotes.includes(key.note);
              
              return (
                <button
                  key={key.note}
                  onClick={() => playNote(key.note, key.midiNote)}
                  className={`
                    relative w-10 h-36 border-2 border-gray-400 rounded-b-lg transition-all
                    ${isPressed 
                      ? 'bg-purple-300' 
                      : isHighlighted
                        ? 'bg-blue-200'
                        : 'bg-white hover:bg-gray-100'
                    }
                  `}
                  title={key.note}
                >
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center">
                    <div className="text-[9px] text-gray-600 font-medium">{key.note}</div>
                    {key.keyBinding && (
                      <div className="text-[9px] font-bold text-gray-800 mt-0.5">
                        {key.keyBinding.toUpperCase()}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Black keys - positioned absolutely */}
          {keys.filter(k => k.isBlack).map((key, index) => {
            const isPressed = pressedKeys.has(key.note);
            const isHighlighted = highlightedNotes.includes(key.note);
            
            // Calculate position based on which black key this is (adjusted for 40px white keys)
            // Positions for C#, D#, F#, G#, A#, C#5, D#5, F#5
            const blackKeyPositions = [27, 67, 147, 187, 227, 307, 347, 427];
            
            return (
              <button
                key={key.note}
                onClick={() => playNote(key.note, key.midiNote)}
                className={`
                  absolute top-0 w-7 h-24 border-2 border-gray-900 rounded-b-lg transition-all z-10
                  ${isPressed 
                    ? 'bg-purple-600' 
                    : isHighlighted 
                      ? 'bg-blue-500'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }
                `}
                style={{ left: `${blackKeyPositions[index]}px` }}
                title={key.note}
              >
                {key.keyBinding && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-white text-[8px] font-bold">
                    {key.keyBinding.toUpperCase()}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="mt-5 text-center text-sm text-gray-400">
        White keys: Q W E R T Y U I O P [ ]  •  Black keys: 2 3 5 6 7 9 0 =
      </div>
    </div>
  );
}