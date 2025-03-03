import { NextResponse } from 'next/server'; 
import { executeQuery } from '@/app/lib/db';

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
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
