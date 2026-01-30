'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Piano from '@/components/Piano';
import { useMIDI, MIDINote } from '@/hooks/useMIDI';

interface Note {
  note: string;
  time: number;
  velocity: number;
}

export default function PracticeRoom() {
  const { user } = useAuth();
  const { 
    isSupported: midiSupported, 
    isConnected: midiConnected, 
    devices, 
    notes: midiNotes,
    lastNote: lastMidiNote,
    error: midiError, 
    requestAccess,
    clearNotes: clearMidiNotes
  } = useMIDI();

  const [sessionActive, setSessionActive] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [recordedNotes, setRecordedNotes] = useState<Note[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [sessionType, setSessionType] = useState<'jazz_harmony' | 'blue_notes' | 'chord_progressions'>('jazz_harmony');
  const [analyzing, setAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [inputMode, setInputMode] = useState<'midi' | 'piano'>('piano');

  // Handle note played from piano or MIDI
  const handleNotePlay = (noteName: string, velocity: number) => {
    if (!sessionActive) return;

    const currentTime = (Date.now() - sessionStartTime) / 1000;
    const note: Note = {
      note: noteName,
      time: currentTime,
      velocity,
    };

    setRecordedNotes(prev => [...prev, note]);
  };

  // Listen to MIDI notes
  useEffect(() => {
    if (lastMidiNote && inputMode === 'midi') {
      handleNotePlay(lastMidiNote.noteName, lastMidiNote.velocity);
    }
  }, [lastMidiNote]);

  // Start practice session
  const startSession = async () => {
    if (!user) return;

    try {
      const response = await fetch('/api/practice/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-firebase-uid': user.uid,
        },
        body: JSON.stringify({ sessionType }),
      });

      const data = await response.json();
      if (data.success) {
        setSessionId(data.session.id);
        setSessionActive(true);
        setSessionStartTime(Date.now());
        setRecordedNotes([]);
        setFeedback(null);
        clearMidiNotes();
      }
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  };

  // Stop session and analyze
  const stopSession = async () => {
    if (!sessionId || !user) return;

    setSessionActive(false);
    setAnalyzing(true);

    try {
      // Analyze with AI
      const analyzeResponse = await fetch('/api/practice/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-firebase-uid': user.uid,
        },
        body: JSON.stringify({
          notes: recordedNotes,
          context: `Practice session: ${sessionType}`,
          sessionType,
        }),
      });

      const analyzeData = await analyzeResponse.json();

      if (analyzeData.success) {
        setFeedback(analyzeData);

        // Update session in database
        const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
        await fetch(`/api/practice/sessions/${sessionId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-firebase-uid': user.uid,
          },
          body: JSON.stringify({
            duration_seconds: duration,
            notes_played: recordedNotes,
            score: analyzeData.analysis?.score || 0,
            accuracy_percentage: analyzeData.analysis?.accuracy || 0,
            ai_feedback: analyzeData.feedback,
            ai_suggestions: analyzeData.analysis?.suggestions || [],
            harmony_analysis: analyzeData.analysis,
            completed: true,
          }),
        });
      }
    } catch (error) {
      console.error('Failed to analyze session:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Navigation />

        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">Practice Room</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Practice jazz harmony with real-time AI feedback
            </p>

            {/* Input Mode Selection */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
              <h2 className="text-xl font-bold mb-4">Input Method</h2>
              
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => setInputMode('piano')}
                  className={`px-6 py-3 rounded-lg font-medium transition ${
                    inputMode === 'piano'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  🎹 Virtual Piano
                </button>
                
                <button
                  onClick={() => {
                    setInputMode('midi');
                    if (!midiConnected && midiSupported) {
                      requestAccess();
                    }
                  }}
                  className={`px-6 py-3 rounded-lg font-medium transition ${
                    inputMode === 'midi'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                  disabled={!midiSupported}
                >
                  🎛️ MIDI Keyboard
                  {midiConnected && <span className="ml-2 text-green-400">●</span>}
                </button>
              </div>

              {/* MIDI Status */}
              {inputMode === 'midi' && (
                <div className="text-sm">
                  {!midiSupported && (
                    <p className="text-red-600">Web MIDI not supported. Use Chrome, Edge, or Opera.</p>
                  )}
                  {midiSupported && !midiConnected && (
                    <p className="text-yellow-600">No MIDI device connected. Click to connect.</p>
                  )}
                  {midiConnected && (
                    <p className="text-green-600">
                      Connected: {devices.map(d => d.name).join(', ')}
                    </p>
                  )}
                  {midiError && <p className="text-red-600">{midiError}</p>}
                </div>
              )}
            </div>

            {/* Session Controls */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
              <h2 className="text-xl font-bold mb-4">Session Controls</h2>
              
              <div className="flex gap-4 items-center">
                <div>
                  <label htmlFor="session-type-select" className="sr-only">
                    Session Type
                  </label>
                  <select
                    id="session-type-select"
                    value={sessionType}
                    onChange={(e) => setSessionType(e.target.value as any)}
                    disabled={sessionActive}
                    className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="jazz_harmony">Jazz Harmony</option>
                    <option value="blue_notes">Blue Notes</option>
                    <option value="chord_progressions">Chord Progressions</option>
                  </select>
                </div>

                {!sessionActive ? (
                  <button
                    onClick={startSession}
                    className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
                  >
                    ▶ Start Practice
                  </button>
                ) : (
                  <button
                    onClick={stopSession}
                    disabled={analyzing}
                    className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition disabled:opacity-50"
                  >
                    {analyzing ? '⏳ Analyzing...' : '⏹ Stop & Analyze'}
                  </button>
                )}

                {sessionActive && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Recording ({recordedNotes.length} notes)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Piano or MIDI Input Area */}
            {inputMode === 'piano' && (
              <Piano
                onNotePlay={handleNotePlay}
                highlightedNotes={feedback?.analysis?.blueNotes || []}
              />
            )}

            {inputMode === 'midi' && midiConnected && sessionActive && (
              <div className="bg-white dark:bg-gray-800 p-12 rounded-lg shadow text-center">
                <p className="text-2xl mb-4">🎹 Play your MIDI keyboard</p>
                <p className="text-gray-600 dark:text-gray-300">
                  Notes will be recorded automatically
                </p>
                {lastMidiNote && (
                  <div className="mt-4 text-4xl font-bold text-blue-600">
                    {lastMidiNote.noteName}
                  </div>
                )}
              </div>
            )}

            {/* AI Feedback */}
            {feedback && (
              <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4">🎵 AI Feedback</h2>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                    <div className="text-4xl font-bold text-blue-600 dark:text-blue-300">
                      {feedback.analysis?.score || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Score</div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                    <div className="text-4xl font-bold text-green-600 dark:text-green-300">
                      {feedback.analysis?.accuracy || 0}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Accuracy</div>
                  </div>
                </div>

                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-base leading-relaxed whitespace-pre-wrap">
                    {feedback.feedback}
                  </p>
                </div>

                {feedback.analysis?.blueNotes?.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-bold mb-2">Blue Notes Detected:</h3>
                    <div className="flex flex-wrap gap-2">
                      {feedback.analysis.blueNotes.map((note: string, i: number) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={startSession}
                  className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  Start New Session
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
