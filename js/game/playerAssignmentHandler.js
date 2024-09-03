const locations = [
    { filepath: "americanairlines", name:"American Airlines Center"},
    { filepath: "aincentgreece", name:"Ancient Greece"},
    { filepath: "at&tcenter", name:"At&t Stadium"},
    { filepath: "bartleyhouse", name:"The Bartley House"},
    { filepath: "bikinibottom", name:"Bikini Bottom"},
    { filepath: "brandedburger", name:"Branded Burger"},
    { filepath: "chuckycheesepizza", name:"Chuck E Cheese"},
    { filepath: "cs2office", name:"CS2 Office"},
    { filepath: "drakehouse", name:"Drake's House"},
    { filepath: "galveston", name:"Galveston"},
    { filepath: "uk", name:"Great Britain"},
    { filepath: "hogwarts", name:"Hogwarts"},
    { filepath: "hibachio", name:"Hibachio"},
    { filepath: "hooters", name:"Hooters"},
    { filepath: "lukeclassroom", name:"Luke's Classroom"},
    { filepath: "midlothianpark", name:"Midlo Community Park"},
    { filepath: "mhs", name:"Midlo High School"},
    { filepath: "oblock", name:"O-Block"},
    { filepath: "ravenswood", name:"Ravenswood Bluff"},
    { filepath: "showbiz", name:"Showbiz Cinema"},
    { filepath: "sixflags", name:"Six Flags"},
    { filepath: "theskeld", name:"The Skeld"},
    { filepath: "somdiscord", name:"SOM Discord"},
    { filepath: "summonersrift", name:"Summoner's Rift"},
    { filepath: "tiltedtowers", name:"Tilted Towers"},
    { filepath: "theshire", name:"The Shire"},
    { filepath: "whitehouse", name:"The White House"},
    { filepath: "twintowers", name:"The Twin Towers"},
    { filepath: "utaustin", name:"UT Austin"},
    { filepath: "whiterun", name:"Whiterun"},
];

// Backend role assignment logic
function assignRoles(players, location) {
    let shuffledPlayers = [...players].sort(() => 0.5 - Math.random());
    let randomLocation = locations[Math.floor(Math.random() * locations.length)];

    // Assign spy to the first player
    shuffledPlayers[0].role = 'spy';
    shuffledPlayers[0].location = null;
    
    // Assign 'good player' role and location to the rest
    for (let i = 1; i < shuffledPlayers.length; i++) {
        shuffledPlayers[i].role = 'good';
        shuffledPlayers[i].location = randomLocation;
    }

    return shuffledPlayers;
}

// Example usage
let players = [
    { id: 1, name: "" },
    { id: 2, name: "" },
    { id: 3, name: "" },
    { id: 4, name: "" }
];

let assignedRoles = assignRoles(players, location);
console.log(assignedRoles);

function displayRole(player) {
    const container = document.getElementById('location-container');
    const image = document.getElementById('location-image');
    const roleText = document.getElementById('role-text');
    
    // Set image and text based on player's role
    if (player.role === 'spy') {
        image.src = 'css/images/spy/image.jpg';
        roleText.textContent = 'You are the Spy!';
    } else {
        image.src = `css/images/${player.location.filepath}.jpg`;
        roleText.textContent = `You are at ${player.location.name}`;
    }

    // Show the container with animation
    container.classList.remove('hidden');
    container.classList.add('show');
}