const { Pool } = require('pg');
require('dotenv').config();

// Creamos un grupo de conexiones (Pool)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Requerido para conexiones seguras con Neon
  }
});

// Función auxiliar para realizar consultas
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};