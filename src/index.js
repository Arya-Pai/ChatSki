const express = require('express');
const app = express();
const { Server } = require("socket.io");
const http = require('http');
const server = http.createServer(app);
const io = new Server(server);
const port = 5000;
const hbs = require('hbs');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", 'hbs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));
app.use('/js', express.static(path.join(__dirname, './')));

app.get('/', (req, res) => {
    res.render('index');  // Renders the index.hbs file
});

io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('send name', (username) => {
        io.emit('send name', (username));
    });

    socket.on('send message', (chat) => {
        io.emit('send message', (chat));
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});