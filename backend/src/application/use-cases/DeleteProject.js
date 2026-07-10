class DeleteProject {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(id) {
    if (!id) {
      throw new Error('El ID del proyecto es requerido para eliminar');
    }

    const success = await this.projectRepository.delete(id);
    if (!success) {
      throw new Error('No se pudo eliminar el proyecto o el proyecto no existe');
    }

    return success;
  }
}

module.exports = DeleteProject;