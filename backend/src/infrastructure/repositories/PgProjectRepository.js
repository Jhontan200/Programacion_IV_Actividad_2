const ProjectRepository = require('../../domain/repositories/ProjectRepository');
const Project = require('../../domain/entities/Project');
const db = require('../database/db');

class PgProjectRepository extends ProjectRepository {
  
  // Obtener todos los proyectos con el nombre de su estado (JOIN)
  async findAll() {
    const queryText = `
      SELECT p.id, p.name, p.description, p.start_date, p.status_id, s.name AS status_name 
      FROM projects p
      JOIN project_statuses s ON p.status_id = s.id
      ORDER BY p.created_at DESC
    `;
    const { rows } = await db.query(queryText);
    return rows.map(row => new Project(row));
  }

  // Obtener un proyecto por su ID
  async findById(id) {
    const queryText = `
      SELECT p.id, p.name, p.description, p.start_date, p.status_id, s.name AS status_name 
      FROM projects p
      JOIN project_statuses s ON p.status_id = s.id
      WHERE p.id = $1
    `;
    const { rows } = await db.query(queryText, [id]);
    if (rows.length === 0) return null;
    return new Project(rows[0]);
  }

  // Crear un nuevo proyecto
  async create(projectData) {
    const { name, description, startDate, statusId } = projectData;
    const queryText = `
      INSERT INTO projects (name, description, start_date, status_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, description, start_date, status_id
    `;
    const values = [name, description, startDate, statusId];
    const { rows } = await db.query(queryText, values);
    
    // Obtenemos los datos completos (incluyendo el nombre del estado) para retornar la entidad limpia
    return this.findById(rows[0].id);
  }

  // Actualizar un proyecto existente
  async update(id, projectData) {
    const { name, description, startDate, statusId } = projectData;
    const queryText = `
      UPDATE projects 
      SET name = $1, description = $2, start_date = $3, status_id = $4
      WHERE id = $5
      RETURNING id
    `;
    const values = [name, description, startDate, statusId, id];
    const { rows } = await db.query(queryText, values);
    
    if (rows.length === 0) return null;
    return this.findById(id);
  }

  // Eliminar un proyecto
  async delete(id) {
    const queryText = 'DELETE FROM projects WHERE id = $1 RETURNING id';
    const { rows } = await db.query(queryText, [id]);
    return rows.length > 0;
  }

  // Obtener el catálogo de estados (necesario para el formulario en el frontend)
  async getStatuses() {
    const queryText = 'SELECT id, name, description FROM project_statuses ORDER BY id ASC';
    const { rows } = await db.query(queryText);
    return rows;
  }
}

module.exports = PgProjectRepository;