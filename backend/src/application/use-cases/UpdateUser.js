class UpdateUser {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(id, userData) {
        if (!id) throw new Error('El ID de usuario es requerido.');
        if (!userData.name || !userData.email || !userData.role || !userData.password) {
            throw new Error('Todos los campos del usuario son obligatorios.');
        }
        return await this.userRepository.update(id, userData);
    }
}

module.exports = UpdateUser;