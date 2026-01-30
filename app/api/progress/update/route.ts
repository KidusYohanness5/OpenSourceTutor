import { NextRequest, NextResponse } from 'next/server';
import { updateUserProgress, getUserByFirebaseUid, initializeUserProgress } from '@/lib/db-utils';
import type { SkillArea } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    const firebaseUid = request.headers.get('x-firebase-uid');
    
    if (!firebaseUid) {
      return NextResponse.json(
        { error: 'Unauthorized - No Firebase UID provided' },
        { status: 401 }
      );
    }

    const { skillArea, xpGained, score, sessionCompleted } = await request.json();

    if (!skillArea) {
      return NextResponse.json(
        { error: 'Skill area is required' },
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

    // Update progress
    const progress = await updateUserProgress(user.id, skillArea as SkillArea, {
      xp_gained: xpGained,
      score: score,
      session_completed: sessionCompleted,
    });

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error('Error updating user progress:', error);
    return NextResponse.json(
      { error: 'Failed to update user progress', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Initialize progress for a new skill area
export async function PUT(request: NextRequest) {
  try {
    const firebaseUid = request.headers.get('x-firebase-uid');
    
    if (!firebaseUid) {
      return NextResponse.json(
        { error: 'Unauthorized - No Firebase UID provided' },
        { status: 401 }
      );
    }

    const { skillArea } = await request.json();

    if (!skillArea) {
      return NextResponse.json(
        { error: 'Skill area is required' },
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

    // Initialize progress
    const progress = await initializeUserProgress(user.id, skillArea as SkillArea);

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error('Error initializing user progress:', error);
    return NextResponse.json(
      { error: 'Failed to initialize user progress', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}