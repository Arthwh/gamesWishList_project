// Seleção dos elementos do DOM
const form = document.querySelector("#formCreate");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const nameInput = document.getElementById("name");
const usernameInput = document.getElementById("username");
const password_confirmInput = document.getElementById("password-confirm");
const birthdateInput = document.getElementById("birthdate");
const newsletterInput = document.getElementById("newsletter");
const termsInput = document.getElementById("terms");

// Adiciona listener ao formulário para o evento de submit
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await sendUserData();
});

// Função para enviar os dados de criacao de usuario
async function sendUserData() {
    if (verifyNullFields()) {
        if (password_confirmInput.value === passwordInput.value) {
            try {
                const response = await fetch('/user/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: nameInput.value,
                        username: usernameInput.value,
                        email: emailInput.value,
                        password: passwordInput.value,
                        birthdate: birthdateInput.value,
                        newsletter: +newsletterInput.checked,
                        terms: +termsInput.checked
                    })
                });
                const data = await response.json();

                if (response.status === 200) {
                    window.location.href = '/login';
                } else {
                    setMessage(data.message);
                }
            } catch (error) {
                console.error('Erro ao enviar requisição:', error);
                setMessage('Erro ao enviar requisição: ' + error.message);
            }
        } else {
            setMessage("Senha e confirmação de senha não coincidem");
        }
    } else {
        setMessage("Preencha todos os campos!");
    }
}

function verifyNullFields() {
    return !(emailInput.value === "" || passwordInput.value === "" || nameInput.value === ""
        || usernameInput.value === "" || password_confirmInput.value === "" || birthdateInput.value === ""
        || termsInput.checked === false);
}

