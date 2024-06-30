// Extrair o valor do parâmetro 'id'
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const gameId = urlParams.get('id');

// Seleção dos elementos do DOM que serão manipulados
const loadingElement = document.getElementById("loading")
const mainContainer = document.getElementById("mainContainer")
const gameCoverElement = document.getElementById("gameCover");
const gameNameElement = document.getElementById("gameName");
const gameStorylineElement = document.getElementById("gameStoryline");
const gameRatingElement = document.getElementById("gameRating");
const gameGenresElement = document.getElementById("gameGenres");
const gamePlatformsElement = document.getElementById("gamePlatforms");
const gameReleaseDateElement = document.getElementById("gameReleaseDate");
const gameDescriptionElement = document.getElementById("gameDescription");
const gameExternalLinksElement = document.getElementById("gameExternalLinks");
const similarGamesElement = document.getElementById("similarGames");
const gameVideosElement = document.getElementById("gameVideos");
const gameArtworksElement = document.getElementById("gameArtworks");
const gameScreenshotsElement = document.getElementById("gameScreenshots");

const gameDetailsSection = document.getElementById("gameDetailsSection");
const gameStorylineSection = document.getElementById("game-storyline-section");
const gameVideosCarousel = document.getElementById("game-videos-carousel");
const gameExternalLinksSection = document.getElementById("game-externalLinks-section");
const similarGamesCarousel = document.getElementById("similarGames-carousel")

const carouselVideosNext = document.getElementById("gameVideosCarousel_next")
const carouselVideosPrev = document.getElementById("gameVideosCarousel_prev")
const carouselSimilarGamesNext = document.getElementById("similarGamesCarousel_next")
const carouselSimilarGamesPrev = document.getElementById("similarGamesCarousel_prev")
const wishlistButton = document.getElementById("wishlistButton")

// Variáveis de estado
var contVideoAtual = 0
var contTotalVideos = 0

// Inicializa a página ao carregar o DOM
document.addEventListener('DOMContentLoaded', async () => {
    loadGameData();
    wishlistButton.addEventListener("click", () => {
        addToList(gameId);
    });
});

async function loadGameData() {
    try {
        const response = await fetch(`/api/games/info?id=${gameId}`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error)
        }
        if (Array.isArray(data) && data.length > 0) {
            // console.log("dados: " + JSON.stringify(data))
            //Obtem, formata e seta os games similares
            await getSimilarGames(data[0].similar_games)

            loadingElement.classList.add("hidden")
            mainContainer.classList.remove("display:none")
            await formatAndSetGameInfo(data)
        }
    } catch (error) {
        console.error('Erro ao buscar dados do jogo:', error);
        setMessage(error);
    }
}

async function formatAndSetGameInfo(gameData) {
    // Obtem a imagem e substitui uma parte da url (imagem com maior resolucao)
    var cover = gameData[0].cover ? gameData[0].cover.url : '';
    var coverEdited = formatImgURL(cover)
    gameCoverElement.src = coverEdited;
    gameCoverElement.classList.remove("hidden")
    gameNameElement.innerHTML = gameData[0].name || "Nome não informado";
    //Formata e atribui o rating
    if (gameData[0].rating) {
        gameRatingElement.classList.remove("hidden")
        gameRatingElement.innerHTML = "<b>Rating: </b>" + gameData[0].rating.toFixed(2);
    }
    //Formata e atribui os generos
    formatAndSetGenres(gameData[0].genres)
    //Formata e atribui as plataformas
    formatAndSetPlatforms(gameData[0].platforms)
    //Formata e atribui data de lançamento
    formatAndSetFirstReleaseDate(gameData[0].first_release_date)
    gameDetailsSection.classList.remove("hidden")
    //Formata e atribui os links externos
    formatExternalLinks(gameData[0].external_games)
    //Formata e atribui a sinopse
    formatAndSetStoryline(gameData[0].summary, gameData[0].storyline);
    //Formata e atribui os videos
    formatAndSetVideos(gameData[0].videos)
}

function formatImgURL(url) {
    return url.replace("t_thumb", "t_cover_big")
}

function formatAndSetGenres(genres) {
    const gameGenres = genres?.map(genre => genre.name).filter(Boolean).join(', ') || null;
    if (gameGenres) {
        gameGenresElement.classList.remove("hidden");
        gameGenresElement.innerHTML = "<b>Genres: </b>" + gameGenres;
    }
}

function formatAndSetPlatforms(platforms) {
    const gamePlatforms = platforms?.map(platform => platform.abbreviation).filter(Boolean).join(', ') || null;
    if (gamePlatforms) {
        gamePlatformsElement.classList.remove("hidden");
        gamePlatformsElement.innerHTML = "<b>Platforms: </b>" + gamePlatforms;
    }
}

function formatAndSetFirstReleaseDate(releaseDate) {
    if (releaseDate) {
        const date = new Date(releaseDate * 1000);
        const formattedDate = date.toLocaleDateString("pt-BR")
        gameReleaseDateElement.classList.remove("hidden");
        gameReleaseDateElement.innerHTML = "<b>Release date: </b>" + formattedDate;
    }
}

// Função para formatar links externos
function formatExternalLinks(gameWebsites) {
    // Verifica se a lista de websites está vazia
    if (!gameWebsites || gameWebsites.length === 0) {
        return;
    }
    gameExternalLinksSection.classList.remove("hidden")
    gameWebsites.forEach(website => {
        const siteName = extractSiteName(website.url);
        if (siteName) {
            const linkHTML = `<a target="_blank" rel="noopener noreferrer" href="${website.url}" class="hover:bg-gray-600 m-2 p-2 bg-gray-700 rounded">${siteName}</a>`;
            gameExternalLinksElement.insertAdjacentHTML('beforeend', linkHTML);
        }
    });
}

