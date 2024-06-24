const form = document.querySelector("#form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await sendLogin();
});

async function sendLogin() {
    const email = emailInput.value;
    const password = passwordInput.value;
    if (verifyNullFields()) {
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        }).then(response => {
            return response.json().then(data => {
                if (response.status === 200) {
                    window.location.href = '/games';
                } else {
                    setMessage(data.message);
                    throw new Error(data.message);
                }
            });
        }).catch(error => {
            console.error('Erro ao enviar requisição:', error);
        });
    }
    else {
        setMessage("Preencha todos os campos!");
    }
}

function verifyNullFields() {
    if (emailInput.value === "" || passwordInput.value === "") {
        return false
    }
    return true
}

