import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/app/lib/db';
import * as sql from 'mssql';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    
    const tracks = await executeQuery(`
      SELECT id, title, description, genre, duration, 
             plays, likes, artist, coverUrl, audioUrl, prompt, createdAt
      FROM Tracks
      ORDER BY createdAt DESC
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `, [
      { name: 'offset', value: offset, type: sql.Int() },
      { name: 'limit', value: limit, type: sql.Int() }
    ]);
    
    // Get total count for pagination
    const countResult = await executeQuery(`
      SELECT COUNT(*) as total FROM Tracks
    `);
    
    const total = countResult[0]?.total || 0;
    
    return NextResponse.json({
      tracks,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
    
  } catch (error) {
    console.error('Error fetching tracks:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch tracks' },
      { status: 500 }
    );
  }
}
