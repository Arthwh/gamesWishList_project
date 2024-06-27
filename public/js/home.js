const gamesLink = document.getElementById("gamesLink")
const loginLink = document.getElementById("loginLink")
const navbarLinks = document.getElementById("navbarLinks")
const popularGamesDiv = document.getElementById("popular-games-div")
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
        }
    } catch (error) {
        console.error('Erro ao buscar status de autenticação:', error);
        setMessage('Erro ao buscar status de autenticação:', error);
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
                const coverUrl = game.cover ? game.cover.url : '';
                const gameCard = `
                    <div class="bg-gray-800 p-4 rounded-lg shadow">
                        <img src="${coverUrl}" alt="${game.name}" class="w-full h-40 object-cover rounded">
                        <h3 class="text-xl font-bold mt-4">${game.name}</h3>
                        <p class="mt-2">${game.storyline}</p>
                    </div>
                `;
                popularGamesDiv.innerHTML += gameCard;
            })
        }
    } catch (error) {
        console.error('Erro ao buscar jogos populares:', error);
        setMessage('Erro ao buscar jogos populares:', error);
    }
}
