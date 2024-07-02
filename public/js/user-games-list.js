// Seleção dos elementos do DOM que serão manipulados
const gameListContainer = document.getElementById("gameList");
const emptyListMessage = document.getElementById("emptyListMessage")
const gamesDiv = document.getElementById("gamesDiv")
// const loading = document.getElementById("loading")
const gameModal = document.getElementById("gameModal")
const gameModalTitle = document.getElementById("gameModalTitle")
const gameStatusInput = document.getElementById("gameStatusInput")
const saveGameButton = document.getElementById("saveGameButton")
const gameModalCloseButton = document.getElementById("gameModalCloseButton")

var gamesRemaining = ""

document.addEventListener("DOMContentLoaded", async () => {
    const loadingElement = setLoadingElementOverlay()
    const gamesData = await getUserGamesList();
    if (gamesData?.games) {
        const userGamesData = gamesData.games
        // const userData = gamesData.userData
        gamesRemaining = gamesData.gamesList
        renderGameList(userGamesData, gamesRemaining);
        loadingElement.remove()
        gamesDiv.classList.remove("hidden")
        gameModalCloseButton.addEventListener("click", () => {
            gameModal.classList.add("hidden")
        })
        document.getElementById("shareListButton").addEventListener("click", shareList);
    } else {
        loadingElement.remove()
        emptyListMessage.classList.remove("hidden")
        gamesDiv.classList.add("hidden")
    }
});

async function getUserGamesList() {
    try {
        const response = await fetch('/games/list/data');
        const data = await response.json();
        if (!response.ok) {
            throw new Error("Teste: " + data.error)
        }
        if (data?.games) {
            return data
        }
        return null
    } catch (error) {
        console.error('Erro ao buscar dados da lista de jogos do usuario:', error);
        setErrorMessage(error, "Erro ao buscar dados da lista de jogos do usuario");
    }
}

function verifyGamesRemaining() {
    if (gamesRemaining.length === 0) {
        emptyListMessage.classList.remove("hidden");
        gamesDiv.classList.add("hidden");
    }
}

async function removeGameIdFromRemaining(gameId) {
    await gamesRemaining.forEach(game => {
        const index = game.game_id.indexOf(gameId.toString());
        if (index === 0 || index) {
            gamesRemaining.splice(index, 1);
            return
        }
    })
}

function renderGameList(gamesList, gamesInList) {
    gamesList.forEach(game => {
        const status = gamesInList.find(games => games.game_id == game.id).status;
        const formattedURL = formatImgURL(game.cover.url);
        const gameCard = document.createElement('div');
        gameCard.className = "game-card bg-zinc-700 rounded-lg shadow w-full relative";
        gameCard.id = `gameCard_${game.id}`;
        gameCard.setAttribute("data-status", status)
        gameCard.setAttribute("data-game-name", game.name)
        gameCard.innerHTML = `
            <a class="block relative overflow-hidden" href="/games/info?id=${game.id}">
                <img class="object-cover w-full min-h-88 hover:opacity-60 rounded-t-lg" src="${formattedURL}" alt="${game.name}">
            </a>
            <div class="flex justify-between">
                <div class="flex flex-col p-4">
                    <h3 class="text-xl font-bold mb-4">${game.name}</h3>
                    <p id="status_${game.id}" class=" text-gray-400">Status: <b>${status || 'Não disponível'}</b></p>
                </div>
                <div class="relative mt-2">
                    <button onclick="toggleMenu(${game.id})" class="text-white focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6h.01M12 12h.01M12 18h.01" />
                        </svg>
                    </button>
                    <div id="dropdown_${game.id}" class="hidden w-56 rounded-l-lg shadow-lg z-10 absolute right-0 mt-2 bg-zinc-800 text-white">
                        <button class="block px-4 py-2 text-left w-full hover:bg-gray-600" onclick="editStatusFromGame(${game.id})">Edit Status</button>
                        <button class="block px-4 py-2 text-left w-full hover:bg-gray-600" data-game-name="${game.name}" onclick="removeGameFromList(${game.id})">Remove from wishlist</button>
                    </div>
                </div>
            </div>
        `;
        gameListContainer.appendChild(gameCard);
    });
}

async function removeGameFromList(gameId) {
    if (await removeGameFromWishlist(gameId)) {
        const elemento = document.getElementById(`gameCard_${gameId}`);
        const gameName = elemento.getAttribute("data-game-name")
        elemento.remove();
        setSuccessfulMessage("Game removed successfully from wishlist", `${gameName}`)
        await removeGameIdFromRemaining(gameId)
        verifyGamesRemaining()
    }
}

async function editStatusFromGame(gameId) {
    const elemento = document.getElementById(`gameCard_${gameId}`);
    const status = elemento.getAttribute("data-status");
    const gameName = elemento.getAttribute("data-game-name")
    gameStatusInput.value = status
    saveGameButton.addEventListener("click", async () => {
        const statusSelected = gameStatusInput.value;
        if (await updateGameStatus(gameId, statusSelected)) {
            setSuccessfulMessage("Game status updated successfully", gameName)
            document.getElementById(`gameCard_${gameId}`).setAttribute("data-status", statusSelected);
            const statusElement = document.getElementById("status_" + gameId)
            statusElement.innerHTML = `Status: <b>${statusSelected}</b>`
            gameModal.classList.add("hidden");
        }
    })
    toggleMenu(gameId)
    gameModal.classList.toggle("hidden")
}

function toggleMenu(gameId) {
    const dropdown = document.getElementById("dropdown_" + gameId)
    dropdown.classList.toggle("hidden")
}

async function updateGameStatus(gameId, status) {
    try {
        const response = await fetch('/games/list/edit/status', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ gameId, status }),
        });
        const data = await response.json();
        if (response.ok) {
            return true;
        } else {
            setErrorMessage(data.message || "Undefined", 'Erro ao editar status do jogo');
            return false;
        }
    } catch (error) {
        console.error('Erro ao enviar requisição:', error);
        setErrorMessage(error, 'Erro ao enviar requisição');
    }
}

async function shareList() {
    var shareableLink = ""
    try {
        const response = await fetch('/games/list/listid');
        const data = await response.json();
        if (response.ok) {
            if (data.listId) {
                shareableLink = window.location.origin + "/games/share?list=" + encodeURIComponent(gameList);
            } else {
                throw new Error("Erro ao obter o id da lista.")
            }
        } else {
            setErrorMessage(data.message || "Undefined", 'Erro ao obter o id da lista');
            return false;
        }
    } catch (error) {
        console.error('Erro ao enviar requisição:', error);
        setErrorMessage(error, 'Erro ao enviar requisição');
    }
    if (shareableLink !== "") {
        setSuccessfulMessage("Link de compartilhamento gerado com sucesso!", "Share wishlist")
        setTimeout(() => {
            prompt("Copie este link para compartilhar sua lista: ", shareableLink);
        }, 10);
    }
}


