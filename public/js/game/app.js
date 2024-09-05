const socket = io();

// Handle start game button click
document.getElementById('startGameButton').addEventListener('click', () => {
    socket.emit('startGame');
});

// Listen for role assignment
socket.on('assignedRole', (data) => {
    const { role, location } = data;
    // Store role in client-side variables
    window.playerRole = role;
    window.playerLocation = location;

    // Update the UI based on role
    if (role === 'spy') {
        displaySpyUI();
    } else {
        displayLocationUI(location);
    }

    // Create role card
    createRoleCard(role);
});

socket.on('assignedRole', function(data) {
    const { role, location } = data;

    // Store role in client-side variables
    window.playerRole = role;
    window.playerLocation = location;

    // Update the UI based on role
    if (role === 'spy') {
        displaySpyUI();
    } else {
        displayLocationUI(location);
    }
});

function displaySpyUI() {
    document.getElementById('roleDisplay').innerHTML = '<h2>You are the Spy!</h2>';
    // Hide or show specific UI elements based on role
}

function displayLocationUI(location) {
    document.getElementById('roleDisplay').innerHTML = `<h2>Your Location: ${location}</h2>`;
    // Show location-related UI elements
}

function displayRoleCard(role) {
    const roleCardImage = document.getElementById('roleCardImage');
    const roleCardTitle = document.getElementById('roleCardTitle');

    if (role === 'spy') {
        roleCardImage.src = '/images/spy-card.jpg';
        roleCardTitle.textContent = 'You are the Spy!';
    } else {
        roleCardImage.src = `/images/${role}.jpg`;
        roleCardTitle.textContent = `Location: ${role}`;
    }

    // Add animation class for card entrance
    document.getElementById('roleCard').classList.add('animate-slideIn');
}

function createRoleCard(playerRole) {
    const hand = document.getElementById('hand');
    const card = document.createElement('div');

    card.classList.add('relative', 'w-40', 'h-60', 'bg-white', 'rounded-lg', 'shadow-lg', 'border', 'border-gray-300', 'card-enter', 'hover-move-up');
    card.style.transform = 'translateY(100%)';

    const roleText = document.createElement('p');
    roleText.textContent = playerRole;
    roleText.classList.add('text-center', 'text-xl', 'font-bold', 'pt-20');

    card.appendChild(roleText);
    hand.appendChild(card);
}