document.addEventListener('DOMContentLoaded', () => {
    // Function to toggle tag visibility in the sidebar
    function toggleTagVisibility(tagId, isVisible) {
        const tag = document.getElementById(tagId);
        if (tag) {
            if (isVisible) {
                tag.classList.remove('hidden');
            } else {
                tag.classList.add('hidden');
            }
        }
    }

    const MAX_ITEM_COUNT = 25;
    let totalItemCount = 0;

    // Function to update the total item count
    function updateTotalItemCount() {
        totalItemCount = 0;
        const selectElements = document.querySelectorAll('#activeTable select');
        
        selectElements.forEach(selectElement => {
            totalItemCount += parseInt(selectElement.value, 10);
        });

        const remainingItems = MAX_ITEM_COUNT - totalItemCount;
        
        // Check if the cap is reached or is about to be reached
        selectElements.forEach(selectElement => {
            const currentVal = parseInt(selectElement.value, 10);
            adjustSelectOptions(selectElement, remainingItems + currentVal);
        });

        // Check if the cap is reached
        if (totalItemCount >= MAX_ITEM_COUNT) {
            disableAdditions();
        } else {
            enableAdditions();
        }
        // Remove later
        console.log("Total Item Count:", totalItemCount);  // For debugging
    }

    // Function to disable adding items when the cap is reached
    function disableAdditions() {
        document.querySelectorAll('#activeTable select').forEach(selectElement => {
            const currentVal = parseInt(selectElement.value, 10);
            // Disable all options greater than or equal to the current value
            for (let i = 0; i < selectElement.options.length; i++) {
                const optionVal = parseInt(selectElement.options[i].value, 10);
                if (optionVal > currentVal) {
                    selectElement.options[i].disabled = true;
                }
            }
            selectElement.classList.add('bg-gray-200', 'cursor-not-allowed');
        });

        // Disable the sidebar tags and add a visual indicator
        document.querySelectorAll('.tag-item').forEach(tag => {
            tag.classList.add('cursor-not-allowed');
        });

        document.querySelectorAll('.tag-number').forEach(tag => {
            tag.classList.remove('hover:bg-green-500', 'hover:text-white');
            tag.classList.add('cursor-not-allowed');
        });
    }

    // Function to re-enable adding items when under the cap
    function enableAdditions() {
        document.querySelectorAll('#activeTable select').forEach(selectElement => {
            for (let i = 0; i < selectElement.options.length; i++) {
                selectElement.options[i].disabled = false;
            }
            selectElement.classList.remove('bg-gray-200', 'cursor-not-allowed');
        });

        // Enable the sidebar tags and remove the visual indicator
        document.querySelectorAll('.tag-item').forEach(tag => {
            tag.classList.remove('cursor-not-allowed');
        });

        document.querySelectorAll('.tag-number').forEach(tag => {
            tag.classList.add('hover:bg-green-500', 'hover:text-white');
            tag.classList.remove('cursor-not-allowed');
        });
    }

    // Function to adjust the options in the select elements dynamically
    function adjustSelectOptions(selectElement, remainingItems) {
        for (let i = 0; i < selectElement.options.length; i++) {
            const optionVal = parseInt(selectElement.options[i].value, 10);
            if (optionVal > remainingItems) {
                selectElement.options[i].disabled = true;
            } else {
                selectElement.options[i].disabled = false;
            }
        }
    }

    // Modify the addTagToTable function to check the cap before adding
    function addTagToTable(tagElement) {
        if (totalItemCount >= MAX_ITEM_COUNT) {
            return;
        }
        const tagText = tagElement.textContent.trim();
        const itemCount = parseInt(tagElement.querySelector('span').textContent.trim(), 10);
        const tagId = tagElement.getAttribute('id');

        const tableBody = document.querySelector('#activeTable tbody');
        const row = document.createElement('tr');
        row.classList.add('border-b');
        row.setAttribute('data-tag-id', tagId);

        // Generate options based on item count
        let options = '';
        for (let i = 1; i <= itemCount; i++) {
            options += `<option>${i}</option>`;
        }

        row.innerHTML = `
            <td class="py-2 px-4">
                <span class="bg-gray-300 text-gray-700 rounded-full px-3 py-1 text-xs font-medium inline-flex items-center relative">
                    <span class="bg-white text-gray-700 rounded-full w-5 h-5 flex items-center justify-center shadow mr-2 hover:bg-red-500 hover:text-white cursor-pointer remove-tag">${itemCount}</span>
                    ${tagText}
                </span>
            </td>
            <td class="py-2 px-4">
                <select class="border border-gray-300 rounded p-1">
                    ${options}
                    <!-- Add options based on tag count -->
                </select>
            </td>
            <td class="py-2 px-4 text-right relative">
                <!-- Triple Dots Button -->
                <button class="text-gray-500 hover:text-gray-700 table-dropdown-button">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5 inline">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01" />
                    </svg>
                </button>
                <!-- Dropdown Menu -->
                <div class="hidden absolute right-0 mt-2 w-48 z-50 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none table-dropdown-menu" role="menu" aria-orientation="vertical">
                    <button class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dropdown-remove-tag">Remove from table</button>
                    <button class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">View items</button>
                    <button class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Add item to tag</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
        
        updateTotalItemCount();

        // Add event listener to the remove link
        row.querySelector('.remove-tag').addEventListener('click', (event) => {
            event.preventDefault();
            const tagId = row.getAttribute('data-tag-id');
            row.remove();
            toggleTagVisibility(tagId, true);

            updateTotalItemCount();
        });

        // Event listener for dropdown "Remove from table" button
        row.querySelector('.dropdown-remove-tag').addEventListener('click', (event) => {
            event.preventDefault();
            const tagId = row.getAttribute('data-tag-id');
            row.remove();
            toggleTagVisibility(tagId, true);

            updateTotalItemCount();
        });

        // Event listener for the select element to track changes in item count
        row.querySelector('select').addEventListener('change', (event) => {
            updateTotalItemCount();
        });

        // Add event listener to the dropdown button
        row.querySelector('.table-dropdown-button').addEventListener('click', (event) => {
            document.querySelectorAll('.table-dropdown-menu').forEach(menu => {
                menu.classList.add('hidden');
            });

            // Toggle the current dropdown menu
            const dropdownMenu = row.querySelector('.table-dropdown-menu');
            dropdownMenu.classList.toggle('hidden');
            
            // Stop the click event from propagating to the document
            event.stopPropagation();
        });

        // Add event listener to the document to close the dropdown when clicking outside
        document.addEventListener('click', (event) => {
            document.querySelectorAll('.table-dropdown-menu').forEach(menu => {
                if (!menu.classList.contains('hidden')) {
                    menu.classList.add('hidden');
                }
            });
        });

        toggleTagVisibility(tagId, false);
    }
    
    // Add event listeners to sidebar tags
    document.querySelectorAll('.tag-item').forEach(tag => {
        tag.addEventListener('click', () => {
            addTagToTable(tag);
        });
    });

    // Function to attach event listeners to tags
    function attachTagEventListeners() {
        document.querySelectorAll('.tag-item').forEach(tag => {
            tag.removeEventListener('click', handleTagClick);
            tag.addEventListener('click', handleTagClick);
        });
    }

    // Event handler for tag click
    function handleTagClick(event) {
        addTagToTable(event.currentTarget);
    }

    // Initialize MutationObserver
    const observer = new MutationObserver(() => {
        attachTagEventListeners();
    });

    // Start observing the sidebar tag container for changes
    const sidebarTagsContainer = document.getElementById('sideBarTags');
    if (sidebarTagsContainer) {
        observer.observe(sidebarTagsContainer, { childList: true });
    }

    // Initial attachment of event listeners
    attachTagEventListeners();
});

document.getElementById('tagSearch').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    const tags = document.querySelectorAll('#sideBarTags .tag-item');
    
    tags.forEach(tag => {
        const tagName = tag.textContent.toLowerCase();
        if (tagName.includes(query)) {
            tag.style.visibility = 'visible';
            tag.style.position = 'relative';
        } else {
            tag.style.visibility = 'hidden';
            tag.style.position = 'absolute';
        }
    });
});