import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/app/lib/db';
import * as sql from 'mssql';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth/authOptions';
import { getRandomImageUrl } from '@/app/lib/imageUtils';

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
    const track = await request.json();
    
    // Generate a cover image URL based on the prompt
    const coverUrl = await getRandomImageUrl(track.prompt || track.title);

    // Map the incoming track data to what we need to store
    const trackData = {
      id: track.id,
      title: track.title,
      description: track.prompt || '', // Use prompt as description
      genre: 'AI Generated', // Default genre
      duration: '15', // Default duration
      artist: 'AI Music', // Default artist
      coverUrl: coverUrl, // Use the generated cover URL
      audioUrl: track.audioUrl || '',
      prompt: track.prompt || track.title || '', // Use title as fallback for prompt
      createdAt: new Date().toISOString()
    };

    // Store track in database
    await executeQuery(`
      INSERT INTO Tracks (id, title, description, genre, duration, artist, coverUrl, audioUrl, prompt, createdAt, userId) 
      VALUES (@id, @title, @desc, @genre, @duration, @artist, @coverUrl, @audioUrl, @prompt, @createdAt, @userId)
    `, [
      { name: 'id', value: trackData.id, type: sql.VarChar(255) },
      { name: 'title', value: trackData.title, type: sql.VarChar(255) },
      { name: 'desc', value: trackData.description, type: sql.VarChar(500) },
      { name: 'genre', value: trackData.genre, type: sql.VarChar(50) },
      { name: 'duration', value: trackData.duration, type: sql.VarChar(10) },
      { name: 'artist', value: trackData.artist, type: sql.VarChar(100) },
      { name: 'coverUrl', value: trackData.coverUrl, type: sql.VarChar(255) },
      { name: 'audioUrl', value: trackData.audioUrl, type: sql.VarChar(255) },
      { name: 'prompt', value: trackData.prompt, type: sql.VarChar(500) },
      { name: 'createdAt', value: trackData.createdAt, type: sql.DateTime() },
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