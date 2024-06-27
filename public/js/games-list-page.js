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
        setMessage('Erro ao buscar generos:', error);
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
        setMessage('Erro ao buscar plataformas:', error);
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
                    const { gameGenres, gamePlatforms, gameReleases } = await transformData(game.genres, game.platforms, game.release_dates);
                    const coverUrl = game.cover ? game.cover.url : '';
                    const gameCard = `
                    <div class="bg-gray-700 p-4 rounded-lg shadow-lg flex flex-col">
                        <h3 class="text-xl font-bold text-center">${game.name}</h3>
                        <p class="hidden">${game.id}</p>
                        <div class="shadow-lg bg-gray-500 rounded-lg p-2 mt-5 flex flex-col items-center h-full">
                            <img src="${coverUrl}" alt="${game.name}" class="rounded-lg object-cover h-64 w-full mb-4">
                            <div class="text-gray-200 text-center p-2 h-full flex-grow flex flex-col">
                                <p class="p-2">Rating: <b>${game.rating !== undefined ? game.rating.toFixed(2) : 'Rating não disponível'}</b></p>
                                <p class="p-2">Lançamento: <b>${gameReleases}</b></p>
                                <p class="p-2">Gêneros: <b>${gameGenres}</b></p>
                                <p class="p-2">Plataformas: <b>${gamePlatforms}</b></p>
                                <div class="mt-4 flex justify-center space-x-4 mt-auto">
                                    <button onclick="viewMoreInfo(${game.id})" class="relative cursor-pointer opacity-90 hover:opacity-100 transition-opacity p-[2px] bg-black rounded-[16px] bg-gradient-to-t from-[#1e3a8a] to-[#3b82f6] active:scale-95">
                                        <span class="w-full h-full flex items-center gap-2 px-8 py-3 bg-[#B931FC] text-white rounded-[14px] bg-gradient-to-t from-[#1e40af] to-[#60a5fa]">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                                                <path
                                                    d="M8 13V9m-2 2h4m5-2v.001M18 12v.001m4-.334v5.243a3.09 3.09 0 0 1-5.854 1.382L16 18a3.618 3.618 0 0 0-3.236-2h-1.528c-1.37 0-2.623.774-3.236 2l-.146.292A3.09 3.09 0 0 1 2 16.91v-5.243A6.667 6.667 0 0 1 8.667 5h6.666A6.667 6.667 0 0 1 22 11.667Z"
                                                ></path>
                                            </svg>Ver mais</span>
                                    </button>
                                    <button title="Adicionar à lista" onclick="addToList(${game.id})" class="group cursor-pointer outline-none hover:rotate-90 duration-300">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="50px"
                                            height="50px"
                                            viewBox="0 0 24 24"
                                            class="stroke-slate-400 fill-none group-hover:fill-slate-800 group-active:stroke-slate-200 group-active:fill-slate-600 group-active:duration-0 duration-300">
                                            <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke-width="1.5"></path>
                                            <path d="M8 12H16" stroke-width="1.5"></path>
                                            <path d="M12 16V8" stroke-width="1.5"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                    gamesList.innerHTML += gameCard;
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
        setMessage('Erro ao buscar jogos: ' + error);
    }
}

// Formata os dados dos jogos para exibição nos cards
async function transformData(genres, platforms, releases) {
    try {
        const gameGenres = genres?.map(genre => genre.name).filter(Boolean).join(', ') || "Não informado";
        const gamePlatforms = platforms?.map(platform => platform.abbreviation).filter(Boolean).join(', ') || "Não informado";
        const minReleaseYear = releases?.map(release => release.y).filter(Boolean).reduce((min, year) => Math.min(min, year), new Date().getFullYear()) || "Não informado";
        return { gameGenres, gamePlatforms, gameReleases: minReleaseYear };
    } catch (error) {
        console.error('Erro ao transformar dados:', error);
        return { gameGenres: "Não informado", gamePlatforms: "Não informado", gameReleases: "Não informado" };
    }
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
        console.log("genresId: " + selectedGenresid)
        filterQuery += `& genres = (${selectedGenresid.join(',')})`;
        activeFiltersList.innerHTML += `<h3 class="text-gray-700"><b>Gêneros: <b></h3>`
        selectedGenresNames.forEach(genreName => {
            activeFiltersList.innerHTML += `<label>${genreName}</label><br>`;
        })
    }
    if (selectedPlatformsid.length > 0) {
        console.log("platformsId: " + selectedPlatformsid)
        filterQuery += `& platforms = (${selectedPlatformsid.join(',')})`;
        activeFiltersList.innerHTML += `<h3 class="text-gray-700"><b>Plataformas: <b></h3>`
        selectedPlatformsNames.forEach(platformName => {
            activeFiltersList.innerHTML += `<label>${platformName}</label><br>`;
        })
    }
    if (activeFiltersList.innerHTML != "") {
        console.log("active: " + activeFiltersList)
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

//Funcao para redirecionar para uma view exclusiva de cada jogo
function viewMoreInfo(gameId) {
    console.log("Ver mais informações para o jogo ID:", gameId);
}

//Funcao para adicionar o jogo a lista
function addToList(gameId) {
    console.log("Adicionar à lista o jogo ID:", gameId);
}
