import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import sql from 'mssql';
import { authOptions } from '@/app/lib/auth/authOptions';
import { executeQuery,config } from '@/app/lib/dbClient';

// Helper function to generate profile image
function generateProfileImage(userId: string, name: string): string {
  // Using initials style with the user's name for more personalization
  return `https://api.dicebear.com/7.x/initials/svg?seed=${name}&backgroundColor=1e1b3b,2a2151&radius=50`;
}

// Helper function to get default phone format (Australian)
function getDefaultPhone(): string {
  return '+61-12345678'; // Fixed default Australian number
}

// Helper function to get default location
function getDefaultLocation(): string {
  return 'Sydney, Australia';
}

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
      SELECT name, email, phone, location, bio, profileImage
      FROM users
      WHERE id = ${params.id}
    `;
    
    let user = result.recordset[0];

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Only generate and update if profileImage is missing
    if (!user.profileImage) {
      const newProfileImage = generateProfileImage(params.id, user.name);
      
      // Update the database with the new profile image
      await sql.query`
        UPDATE users
        SET profileImage = ${newProfileImage}
        WHERE id = ${params.id}
      `;
      
      user.profileImage = newProfileImage;
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
    
    // If no profile image is provided, generate one based on the name
    if (!data.profileImage) {
      data.profileImage = generateProfileImage(params.id, data.name);
    }
    
    // Update user in database
    await sql.query`
      UPDATE users
      SET 
        name = ${data.name},
        phone = ${data.phone},
        location = ${data.location},
        bio = ${data.bio},
        profileImage = ${data.profileImage}
      WHERE id = ${params.id}
    `;
    
    // Get updated user data
    const result = await sql.query`
      SELECT name, email, phone, location, bio, profileImage
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
  } 
}