const UserRepository = require('../../domain/repositories/UserRepository');
const User = require('../../domain/entities/User');
const db = require('../database/db');

class PgUserRepository extends UserRepository {
    async findAll() {
        const { rows } = await db.query('SELECT * FROM users ORDER BY id DESC');
        return rows.map(row => new User(row));
    }

    async create(userData) {
        const { name, email, role, password } = userData;
        const queryText = 'INSERT INTO users (name, email, role, password) VALUES ($1, $2, $3, $4) RETURNING *';
        const { rows } = await db.query(queryText, [name, email, role, password]);
        return new User(rows[0]);
    }

    // NUEVO: Actualización en base de datos
    async update(id, userData) {
        const { name, email, role, password } = userData;
        const queryText = `
      UPDATE users 
      SET name = $1, email = $2, role = $3, password = $4 
      WHERE id = $5 RETURNING *
    `;
        const { rows } = await db.query(queryText, [name, email, role, password, id]);
        if (rows.length === 0) return null;
        return new User(rows[0]);
    }

    async delete(id) {
        const queryText = 'DELETE FROM users WHERE id = $1 RETURNING id';
        const { rows } = await db.query(queryText, [id]);
        return rows.length > 0;
    }

    // NUEVO: Buscar por correo (usado para login)
    async findByEmail(email) {
        const queryText = 'SELECT * FROM users WHERE email = $1';
        const { rows } = await db.query(queryText, [email]);
        if (rows.length === 0) return null;
        return new User(rows[0]);
    }
}

module.exports = PgUserRepository;