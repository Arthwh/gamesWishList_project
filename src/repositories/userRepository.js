import db from '../db/index.js'
import { User } from '../models/userModel.js'

async function createUser(userData) {
    if (User.validate(userData)) {
        const user = new User(userData);
        const result = await db.query('INSERT INTO user SET ?', user);
        return { ...user, id: result.insertId };
    }
}

export async function findUserByEmail(email) {
    return new Promise((resolve, reject) => {
        console.log("email: " + email);
        
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
            console.log("resultado consulta: " + JSON.stringify(rows[0]));
            resolve(new User(rows[0]));
        });
    });
}