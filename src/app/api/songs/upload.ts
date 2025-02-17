import { NextApiRequest, NextApiResponse } from 'next';
import { BlobServiceClient } from '@azure/storage-blob';
const sql = require('mssql'); 
import "dotenv/config";

const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING || '');

const config = {
  user: process.env.DB_USER || "muzo",
  password: process.env.DB_PASSWORD || "taszyq-jiwZen-fakcy2",
  server: process.env.DB_SERVER || 'muzodb.database.windows.net',
  database: process.env.DB_NAME || 'muzo',
  port: Number(process.env.DB_PORT || 1433),
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

const sqlPool = new sql.ConnectionPool(config);
const poolConnect = sqlPool.connect();

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

    await poolConnect;
    await sqlPool.request()
      .input('title', sql.NVarChar, prompt)
      .input('audioUrl', sql.NVarChar, audioUrl)
      .query(`
        INSERT INTO Songs (title, audioUrl)
        VALUES (@title, @audioUrl)
      `);

    res.status(200).json({ message: 'Song uploaded successfully', audioUrl });
  } catch (error) {
    console.error('Error uploading song:', error);
    res.status(500).json({ error: 'Failed to upload song' });
  }
}
