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
    const params = getQueryParams()
    const redirectUrl = params.redirectUrl || '/games';

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
            if (response.ok) {
                window.location.href = redirectUrl
            } else {
                setErrorMessage(data.message || "undefined", 'Erro ao fazer login');
            }
        } catch (error) {
            console.error('Erro ao enviar requisição:', error);
            setErrorMessage(error, 'Erro ao enviar requisição');
        }
    } else {
        setErrorMessage("É necessário que todos os campos estejam preenchidos para fazer login", "Preencha todos os campos!");
    }
}

// Função para verificar se os campos estão preenchidos
function verifyNullFields(email, password) {
    return (email !== "" && password !== "");
}

// Função para obter parâmetros de consulta
function getQueryParams() {
    const params = {};
    window.location.search.substring(1).split("&").forEach(pair => {
        const [key, value] = pair.split("=");
        params[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return params;
}
