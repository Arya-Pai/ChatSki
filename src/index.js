import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';


const app = express();
const server = createServer(app);
const io = new Server(server);
const port = process.env.PORT||5000;
const __filename=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", 'hbs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));
app.use('/js', express.static(path.join(__dirname, './')));
app.use(express.static(path.join(__dirname, '../src'))); // Serve static files from src


app.get('/home', (req, res) => {
    res.render('index');  // Renders the index.hbs file
});

 io.on('connection', async(socket) => {
    console.log('user connected');

    socket.on('send name', (username) => {
        io.emit('send name', (username));
    });

  socket.on('send message', (chat) => {
        io.emit('send message', (chat));
    });
  socket.emit('message','Welcome to the room')

   socket.broadcast.emit('message',`${username} connected`)

 socket.on('disconnect', () => {
        console.log('user disconnected');
    });

});


server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});