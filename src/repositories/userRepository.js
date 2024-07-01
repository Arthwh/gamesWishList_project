import db from '../db/index.js'
import { User } from '../models/userModel.js'
import { randomUUID } from "node:crypto";

export async function createUser(userData) {
    const uuid = randomUUID();
    const listId = randomUUID();
    const userSql = `
        INSERT INTO user (user_id, name, username, email, password, birthdate, receive_updates, agree_terms)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const listSql = `
        INSERT INTO lists (list_id, user_id, empty)
        VALUES (?, ?, ?)
    `;
    const userParams = [uuid, userData.name, userData.username, userData.email, userData.password, userData.birthdate, userData.newsletter, userData.terms];
    const listParams = [listId, uuid, 1]; // Inicialmente, a lista está vazia

    try {
        await new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run('BEGIN TRANSACTION');
                db.run(userSql, userParams, (err) => {
                    if (err) {
                        db.run('ROLLBACK');
                        console.error('Error creating user:', err.message);
                        reject('Error creating user: ' + err.message);
                        return;
                    }
                    db.run(listSql, listParams, (err) => {
                        if (err) {
                            db.run('ROLLBACK');
                            console.error('Error creating list:', err.message);
                            reject('Error creating list: ' + err.message);
                            return;
                        }
                        db.run('COMMIT', (err) => {
                            if (err) {
                                db.run('ROLLBACK');
                                console.error('Error committing transaction:', err.message);
                                reject('Error committing transaction: ' + err.message);
                                return;
                            }
                            resolve();
                        });
                    });
                });
            });
        });
        return { message: "User and list created successfully" };
    } catch (error) {
        console.error('Error in transaction: ', error.message);
        throw error;
    }
}

export async function findUserByEmail(email) {
    try {
        const sql = 'SELECT * FROM user u INNER JOIN lists l WHERE u.user_id = l.user_id AND email = ?';
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


