import { NextRequest, NextResponse } from 'next/server';
import { getUserProgress, getUserByFirebaseUid } from '@/lib/db-utils';
import type { SkillArea } from '@/types/database';

export async function GET(request: NextRequest) {
  try {
    const firebaseUid = request.headers.get('x-firebase-uid');
    
    if (!firebaseUid) {
      return NextResponse.json(
        { error: 'Unauthorized - No Firebase UID provided' },
        { status: 401 }
      );
    }

    // Get optional skill area filter from query params
    const { searchParams } = new URL(request.url);
    const skillArea = searchParams.get('skill') as SkillArea | null;

    // Get user from database
    const user = await getUserByFirebaseUid(firebaseUid);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch user progress
    const progress = await getUserProgress(user.id, skillArea || undefined);

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user progress', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}