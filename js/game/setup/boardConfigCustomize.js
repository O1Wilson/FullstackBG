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

// Function to toggle the opacity of the overlay
let toggledCount = 0;
const toggledItems = new Set();
const generateButton = document.getElementById('customApplyButton');
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
            // Prevent further toggling
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
        customApplyButton.classList.remove('bg-gray-300', 'bg-red-500', 'cursor-not-allowed');
        customApplyButton.classList.add('bg-green-500', 'hover:bg-green-600', 'text-white');
    } else if (toggledCount > 25) {
        customApplyButton.classList.remove('bg-gray-300', 'bg-green-500');
        customApplyButton.classList.add('bg-red-500', 'cursor-not-allowed');
    } else {
        customApplyButton.classList.remove('bg-green-500', 'bg-red-500', 'cursor-not-allowed', 'hover:bg-green-600', 'text-white');
        customApplyButton.classList.add('bg-gray-300');
    }

    // Update the toggled count display
    updateToggledCountDisplay();
}

function reapplyTints() {
    toggledItems.forEach(id => {
        const button = document.getElementById(id);
        const overlay = button.querySelector('div');
        overlay.classList.remove('bg-opacity-50');
        overlay.classList.add('bg-opacity-0');
    });
}