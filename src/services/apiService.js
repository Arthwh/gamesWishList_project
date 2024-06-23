import { fetchGames as fetchAll } from "../repositories/apiRepository.js";

export async function fetchGames(limit, offset) {
    try {
        const games = await fetchAll(limit, offset);
        // console.log("depuracaoService: " + games)
        return games;
    } catch (error) {
        console.error('Erro ao obter dados dos games:', error.message);
        throw error;
    }
}