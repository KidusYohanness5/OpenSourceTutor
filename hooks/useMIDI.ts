'use client';

import { useEffect, useState, useCallback } from 'react';

export interface MIDINote {
  note: number; // MIDI note number (0-127)
  noteName: string; // e.g., "C4", "Eb3"
  velocity: number; // 0-127
  timestamp: number;
}

// Define Web MIDI API types
interface MIDIMessageEvent extends Event {
  data: Uint8Array;
  timeStamp: number;
}

interface MIDIInput extends EventTarget {
  id: string;
  name?: string;
  manufacturer?: string;
  state: string;
  connection: string;
  onmidimessage: ((event: MIDIMessageEvent) => void) | null;
}

interface MIDIAccess extends EventTarget {
  inputs: Map<string, MIDIInput>;
  outputs: Map<string, any>;
  onstatechange: ((event: Event) => void) | null;
}

// Extend Navigator type
declare global {
  interface Navigator {
    requestMIDIAccess(): Promise<MIDIAccess>;
  }
}

interface UseMIDIReturn {
  isSupported: boolean;
  isConnected: boolean;
  devices: MIDIInput[];
  notes: MIDINote[];
  lastNote: MIDINote | null;
  error: string | null;
  requestAccess: () => Promise<void>;
  clearNotes: () => void;
}

// Convert MIDI note number to note name (e.g., 60 -> "C4")
function midiNoteToName(midiNote: number): string {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(midiNote / 12) - 1;
  const noteName = noteNames[midiNote % 12];
  return `${noteName}${octave}`;
}

export function useMIDI(): UseMIDIReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [devices, setDevices] = useState<MIDIInput[]>([]);
  const [notes, setNotes] = useState<MIDINote[]>([]);
  const [lastNote, setLastNote] = useState<MIDINote | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if Web MIDI API is supported
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'requestMIDIAccess' in navigator) {
      setIsSupported(true);
    } else {
      setError('Web MIDI API not supported in this browser. Try Chrome, Edge, or Opera.');
    }
  }, []);

  // Handle MIDI message
  const handleMIDIMessage = useCallback((event: MIDIMessageEvent) => {
    const [command, note, velocity] = event.data;
    
    // Note On (144) or Note Off (128)
    if (command === 144 && velocity > 0) {
      // Note On
      const midiNote: MIDINote = {
        note,
        noteName: midiNoteToName(note),
        velocity,
        timestamp: event.timeStamp,
      };
      
      setNotes(prev => [...prev, midiNote]);
      setLastNote(midiNote);
    }
  }, []);

  // Request MIDI access
  const requestAccess = useCallback(async () => {
    if (!isSupported) {
      setError('Web MIDI API not supported');
      return;
    }

    try {
      const midiAccess = await navigator.requestMIDIAccess();
      
      const inputs = Array.from(midiAccess.inputs.values());
      setDevices(inputs);

      if (inputs.length === 0) {
        setError('No MIDI devices found. Please connect a MIDI keyboard.');
        setIsConnected(false);
        return;
      }

      // Attach listeners to all MIDI inputs
      inputs.forEach(input => {
        input.onmidimessage = handleMIDIMessage;
      });

      setIsConnected(true);
      setError(null);

      // Listen for device connection/disconnection
      midiAccess.onstatechange = (e) => {
        const updatedInputs = Array.from(midiAccess.inputs.values());
        setDevices(updatedInputs);
        setIsConnected(updatedInputs.length > 0);
      };

    } catch (err: any) {
      setError(`Failed to access MIDI devices: ${err.message}`);
      setIsConnected(false);
    }
  }, [isSupported, handleMIDIMessage]);

  const clearNotes = useCallback(() => {
    setNotes([]);
    setLastNote(null);
  }, []);

  return {
    isSupported,
    isConnected,
    devices,
    notes,
    lastNote,
    error,
    requestAccess,
    clearNotes,
  };
}