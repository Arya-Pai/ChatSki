import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { signup,validate } from './mongo.js';

const app = express();
const server = createServer(app);
const io = new Server(server);
const port = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('send name', (username) => {
        io.emit('send name', username);
    });

    socket.on('send message', (chat) => {
        io.emit('send message', chat);
    });

    socket.emit('message', 'Welcome to the room');

    socket.on('send name', (username) => {
        socket.broadcast.emit('message', `${username} connected`);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

app.get('/', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        console.log(error);
        return res.status(400).send("Validation error");

};

    const data = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    };

    try {
        await signup.create(data);
        res.render("login");
    } catch (error) {
        console.log("Error in validation to database", error);
        res.status(400).send("Validation not successful");
    }
});

app.post('/', async (req, res) => {
    try {
        const user = await signup.findOne({ email: req.body.email });

        if (!user) {
            return res.status(400).send("User does not exist");
        }

        if (user.password === req.body.password) {
            return res.render("index");
        } else {
            return res.status(400).send("Incorrect password");
        }
    } catch (error) {
        console.log("Error occurred while processing login:", error);
        return res.status(500).send("Error occurred while logging in");
    }
});