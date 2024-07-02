// Seleção dos elementos do DOM que serão manipulados
const gamesList = document.getElementById('games-list');
const listGamesContainer = document.getElementById("listGamesContainer")
const mainContainer = document.getElementById("mainContainer")
const searchResult = document.getElementById("searchResult")
const genresFilter = document.getElementById("collapse-genre")
const platformsFilter = document.getElementById("collapse-platform")
const activeFiltersList = document.getElementById("active-filters-list")

// Constantes para filtros e limites de resultados
const limitGamesPage = 30
const limitGenres = 100
const limitPlatforms = 100
const defaultFIlter = "category = 0 & aggregated_rating > 90 & platforms.generation >= 5 & version_title = null"
const fixedFilterQuery = "category = 0 & version_title = null"

// Variáveis de estado
var currentPage = 1
var filterQuery = "category = 0 & aggregated_rating > 90 & platforms.generation >= 5 & version_title = null"
var searchQuery = ""
var gamesInList = ""
var firstLoad = true;

// Inicializa a página ao carregar o DOM
document.addEventListener('DOMContentLoaded', async () => {
    var page = currentPage;
    var filter = filterQuery;
    var search = searchQuery

    await loadData(page, search, filter)
    addPaginationListeners();
    firstLoad = false;
});

// Adiciona listeners para os botões de paginação
function addPaginationListeners() {
    document.getElementById('next-page').addEventListener('click', async () => {
        currentPage += 1;
        await loadData(currentPage, searchQuery, filterQuery);
    });

    document.getElementById('previous-page').addEventListener('click', async () => {
        if (currentPage > 1) {
            currentPage -= 1;
            await loadData(currentPage, searchQuery, filterQuery);
        }
    });
}

async function loadData(page, search, filter) {
    var loadingElement = ""
    if (firstLoad) {
        mainContainer.style.display = 'none'
        loadingElement = setLoadingElementOverlay()
    }
    else {
        gamesList.style.display = 'none';
        loadingElement = setLoadingElementOverlay(listGamesContainer)
    }
    try {
        const response = await fetch(`/games/data?limit=${limitGamesPage}&page=${page}&search=${encodeURIComponent(search)}&filter=${encodeURIComponent(filter)}&firstload=${firstLoad}`);
        const data = await response.json();
        if (data.gamesData) {
            const games = data.gamesData;
            const listOfGames = data.listOfGames;
            // const userData = data.user
            if (firstLoad) {
                const platforms = data.platformsData;
                const genres = data.genresData;
                await loadGenres(genres);
                await loadPlatforms(platforms);
                await loadGames(games, listOfGames)
            } else {
                await loadGames(games, listOfGames)
            }
            mainContainer.style.display = 'flex'
            gamesList.style.display = 'grid';
            loadingElement.remove()
        }
    } catch (error) {
        console.error('Erro ao buscar jogos:', error);
        setErrorMessage(error, 'Erro ao buscar jogos');
    }
}

async function loadGames(games, listOfGames) {
    gamesList.innerHTML = '';
    if (Array.isArray(games) && games.length > 0) {
        games.forEach(async game => {
            if (!game.version_title) { // Filtra para não mostrar versões diferentes do mesmo jogo
                const gameGenres = formatGenres(game.genres);
                const gamePlatforms = formatPlatforms(game.platforms);
                const releaseDate = formatReleaseDate(game.first_release_date)
                const coverUrl = formatImgURL(game.cover.url)
                const element = document.createElement('div');
                element.className = "bg-zinc-700 rounded-lg shadow-lg flex flex-col"
                element.innerHTML = `
                        <div class="relative">
                            <a href="/games/info?id=${game.id}">
                                <img src="${coverUrl}" alt="${game.name}" class="mb-4 rounded-t-lg object-cover min-h-75 w-full hover:opacity-65">
                            </a>
                            <button onclick="wishlist(this)" data-game-id="${game.id}" data-game-name="${game.name}" class="absolute top-2 right-2 outline-none duration-300"></button>
                        </div>
                        <div class="text-gray-200 p-4 h-full flex-grow flex flex-col">
                            <h3 class="pl-2 text-2xl font-bold mb-4">${game.name}</h3>
                            <p class="p-2">Rating: <b>${game.rating !== undefined ? game.rating.toFixed(2) : 'Rating não disponível'}</b></p>
                            <p class="p-2">Lançamento: <b>${releaseDate}</b></p>
                            <p class="p-2">Gêneros: <b>${gameGenres}</b></p>
                            <p class="p-2">Plataformas: <b>${gamePlatforms}</b></p>
                        </div>
                    `;
                gamesList.appendChild(element);
                const isAdded = await verifyIfIsAdded(listOfGames, game.id)
                const wishlistButton = element.querySelector("button[data-game-id]");
                setWishlistButton(wishlistButton, isAdded);
            }
        });
        searchResult.innerHTML = searchQuery ? `Resultados para: <i>${searchQuery}</i>` : 'Top games (by rating)';
    } else {
        searchResult.innerHTML = `Nenhum jogo encontrado para: <i>${searchQuery}</i>`;
    }

    // Atualiza o número da página e o estado dos botões de paginação
    document.getElementById('page-number').innerText = currentPage;
    document.getElementById('previous-page').disabled = (currentPage === 1);
    document.getElementById('next-page').disabled = (games.length < limitGamesPage);
}

