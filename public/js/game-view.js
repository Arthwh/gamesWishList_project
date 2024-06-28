// Extrair o valor do parâmetro 'id'
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const gameId = urlParams.get('id');

// Seleção dos elementos do DOM que serão manipulados
const gameCoverElement = document.getElementById("gameCover");
const gameNameElement = document.getElementById("gameName");
const gameStorylineElement = document.getElementById("gameStoryline");
const gameStatusElement = document.getElementById("gameStatus");
const gameRatingElement = document.getElementById("gameRating");
const gameAggregatedRatingElement = document.getElementById("gameAggregatedRating");
const gameDescriptionElement = document.getElementById("gameDescription");
const gameExternalLinksElement = document.getElementById("gameExternalLinks");
const criticReviewsElement = document.getElementById("criticReviews");
const similarGamesCarouselElement = document.getElementById("similarGamesCarousel");
const gameVideosElement = document.getElementById("gameVideos");
const gameArtworksElement = document.getElementById("gameArtworks");
const gameScreenshotsElement = document.getElementById("gameScreenshots");

const gameDetailsSection = document.getElementById("gameDetailsSection");


const carouselPrevButton = document.getElementById("prevButton");
const carouselNextButton = document.getElementById("nextButton");

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
            formatAndSetGameInfo(data)
        }
    } catch (error) {
        console.error('Erro ao buscar dados do jogo:', error);
        setMessage(error);
    }
}

function formatAndSetGameInfo(gameData) {
    var cover = gameData[0].cover ? gameData[0].cover.url : '';
    var coverEdited = cover.replace("t_thumb", "t_cover_big")
    gameCoverElement.src = coverEdited;
    gameNameElement.innerHTML = gameData[0].name || "Nome não informado";
    gameStorylineElement.innerHTML = "<b>Storyline: </b>" + gameData[0]?.summary + gameData[0]?.storyline || "Sinopse não informada";
    gameStatusElement.innerHTML = gameData[0].status || "Status não informado";
    formatExternalLinks(gameData[0].websites)
    gameData[0].rating !== undefined ? gameRatingElement.innerHTML = "Rating: <b>" + gameData[0].rating.toFixed(2) + "</b>" : gameRatingElement.innerHTML = 'Rating não disponível'
}

function getSimilarGames() {

}

// Função para formatar links externos
function formatExternalLinks(gameWebsites) {
    // Verifica se a lista de websites está vazia
    if (!gameWebsites || gameWebsites.length === 0) {
        return;
    }
    // Adiciona o cabeçalho "External Links" antes da lista de links
    const headerHTML = `<h2 class="text-xl font-bold mt-6">External Links</h2>`;
    gameExternalLinksElement.insertAdjacentHTML('beforebegin', headerHTML);
    gameWebsites.forEach(website => {
        const siteName = extractSiteName(website.url);
        const linkHTML = `<a target="_blank" rel="noopener noreferrer" href="${website.url}" class="hover:bg-gray-600 m-2 p-2 bg-gray-700 rounded">${siteName}</a>`;
        gameExternalLinksElement.insertAdjacentHTML('beforeend', linkHTML);
    });
}

// Função auxiliar para extrair o nome do site
function extractSiteName(url) {
    const hostname = new URL(url).hostname;
    return hostname.replace('www.', '');
}

