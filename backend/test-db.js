import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('--- DB CONNECTION TEST ---');
console.log('ENV PATH:', path.resolve(__dirname, '../.env'));

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function test() {
  if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL is not set!');
    process.exit(1);
  }

  console.log('Connecting to:', process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@'));
  
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
