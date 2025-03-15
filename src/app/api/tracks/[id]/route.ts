import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/app/lib/dbClient';
import * as sql from 'mssql';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Track ID is required' },
        { status: 400 }
      );
    }
    
    const tracks = await executeQuery(`
      SELECT id, title, description, genre, duration, 
             plays, likes, artist, coverUrl, audioUrl, prompt, createdAt
      FROM Tracks
      WHERE id = @id
    `, [
      { name: 'id', value: id, type: sql.VarChar(255) }
    ]);
    
    if (!tracks || tracks.length === 0) {
      return NextResponse.json(
        { error: 'Track not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(tracks[0]);
    
  } catch (error) {
    console.error('Error fetching track:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch track' },
      { status: 500 }
    );
  }
}
