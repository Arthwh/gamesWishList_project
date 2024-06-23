document.addEventListener('DOMContentLoaded', () => {
    let currentPage = 1;
    const limit = 10;

    function loadGames(page) {
        fetch(`/api/games/all?limit=${limit}&page=${page}`)
            .then(response => response.json())
            .then(data => {
                const gamesList = document.getElementById('games-list');
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
                                    <p>Gêneros: <b>${gameGenres}</b></p>
                                    <p>Plataformas: <b>${gamePlatforms}</b></p>
                                    <p>Lançamento: <b>${gameReleases}</b></p>
                                    <p>Rating: <b>${game.rating.toFixed(2)}</b></p>
                                </div>
                            </div>
                        </div>
                    `;
                    gamesList.innerHTML += gameCard;
                });

                document.getElementById('page-number').innerText = page; // Atualiza o número da página
                document.getElementById('previous-page').disabled = (page === 1); // Habilita ou desabilita os botões de paginação
                document.getElementById('next-page').disabled = (data.length < limit);
            })
            .catch(error => console.error('Erro ao buscar jogos:', error));
    }
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



async function transformData(genres, platforms, releases) {
    const gameGenres = await genres.map(genre => genre.name).join(', ') || "Não informado"
    const gamePlatforms = await platforms.map(platform => platform.name).join(', ') || "Não informado"
    const minReleaseYear = Math.min(...releases.map(release => release.y));// Encontrar o menor valor de ano dentro do array de releases
    const gameReleases = minReleaseYear || "Não informado";

    return { gameGenres, gamePlatforms, gameReleases }
}

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