// Função auxiliar para extrair o nome do site
function extractSiteName(url) {
    try {
        const hostname = new URL(url).hostname;
        return hostname.replace('www.', '');
    } catch (error) {
        // console.error("Erro ao formatar URL: " + error)
        return null
    }
}

function formatAndSetStoryline(summary, storyline) {
    if (summary) {
        gameStorylineElement.innerHTML += summary;
    }
    if (storyline) {
        gameStorylineElement.innerHTML += storyline;

    }
    if (gameStorylineSection.innerHTML) {
        gameStorylineSection.classList.remove("hidden")
    }
}

function formatAndSetVideos(gameVideos) {
    var contVideos = 0
    const youtubeUrlPattern = "https://www.youtube.com/embed/"
    if (!gameVideos || gameVideos.length === 0) {
        return
    }
    gameVideosCarousel.classList.remove("hidden")
    gameVideos.forEach(video => {
        if (video.video_id) {
            const videoURL = youtubeUrlPattern + video.video_id
            const element = document.createElement('div');
            element.className = "hidden absolute top-0 left-0 w-full h-full p-6";
            element.innerHTML = `<iframe src="${videoURL}" class="w-full h-full px-6 object-cover"
                                    frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                                    allowfullscreen>
                                </iframe>`;
            gameVideosElement.appendChild(element);
            contVideos++;
            if (contVideos === 1) {
                element.classList.remove("hidden");
                contVideoAtual = 1;
            }
        }
    })
    contTotalVideos = contVideos;
    carouselVideosPrev.disabled = true;

    //Adiciona listeners aos botoes do carrosel
    carouselVideosNext.addEventListener("click", showNextVideo);
    carouselVideosPrev.addEventListener("click", showPrevVideo);
}

//Edita o estado do botao e exibe o proximo video
function showNextVideo() {
    if (contVideoAtual < contTotalVideos) {
        gameVideosElement.children[contVideoAtual - 1].classList.add("hidden");
        gameVideosElement.children[contVideoAtual].classList.remove("hidden");
        contVideoAtual++;
        carouselVideosPrev.disabled = false;
        if (contVideoAtual === contTotalVideos) {
            carouselVideosNext.disabled = true;
        }
    }
}

//Edita o estado do botao e exibe o video anterior
function showPrevVideo() {
    if (contVideoAtual > 1) {
        gameVideosElement.children[contVideoAtual - 1].classList.add("hidden");
        gameVideosElement.children[contVideoAtual - 2].classList.remove("hidden");
        contVideoAtual--;
        carouselVideosNext.disabled = false;
        if (contVideoAtual === 1) {
            carouselVideosPrev.disabled = true;
        }
    }
}

async function getSimilarGames(similarGames) {
    if (!similarGames || similarGames.length === 0) {
        return
    }
    try {
        const response = await fetch(`/api/games/similargames?id=${encodeURIComponent(similarGames)}`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error)
        }
        if (Array.isArray(data) && data.length > 0) {
            formatAndSetSimilarGames(data)
        }
    } catch (error) {
        console.error('Erro ao buscar dados dos jogos similares:', error);
        // setMessage(error);
    }
}

function formatAndSetSimilarGames(similarGames) {
    similarGamesCarousel.classList.remove("hidden");
    similarGames.forEach(game => {
        if (game.cover && game.name) {
            const formatedURL = formatImgURL(game.cover.url);
            const element = document.createElement('div');
            element.className = "bg-gray-700 p-4 rounded-lg shadow min-w-56 lg:min-w-60 xl:min-w-64 will-change-scroll";
            element.innerHTML = `
                <a class="block relative rounded overflow-hidden" href="/games/info?id=${game.id}">
                    <img class="object-cover w-full h-72 xl:h-96" src="${formatedURL}" alt="${game.name}">
                    <div class="mt-4">
                        <h3 class="text-xl font-bold">${game.name}</h3>
                        <p class="text-gray-400">Rating: <b>${game.rating?.toFixed(2) || 'Rating não disponível'}</b></p>
                    </div>
                </a>
            `;
            similarGamesElement.appendChild(element);
        }
    });

    // Adicionar funcionalidade de navegação
    let scrollPosition = 0;
    const scrollStep = 300;
    carouselSimilarGamesPrev.disabled = true;

    carouselSimilarGamesNext.addEventListener("click", () => {
        scrollPosition += scrollStep;
        similarGamesElement.scrollTo({
            top: 0,
            left: scrollPosition,
            behavior: 'auto'
        });
    })
    carouselSimilarGamesPrev.addEventListener("click", () => {
        scrollPosition -= scrollStep;
        similarGamesElement.scrollTo({
            top: 0,
            left: scrollPosition,
            behavior: 'auto'
        });
    })
    similarGamesElement.addEventListener('scroll', () => {
        carouselSimilarGamesPrev.disabled = similarGamesElement.scrollLeft === 0;
        carouselSimilarGamesNext.disabled = similarGamesElement.scrollRight === 0;
        carouselSimilarGamesNext.disabled = similarGamesElement.scrollLeft >= (similarGamesElement.scrollWidth - similarGamesElement.clientWidth);
    });
}

//Funcao para adicionar o jogo a lista
function addToList(gameId) {
    console.log("Adicionar à lista o jogo ID:", gameId);
}
