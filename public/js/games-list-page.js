// Seleção dos elementos do DOM que serão manipulados
const gamesList = document.getElementById('games-list');
const loadingMessage = document.getElementById('loading');
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

// Inicializa a página ao carregar o DOM
document.addEventListener('DOMContentLoaded', async () => {
    await loadGenres();
    await loadPlatforms();
    await loadGames(currentPage, searchQuery, filterQuery);
    addPaginationListeners();
});

// Adiciona listeners para os botões de paginação
function addPaginationListeners() {
    document.getElementById('next-page').addEventListener('click', async () => {
        currentPage += 1;
        await loadGames(currentPage, searchQuery, filterQuery);
    });

    document.getElementById('previous-page').addEventListener('click', async () => {
        if (currentPage > 1) {
            currentPage -= 1;
            await loadGames(currentPage, searchQuery, filterQuery);
        }
    });
}

// Carrega a lista de gêneros e preenche o filtro
async function loadGenres() {
    try {
        const response = await fetch(`/api/genres/all?limit=${limitGenres}`);
        const data = await response.json();
        genresFilter.innerHTML = '';
        data.forEach(genre => {
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
    } catch (error) {
        console.error('Erro ao buscar generos:', error);
        setErrorMessage(error, 'Erro ao buscar generos');
    }
}

// Carrega a lista de plataformas e preenche o filtro
async function loadPlatforms() {
    try {
        const response = await fetch(`/api/platforms/all?limit=${limitPlatforms}`);
        const data = await response.json();
        platformsFilter.innerHTML = '';
        data.forEach(platform => {
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
    } catch (error) {
        console.error('Erro ao buscar plataformas:', error);
        setErrorMessage(error, 'Erro ao buscar plataformas');
    }
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

// Carrega a lista de jogos com base na página, pesquisa e filtros
async function loadGames(page, search, filter) {
    // Mostrar a mensagem de carregamento
    loadingMessage.style.display = 'block';
    gamesList.style.display = 'none';
    const gamesInList = await getUserGamesList()
    try {
        const response = await fetch(`/api/games?limit=${limitGamesPage}&page=${page}&search=${encodeURIComponent(search)}&filter=${encodeURIComponent(filter)}`);
        const data = await response.json();
        // Ocultar a mensagem de carregamento
        loadingMessage.style.display = 'none';
        gamesList.style.display = 'grid';
        gamesList.innerHTML = '';

        if (Array.isArray(data) && data.length > 0) {
            data.forEach(async game => {
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
                            <button onclick="wishlist(this)" data-game-id="${game.id}" class="absolute top-2 right-2 outline-none duration-300"></button>
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
                    const isAdded = await verifyIfGameIsAdded(gamesInList, game.id);
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
        document.getElementById('next-page').disabled = (data.length < limitGamesPage);
    } catch (error) {
        console.error('Erro ao buscar jogos:', error);
        setErrorMessage(error, 'Erro ao buscar jogos');
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
        loadGames(currentPage, searchQuery, filterQuery)
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
        loadGames(currentPage, searchQuery, filterQuery)
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
    loadGames(currentPage, searchQuery, filterQuery)
}
