export class User {
    constructor({ id, username, email, password, birthdate }) {
        // console.log(id + ", " + username + ", " + email + ", " + password + ", " + birthdate)
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.birthdate = birthdate;
    }
}

// Método para validar dados do usuário
export function validate(userData) {
    const { username, email, password, birthdate } = userData;
    // console.log(id + ", " + username + ", " + email + ", " + password + ", " + birthdate)
    if (!username || !email || !password || !dateOfBirth) {
        return false
    }
    return true
}