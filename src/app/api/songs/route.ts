import { NextResponse } from "next/server";
const sql = require('mssql'); // Use CommonJS import
import "dotenv/config"; // Ensures environment variables are loaded
import type { Track } from '@/types/music';


const config = {
    user: "muzo", // Username for SQL Server
    password: "taszyq-jiwZen-fakcy2", // Password for SQL Server
    server: 'muzodb.database.windows.net', // SQL Server Host
    database: 'muzo', // Database Name
    port: Number(1433) , // Default SQL Server port
    options: {
        encrypt: true, // Required for Azure SQL
        trustServerCertificate: false, // Set to true if using a self-signed cert
    },
};


// GET request handler to fetch songs
async function getSongs() {
    try {
      await sql.connect(config);
      const result = await sql.query("SELECT id,title,description,genre,duration,plays,likes,artist,coverUrl,audioUrl FROM Songs");
      return NextResponse.json(result.recordset);
    } catch (error) {
      console.error("Database Connection Error:", error);
      return new NextResponse("Error fetching songs", { status: 500 });
    }
  }
  
  module.exports = { GET: getSongs };