// Carrega a lista de gêneros e preenche o filtro
async function loadGenres(genres) {
    genresFilter.innerHTML = '';
    genres.forEach(genre => {
        if (genre.name) {
            const genreCard = `
                    <label class="block mb-1">
                        <input type="checkbox" class="mr-2" value="${genre.id}">
                        ${genre.name}
                    </label>
                `;
            genresFilter.innerHTML += genreCard;
        }
    });
}

// Carrega a lista de plataformas e preenche o filtro
async function loadPlatforms(platforms) {
    platformsFilter.innerHTML = '';
    platforms.forEach(platform => {
        if (platform.abbreviation) {
            const platformCard = `
                    <label class="block mb-1">
                        <input type="checkbox" class="mr-2" value="${platform.id}">
                        ${platform.abbreviation}
                    </label>
                `;
            platformsFilter.innerHTML += platformCard;
        }
    });
}

// Alterna a visibilidade dos botoes colapsáveis do filtro
function toggleCollapse(id) {
    const collapseElement = document.getElementById(id);
    if (collapseElement.classList.contains('hidden')) {
        collapseElement.classList.remove('hidden');
    } else {
        collapseElement.classList.add('hidden');
    }
}


function formatGenres(genres) {
    const gameGenres = genres?.map(genre => genre.name).filter(Boolean).join(', ') || null;
    if (gameGenres) {
        return gameGenres;
    }
    return "Não informado"
}

function formatPlatforms(platforms) {
    const gamePlatforms = platforms?.map(platform => platform.abbreviation).filter(Boolean).join(', ') || null;
    if (gamePlatforms) {
        return gamePlatforms;
    }
    return "Não informado"
}

function formatReleaseDate(releaseDate) {
    if (releaseDate) {
        const date = new Date(releaseDate * 1000);
        const formattedDate = date.toLocaleDateString("pt-BR")
        return formattedDate;
    }
    return "Não informado"
}

// Executa a busca de jogos com base na consulta
function searchGames() {
    const input = document.getElementById('search-bar');
    if (input.value) {
        searchQuery = input.value.trim().toLowerCase();
        clearFilters()
        filterQuery = fixedFilterQuery
        loadData(currentPage, searchQuery, filterQuery)
    }
}

// Aplica filtros aos jogos com base nos gêneros e plataformas selecionados
function filterGames() {
    const { selectedGenresid, selectedGenresNames } = getSelectedGenres(); // Função para obter os gêneros selecionados
    const { selectedPlatformsid, selectedPlatformsNames } = getSelectedPlatforms(); // Função para obter as plataformas selecionadas

    // Adicionar condições de filtro com base nos valores selecionados
    filterQuery = fixedFilterQuery
    activeFiltersList.innerHTML = ""
    if (selectedGenresid.length > 0) {
        filterQuery += `& genres = (${selectedGenresid.join(',')})`;
        activeFiltersList.innerHTML += `<h3 class="text-gray-700"><b>Gêneros: <b></h3>`
        selectedGenresNames.forEach(genreName => {
            activeFiltersList.innerHTML += `<label>${genreName}</label><br>`;
        })
    }
    if (selectedPlatformsid.length > 0) {
        filterQuery += `& platforms = (${selectedPlatformsid.join(',')})`;
        activeFiltersList.innerHTML += `<h3 class="text-gray-700"><b>Plataformas: <b></h3>`
        selectedPlatformsNames.forEach(platformName => {
            activeFiltersList.innerHTML += `<label>${platformName}</label><br>`;
        })
    }
    if (activeFiltersList.innerHTML != "") {
        document.getElementById("active-filters").classList.remove("hidden")
        currentPage = 1
        loadData(currentPage, searchQuery, filterQuery)
    }
}

// Obtém os gêneros selecionados no filtro
function getSelectedGenres() {
    const genreCheckboxes = document.querySelectorAll('#collapse-genre input[type="checkbox"]:checked');
    const selectedGenresid = Array.from(genreCheckboxes).map(checkbox => checkbox.value);
    const selectedGenresNames = Array.from(genreCheckboxes).map(checkbox => checkbox.nextSibling.textContent.trim());
    return { selectedGenresid, selectedGenresNames };
}

// Obtém as plataformas selecionadas no filtro
function getSelectedPlatforms() {
    const platformCheckboxes = document.querySelectorAll('#collapse-platform input[type="checkbox"]:checked');
    const selectedPlatformsid = Array.from(platformCheckboxes).map(checkbox => checkbox.value);
    const selectedPlatformsNames = Array.from(platformCheckboxes).map(checkbox => checkbox.nextSibling.textContent.trim());
    return { selectedPlatformsid, selectedPlatformsNames };
}

// Limpa os filtros aplicados
function clearFilters() {
    currentPage = 1
    filterQuery = defaultFIlter
    activeFiltersList.innerHTML = ""
    document.getElementById("active-filters").classList.add("hidden")
    const checkboxes = document.querySelectorAll('#collapse-genre input[type="checkbox"], #collapse-platform input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    loadData(currentPage, searchQuery, filterQuery)
}
