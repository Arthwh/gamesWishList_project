const gamesList = document.getElementById('games-list');
const loadingMessage = document.getElementById('loading');
const genresFilter = document.getElementById("collapse-genre")
const platformsFilter = document.getElementById("collapse-platform")
const limitGamesPage = 12
const limitGenres = 100
var currentPage = 1

//Carrega tudo na pagina ao iniciar e adiciona os listener
document.addEventListener('DOMContentLoaded', async () => {
    loadGenres();
    loadPlatforms();
    loadGames(currentPage);
    // Event listener para botões de paginação
    document.getElementById('next-page').addEventListener('click', () => {
        currentPage += 1;
        loadGames(currentPage);
    });

    document.getElementById('previous-page').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage -= 1;
            loadGames(currentPage);
        }
    });
});

//Carrega os filtros de genero
function loadGenres() {
    fetch(`/api/genres/all?limit=${limitGenres}`)
        .then(response => response.json())
        .then(data => {
            genresFilter.innerHTML = '';
            data.forEach(async genre => {
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
        })
        .catch(error => {
            console.error('Erro ao buscar generos:', error)
            setMessage('Erro ao buscar generos:', error)
        });
}

function loadPlatforms() {
    fetch(`/api/platforms/all?limit=${limitGenres}`)
        .then(response => response.json())
        .then(data => {
            platformsFilter.innerHTML = '';
            data.forEach(async platform => {
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
        })
        .catch(error => {
            console.error('Erro ao buscar plataformas:', error)
            setMessage('Erro ao buscar plataformas:', error)
        });
}

// Função para alternar a exibição dos colapsáveis
function toggleCollapse(id) {
    const collapseElement = document.getElementById(id);
    if (collapseElement.classList.contains('hidden')) {
        collapseElement.classList.remove('hidden');
    } else {
        collapseElement.classList.add('hidden');
    }
}

//Carrega os jogos
async function loadGames(page) {
    // Mostrar a mensagem de carregamento
    loadingMessage.style.display = 'block';
    gamesList.style.display = 'none';
    fetch(`/api/games/all?limit=${limitGamesPage}&page=${page}`)
        .then(response => response.json())
        .then(data => {
            loadingMessage.style.display = 'none';
            gamesList.style.display = 'grid';
            gamesList.innerHTML = '';
            data.forEach(async game => {
                const { gameGenres, gamePlatforms, gameReleases } = await transformData(game.genres, game.platforms, game.release_dates)
                const gameCard = `
                <div class="bg-gray-700 p-4 rounded-lg shadow-lg">
                    <h3 class="text-xl font-bold text-center mb-5">${game.name}</h3>
                    <p class="hidden">${game.id}</p>
                    <div class="shadow-lg bg-gray-500 rounded-lg p-2 mt-5 flex flex-col items-center">
                        <img src="${game.cover.url}" alt="${game.name}" class="rounded-lg object-cover h-64 w-full mb-4">
                        <div class="text-gray-200 text-center p-2">
                            <p class="p-2">Rating: <b>${game.rating.toFixed(2)}</b></p>
                            <p class="p-2">Lançamento: <b>${gameReleases}</b></p>
                            <p class="p-2">Gêneros: <b>${gameGenres}</b></p>
                            <p class="p-2">Plataformas: <b>${gamePlatforms}</b></p>
                        </div>
                        <div class="mt-4 flex justify-center space-x-4">
                            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onclick="viewMoreInfo(${game.id})">
                                Ver mais informações
                            </button>
                            <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onclick="addToList(${game.id})">
                                Adicionar à lista
                            </button>
                        </div>
                    </div>
                </div>
                `;
                gamesList.innerHTML += gameCard;
            });
            document.getElementById('page-number').innerText = currentPage; // Atualiza o número da página
            document.getElementById('previous-page').disabled = (currentPage === 1); // Habilita ou desabilita os botões de paginação
            document.getElementById('next-page').disabled = (data.length < limitGamesPage);
        })
        .catch(error => {
            console.error('Erro ao buscar jogos:', error)
            setMessage('Erro ao buscar jogos:', error)
        });
}

//Formata os dados dos jogos para colocar nos cards
async function transformData(genres, platforms, releases) {
    const gameGenres = await genres.map(genre => genre.name).filter(Boolean).join(', ') || "Não informado"
    const gamePlatforms = await platforms.map(platform => platform.abbreviation).filter(Boolean).join(', ') || "Não informado"
    const minReleaseYear = Math.min(...releases.map(release => release.y));// Encontrar o menor valor de ano dentro do array de releases
    const gameReleases = minReleaseYear || "Não informado";

    return { gameGenres, gamePlatforms, gameReleases }
}

//Funcao para redirecionar para uma view exclusiva de cada jogo
function viewMoreInfo(gameId) {
    // Lógica para exibir mais informações sobre o jogo
    console.log("Ver mais informações para o jogo ID:", gameId);
    // Aqui você pode redirecionar para uma página de detalhes ou abrir um modal com mais informações
}

//Funcao para adicionar o jogo a lista
function addToList(gameId) {
    // Lógica para adicionar o jogo à lista
    console.log("Adicionar à lista o jogo ID:", gameId);
    // Aqui você pode fazer uma requisição ao backend para adicionar o jogo à lista do usuário
}

//Ativa os filtros selecionados
document.getElementById('search-bar').addEventListener('input', (event) => {
    // Lógica para filtro de pesquisa
    const searchQuery = event.target.value.toLowerCase();
    const games = document.querySelectorAll('#games-list > div');
    games.forEach(game => {
        const title = game.querySelector('h3').textContent.toLowerCase();
        if (title.includes(searchQuery)) {
            game.style.display = '';
        } else {
            game.style.display = 'none';
        }
    });
});