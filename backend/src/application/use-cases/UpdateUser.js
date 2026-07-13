class UpdateUser {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(id, userData) {
        if (!id) throw new Error('El ID de usuario es requerido.');
        // Quitamos 'password' de la validación obligatoria al actualizar
        if (!userData.name || !userData.email || !userData.role) {
            throw new Error('El nombre, correo y rol son campos obligatorios.');
        }
        return await this.userRepository.update(id, userData);
    }
}

module.exports = UpdateUser;