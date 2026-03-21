import pkg from 'pg';
const { Client } = pkg;

// Using the URL-encoded password directly
const DATABASE_URL = 'postgres://postgres.bnlpkfhdashlwsitktku:9n%24bs%2At_E%3D5zV%5E%60R@aws-0-us-central1.pooler.supabase.com:6543/postgres';

const client = new Client({
  connectionString: DATABASE_URL,
});

async function test() {
  console.log('--- DB DIRECT TEST ---');
  console.log('Connecting to:', DATABASE_URL.replace(/:[^:@]+@/, ':****@'));
  
  try {
    await client.connect();
    console.log('Connected successfully!');
    const res = await client.query('SELECT NOW()');
    console.log('Query result:', res.rows[0]);
    await client.end();
  } catch (err) {
    console.error('Connection error:', err);
    process.exit(1);
  }
}

test();
