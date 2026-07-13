class LoginUser {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(email, password) {
        if (!email || !password) {
            throw new Error('El correo y la contraseña son requeridos.');
        }
        const user = await this.userRepository.findByEmail(email);
        if (!user || user.password !== password) {
            throw new Error('Credenciales inválidas o correo inexistente.');
        }
        return user;
    }
}

module.exports = LoginUser;