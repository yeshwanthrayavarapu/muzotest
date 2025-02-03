const sql = require('mssql'); // Use CommonJS import

interface DatabaseConfig {
  server: string;
  authentication: {
    type: string;
  };
  options: {
    encrypt: boolean;
    database: string;
  };
}

// Define the authentication structure
interface DefaultAuthentication {
    type: 'default';
    options: {
        userName?: string;
        password?: string;
    };
}

// Load environment variables
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

const testConnection = async () => {
    try {
        const pool = await sql.connect(config);
        console.log('✅ Connected to SQL Server');
        const result = await pool.request().query('SELECT * FROM Songs');
        console.log('Query result:', result.recordset);
    } catch (error) {
        console.error('❌ Database connection failed:', error);
    }
};

testConnection();
