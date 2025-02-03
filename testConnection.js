

  const sql = require("mssql");

  const config = {
    server: "muzodb.database.windows.net",
    authentication: {
      type: "azure-active-directory-msi-app-service"
    },
    options: {
      encrypt: true
    }
  };
  
  async function testConnection() {
    try {
      console.log("Connecting...");
      await sql.connect(config);
      console.log("✅ Connected successfully!");
    } catch (error) {
      console.error("❌ Connection failed:", error);
    }
  }
  
  testConnection();