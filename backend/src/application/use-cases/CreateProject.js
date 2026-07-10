class CreateProject {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(projectData) {
    // Validaciones de negocio antes de persistir
    if (!projectData.name || projectData.name.trim() === '') {
      throw new Error('El nombre del proyecto es obligatorio');
    }
    if (!projectData.startDate) {
      throw new Error('La fecha de inicio es obligatoria');
    }
    if (!projectData.statusId) {
      throw new Error('El estado del proyecto es obligatorio');
    }

    return await this.projectRepository.create(projectData);
  }
}

module.exports = CreateProject;