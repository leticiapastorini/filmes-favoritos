// db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'filmes-favoritos',
  password: 'root1',
  port: 5432,
});

module.exports = pool;
