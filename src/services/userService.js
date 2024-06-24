import argon2 from 'argon2';
import { verifyUniqueUser, createUser as createUserRepository } from '../repositories/userRepository.js';

export async function createUser(userData) {
    try {
        // Validação de entrada
        if (!userData.email || !userData.username || !userData.password) {
            throw new Error('Email, username, and password are required fields');
        }

        const result = await verifyUniqueUser(userData.email, userData.username);
        if (result.unique) {
            userData.password = await argon2.hash(userData.password);
            await createUserRepository(userData);
            return { message: "User created successfully" };
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('Erro ao criar usuário: ' + error.message);
        throw error;
    }
}