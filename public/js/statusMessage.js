var messageSetElement = ""

function setErrorMessage(message, title) {
    if (!message || !title) {
        return
    }
    if (messageSetElement) {
        messageSetElement.remove();
    }
    const notification = document.createElement('div');
    notification.className = 'notifications-container';
    notification.id = `errorNotificationComponent`;
    notification.innerHTML = `
            <div class="error-alert bg-zinc-800 rounded-lg shadow-lg flex justify-between items-center">
                <svg aria-hidden="true" fill="darkred" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 mr-4">
                    <path clip-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        fill-rule="evenodd"></path>
                </svg>
                <div class="flex-1">
                    <p class="error-prompt-heading font-bold">${title}</p>
                    <ul role="list">
                        <li>${message}</li>
                    </ul>
                </div>
                <button class="close-button" aria-label="Close">X</button>
            </div>
    `;
    document.body.appendChild(notification);
    messageSetElement = notification;
    setTimeout(() => {
        notification.remove();
    }, 4000);
    notification.querySelector('.close-button').addEventListener('click', () => {
        notification.remove();
    });
}

function setSuccessfulMessage(message, title) {
    if (!message || !title) {
        return
    }
    if (messageSetElement) {
        messageSetElement.remove();
    }
    const notification = document.createElement('div');
    notification.className = 'notifications-container';
    notification.id = `successNotificationComponent`;
    notification.innerHTML = `
            <div class="success-alert bg-zinc-800 p-4 rounded-lg shadow-lg flex justify-between items-center">
                <svg aria-hidden="true" fill="green" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 mr-4">
                    <path clip-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM14.293 7.293a1 1 0 00-1.414 0L8 12.586 7.121 11.707a1 1 0 00-1.414 1.414l1.707 1.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414z"
                        fill-rule="evenodd"></path>
                </svg>
                <div class="flex-1">
                    <p class="success-prompt-heading font-bold">${title}</p>
                    <ul role="list">
                        <li>${message}</li>
                    </ul>
                </div>
                <button class="close-button" aria-label="Close">X</button>
            </div>
    `;
    document.body.appendChild(notification);
    messageSetElement = notification;
    setTimeout(() => {
        notification.remove();
    }, 4000);
    notification.querySelector('.close-button').addEventListener('click', () => {
        notification.remove();
    });
}
