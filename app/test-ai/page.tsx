'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';

export default function TestAI() {
  const { user } = useAuth();
  const [notes, setNotes] = useState('C4, Eb4, G4');
  const [context, setContext] = useState('Playing a C minor triad with blue notes');
  const [sessionType, setSessionType] = useState('blue_notes');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  async function testAnalyze() {
    if (!user) {
      setError('Please log in first');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Convert note string to array of note objects
      const noteArray = notes.split(',').map((note, index) => ({
        note: note.trim(),
        time: index * 0.5,
        velocity: 80,
      }));

      const response = await fetch('/api/practice/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-firebase-uid': user.uid,
        },
        body: JSON.stringify({
          notes: noteArray,
          context: context,
          sessionType: sessionType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to analyze');
        return;
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }

  // Preset examples
  const examples = [
    {
      name: 'C Minor Triad with Blue Note',
      notes: 'C4, Eb4, G4',
      context: 'Playing a C minor triad',
      type: 'blue_notes',
    },
    {
      name: 'Blues Scale',
      notes: 'C4, Eb4, F4, Gb4, G4, Bb4, C5',
      context: 'Playing the C blues scale',
      type: 'blue_notes',
    },
    {
      name: 'II-V-I Progression',
      notes: 'D4, F4, A4, G4, B4, D4, C4, E4, G4',
      context: 'Playing a ii-V-I progression in C major',
      type: 'chord_progressions',
    },
    {
      name: 'Jazz Voicing',
      notes: 'C3, Bb3, E4, A4',
      context: 'Cmaj7 jazz voicing',
      type: 'jazz_harmony',
    },
  ];

  function loadExample(example: any) {
    setNotes(example.notes);
    setContext(example.context);
    setSessionType(example.type);
    setResult(null);
    setError('');
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Please Log In</h1>
            <p className="text-gray-600 dark:text-gray-300">
              You need to be logged in to test the AI analysis
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">AI Harmony Analysis Test</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Test the Gemini AI-powered jazz harmony analysis
        </p>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Input</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Notes (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    placeholder="C4, Eb4, G4"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format: Note + Octave (e.g., C4, Eb3, F#5)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Context
                  </label>
                  <textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    rows={3}
                    placeholder="Describe what you're practicing..."
                  />
                </div>

                <div>
                  <label htmlFor="session-type" className="block text-sm font-medium mb-2">
                    Session Type
                  </label>
                  <select
                    id="session-type"
                    value={sessionType}
                    onChange={(e) => setSessionType(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="blue_notes">Blue Notes</option>
                    <option value="jazz_harmony">Jazz Harmony</option>
                    <option value="chord_progressions">Chord Progressions</option>
                    <option value="functional_harmony">Functional Harmony</option>
                    <option value="sight_reading">Sight Reading</option>
                  </select>
                </div>

                <button
                  onClick={testAnalyze}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Analyzing...' : '🎵 Analyze Harmony'}
                </button>
              </div>
            </div>

            {/* Examples */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold mb-4">Quick Examples</h3>
              <div className="space-y-2">
                {examples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => loadExample(example)}
                    className="w-full text-left px-4 py-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <div className="font-medium">{example.name}</div>
                    <div className="text-xs text-gray-500 truncate">
                      {example.notes}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
                <h3 className="font-bold text-red-800 dark:text-red-200 mb-2">
                  Error
                </h3>
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            {result && (
              <>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <h2 className="text-2xl font-bold mb-4">AI Feedback</h2>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">{result.feedback}</p>
                  </div>
                </div>

                {result.analysis && (
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h2 className="text-2xl font-bold mb-4">Analysis</h2>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-300">
                          {result.analysis.score}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          Score
                        </div>
                      </div>

                      <div className="text-center p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-300">
                          {result.analysis.accuracy}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          Accuracy
                        </div>
                      </div>
                    </div>

                    {result.analysis.blueNotes?.length > 0 && (
                      <div className="mb-4">
                        <h3 className="font-bold mb-2">Blue Notes Detected:</h3>
                        <div className="flex flex-wrap gap-2">
                          {result.analysis.blueNotes.map((note: string, i: number) => (
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

                    {result.analysis.suggestions?.length > 0 && (
                      <div>
                        <h3 className="font-bold mb-2">Suggestions:</h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          {result.analysis.suggestions.map((suggestion: string, i: number) => (
                            <li key={i}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <details>
                    <summary className="cursor-pointer font-medium">
                      View Raw JSON Response
                    </summary>
                    <pre className="mt-2 text-xs overflow-auto">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </details>
                </div>
              </>
            )}

            {!result && !error && !loading && (
              <div className="bg-gray-50 dark:bg-gray-900 p-12 rounded-lg text-center">
                <p className="text-gray-500">
                  👈 Enter notes and click "Analyze Harmony" to see AI feedback
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}