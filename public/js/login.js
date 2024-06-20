const form = document.querySelector("#form");
const messageDiv = document.getElementById("message");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await sendLogin();
});

async function sendLogin() {
    const username = usernameInput.value;
    const password = passwordInput.value;
    if (verifyNullFields()) {
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        }).then(response => {
            return response.json().then(data => {
                if (response.status === 200) {
                    console.log(data.message)
                    window.location.href = data.redirectUrl;
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
    if (usernameInput.value === "" || passwordInput.value === "") {
        return false
    }
    return true
}

function setMessage(msg) {
    messageDiv.innerHTML = "<p>" + msg + "</p>"
    messageDiv.classList.add('bg-red-400');
    messageDiv.classList.remove('hidden');
    setTimeout(() => {
        messageDiv.classList.add('hidden');
    }, 5000);
}
