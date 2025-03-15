import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/app/lib/dbClient';
import * as sql from 'mssql';
import { getRandomImageUrl } from '@/app/lib/imageUtils';

export async function POST(
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
    
    // Get the track to access its prompt
    const tracks = await executeQuery(`
      SELECT prompt FROM Tracks WHERE id = @id
    `, [
      { name: 'id', value: id, type: sql.VarChar(255) }
    ]);
    
    if (!tracks || tracks.length === 0) {
      return NextResponse.json(
        { error: 'Track not found' },
        { status: 404 }
      );
    }
    
    const prompt = tracks[0].prompt;
    
    // Generate a new cover image
    const newCoverUrl = await getRandomImageUrl(prompt);
    
    // Update the track with the new cover URL
    await executeQuery(`
      UPDATE Tracks SET coverUrl = @coverUrl WHERE id = @id
    `, [
      { name: 'coverUrl', value: newCoverUrl, type: sql.VarChar(255) },
      { name: 'id', value: id, type: sql.VarChar(255) }
    ]);
    
    return NextResponse.json({ coverUrl: newCoverUrl });
    
  } catch (error) {
    console.error('Error updating cover image:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update cover image' },
      { status: 500 }
    );
  }
}
