import pkg from 'pg';
const { Client } = pkg;

// Using the direct connection host and port 5432
const DATABASE_URL = 'postgres://postgres.bnlpkfhdashlwsitktku:9n%24bs%2At_E%3D5zV%5E%60R@db.bnlpkfhdashlwsitktku.supabase.co:5432/postgres';

const client = new Client({
  connectionString: DATABASE_URL,
});

async function test() {
  console.log('--- DB DIRECT (PORT 5432) TEST ---');
  console.log('Connecting to:', DATABASE_URL.replace(/:[^:@]+@/, ':****@'));
  
  try {
    const start = Date.now();
    await client.connect();
    console.log('Connected successfully in', Date.now() - start, 'ms');
    const res = await client.query('SELECT NOW()');
    console.log('Query result:', res.rows[0]);
    await client.end();
  } catch (err) {
    console.error('Connection error:', err);
    process.exit(1);
  }
}

test();
