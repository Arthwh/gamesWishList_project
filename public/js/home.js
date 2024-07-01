const gamesLink = document.getElementById("gamesLink")
const loginLink = document.getElementById("loginLink")
const myGames = document.getElementById("myGamesLink")
const navbarLinks = document.getElementById("navbarLinks")
const popularGamesDiv = document.getElementById("popular-games-div")
const popularGamesSection = document.getElementById("popularGames")
const loadingMessage = document.getElementById('loading');

document.addEventListener('DOMContentLoaded', () => {
    isAuthenticated();
    loadPopularGames();
})

async function isAuthenticated() {
    try {
        const response = await fetch('/auth');
        if (!response.ok) {
            throw new Error('Erro ao buscar status de autenticação');
        }
        const data = await response.json();
        const isAuthenticated = data.isAuthenticated;
        if (isAuthenticated) {
            gamesLink.classList.remove('hidden')
            loginLink.classList.add('hidden')
            logoutLink.classList.remove('hidden')
            myGames.classList.remove("hidden")
        }
    } catch (error) {
        console.error('Erro ao buscar status de autenticação:', error);
        setErrorMessage(error, 'Erro ao buscar status de autenticação');
    }
}

async function loadPopularGames() {
    loadingMessage.style.display = 'block';
    try {
        const response = await fetch(`/api/games/toprated`);
        const data = await response.json();
        loadingMessage.style.display = 'none';
        if (Array.isArray(data) && data.length > 0) {
            data.forEach(async game => {
                const formattedURL = formatImgURL(game.cover.url);
                const element = document.createElement('div');
                element.className = "bg-zinc-700 rounded-lg shadow min-h-40 lg:min-w-56 xl:min-w-64"
                element.innerHTML = `
                    <a class="block relative rounded overflow-hidden" href="/games/info?id=${game.id}">
                    <img class="object-cover w-full h-72 xl:h-96 hover:opacity-60 rounded-t-lg" src="${formattedURL}" alt="${game.name}">
                    <div class="mt-2 p-4">
                        <h3 class="text-xl font-bold mb-2">${game.name}</h3>
                        <p class="text-gray-400">Rating: <b>${game.rating?.toFixed(2) || 'Rating não disponível'}</b></p>
                    </div>
                </a>
                `;
                popularGamesDiv.appendChild(element);
            })
            popularGamesSection.classList.remove("hidden")
        }
    } catch (error) {
        console.error('Erro ao buscar jogos populares:', error);
        setErrorMessage(error, 'Erro ao buscar jogos populares');
    }
}
