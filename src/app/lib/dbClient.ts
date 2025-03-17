import * as sql from "mssql";

// Database Configuration
export const config: sql.config = {
  user: process.env.DB_USER ?? "muzo",
  password: process.env.DB_PASSWORD ?? "taszyq-jiwZen-fakcy2",
  server: process.env.DB_HOST ?? 'muzodb.database.windows.net',
  database: process.env.DB_NAME ?? 'muzo',
  port: Number(process.env.DB_PORT ?? 1433),
  options: {
    encrypt: true,
    trustServerCertificate: process.env.DB_SELF_CERT === "true" || false, // Ensure default is false
  },
};

// Lazy Connection Pool
let pool: sql.ConnectionPool | null = null;

async function getPool(): Promise<sql.ConnectionPool> {
  if (!pool) {
    pool = new sql.ConnectionPool(config);
    await pool.connect();
  }
  return pool;
}

// Execute Query Function
export type QueryParam = string | { value: any, type: sql.ISqlType, name: string };

export async function executeQuery(query: string, params: QueryParam[] = []) {
  try {
    const sqlPool = await getPool();
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