import { NextRequest, NextResponse } from 'next/server';
import { BlobServiceClient } from '@azure/storage-blob';
import { executeQuery } from '@/app/lib/dbClient';

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING || ''
);

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const prompt = formData.get('prompt') as string;
  const audioFile = formData.get('audioFile') as File;

  if (!audioFile) {
    return NextResponse.json({ error: 'Audio file is required' }, { status: 400 });
  }

  try {
    const containerClient = blobServiceClient.getContainerClient('songs');
    const blobName = `${Date.now()}-${(audioFile as File).name}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadData(await audioFile.arrayBuffer());
    const audioUrl = blockBlobClient.url;

    await executeQuery(
      `
        INSERT INTO Songs (title, audioUrl)
        VALUES (@title, @audioUrl)
      `,
      [
        { name: 'title', value: prompt, type: sql.NVarChar },
        { name: 'audioUrl', value: audioUrl, type: sql.NVarChar }
      ]
    );

    return NextResponse.json({ message: 'Song uploaded successfully', audioUrl });
  } catch (error) {
    console.error('Error uploading song:', error);
    return NextResponse.json({ error: 'Failed to upload song' }, { status: 500 });
  }
}
