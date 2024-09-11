window.images = [
    { location:"American Airlines Center", id: "aacenter", tags: [4] },
    { location:"Ancient Greece", id: "anicentgreece", tags: [7] },
    { location:"At&t Stadium", id: "attstad", tags: [4] },
    { location:"The Bartley House", id: "bartleyhouse", tags: [3] },
    { location:"Bikini Bottom", id: "bikinibottom", tags: [6, 8] },
    { location:"Branded Burger", id: "brandedburger", tags: [1] },
    { location:"Chuck E Cheese", id: "chuckecheese", tags: [4] },
    { location:"CS2 Office", id: "de_office", tags: [2, 6] },
    { location:"Drake's House", id: "drakehouse", tags: [9] },
    { location:"Galveston", id: "galveston", tags: [9] },
    { location:"Great Britain", id: "greatbritain", tags: [7] },
    { location:"Hogwarts", id: "hogwarts", tags: [6, 8] },
    { location:"Hibachio", id: "hibachio", tags: [1] },
    { location:"Hooters", id: "hooters", tags: [1] },
    { location:"Luke's Classroom", id: "lukesclassroom", tags: [3] },
    { location:"Midlo Community Park", id: "midlopark", tags: [3] },
    { location:"Midlo High School", id: "mhs", tags: [3] },
    { location:"O-Block", id: "oblock", tags: [8, 9] },
    { location:"Ravenswood Bluff", id: "ravenswoodbluff", tags: [6] },
    { location:"Showbiz Cinema", id: "showbiz", tags: [4] },
    { location:"Six Flags", id: "sixflags", tags: [4] },
    { location:"The Skeld", id: "skeld", tags: [2, 6] },
    { location:"SOM Discord", id: "som", tags: [9] },
    { location:"Summoner's Rift", tags: [2, 6] },
    { location:"Tilted Towers", tags: [2, 6] },
    { location:"The Shire", id: "theshire", tags: [6, 8] },
    { location:"The White House", id: "thewhitehouse", tags: [7] },
    { location:"The Twin Towers", id: "twintowers", tags: [7] },
    { location:"UT Austin", id: "utaustin", tags: [9] },
    { location:"Whiterun", id: "whiterun", tags: [2, 6] }
];

document.getElementById('customSearch').addEventListener('input', function() {
    const searchValue = this.value.toLowerCase();

    // Select all location elements
    const locationItems = document.querySelectorAll('.griddy button');

    locationItems.forEach(locationItem => {
        const locationId = locationItem.id.toLowerCase();
        
        // Ensure data-alias is not null, if it is, default to an empty string
        const locationAliasAttr = locationItem.getAttribute('data-alias');
        const locationAliases = locationAliasAttr ? locationAliasAttr.toLowerCase().split(',') : [];

        // Check if the search value matches the id or any alias
        const matchesId = locationId.includes(searchValue);
        const matchesAlias = locationAliases.some(alias => alias.includes(searchValue));

        if (matchesId || matchesAlias) {
            locationItem.classList.remove('hidden');
        } else {
            locationItem.classList.add('hidden');
        }
    });
});

let toggledCount = 0;
const toggledItems = new Set();
const generateButton = document.getElementById('customSubmitButton');
const toggledCountDisplay = document.getElementById('toggledCountDisplay');

function updateToggledCountDisplay() {
    toggledCountDisplay.textContent = `${toggledCount} / 25`;
}

function toggleOpacity(id) {
    const button = document.getElementById(id);
    const overlay = button.querySelector('div');

    if (toggledItems.has(id)) {
        // If the item is already toggled, untoggle it
        console.log(`Item ${id} is already toggled. Untoggling it.`);
        overlay.classList.remove('bg-opacity-0');
        overlay.classList.add('bg-opacity-50');
        toggledItems.delete(id);
        toggledCount--;
    } else {
        // If the item is not toggled, check the cap
        if (toggledCount >= 25) {
            button.classList.add('cursor-not-allowed');
            return;
        }
        overlay.classList.remove('bg-opacity-50');
        overlay.classList.add('bg-opacity-0');
        toggledItems.add(id);
        toggledCount++;
    }
    console.log(`Updated toggled count: ${toggledCount}`);

    // Update cursor style based on the selection state
    if (toggledCount >= 25) {
        document.querySelectorAll('.griddy button').forEach(btn => {
            if (!toggledItems.has(btn.id)) {
                btn.classList.add('cursor-not-allowed');
            }
        });
    } else {
        document.querySelectorAll('.griddy button').forEach(btn => {
            btn.classList.remove('cursor-not-allowed');
        });
    }

     // Update generate button style based on the toggled count
    if (toggledCount === 25) {
        customSubmitButton.classList.remove('bg-gray-300', 'bg-red-500', 'cursor-not-allowed');
        customSubmitButton.classList.add('bg-green-500', 'hover:bg-green-600', 'text-white');
    } else if (toggledCount > 25) {
        customSubmitButton.classList.remove('bg-gray-300', 'bg-green-500');
        customSubmitButton.classList.add('bg-red-500', 'cursor-not-allowed');
    } else {
        customSubmitButton.classList.remove('bg-green-500', 'bg-red-500', 'cursor-not-allowed', 'hover:bg-green-600', 'text-white');
        customSubmitButton.classList.add('bg-gray-300');
    }

    // Update the toggled count display
    updateToggledCountDisplay();
}

document.getElementById('customSubmitButton').addEventListener('click', function() {
    if (toggledCount === 25) {
        generateSelectedLocations();
    } else {
        alert(`Please select exactly 25 locations. You have selected ${toggledCount}.`);
    }
});

function generateSelectedLocations() {
    const selectedLocations = [];

    toggledItems.forEach(toggledId => {
        const location = images.find(img => img.id === toggledId);
        if (location) {
            selectedLocations.push(location);
        }
    });

    sendSelectedLocationsToServer(selectedLocations);
}

function reapplyTints() {
    toggledItems.forEach(id => {
        const button = document.getElementById(id);
        const overlay = button.querySelector('div');
        overlay.classList.remove('bg-opacity-50');
        overlay.classList.add('bg-opacity-0');
    });
}