const sql = require('mssql'); 

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


// Create a function to handle the database connection and queries
export async function executeQuery(query: string, params: any[] = []) {
    try {
      const pool = await sql.connect(config);
      const request = pool.request();
  
      params.forEach((param, index) => {
        request.input(`param${index}`, param);
      });
  
      const result = await request.query(query);
      return result.recordset;
    } catch (error) {
      console.error("Database error:", error);
      throw new Error("Database query failed");
    }
  }