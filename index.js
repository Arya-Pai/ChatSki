const express=require('express');
const app=express();
const {Server}=require("socket.io");
const http=require('http');
const server = http.createServer(app);
const io=new Server(server);
const port=5000;
const path = require('path');
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',(req,res)=>{
    res.sendFile(__dirname, 'public','index.html');

});
io.on('connection',(socket)=>{
    console.log('user connected')
    socket.on('send name',(username)=>{
        io.emit('send name',(username));
    });
    
    socket.on('send message',(chat)=>{
        io.emit('send message',(chat));
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
server.listen(port,()=>{
    console.log(`Listening on port ${port}`);
})