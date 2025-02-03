import sql from 'mssql';

const config = {
  user: 'muzo',
  password: 'taszyq-jiwZen-fakcy2',
  server: 'muzodb.database.windows.net', // Use the full hostname of your Azure SQL server
  database: 'muzo',
  options: {
    encrypt: true,  // Use encryption
    trustServerCertificate: false, // Set to true if you are using a self-signed cert (not recommended for production)
  },
};

// Create a function to handle the database connection and queries
export const query = async (queryString: string, params: any[] = []) => {
  try {
    // Establish connection
    const pool = await sql.connect(config);
    
    // Execute the query
    const result = await pool.request()
      .input('params', sql.VarChar, params)
      .query(queryString);

    return result.recordset;
  } catch (error) {
    console.error('Database query failed', error);
    throw error;
  } 
};