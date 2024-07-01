import db from '../db/index.js'
import { User } from '../models/userModel.js'
import { randomUUID } from "node:crypto";

function getCurrentDate() {
    var currentdate = new Date();
    var datetime = currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
    return datetime
}

export async function verifyIfGameIsAddedToList(user_id, list_id, game_id) {
    try {
        const sql = `SELECT * FROM games_in_lists WHERE user_id = ? AND list_id = ? AND game_id = ?;`;
        const params = [user_id, list_id, game_id];
        const rows = await new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => {
                if (err) {
                    console.error('Error verifying if game is already added: ', err);
                    reject(err);
                    return
                }
            });
        });
        if (rows.length > 0) {
            return true
        }
        return false
    } catch (error) {
        console.error('Error verifying if game is already added: ', error.message);
        throw error;
    }
}

export async function getGamesListRepository(user_id, list_id) {
    try {
        const sql = `SELECT game_id, status, date_added FROM games_in_lists WHERE user_id = ? AND list_id = ?;`;
        const params = [user_id, list_id];
        const rows = await new Promise((resolve, reject) => {
            db.all(sql, [user_id, list_id], (err, rows) => {
                if (err) {
                    console.error('Error getting user games list: ', err);
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
        if (rows.length > 0) {
            return rows
        }
        return null
    } catch (error) {
        console.error('Error getting user games list: ', error.message);
        throw error;
    }
}

export async function addGameToListRepository(userId, listId, gameId, gameStatus) {
    try {
        const uuid = randomUUID();
        const date_added = getCurrentDate();
        const sql = `
            INSERT INTO games_in_lists (game_in_list_id, list_id, user_id, game_id, status, date_added)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const params = [uuid, listId, userId, gameId, gameStatus, date_added];
        await new Promise((resolve, reject) => {
            db.run(sql, params, (err) => {
                if (err) {
                    console.error('Error adding game to list: ', err.message);
                    reject('Error adding game to list: ' + err.message);
                    return;
                }
                resolve();
            });
        });
        return { message: "Game added successfully" };
    } catch (error) {
        console.error('Error adding game to list: ', error.message);
        throw error;
    }
}

export async function deleteGamesListRepository(user_id, list_id, game_id) {
    try {
        const sql = `DELETE FROM games_in_lists WHERE user_id = ? AND list_id = ? AND game_id = ?;`;
        const params = [user_id, list_id, game_id];
        await new Promise((resolve, reject) => {
            db.run(sql, params, (err) => {
                if (err) {
                    console.error('Error deleting game from list: ', err);
                    reject(err);
                    return;
                }
                resolve();
            });
        });
        return { message: "Game deleted successfully" };
    } catch (error) {
        console.error('Error deleting game from list: ', error.message);
        throw error;
    }
}

export async function editGameStatusRepository(user_id, list_id, game_id, gameStatus) {
    try {
        const sql = `UPDATE games_in_lists SET status = ? WHERE user_id = ? AND list_id = ? AND game_id = ?;`;
        const params = [gameStatus, user_id, list_id, game_id];
        await new Promise((resolve, reject) => {
            db.run(sql, params, (err) => {
                if (err) {
                    console.error('Error updating game status: ', err);
                    reject(err);
                    return;
                }
                resolve();
            });
        });
        return { message: "Game status updated successfully" };
    } catch (error) {
        console.error('Error updating game status: ', error.message);
        throw error;
    }
} editGameStatusRepository