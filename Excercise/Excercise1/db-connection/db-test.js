const { Pool } = require('pg');

// Create a connection pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'student_records',
  password: 'OmyLord6969',
  port: 5432
});

// Test the connection and run a query
async function testConnection() {
  let client;

  try {
    client = await pool.connect();
    console.log('Connected to PostgreSQL database!');

    const result = await client.query('SELECT * FROM students');

    console.log('Students in database:');
    console.table(result.rows);

    console.log(`Total students: ${result.rowCount}`);
  } catch (err) {
    console.error('Database connection error:', err);
  } finally {
    if (client) client.release();

    await pool.end();
    console.log('Connection pool closed');
  }
}

testConnection();