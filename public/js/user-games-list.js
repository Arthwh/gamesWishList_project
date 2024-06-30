// Sample game list data
const gameList = [
    { id: 1, name: "Game 1", imageUrl: "https://via.placeholder.com/150", status: "want-to-play" },
    { id: 2, name: "Game 2", imageUrl: "https://via.placeholder.com/150", status: "playing" },
    { id: 3, name: "Game 3", imageUrl: "https://via.placeholder.com/150", status: "played" },
    { id: 3, name: "Game 3", imageUrl: "https://via.placeholder.com/150", status: "played" },
    { id: 3, name: "Game 3", imageUrl: "https://via.placeholder.com/150", status: "played" },
    { id: 3, name: "Game 3", imageUrl: "https://via.placeholder.com/150", status: "played" },
];

document.addEventListener("DOMContentLoaded", function () {
    renderGameList();
    document.getElementById("cancelGameButton").addEventListener("click", () => document.getElementById("gameModal").classList.add("hidden"));
    document.getElementById("shareListButton").addEventListener("click", shareList);
});

function renderGameList() {
    const gameListContainer = document.getElementById("gameList");
    gameListContainer.innerHTML = '';

    gameList.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = "game-card bg-gray-700 p-4 rounded-lg shadow";
        gameCard.innerHTML = `
            <img class="w-full h-40 object-cover rounded mb-2" src="${game.imageUrl}" alt="${game.name}">
            <h3 class="text-xl font-bold">${game.name}</h3>
            <p class="text-gray-400 mb-2">Status: ${game.status}</p>
            <div class="flex justify-between">
                <button onclick="editGame(${game.id})" class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">Editar</button>
                <button onclick="deleteGame(${game.id})" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Excluir</button>
            </div>
        `;
        gameListContainer.appendChild(gameCard);
    });
}

function saveNewGame() {
    const newGame = {
        id: gameList.length + 1,
        name: document.getElementById("gameNameInput").value,
        imageUrl: document.getElementById("gameImageUrlInput").value,
        status: document.getElementById("gameStatusInput").value,
    };
    gameList.push(newGame);
    renderGameList();
    document.getElementById("gameModal").classList.add("hidden");
}

function editGame(gameId) {
    const game = gameList.find(g => g.id === gameId);
    if (game) {
        document.getElementById("gameModalTitle").textContent = "Editar Jogo";
        document.getElementById("gameNameInput").value = game.name;
        document.getElementById("gameImageUrlInput").value = game.imageUrl;
        document.getElementById("gameStatusInput").value = game.status;
        document.getElementById("saveGameButton").onclick = () => saveEditedGame(gameId);
        document.getElementById("gameModal").classList.remove("hidden");
    }
}

function saveEditedGame(gameId) {
    const gameIndex = gameList.findIndex(g => g.id === gameId);
    if (gameIndex !== -1) {
        gameList[gameIndex].name = document.getElementById("gameNameInput").value;
        gameList[gameIndex].imageUrl = document.getElementById("gameImageUrlInput").value;
        gameList[gameIndex].status = document.getElementById("gameStatusInput").value;
        renderGameList();
        document.getElementById("gameModal").classList.add("hidden");
    }
}

function deleteGame(gameId) {
    const gameIndex = gameList.findIndex(g => g.id === gameId);
    if (gameIndex !== -1) {
        gameList.splice(gameIndex, 1);
        renderGameList();
    }
}

function shareList() {
    const shareableLink = window.location.origin + "/share?list=" + btoa(JSON.stringify(gameList));
    prompt("Copie este link para compartilhar sua lista:", shareableLink);
}


