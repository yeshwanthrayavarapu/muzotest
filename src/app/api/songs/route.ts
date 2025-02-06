const sql = require('mssql'); 
import { NextResponse } from 'next/server'; 
import type { Track } from '@/types/music';
import "dotenv/config"; 

// Move config to environment variables
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

// Optimize SQL query and add connection pooling
const sqlPool = new sql.ConnectionPool(config);
const poolConnect = sqlPool.connect();

export async function GET() {
  try {
    await poolConnect; // Ensure pool is connected
    const result = await sqlPool.request()
      .query(`
        SELECT id, title, description, genre, duration, 
               plays, likes, artist, coverUrl, audioUrl 
        FROM Songs
      `);
      
    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error("Database Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}