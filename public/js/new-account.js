const form = document.querySelector("#form");
const messageDiv = document.getElementById("message");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const nameInput = document.getElementById("name");
const usernameInput = document.getElementById("username");
const password_confirmInput = document.getElementById("password-confirm");
const birthdateInput = document.getElementById("birthdate");
const newsletterInput = document.getElementById("newsletter");
const termsInput = document.getElementById("terms");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await sendUserData();
});

async function sendUserData() {

}

function verifyNullFields() {
    if (emailInput.value === "" || passwordInput.value === "" || nameInput === ""
        || usernameInput.value === "" || password_confirmInput.value === "" || birthdateInput.value === ""
        || newsletterInput.value === "" || termsInput.value === "") {
        return false
    }
    return true
}