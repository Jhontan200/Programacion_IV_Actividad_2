const PgUserRepository = require('../../repositories/PgUserRepository');
const ListUsers = require('../../../application/use-cases/ListUsers');
const CreateUser = require('../../../application/use-cases/CreateUser');
const UpdateUser = require('../../../application/use-cases/UpdateUser');
const DeleteUser = require('../../../application/use-cases/DeleteUser');
const LoginUser = require('../../../application/use-cases/LoginUser');

const userRepository = new PgUserRepository();

class UserController {
    async getAll(req, res) {
        try {
            const useCase = new ListUsers(userRepository);
            const users = await useCase.execute();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const useCase = new CreateUser(userRepository);
            const newUser = await useCase.execute(req.body);
            res.status(201).json(newUser);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // NUEVO: Endpoint de Actualización
    async update(req, res) {
        try {
            const { id } = req.params;
            const useCase = new UpdateUser(userRepository);
            const updatedUser = await useCase.execute(id, req.body);
            res.json(updatedUser);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const useCase = new DeleteUser(userRepository);
            await useCase.execute(id);
            res.json({ message: 'Usuario eliminado con éxito' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // NUEVO: Endpoint de Login
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const useCase = new LoginUser(userRepository);
            const user = await useCase.execute(email, password);
            res.json(user);
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
}

module.exports = new UserController();