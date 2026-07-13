class User {
    constructor({ id, name, email, role, password, created_at }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.password = password; // Agregado
        this.createdAt = created_at;
    }
}

module.exports = User;