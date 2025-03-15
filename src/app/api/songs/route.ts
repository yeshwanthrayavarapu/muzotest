import { NextResponse } from 'next/server'; 
import { executeQuery } from '@/app/lib/dbClient';

export async function GET() {
  try {
    const result = await executeQuery(`
        SELECT id, title, description, genre, duration, 
               plays, likes, artist, coverUrl, audioUrl 
        FROM Songs
      `);
      
    return NextResponse.json(result);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
