const gameState = {
    players: [], // Each player will have their role stored here
    location: '', // The location being used for this game session
    spy: null, // Reference to the spy player
};

// Example of a player object
// {
//     id: socket.id,
//     role: 'spy' or 'location',
//     location: 'locationName' or null (if spy),
//     socket: socket (reference to socket object)
// }