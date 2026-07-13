class UserRepository {
    async findAll() {
        throw new Error('Método findAll() no implementado');
    }

    async create(userData) {
        throw new Error('Método create() no implementado');
    }

    async delete(id) {
        throw new Error('Método delete() no implementado');
    }
}

module.exports = UserRepository;