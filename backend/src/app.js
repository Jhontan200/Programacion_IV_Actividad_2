const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const db = require('./infrastructure/database/db');
const projectRoutes = require('./infrastructure/web/routes/projectRoutes');
const userRoutes = require('./infrastructure/web/routes/userRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// 1. Rutas de la API REST
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);

// Ruta básica de verificación de salud
app.get('/api/health', (req, res) => {
  res.json({ status: 'API activa' });
});

// 2. Servir frontend compilado (Solo para producción)
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDistPath));

// Ruta comodín corregida para evitar errores de archivo inexistente en Render
app.get(/.*/, (req, res) => {
  const indexPath = path.join(frontendDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // Si la carpeta de Vue no existe (entorno dividido), respondemos con JSON en vez de lanzar un error
    res.json({ 
      status: 'API activa', 
      message: 'Servidor de base de datos Neon conectado y operativo de manera exitosa.' 
    });
  }
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