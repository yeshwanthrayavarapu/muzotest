import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/app/lib/dbClient';
import * as sql from 'mssql';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth/authOptions';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user ID from email
    const userResult = await executeQuery(
      "SELECT id FROM Users WHERE email = @param0",
      [session.user.email]
    );

    if (!userResult?.[0]?.id) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = userResult[0].id;

    // Get tracks created by the user
    const tracks = await executeQuery(
      `SELECT t.*, u.name as artist 
       FROM Tracks t 
       JOIN Users u ON t.userId = u.id 
       WHERE t.userId = @param0 
       ORDER BY t.createdAt DESC`,
      [userId]
    );

    return NextResponse.json(tracks);
  } catch (error) {
    console.error('Error fetching tracks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tracks' },
      { status: 500 }
    );
  }
}
