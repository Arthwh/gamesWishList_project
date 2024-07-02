// Seleção dos elementos do DOM
const logoutLink = document.getElementById("logoutLink") || null

document.addEventListener("DOMContentLoaded", () => {
    if (logoutLink) {
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
        setTransparentOverlay(timeout)
        setSuccessfulMessage("Logged out successfully", "Loggout")
        var timeout = 2500;
        setTransparentOverlay(timeout)
        setTimeout(() => {
            window.location.href = '/';
        }, timeout)
    } catch (error) {
        setErrorMessage(error.message || "Undefined", 'Failed to logout')
        console.error('Error logging out:', error.message);
    }
}

async function verifyIfIsAdded(listOfGames, gameId) {
    if (listOfGames) {
        const gamesId = listOfGames.find(game => game.game_id == gameId.toString())
        if (gamesId) {
            return true
        }
    }
    return false
}

async function wishlist(elemento) {
    const gameId = elemento.getAttribute("data-game-id")
    const gameName = elemento.getAttribute("data-game-name")
    const isAdded = elemento.getAttribute("data-added") === 'true'
    if (isAdded) {
        if (await removeGameFromWishlist(gameId)) {
            setWishlistButton(elemento, false);
            setSuccessfulMessage("Game removed successfully from the wishlist", gameName)
        }
    } else {
        if (await addToList(gameId)) {
            setWishlistButton(elemento, true);
            setSuccessfulMessage("Game added successfully to the wishlist", gameName)
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

function setLoadingElementOverlay(appendElement) {
    const element = document.createElement('div');
    element.classList.add('loading-overlay');
    element.classList.add('backgroundPattern');
    element.innerHTML = `
        <div class="loadingMessageContainer">
            <h1 class="loadingTitle">Loading</h1>
            <div class="anim-box">
                <div class="anim-interieur">
                    <div class="rect rect1"></div>
                    <div class="rect rect2"></div>
                    <div class="rect rect3"></div>
                    <div class="rect rect4"></div>
                    <div class="rect rect5"></div>
                </div>
            </div>
        </div>
    `;
    if (appendElement) {
        appendElement.appendChild(element)
    }
    else {
        document.body.appendChild(element);
    }
    window.scrollTo(0, 0);

    return element;
}

function setTransparentOverlay(timeout) {
    const element = document.createElement('div');
    element.classList.add('transparent-overlay');
    document.body.appendChild(element);

    setTimeout(() => {
        element.remove();
    }, timeout);
}