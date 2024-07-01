export class User {
    constructor({ user_id, username, email, password, birthdate, list_id }) {
        this.user_id = user_id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.birthdate = birthdate;
        this.list_id = list_id
    }
}

// Método para validar dados do usuário
export function validate(userData) {
    const { username, email, password, birthdate, list_id } = userData;
    if (!username || !email || !password || !birthdate || !list_id) {
        return false
    }
    return true
}