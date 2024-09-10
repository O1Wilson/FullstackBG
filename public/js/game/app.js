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

let popupOpen = false; 

function openRolePopup(title, message) {
    if (popupOpen) return;

    popupOpen = true;

    // Create a popup container
    const popupOverlay = document.createElement('div');
    popupOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50';
    popupOverlay.onclick = function(event) {
        if (event.target === popupOverlay) {
            document.body.removeChild(popupOverlay);
            popupOpen = false;
        }
    };

    // Create the popup content
    const popupContent = document.createElement('div');
    popupContent.className = 'bg-white p-5 rounded-lg shadow-lg relative';
    popupContent.style.width = '400px'; 
    popupContent.style.height = '200px';
    popupContent.style.display = 'flex';
    popupContent.style.flexDirection = 'column';
    popupContent.style.justifyContent = 'center';
    popupContent.style.alignItems = 'center';
    popupContent.onclick = function(event) {
        event.stopPropagation();
    };

    // Add title and message to the popup
    const popupTitle = document.createElement('h2');
    popupTitle.textContent = title;
    popupTitle.className = 'text-xl font-bold mb-4';
    
    const popupMessage = document.createElement('p');
    popupMessage.textContent = message;
    popupMessage.className = 'text-lg';

    popupContent.appendChild(popupTitle);
    popupContent.appendChild(popupMessage);

    // Add a close button to the popup
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.className = 'absolute top-2 right-2 bg-gray-200 text-gray-800 px-3 py-1 rounded';
    closeButton.onclick = function() {
        document.body.removeChild(popupOverlay);
        popupOpen = false;
    };
    popupContent.appendChild(closeButton);

    popupOverlay.appendChild(popupContent);
    document.body.appendChild(popupOverlay);
}

// Display functions to use the popup
function displaySpyUI() {
    openRolePopup('Role Information', 'You are the Spy!');
}

function displayLocationUI(location) {
    openRolePopup('Role Information', `Your Location: ${location}`);
}

function displayRoleCard(role) {
    const roleCardImage = document.getElementById('roleCardImage');
    const roleCardTitle = document.getElementById('roleCardTitle');

    if (role === 'spy') {
        roleCardImage.src = '/css/images/spy-card.jpg';
        roleCardTitle.textContent = 'You are the Spy!';
    } else {
        roleCardImage.src = `/css/images/${role}.jpg`;
        roleCardTitle.textContent = `Location: ${role}`;
    }

    // Add animation class for card entrance
    document.getElementById('roleCard').classList.add('animate-slideIn');
}

function createRoleCard(playerRole) {
    const hand = document.getElementById('hand');
    const card = document.createElement('div');

    card.classList.add('role-card');
    
    const roleImage = document.createElement('img');
    roleImage.src = playerRole === 'spy' ? '/images/spy-card.jpg' : `/css/images/${playerRole}.jpg`;
    roleImage.alt = playerRole === 'spy' ? 'Spy Card' : `Location Card for ${playerRole}`;
    
    card.appendChild(roleImage);
    
    const roleText = document.createElement('p');
    roleText.textContent = playerRole === 'spy' ? 'You are the Spy!' : `Location: ${playerRole}`;
    roleText.classList.add('text-center', 'text-xl', 'font-bold', 'pt-2');
    
    card.appendChild(roleText);
    hand.appendChild(card);

    setTimeout(() => {
        card.classList.add('show');
    }, 100);
}