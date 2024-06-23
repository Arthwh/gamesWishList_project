const gamesLink = document.getElementById("gamesLink")
const loginLink = document.getElementById("loginLink")
const navbarLinks = document.getElementById("navbarLinks")
const messageDiv = document.getElementById("message")
const logoutLink = document.getElementById("logoutLink")

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
            console.log('Usuário logado:', isAuthenticated);
        }
        console.log('Usuário logado:', isAuthenticated);
    } catch (error) {
        console.error('Erro ao buscar status de autenticação:', error);
    }
}

logoutLink.addEventListener('click', async (event) => {
    event.preventDefault();
    try {
        const response = await fetch('/logout');
        const data = await response.json();

        if (!response.ok) {
            setMessage(data.message || 'Failed to logout')
            throw new Error(data.message || 'Failed to logout');
        }
        window.location.href = '/';
    } catch (error) {
        setMessage('Error logging out: ', error.message)
        console.error('Error logging out:', error.message);
    }
})

function setMessage(msg) {
    messageDiv.innerHTML = "<p>" + msg + "</p>"
    messageDiv.classList.add('bg-red-400');
    messageDiv.classList.remove('hidden');
    setTimeout(() => {
        messageDiv.classList.add('hidden');
    }, 5000);
}