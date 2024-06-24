// Seleção dos elementos do DOM
const form = document.querySelector("#form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// Adiciona listener ao formulário para o evento de submit
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await sendLogin();
});

// Função para enviar os dados de login
async function sendLogin() {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (verifyNullFields(email, password)) {
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            // Verifica se a resposta do servidor foi bem-sucedida
            if (response.ok) {
                window.location.href = '/games';
            } else {
                setMessage(data.message || 'Erro ao fazer login. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao enviar requisição:', error);
            setMessage('Erro ao enviar requisição. Tente novamente.');
        }
    } else {
        setMessage("Preencha todos os campos!");
    }
}

// Função para verificar se os campos estão preenchidos
function verifyNullFields(email, password) {
    return email !== "" && password !== "";
}
