import { verifyIfGameIsAddedToList, addGameToListRepository, getGamesListRepository, deleteGamesListRepository, editGameStatusRepository } from '../repositories/gameRepository.js';

export async function getGamesListService(user) {
    try {
        if (!user.user_id || user.length === 0 || !user.list_id) {
            throw new Error("Usuario ou lista nao encontrados")
        }
        const userGamesList = await getGamesListRepository(user.user_id, user.list_id);
        return userGamesList;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

export async function addGameToListService(user, gameData) {
    try {
        if (!user || user.length === 0) {
            throw new Error("Usuario nao encontrado")
        }
        if (!gameData || gameData.length === 0) {
            throw new Error("Dados do jogo nao encontrados")
        }
        if (verifyIfGameIsAddedToList(user.user_id, user.list_id, gameData.gameId) === true) {
            throw new Error("Jogo ja adicionado a lista")
        }
        await addGameToListRepository(user.user_id, user.list_id, gameData.gameId, gameData.status)
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

export async function deleteGameFromListService(user, gameData) {
    try {
        if (!user || user.length === 0) {
            throw new Error("Usuario nao encontrado")
        }
        if (!gameData || gameData.length === 0) {
            throw new Error("Dados do jogo nao encontrados")
        }
        if (!verifyIfGameIsAddedToList(user.user_id, user.list_id, gameData) === true) {
            throw new Error("Jogo nao encontrado na lista")
        }
        await deleteGamesListRepository(user.user_id, user.list_id, gameData)
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

export async function editGameStatusFromListService(user, gameData) {
    try {
        if (!user || user.length === 0) {
            throw new Error("Usuario nao encontrado")
        }
        if (!gameData || gameData.length === 0) {
            throw new Error("Dados do jogo nao encontrados")
        }
        if (!verifyIfGameIsAddedToList(user.user_id, user.list_id, gameData.gameId) === true) {
            throw new Error("Jogo nao encontrado na lista")
        }
        await editGameStatusRepository(user.user_id, user.list_id, gameData.gameId, gameData.status)
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};


