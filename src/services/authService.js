import "dotenv/config";
import { findUserByEmail } from '../repositories/userRepository.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

const key = process.env.SECRET_KEY;

export async function authenticateUser(email, password) {
    try {
        if (!email || !password) {
            throw new Error("Email and password are required");
        }
        const user = await findUserByEmail(email);
        if (!user || !(await argon2.verify(user.password, password))) {
            throw new Error('Credenciais inválidas');
        }
        const token = generateToken(user)
        return { token, userId: user.id };
    } catch (error) {
        throw error;
    }
}

function generateToken(user) {
    const payload = {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        list_id: user.list_id,
    };

    const token = jwt.sign(payload, key, { expiresIn: '1h' });
    return token;
}