let socket = io();
let form = document.getElementById('form');
let username = req.body.username;
let message = document.getElementById('textArea');
let messageArea = document.getElementById('messageArea');c

form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (message.value && userName.value) {
        socket.emit('send message', { username: username.value, message: message.value });
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

message.addEventListener('keypress',()=>{
    socket.broadcast.emit(appendActivity(),`${userName} is typing...`);
})

function appendActivity(){
    let activityElement=document.createElement('h7');
    activityElement.classList.add('activityBody');

}



let activityTimer;
export{setUserName,getUserName}
