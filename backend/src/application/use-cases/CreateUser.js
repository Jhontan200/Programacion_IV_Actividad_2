class CreateUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  async execute(userData) {
    if (!userData.name || !userData.email || !userData.role || !userData.password) {
      throw new Error('Todos los campos del usuario son obligatorios, incluyendo la contraseña.');
    }
    return await this.userRepository.create(userData);
  }
}
module.exports = CreateUser;