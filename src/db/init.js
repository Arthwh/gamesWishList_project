import db from './index.js'
import argon2 from 'argon2';
import { randomUUID } from "node:crypto";


// Função para criar as tabelas
async function createTables() {
    // const queryDeleteGamesList = `DELETE FROM games_in_lists`
    // const queryDropUser = `DROP TABLE IF EXISTS user`
    // const queryDropLists = `DROP TABLE IF EXISTS lists`
    // const queryDropGamesInLists = `DROP TABLE IF EXISTS games_in_lists`

    // const query = `
    //     CREATE TABLE IF NOT EXISTS user (
    //         user_id TEXT PRIMARY KEY,
    //         name TEXT,
    //         username TEXT UNIQUE,
    //         email TEXT UNIQUE,
    //         password TEXT,
    //         birthdate TEXT,
    //         receive_updates INTEGER,
    //         agree_terms INTEGER
    //     )
    // `;

    // const listTableQuery = `
    //     CREATE TABLE IF NOT EXISTS lists (
    //         list_id TEXT PRIMARY KEY,
    //         user_id TEXT UNIQUE,
    //         empty INTEGER DEFAULT 1,
    //         FOREIGN KEY(user_id) REFERENCES user(id)
    //     )
    // `;

    // const gamesInListsTableQuery = `
    //     CREATE TABLE IF NOT EXISTS games_in_lists (
    //         game_in_list_id TEXT PRIMARY KEY,
    //         list_id TEXT,
    //         user_id TEXT,
    //         game_id TEXT,
    //         status TEXT,
    //         date_added TEXT,
    //         FOREIGN KEY(list_id) REFERENCES lists(id),
    //         FOREIGN KEY(user_id) REFERENCES user(id)
    //     )
    // `;

    // await db.run(queryDropUser, (err) => {
    //     if (err) {
    //         console.error('Erro ao excluir tabela de usuários:', err.message);
    //     } else {
    //         console.log('Tabela de usuários excluida com sucesso.');
    //     }
    // });
    // await db.run(queryDropLists, (err) => {
    //     if (err) {
    //         console.error('Erro ao excluir tabela de listas:', err.message);
    //     } else {
    //         console.log('Tabela de listas excluida com sucesso.');
    //     }
    // });
    // await db.run(queryDropGamesInLists, (err) => {
    //     if (err) {
    //         console.error('Erro ao excluir tabela de GamesInLists:', err.message);
    //     } else {
    //         console.log('Tabela de GamesInLists excluida com sucesso.');
    //     }
    // });

    // await db.run(query, (err) => {
    //     if (err) {
    //         console.error('Erro ao criar tabela de usuários:', err.message);
    //     } else {
    //         console.log('Tabela de usuários criada com sucesso.');
    //     }
    // });

    // await db.run(listTableQuery, (err) => {
    //     if (err) {
    //         console.error('Erro ao criar tabela de listas:', err.message);
    //     } else {
    //         console.log('Tabela de listas criada com sucesso.');
    //     }
    // });

    // await db.run(queryDeleteGamesList, (err) => {
    //     if (err) {
    //         console.error('Erro ao criar tabela de jogos nas listas:', err.message);
    //     } else {
    //         console.log('Tabela de jogos nas listas criada com sucesso.');
    //     }
    // });
}

// async function insertRootUser() {
//     const hashedPassword = await argon2.hash("senha123", 10);
//     const uuid = randomUUID()
//     const query = `INSERT INTO user (user_id, name, username, email, password, birthDate) VALUES ('${uuid}', 'root', 'root', 'root@root.com', '${hashedPassword}', '01/01/0001')`;
//     db.run(query, (err) => {
//         if (err) {
//             console.error('Erro ao inserir usuário "root":', err.message);
//         } else {
//             console.log('Usuário "root" criado com sucesso!.');
//         }
//     })
// }

// Função para inicializar o banco de dados
async function init() {
    // await createTables();
    // insertRootUser();
}

init();
