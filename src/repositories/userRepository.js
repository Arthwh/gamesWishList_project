import db from '../db/index.js'
import { User } from '../models/userModel.js'
import { randomUUID } from "node:crypto";

export async function createUser(userData) {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO user (id, name, username, email, password, birthdate, receive_updates, agree_terms)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const uuid = randomUUID();
        const params = [uuid, userData.name, userData.username, userData.email, userData.password, userData.birthdate, userData.newsletter, userData.terms];

        db.run(sql, params, (err) => {
            if (err) {
                console.error('Error creating user:', err.message);
                reject('Error creating user: ' + err.message);
                return;
            }
            resolve();
        });
    });
}

export async function findUserByEmail(email) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM user WHERE email = ?';
        db.all(sql, [email], (err, rows) => {
            if (err) {
                console.error('Error finding user by email:', err);
                reject(err);
                return;
            }
            if (rows.length === 0) {
                console.log("No user found with this email.");
                resolve(null);
                return;
            }
            resolve(new User(rows[0]));
        });
    });
}

export async function verifyUniqueUser(email, username) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT email, username FROM user WHERE email = ? OR username = ?';
        db.all(sql, [email, username], (err, rows) => {
            if (err) {
                console.error('Error verifying unique user:', err);
                reject(err);
                return;
            }
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
                    resolve({ unique: false, message: 'Email and Username already exist' });
                } else if (existingFields.email) {
                    resolve({ unique: false, message: 'Email already exists' });
                } else if (existingFields.username) {
                    resolve({ unique: false, message: 'Username already exists' });
                }
            } else {
                resolve({ unique: true });
            }
        });
    });
}


