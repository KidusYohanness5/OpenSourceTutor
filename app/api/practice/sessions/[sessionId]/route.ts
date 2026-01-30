import { NextRequest, NextResponse } from 'next/server';
import { updatePracticeSession, getUserByFirebaseUid, updatePracticeStreak, checkAndUnlockAchievements } from '@/lib/db-utils';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const firebaseUid = request.headers.get('x-firebase-uid');
    
    if (!firebaseUid) {
      return NextResponse.json(
        { error: 'Unauthorized - No Firebase UID provided' },
        { status: 401 }
      );
    }

    const { sessionId } = await params;
    const data = await request.json();

    // Verify user owns this session (optional but recommended)
    const user = await getUserByFirebaseUid(firebaseUid);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update the practice session
    const session = await updatePracticeSession(sessionId, data);

    // If session is being completed, update streak and check achievements
    if (data.completed) {
      await updatePracticeStreak(user.id);
      const newAchievements = await checkAndUnlockAchievements(user.id);
      
      return NextResponse.json({ 
        success: true, 
        session,
        newAchievements: newAchievements.length > 0 ? newAchievements : undefined
      });
    }

    return NextResponse.json({ success: true, session });
  } catch (error) {
    console.error('Error updating practice session:', error);
    return NextResponse.json(
      { error: 'Failed to update practice session', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}