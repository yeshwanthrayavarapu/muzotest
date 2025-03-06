import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth/authOptions';
import { writeFile } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Generate unique filename
    const buffer = await file.arrayBuffer();
    const fileName = `${crypto.randomUUID()}${path.extname(file.name)}`;
    
    // Save to local storage (in production, consider using Azure Blob Storage)
    const filePath = path.join(process.cwd(), 'public/uploads', fileName);
    await writeFile(filePath, Buffer.from(buffer));
    
    // Return the URL to the uploaded image
    const imageUrl = `/uploads/${fileName}`;
    
    return NextResponse.json({ 
      message: 'Image uploaded successfully',
      imageUrl 
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}