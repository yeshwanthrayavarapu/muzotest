import { NextApiRequest, NextApiResponse } from 'next';
import { BlobServiceClient } from '@azure/storage-blob';
import { executeQuery } from '@/app/lib/dbClient';

const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING || '');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const formData = await req.body;
    const { prompt, audioFile } = formData;

    if (!audioFile) {
      return res.status(400).json({ error: 'Audio file is required' });
    }

    const containerClient = blobServiceClient.getContainerClient('songs');
    const blobName = `${Date.now()}-${audioFile.name}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(audioFile);

    const audioUrl = blockBlobClient.url;

    await executeQuery(`
        INSERT INTO Songs (title, audioUrl)
        VALUES (@title, @audioUrl)
      `,
      [
        {
          name: 'title',
          value: prompt,
          type: sql.NVarChar
        },
        {
          name: 'audioUrl',
          value: audioUrl,
          type: sql.NVarChar
        }, audioUrl
      ]);

    res.status(200).json({ message: 'Song uploaded successfully', audioUrl });
  } catch (error) {
    console.error('Error uploading song:', error);
    res.status(500).json({ error: 'Failed to upload song' });
  }
}
