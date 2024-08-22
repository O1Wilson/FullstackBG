document.addEventListener('DOMContentLoaded', () => {
    // Sample tag data
    const tags = [
        { id: "1", name: "Resturant", count: 5 },
        { id: "2", name: "Video Game", count: 3 },
        { id: "3", name: "Midlothian", count: 7 },
        { id: "4", name: "Austin", count: 2 },
        { id: "5", name: "Anime", count: 1 },
        { id: "6", name: "Miscellaneous", count: 4 },
        { id: "7", name: "Historical", count: 6 },
        { id: "8", name: "Pop-Culture", count: 9 },
        { id: "9", name: "Movie", count: 8 },
        { id: "10", name: "Tag 10", count: 10 }
    ];

    // Function to generate tag HTML
    function createTagElement(tag) {
        return `
            <span id="tag-${tag.id}" class="tag-item bg-gray-300 text-gray-700 rounded-full px-3 py-1 text-xs font-medium inline-flex items-center relative cursor-pointer">
                <span class="tag-number bg-white text-gray-700 rounded-full w-5 h-5 flex items-center justify-center shadow mr-2 hover:bg-green-500 hover:text-white cursor-pointer">${tag.count}</span>
                ${tag.name}
            </span>
        `;
    }

    // Function to load and insert tags
    function loadTags() {
        const container = document.getElementById('sideBarTags');
        container.innerHTML = tags.map(createTagElement).join('');
    }

    // Function to show the customize map pop-up
    function showCustomizePopup() {
        const popup = document.getElementById('customize-map-popup');
        popup.classList.remove('hidden');
        loadTags();
    }

    // Function to hide the customize map pop-up
    function hideCustomizePopup() {
        const popup = document.getElementById('customize-map-popup');
        popup.classList.add('hidden');
    }

    // Event listener for opening the pop-up
    document.getElementById('customizeButton').addEventListener('click', showCustomizePopup); // Causes error when testing button not present

    // Event listener for closing the pop-up 
    document.getElementById('customize-map-popup').addEventListener('click', (event) => {
        if (event.target === event.currentTarget) {
            hideCustomizePopup();
        }
    });
});

// Handles switching between the different setup categories.
//
// Add code for generating board from setup