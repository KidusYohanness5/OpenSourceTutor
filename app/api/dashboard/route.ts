import { NextRequest, NextResponse } from 'next/server';
import { getDashboardData, getUserByFirebaseUid } from '@/lib/db-utils';

export async function GET(request: NextRequest) {
  try {
    // In production, verify the Firebase token from Authorization header
    // For now, we'll use a custom header
    const firebaseUid = request.headers.get('x-firebase-uid');
    
    if (!firebaseUid) {
      return NextResponse.json(
        { error: 'Unauthorized - No Firebase UID provided' },
        { status: 401 }
      );
    }

    // Get user from database first
    const user = await getUserByFirebaseUid(firebaseUid);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }

    // Get dashboard data using the database user ID
    const data = await getDashboardData(user.id);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}