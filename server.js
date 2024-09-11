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

let availableLocations = [];

io.on('connection', (socket) => {
    console.log('A player connected');

    // Listen for the event when locations are sent from the client
    socket.on('setLocations', (locations) => {
        if (locations.length > 0) {
            availableLocations = locations;
            console.log('Available locations updated:', availableLocations);
        } else {
            socket.emit('errorMessage', 'Please choose locations from the map-board.');
        }
    });

    socket.on('startGame', () => {
        const players = getPlayers();
        if (availableLocations.length === 0) {
            socket.emit('errorMessage', 'Please choose locations from the map-board.');
            return;
        }

        const location = chooseRandomLocation(availableLocations);
        const roles = assignRoles(players, location);

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

function chooseRandomLocation(locations) {
    const randomIndex = Math.floor(Math.random() * locations.length);
    return locations[randomIndex].location;
}

// Implement this function to return the list of connected players
function getPlayers() {
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