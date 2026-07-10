class UpdateProject {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(id, projectData) {
    if (!id) {
      throw new Error('El ID del proyecto es requerido para actualizar');
    }
    if (!projectData.name || projectData.name.trim() === '') {
      throw new Error('El nombre del proyecto es obligatorio para actualizar');
    }
    if (!projectData.statusId) {
      throw new Error('El estado del proyecto es obligatorio');
    }

    const updatedProject = await this.projectRepository.update(id, projectData);
    if (!updatedProject) {
      throw new Error('No se encontró el proyecto a actualizar');
    }

    return updatedProject;
  }
}

module.exports = UpdateProject;