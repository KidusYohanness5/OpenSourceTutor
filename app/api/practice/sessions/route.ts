import { NextRequest, NextResponse } from 'next/server';
import { createPracticeSession, getUserRecentSessions, getUserByFirebaseUid } from '@/lib/db-utils';
import type { SessionType } from '@/types/database';

// GET - List recent practice sessions
export async function GET(request: NextRequest) {
  try {
    const firebaseUid = request.headers.get('x-firebase-uid');
    
    if (!firebaseUid) {
      return NextResponse.json(
        { error: 'Unauthorized - No Firebase UID provided' },
        { status: 401 }
      );
    }

    // Get limit from query params (default 10)
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get user from database
    const user = await getUserByFirebaseUid(firebaseUid);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch recent sessions
    const sessions = await getUserRecentSessions(user.id, limit);

    return NextResponse.json({ success: true, sessions });
  } catch (error) {
    console.error('Error fetching practice sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch practice sessions', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST - Start a new practice session
export async function POST(request: NextRequest) {
  try {
    const firebaseUid = request.headers.get('x-firebase-uid');
    
    if (!firebaseUid) {
      return NextResponse.json(
        { error: 'Unauthorized - No Firebase UID provided' },
        { status: 401 }
      );
    }

    const { sessionType, exerciseTypeId } = await request.json();

    if (!sessionType) {
      return NextResponse.json(
        { error: 'Session type is required' },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await getUserByFirebaseUid(firebaseUid);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create new practice session
    const session = await createPracticeSession(
      user.id,
      sessionType as SessionType,
      exerciseTypeId
    );

    return NextResponse.json({ success: true, session });
  } catch (error) {
    console.error('Error creating practice session:', error);
    return NextResponse.json(
      { error: 'Failed to create practice session', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}