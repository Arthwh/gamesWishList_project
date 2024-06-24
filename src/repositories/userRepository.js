import db from '../db/index.js'
import { User } from '../models/userModel.js'
import { randomUUID } from "node:crypto";

export async function createUser(userData) {
    try {
        const uuid = randomUUID();
        const sql = `
            INSERT INTO user (id, name, username, email, password, birthdate, receive_updates, agree_terms)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [uuid, userData.name, userData.username, userData.email, userData.password, userData.birthdate, userData.newsletter, userData.terms];
        await new Promise((resolve, reject) => {
            db.run(sql, params, (err) => {
                if (err) {
                    console.error('Error creating user:', err.message);
                    reject('Error creating user: ' + err.message);
                    return;
                }
                resolve();
            });
        });
        return { message: "User created successfully" };
    } catch (error) {
        console.error('Erro ao criar usuário: ', error.message);
        throw error;
    }
}

export async function findUserByEmail(email) {
    try {
        const sql = 'SELECT * FROM user WHERE email = ?';
        const rows = await new Promise((resolve, reject) => {
            db.all(sql, [email], (err, rows) => {
                if (err) {
                    console.error('Error finding user by email:', err);
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
        if (rows.length === 0) {
            console.error("No user found with this email.");
            return null;
        }
        return new User(rows[0]);
    } catch (error) {
        console.error('Error finding user by email:', error);
        throw error;
    }
}

export async function verifyUniqueUser(email, username) {
    try {
        const sql = 'SELECT email, username FROM user WHERE email = ? OR username = ?';
        const rows = await new Promise((resolve, reject) => {
            db.all(sql, [email, username], (err, rows) => {
                if (err) {
                    console.error('Error verifying unique user:', err);
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
        const existingFields = {
            email: false,
            username: false
        };
        if (rows.length > 0) {
            rows.forEach(row => {
                if (row.email === email) {
                    existingFields.email = true;
                }
                if (row.username === username) {
                    existingFields.username = true;
                }
            });
            if (existingFields.email && existingFields.username) {
                return { unique: false, message: 'Email and Username already exist' };
            } else if (existingFields.email) {
                return { unique: false, message: 'Email already exists' };
            } else if (existingFields.username) {
                return { unique: false, message: 'Username already exists' };
            }
        } else {
            return { unique: true };
        }
    } catch (error) {
        console.error('Error verifying unique user:', error);
        throw error;
    }
}


