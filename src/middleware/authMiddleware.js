import { jwt } from 'jsonwebtoken'
import "dotenv/config";

const key = process.env.SECRET_KEY;

function authMiddleware(request, reply, done) {
    // Verifica se o token JWT está presente nos cookies, headers ou corpo da requisição
    const token = request.cookies.jwt-token || request.headers.authorization?.split(' ')[1];

    if (!token) {
        return reply.code(401).send({ message: 'Unauthorized' });
    }

    // Verifica se o token é válido
    jwt.verify(token, key, (err, decoded) => {
        if (err) {
            return reply.code(401).send({ message: 'Invalid token' });
        }
        // Anexa o usuário decodificado (ou informações relevantes) ao objeto de solicitação para uso posterior
        request.user = decoded;
        done();
    });
}

export default authMiddleware;