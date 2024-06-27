// Extrair o valor do parâmetro 'id'
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const gameId = urlParams.get('id');

// Inicializa a página ao carregar o DOM
document.addEventListener('DOMContentLoaded', async () => {
    loadGameData();
});

async function loadGameData() {
    try {
        console.log("teste")
        const response = await fetch(`/api/games/info?id=${gameId}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error)
        }
        if (Array.isArray(data) && data.length > 0) {
            console.log("dados: " + JSON.stringify(data))
        }
    } catch (error) {
        console.error('Erro ao buscar dados do jogo:', error);
        setMessage(error);
    }
}