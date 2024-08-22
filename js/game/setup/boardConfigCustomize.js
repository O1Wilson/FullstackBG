document.getElementById('customSearch').addEventListener('input', function() {
    const searchValue = this.value.toLowerCase();

    // Select all location elements
    const locationItems = document.querySelectorAll('.grid div');

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
