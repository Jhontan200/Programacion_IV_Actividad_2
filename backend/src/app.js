const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./infrastructure/database/db');
const projectRoutes = require('./infrastructure/web/routes/projectRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// 1. Rutas de la API REST
app.use('/api/projects', projectRoutes);

// Ruta básica de verificación de salud
app.get('/api/health', (req, res) => {
  res.json({ status: 'API activa' });
});

// 2. Servir frontend compilado (Solo para producción)
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Ruta comodín usando Expresión Regular nativa de JS (Bypass a path-to-regexp)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// Función para validar la conexión a la base de datos Neon al iniciar
async function testDatabaseConnection() {
  try {
    const result = await db.query('SELECT NOW()');
    console.log('Conexión a Neon (PostgreSQL) exitosa:', result.rows[0].now);
  } catch (error) {
    console.error('Error al conectar a la base de datos de Neon:', error.message);
  }
}

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  await testDatabaseConnection();
});