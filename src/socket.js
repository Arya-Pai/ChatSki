const username = '{{username}}';  // Get the username from the server-side template
const socket = io({
    query: {
        username: username
    }
});

const messages = document.getElementById('messages');
const form = document.getElementById('messageForm');
const input = document.getElementById('messageInput');

form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the form from submitting
    const chat = input.value;
    socket.emit('send message', chat);
    input.value = '';
});
socket.on('message', (msg) => {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
});

socket.on('send message', ({ username, chat }) => {
    const item = document.createElement('li');
    item.textContent = `${username}: ${chat}`;
    messages.appendChild(item);
});

