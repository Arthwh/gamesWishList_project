import { jwt } from 'jsonwebtoken'
import { secret } from '../config' // Configure sua chave secreta JWT em um arquivo config separado

function authMiddleware(request, reply, done) {
    // Verifica se o token JWT está presente nos cookies, headers ou corpo da requisição
    const token = request.cookies.token || request.headers.authorization?.split(' ')[1];

    if (!token) {
        return reply.code(401).send({ message: 'Unauthorized' });
    }

    // Verifica se o token é válido
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return reply.code(401).send({ message: 'Invalid token' });
        }
        // Anexa o usuário decodificado (ou informações relevantes) ao objeto de solicitação para uso posterior
        request.user = decoded;
        done();
    });
}

export default authMiddleware;