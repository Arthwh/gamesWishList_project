export class User {
    constructor({ id, username, email, password, birthdate }) {
        console.log(id + ", " + username + ", " + email + ", " + password + ", " + birthdate)
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.birthdate = birthdate;
    }
}

// Método para validar dados do usuário
export function validate(userData) {
    // Implementar validações de dados aqui
    const { username, email, password, dateOfBirth } = userData;
    if (!username || !email || !password || !dateOfBirth) {
        throw new Error('Todos os campos são obrigatórios');
    }
    return true
}