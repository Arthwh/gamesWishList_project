import jwt from 'jsonwebtoken'
import "dotenv/config";

const key = process.env.SECRET_KEY;

export function isAuthenticated(request, reply, done) {
    let token;
    if (request.cookies && request.cookies['jwt-token']) {
        token = request.cookies['jwt-token'];
    } else if (request.headers && request.headers.authorization) {
        token = request.headers.authorization.split(' ')[1];
    }

    if (!token) {
        request.isAuthenticated = false;
        done();
        return;
    }

    jwt.verify(token, key, (err, decoded) => {
        if (err) {
            request.isAuthenticated = false;
        } else {
            request.isAuthenticated = true;
            request.user = decoded; // Anexa o usuário decodificado ao objeto de solicitação para uso posterior
        }
        done();
    });
}