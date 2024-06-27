// Seleção dos elementos do DOM
const messageDiv = document.getElementById("message");
const logoutLink = document.getElementById("logoutLink") || ""

// Funcao para colocar mensagem de erro na tela
function setMessage(msg) {
    messageDiv.innerHTML = "<p>" + msg + "</p>"
    messageDiv.classList.add('bg-red-400');
    messageDiv.classList.remove('hidden');
    setTimeout(() => {
        messageDiv.classList.add('hidden');
    }, 5000);
}

// Adiciona um listener para o botao de logout
document.addEventListener("DOMContentLoaded", () => {
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
})

// export async function addGameToList(gameId) {
//     try {

//     } catch (error) {

//     }
// }
