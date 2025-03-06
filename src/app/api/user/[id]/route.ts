import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import sql from 'mssql';
import { authOptions } from '@/app/lib/auth/authOptions';
import { executeQuery,config } from '@/app/lib/db';

// GET user data
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication and authorization
    if (!session || (session.user?.id !== params.id && !session.user?.isAdmin)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to SQL Server
    await sql.connect(config);
    
    // Query to get user data
    const result = await sql.query`
      SELECT name, email, phone, location, website, bio, profileImage
      FROM users
      WHERE id = ${params.id}
    `;
    
    const user = result.recordset[0];

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}

// UPDATE user data
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication and authorization
    if (!session || session.user?.id !== params.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    // Connect to SQL Server
    await sql.connect(config);
    
    // Update user in database
    await sql.query`
      UPDATE users
      SET 
        name = ${data.name},
        phone = ${data.phone},
        location = ${data.location},
        website = ${data.website},
        bio = ${data.bio},
        profileImage = ${data.profileImage}
      WHERE id = ${params.id}
    `;
    
    // Get updated user data
    const result = await sql.query`
      SELECT name, email, phone, location, website, bio, profileImage
      FROM users
      WHERE id = ${params.id}
    `;
    
    const updatedUser = result.recordset[0];

    return NextResponse.json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user data' },
      { status: 500 }
    );
  } finally {
  }
}