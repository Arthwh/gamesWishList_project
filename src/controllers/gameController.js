import { list } from 'postcss';
import { addGameToListService, deleteGameFromListService, editGameStatusFromListService, getGamesListService } from '../services/gameService.js';

export const getGamesPage = async (request, reply) => {
    if (!request.isAuthenticated) {
        const currentUrl = request.raw.url; // obtém a URL solicitada
        reply.redirect(`/login?redirectUrl=${encodeURIComponent(currentUrl)}`);
    }
    return reply.sendFile('games-list-page.html');
};

export const getGameInfoPage = async (request, reply) => {
    if (!request.isAuthenticated) {
        const currentUrl = request.raw.url; // obtém a URL solicitada
        reply.redirect(`/login?redirectUrl=${encodeURIComponent(currentUrl)}`);
    }
    return reply.sendFile('game-view.html');
};

export const getUserGamesPage = async (request, reply) => {
    if (!request.isAuthenticated) {
        const currentUrl = request.raw.url; // obtém a URL solicitada
        reply.redirect(`/login?redirectUrl=${encodeURIComponent(currentUrl)}`);
    }
    return reply.sendFile('user-games-list.html');
};

export const getUserGamesList = async (request, reply) => {
    if (!request.isAuthenticated) {
        const currentUrl = request.raw.url; // obtém a URL solicitada
        reply.redirect(`/login?redirectUrl=${encodeURIComponent(currentUrl)}`);
    }
    try {
        const user = request.user
        const listOfGames = await getGamesListService(user);
        return reply.status(200).send(listOfGames)
    } catch (error) {
        return reply.status(500).send({ error: error.message });
    }
};

export const addGameToList = async (request, reply) => {
    if (!request.isAuthenticated) {
        const currentUrl = request.raw.url; // obtém a URL solicitada
        reply.redirect(`/login?redirectUrl=${encodeURIComponent(currentUrl)}`);
    }
    try {
        const userAndGameData = request.body;
        const user = request.user
        if (!userAndGameData) {
            throw new Error("Request body should not be empty.")
        }
        await addGameToListService(user, userAndGameData)
        return reply.status(200).send({ message: "Game added successfully." })
    } catch (error) {
        return reply.status(500).send({ error: error.message });
    }
};

export const deleteGameFromList = async (request, reply) => {
    if (!request.isAuthenticated) {
        const currentUrl = request.raw.url; // obtém a URL solicitada
        reply.redirect(`/login?redirectUrl=${encodeURIComponent(currentUrl)}`);
    }
    try {
        const userAndGameData = request.body;
        const user = request.user
        if (!userAndGameData) {
            throw new Error("Request body should not be empty.")
        }
        await deleteGameFromListService(user, userAndGameData)
        return reply.status(200).send({ message: "Game deleted successfully." })
    } catch (error) {
        return reply.status(500).send({ error: error.message });
    }
};

export const editGameStatusFromList = async (request, reply) => {
    if (!request.isAuthenticated) {
        const currentUrl = request.raw.url; // obtém a URL solicitada
        reply.redirect(`/login?redirectUrl=${encodeURIComponent(currentUrl)}`);
    }
    try {
        const gameData = request.body;
        const user = request.user
        if (!gameData) {
            throw new Error("Request body should not be empty.")
        }
        await editGameStatusFromListService(user, gameData)
        return reply.status(200).send({ message: "Game status edited successfully." })
    } catch (error) {
        return reply.status(500).send({ error: error.message });
    }
};

export const getUserListId = async (request, reply) => {
    if (!request.isAuthenticated) {
        return reply.status(400).send({ error: "Erro ao obter id da lista. Usuario nao autenticado." });
    }
    const listId = request.user.list_id
    if (listId) {
        return reply.status(200).send({ listId })
    }
    return reply.status(404).send({ error: "Erro ao obter id da lista. Id da lista nao encontrado." })
};

export const getSharedList = async (request, reply) => {
    if (!request.isAuthenticated) {
        const currentUrl = request.raw.url; // obtém a URL solicitada
        reply.redirect(`/login?redirectUrl=${encodeURIComponent(currentUrl)}`);
    }
    const listId = request.query.list
    if (!listId) {
        return reply.status(400).send({ error: "Lista compartilhada invalida"})
    }
    if (listId) {
        return reply.status(200).send({ listId })
    }
    return reply.status(404).send({ error: "Erro ao obter lista compartilhada." })
};