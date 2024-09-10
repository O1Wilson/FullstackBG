const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'boardgame.html'));
});

io.on('connection', (socket) => {
    console.log('A player connected');

      socket.on('startGame', () => {
        const players = getPlayers();
        const location = 'Some Location';

        const roles = assignRoles(players, location);

        // Send the role to each player
        players.forEach(player => {
            io.to(player.id).emit('assignedRole', {
                role: player.role,
                location: player.location
            });
        });
    });

    socket.on('disconnect', () => {
        console.log('A player disconnected');
    });
});

// Implement this function to return the list of connected players
function getPlayers() {
    // Placeholder: return an array of connected players
    // You need to track connected players and their socket IDs
    return Array.from(io.sockets.sockets.values()).map(socket => ({
        id: socket.id,
        socket: socket,
    }));
}

function assignRoles(players, location) {
    let spyIndex = Math.floor(Math.random() * players.length);

    players.forEach((player, index) => {
        if (index === spyIndex) {
            player.role = 'spy';
            player.location = null;
        } else {
            player.role = 'location';
            player.location = location;
        }
    });

    return players;
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));