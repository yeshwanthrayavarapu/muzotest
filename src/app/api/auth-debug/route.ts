import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/authOptions';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Return safe session info for debugging
    return NextResponse.json({
      hasSession: !!session,
      userId: session?.user?.id || null,
      userName: session?.user?.name || null,
      // Don't include email or sensitive data
    });
  } catch (error) {
    console.error('Session debug error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}