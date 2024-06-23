import "dotenv/config";
import { findUserByEmail } from '../repositories/userRepository.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

const key = process.env.SECRET_KEY;

export async function authenticateUser(email, password) {
    try {
        const user = await findUserByEmail(email);
        if (!user || !(await argon2.verify(user.password, password))) {
            throw new Error('Credenciais inválidas');
        }
        const token = generateToken(user)
        return { token, userId: user.id };
    } catch (error) {
        console.error('Erro na autenticação:', error.message);
        throw error;
    }
}

function generateToken(user) {
    const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
    };
    
    const token = jwt.sign(payload, key, { expiresIn: '1h' });
    return token;
}