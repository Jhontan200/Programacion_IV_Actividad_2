class GetStatuses {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute() {
    return await this.projectRepository.getStatuses();
  }
}

module.exports = GetStatuses;