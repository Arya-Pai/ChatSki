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
    let name = document.createElement('strong');
    name.classList.add('messageUsername');
    name.textContent = data.username + ": ";
    messageArea.appendChild(name);

    let chat = document.createElement('p');
    chat.classList.add('messageBody');
    chat.textContent = data.message;
    messageArea.appendChild(chat);
});