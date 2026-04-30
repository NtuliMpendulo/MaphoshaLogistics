import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  server: process.env.DATABASE_SERVER,
  database: process.env.DATABASE_NAME,
  authentication: {
    type: 'default',
    options: {
      userName: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
    },
  },
  options: {
    encrypt: process.env.DATABASE_ENCRYPT === 'true',
    trustServerCertificate: process.env.DATABASE_TRUST_SERVER_CERTIFICATE === 'true',
    port: parseInt(process.env.DATABASE_PORT || '1433'),
    connectTimeout: 30000,
    requestTimeout: 30000,
  },
};

let pool = null;

export async function getPool() {
  if (!pool) {
    pool = new sql.ConnectionPool(config);
    await pool.connect();
    console.log('✅ Connected to Azure SQL Database');
  }
  return pool;
}

export async function closePool() {
  if (pool) {
    await pool.close();
    pool = null;
    console.log('Database connection closed');
  }
}

export async function executeQuery(query, inputs = {}) {
  const pool = await getPool();
  const request = pool.request();

  // Add input parameters
  Object.keys(inputs).forEach(key => {
    request.input(key, inputs[key]);
  });

  return request.query(query);
}

export default { getPool, closePool, executeQuery };
