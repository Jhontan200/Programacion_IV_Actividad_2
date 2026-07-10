const PgProjectRepository = require('../../repositories/PgProjectRepository');
const ListProjects = require('../../../application/use-cases/ListProjects');
const CreateProject = require('../../../application/use-cases/CreateProject');
const UpdateProject = require('../../../application/use-cases/UpdateProject');
const DeleteProject = require('../../../application/use-cases/DeleteProject');
const GetStatuses = require('../../../application/use-cases/GetStatuses');

// Instanciamos el repositorio único para esta base de datos
const projectRepository = new PgProjectRepository();

class ProjectController {
  
  // Obtener todos los proyectos
  async getAll(req, res) {
    try {
      const useCase = new ListProjects(projectRepository);
      const projects = await useCase.execute();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Crear un nuevo proyecto
  async create(req, res) {
    try {
      const useCase = new CreateProject(projectRepository);
      const newProject = await useCase.execute(req.body);
      res.status(201).json(newProject);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Actualizar un proyecto
  async update(req, res) {
    try {
      const { id } = req.params;
      const useCase = new UpdateProject(projectRepository);
      const updatedProject = await useCase.execute(id, req.body);
      res.json(updatedProject);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Eliminar un proyecto
  async delete(req, res) {
    try {
      const { id } = req.params;
      const useCase = new DeleteProject(projectRepository);
      await useCase.execute(id);
      res.json({ message: 'Proyecto eliminado con éxito' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Obtener el catálogo de estados
  async getStatuses(req, res) {
    try {
      const useCase = new GetStatuses(projectRepository);
      const statuses = await useCase.execute();
      res.json(statuses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ProjectController();