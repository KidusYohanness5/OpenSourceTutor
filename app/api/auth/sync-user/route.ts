import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByFirebaseUid, updateUserLastLogin } from '@/lib/db-utils';

export async function POST(request: NextRequest) {
  try {
    const { firebaseUid, email, displayName } = await request.json();

    if (!firebaseUid || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists in database
    let user = await getUserByFirebaseUid(firebaseUid);

    if (!user) {
      // Create new user in database
      try {
        user = await createUser(firebaseUid, email, displayName);
      } catch (error: any) {
        // If duplicate key error, user was just created by another request
        if (error.code === '23505') {
          user = await getUserByFirebaseUid(firebaseUid);
        } else {
          throw error;
        }
      }
    } else {
      // Update last login
      await updateUserLastLogin(user.id);
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error syncing user:', error);
    return NextResponse.json(
      { error: 'Failed to sync user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}