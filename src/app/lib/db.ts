import * as sql from "mssql";
import 'dotenv/config';

const config = {
  user: process.env.DB_USER ?? "muzo",
  password: process.env.DB_PASSWORD ?? "taszyq-jiwZen-fakcy2",
  server: process.env.DB_HOST ?? 'muzodb.database.windows.net',
  database: process.env.DB_NAME ?? 'muzo',
  port: Number(process.env.DB_PORT ?? 1433),
  options: {
    encrypt: true,
    trustServerCertificate: process.env.SELF_CERT === "true",
  },
};

const sqlPool = new sql.ConnectionPool(config);
const poolConnect = sqlPool.connect();

export type QueryParam = string | { value: any, type: sql.ISqlType, name: string };

// Create a function to handle the database connection and queries
export async function executeQuery(query: string, params: QueryParam[] = []) {
  try {
    await poolConnect; // Ensure pool is connected

    const request = sqlPool.request();

    params.forEach((param, index) => {
      const paramName = `param${index}`;

      if (typeof param === "object") {
        request.input(param.name ?? paramName, param.type, param.value);
      } else {
        request.input(paramName, param);
      }
    });

    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Database query failed");
  }
}
