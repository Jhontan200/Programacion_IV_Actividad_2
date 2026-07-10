class ProjectRepository {
  async findAll() {
    throw new Error('Método findAll() no implementado');
  }

  async findById(id) {
    throw new Error('Método findById() no implementado');
  }

  async create(projectData) {
    throw new Error('Método create() no implementado');
  }

  async update(id, projectData) {
    throw new Error('Método update() no implementado');
  }

  async delete(id) {
    throw new Error('Método delete() no implementado');
  }

  async getStatuses() {
    throw new Error('Método getStatuses() no implementado');
  }
}

module.exports = ProjectRepository;