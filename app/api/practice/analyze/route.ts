import { NextRequest, NextResponse } from 'next/server';
import { analyzeJazzHarmony } from '@/lib/gemini';
import type { Note } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    const firebaseUid = request.headers.get('x-firebase-uid');
    
    if (!firebaseUid) {
      return NextResponse.json(
        { error: 'Unauthorized - No Firebase UID provided' },
        { status: 401 }
      );
    }

    const { notes, context, sessionType } = await request.json();

    if (!notes || !Array.isArray(notes)) {
      return NextResponse.json(
        { error: 'Notes array is required' },
        { status: 400 }
      );
    }

    // Convert notes to string format for AI analysis
    const noteNames = notes.map((note: Note) => note.note);
    const contextInfo = context || `Analyzing ${sessionType || 'jazz harmony'} practice`;

    // Call Gemini AI for harmony analysis
    const feedback = await analyzeJazzHarmony(noteNames, contextInfo);

    // Parse the AI response to extract structured data
    const analysis = parseHarmonyFeedback(feedback, notes);

    return NextResponse.json({ 
      success: true, 
      feedback,
      analysis
    });
  } catch (error) {
    console.error('Error analyzing harmony:', error);
    return NextResponse.json(
      { error: 'Failed to analyze harmony', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Helper function to parse AI feedback into structured data
function parseHarmonyFeedback(feedback: string, notes: Note[]) {
  const analysis = {
    blueNotes: [] as string[],
    chords: [] as string[],
    suggestions: [] as string[],
    score: 70, // Default
    accuracy: 70, // Default
  };

  // Extract score
  const scoreMatch = feedback.match(/SCORE:\s*(\d+)/i);
  if (scoreMatch) {
    analysis.score = parseInt(scoreMatch[1]);
  }

  // Extract accuracy
  const accuracyMatch = feedback.match(/ACCURACY:\s*(\d+)/i);
  if (accuracyMatch) {
    analysis.accuracy = parseInt(accuracyMatch[1]);
  }

  // Extract blue notes
  const blueNotesMatch = feedback.match(/BLUE_NOTES:\s*([^\n]+)/i);
  if (blueNotesMatch && !blueNotesMatch[1].toLowerCase().includes('none')) {
    analysis.blueNotes = blueNotesMatch[1]
      .split(',')
      .map(note => note.trim())
      .filter(note => note && note !== 'none');
  }

  // Extract suggestion
  const suggestionMatch = feedback.match(/SUGGESTION:\s*([^\n]+)/i);
  if (suggestionMatch) {
    analysis.suggestions = [suggestionMatch[1].trim()];
  }

  return analysis;
}