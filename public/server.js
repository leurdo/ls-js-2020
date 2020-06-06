const path = require('path');
const express = require('express');
const app = express(),
    DIST_DIR = __dirname + '/../',
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
    console.log('connected');
    socket.on('disconnect', () => {
        console.log("A user disconnected");
    });

});