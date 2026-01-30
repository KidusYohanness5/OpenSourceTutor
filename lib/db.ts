import postgres from 'postgres';

// Use the pooled connection for serverless (Vercel)
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('Database connection string is not defined');
}

// Create a single postgres connection instance
const sql = postgres(connectionString, {
  max: 10, // Maximum number of connections
  idle_timeout: 20,
  connect_timeout: 10,
});

export default sql;
