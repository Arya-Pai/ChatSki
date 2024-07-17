import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { signup, validate } from './mongo.js';
import session from 'express-session';

const app = express();
const server = createServer(app);
const io = new Server(server);
const port = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", 'hbs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));
app.use('/js', express.static(path.join(__dirname, './')));
app.use(express.static(path.join(__dirname, '../src'))); // Serve static files from src

app.get('/home', async (req, res) => {
    try {
        if (!req.session.username) {
            return res.redirect('/');
        }
        const user = await signup.findOne({ email: req.session.email }); // Assuming signup is your Mongoose model
        if (!user) {
            return res.status(400).send("User does not exist");
        }
        res.render('index', { username: user.username });
    } catch (error) {
        console.log("Error in fetching user data from database:", error);
        return res.status(500).send("Error occurred while fetching user data");
    }
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
    }

    const data = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    };

    try {
        await signup.create(data);
        req.session.username = req.body.username;
        req.session.email = req.body.email;
        res.redirect('/home');
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
            req.session.username = user.username;
            req.session.email = user.email;
            console.log(req.session.username);
            return res.redirect('/home');
        } else {
            return res.status(400).send("Incorrect password");
        }
    } catch (error) {
        console.log("Error occurred while processing login:", error);
        return res.status(500).send("Error occurred while logging in");
    }
});

io.on('connection', (socket) => {
    const username = socket.handshake.query.username;
    console.log(`${username} connected`);

    socket.emit('message', `Welcome to the room, ${username}`);

    socket.broadcast.emit('message', `${username} connected`);

    socket.on('send message', (chat) => {
        io.emit('send message', { username, chat });
    });

    socket.on('disconnect', () => {
        console.log(`${username} disconnected`);
        socket.broadcast.emit('message', `${username} disconnected`);
    });
});