class DeleteUser {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(id) {
        if (!id) {
            throw new Error('ID del usuario requerido para eliminar.');
        }
        return await this.userRepository.delete(id);
    }
}
module.exports = DeleteUser;