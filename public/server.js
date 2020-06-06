const path = require('path');
const express = require('express');
const app = express(),
    DIST_DIR = __dirname + '/../dist',
    HTML_FILE = path.join(DIST_DIR, 'index.html')
app.use(express.static(DIST_DIR))
app.get('/', (req, res) => {
    res.sendFile(HTML_FILE)
});
const PORT = process.env.PORT || 8080;
const http = require('http').Server(app);
const io = require('socket.io')(http);

http.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
})

io.on('connection', (socket) => {

    socket.on('chat message', msg => {
        socket.broadcast.emit('chat message', {
            username: socket.username,
            message: msg
        });
    });

    socket.on('add user', (username) => {
        // we store the username in the socket session for this client
        socket.username = username;

        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user joined', socket.username);
    });

    socket.on('disconnect', () => {
        // echo globally that this client has left
        socket.broadcast.emit('user left', socket.username);
    });
});

