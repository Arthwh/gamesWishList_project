const gamesLink = document.getElementById("gamesLink")
const loginLink = document.getElementById("loginLink")
const navbarLinks = document.getElementById("navbarLinks")

document.addEventListener('DOMContentLoaded', () => {
    isAuthenticated();
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
    }
}
