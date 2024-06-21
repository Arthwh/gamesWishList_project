import db from './index.js'
import argon2 from 'argon2';
import { randomUUID } from "node:crypto";


// Função para criar a tabela de usuários
function createUsersTable() {
    //const queryDrop = `DROP TABLE IF EXISTS user`
    const query = `
        CREATE TABLE IF NOT EXISTS user (
            id TEXT PRIMARY KEY,
            name TEXT,
            username TEXT UNIQUE,
            email TEXT UNIQUE,
            password TEXT,
            birthdate TEXT,
            receive_updates INTEGER,
            agree_terms INTEGER
        )
    `;
    // db.run(queryDrop, (err) => {
    //     if (err) {
    //         console.error('Erro ao excluir tabela de usuários:', err.message);
    //     } else {
    //         console.log('Tabela de usuários excluida com sucesso.');
    //     }
    // });

    db.run(query, (err) => {
        if (err) {
            console.error('Erro ao criar tabela de usuários:', err.message);
        } else {
            console.log('Tabela de usuários criada com sucesso.');
        }
    });
}

async function insertRootUser() {
    const hashedPassword = await argon2.hash("senha123", 10);
    const uuid = randomUUID()
    const query = `INSERT INTO user (id, name, username, email, password, birthDate) VALUES ('${uuid}', 'root', 'root', 'root@root.com', '${hashedPassword}', '01/01/0001')`;
    db.run(query, (err) => {
        if (err) {
            console.error('Erro ao inserir usuário "root":', err.message);
        } else {
            console.log('Usuário "root" criado com sucesso!.');
        }
    })
}

// Função para inicializar o banco de dados
function init() {
    createUsersTable();
    insertRootUser();
}

init();
