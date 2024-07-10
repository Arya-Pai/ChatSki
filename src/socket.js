let socket = io();
let form = document.getElementById('form');
let userName = document.getElementById('username');
let message = document.getElementById('textArea');
let messageArea = document.getElementById('messageArea');

form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (message.value && userName.value) {
        socket.emit('send message', { username: userName.value, message: message.value });
        message.value = "";
    }
});

socket.on("send message", (data) => {
    appendMessage(data.username, data.message);
});

function appendMessage(username, messageText) {
    let nameElement = document.createElement('strong');
    nameElement.classList.add('messageUsername');
    nameElement.textContent = username + ": ";

    let messageElement = document.createElement('p');
    messageElement.classList.add('messageBody');
    messageElement.textContent = messageText;

    messageArea.appendChild(nameElement);
    messageArea.appendChild(messageElement);
}
