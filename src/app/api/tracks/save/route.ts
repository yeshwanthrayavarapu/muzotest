import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/app/lib/dbClient';
import * as sql from 'mssql';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth/authOptions';
import { getRandomImageUrl } from '@/app/lib/imageUtils';
import { Track } from '@/types/music';
import { truncate } from '@/utils';

export async function POST(request: NextRequest) {
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
    const track = await request.json() as Track;
    
    // Generate a cover image URL based on the prompt
    // const coverUrl = await getRandomImageUrl(track.prompt || track.title);

    // Store track in database
    await executeQuery(`
      INSERT INTO Tracks (id, title, description, genre, duration, artist, coverUrl, audioUrl, prompt, createdAt, userId) 
      VALUES (@id, @title, @desc, @genre, @duration, @artist, @coverUrl, @audioUrl, @prompt, @createdAt, @userId)
    `, [
      { name: 'id', value: track.id, type: sql.VarChar(255) },
      { name: 'title', value: track.title, type: sql.VarChar(255) },
      { name: 'desc', value: truncate(track.description, 300), type: sql.VarChar(500) },
      { name: 'genre', value: track.genre, type: sql.VarChar(50) },
      { name: 'duration', value: track.duration, type: sql.VarChar(10) },
      { name: 'artist', value: track.artist, type: sql.VarChar(100) },
      { name: 'coverUrl', value: track.coverUrl, type: sql.VarChar(255) },
      { name: 'audioUrl', value: track.audioUrl, type: sql.VarChar(255) },
      { name: 'prompt', value: truncate(track.prompt, 300), type: sql.VarChar(500) },
      { name: 'createdAt', value: track.createdAt, type: sql.DateTime() },
      { name: 'userId', value: userId, type: sql.VarChar(36) }
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving track:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save track' },
      { status: 500 }
    );
  }
} 
