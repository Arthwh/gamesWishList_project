// Seleção dos elementos do DOM
const logoutLink = document.getElementById("logoutLink") || null

// adiciona listener para o botao de logout
document.addEventListener("DOMContentLoaded", () => {
    if (logoutLink) {
        // Adiciona um listener para o botao de logout
        logoutLink.addEventListener('click', async (event) => {
            event.preventDefault();
            await logout();
        })
    };
});

//Funcao para deslogar o usuario
async function logout() {
    try {
        const response = await fetch('/logout');
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to logout');
        }
        setSuccessfulMessage("Logged out successfully", "Loggout")
        setTimeout(() => {
            window.location.href = '/';
        }, 2000)
    } catch (error) {
        setErrorMessage(error.message || "Undefined", 'Failed to logout')
        console.error('Error logging out:', error.message);
    }
}

async function getUserGamesList() {
    try {
        const response = await fetch('/games/list/data');
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error)
        }
        if (Array.isArray(data) && data.length > 0) {
            return data
        }
        return null
    } catch (error) {
        console.error('Erro ao buscar dados da lista de jogos do usuario:', error);
        setErrorMessage(error, "Erro ao buscar dados da lista de jogos do usuario");
    }
}

async function getGamesById(ids) {
    if (!ids || ids.length === 0) {
        return
    }
    try {
        const response = await fetch(`/api/games/by_id?id=${encodeURIComponent(ids)}`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error)
        }
        if (Array.isArray(data) && data.length > 0) {
            return data
        }
    } catch (error) {
        console.error('Erro ao buscar dados dos jogos:', error);
        setErrorMessage(error, "Erro ao buscar dados dos jogos");
    }
}

async function verifyIfGameIsAdded(data, gameId) {
    if (data) {
        const games = data.find(game => game.game_id == gameId)
        if (games) {
            return true
        }
    }
    return false
}

async function wishlist(elemento) {
    const gameId = elemento.getAttribute("data-game-id")
    const isAdded = elemento.getAttribute("data-added") === 'true'
    if (isAdded) {
        if (await removeGameFromWishlist(gameId)) {
            setWishlistButton(elemento, false);
            setSuccessfulMessage("Game removed successfully from the wishlist", "Wishlist")
        }
    } else {
        if (await addToList(gameId)) {
            setWishlistButton(elemento, true);
            setSuccessfulMessage("Game added successfully to the wishlist", "Wishlist")

        }
    }
}

//Funcao para adicionar o jogo a lista
async function addToList(gameId) {
    try {
        const response = await fetch('/games/list/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ gameId, status: "want-to-play" }),
        });
        const data = await response.json();
        if (response.ok) {
            return true;
        } else {
            setErrorMessage(data.message || "Undefined", 'Erro ao adicionar jogo à lista');
            return false;
        }
    } catch (error) {
        console.error('Erro ao enviar requisição:', error);
        setErrorMessage(error, 'Erro ao enviar requisição');
    }
}

//Funcao para remover o jogo a lista
async function removeGameFromWishlist(gameId) {
    try {
        const response = await fetch('/games/list/remove', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: gameId
        });
        const data = await response.json();
        if (response.ok) {
            return true;
        } else {
            setErrorMessage(data.message || "Undefined", 'Erro ao remover jogo da lista');
            return false;
        }
    } catch (error) {
        console.error('Erro ao enviar requisição:', error);
        setErrorMessage(error, 'Erro ao enviar requisição');
    }
    return true
}

function setWishlistButton(wishlistButtonElement, gameAddedToList) {
    if (gameAddedToList) {
        wishlistButtonElement.classList.remove("hover:rotate-90");
        wishlistButtonElement.classList.add("hover:scale-105");
        wishlistButtonElement.setAttribute("data-added", true)
        wishlistButtonElement.title = "Remover da lista"
        wishlistButtonElement.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 24 24"
                class="stroke-zinc-100 fill-none hover:fill-zinc-900 active:fill-zinc-600 active:duration-0 duration-300">
                <path
                    d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                    stroke-width="1.5"></path>
                <path d="M9 12.5L11.5 15L16 9" stroke-width="1.5"></path>
            </svg>
        `;
    } else {
        wishlistButtonElement.classList.add("hover:rotate-90");
        wishlistButtonElement.classList.remove("hover:scale-105");
        wishlistButtonElement.setAttribute("data-added", false)
        wishlistButtonElement.title = "Adicionar à lista"
        wishlistButtonElement.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 24 24"
                class="stroke-zinc-100 fill-none hover:fill-zinc-900 active:fill-zinc-600 active:duration-0 duration-300">
                <path
                    d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                    stroke-width="1.5"></path>
                <path d="M8 12H16" stroke-width="1.5"></path>
                <path d="M12 16V8" stroke-width="1.5"></path>
            </svg>
        `;
    }
}

function formatImgURL(url) {
    if (url) {
        return url.replace("t_thumb", "t_cover_big")
    }
    return ""
}