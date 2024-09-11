document.addEventListener('DOMContentLoaded', () => {
    // Sample tag data
    window.tags = [
        { id: "1", name: "Resturant", count: "3" }, // Tags = Branded Burger, Hooters, Hibachio
        { id: "2", name: "Video Game", count: "5"}, // Tags = CS2 Office, The Skeld, Summoner's Rift, Tilted Towers, Whiterun
        { id: "3", name: "Midlothian", count: "4"},// Tags = Midlo Community Park, Midlo High School, Luke's classroom, The Bartley House
        { id: "4", name: "Entertainment", count: "5"}, // Tags = American Airlines Center, At&t Stadium, Showbiz Cinema, Six Flags, Chuck E Cheese
        { id: "6", name: "Fictional", count: "9" }, // Tags = Bikini Bottom, Hogwarts, Tilted Towers, Whiterun, The Shire, Summoner's Rift, The Skeld, CS2 Office, Ravenswood Bluff
        { id: "7", name: "Historical", count: "4"}, // Tags = Ancient Greece, Greate Britain, The White House, The Twin Towers
        { id: "8", name: "Pop-Culture", count: "4"}, // Tags = Bikini Bottom, Hogwarts, The Shire, O-Block
        { id: "9", name: "Miscellaneous", count: "5"}, // Tags = UT Austin, SOM Discord, O-Block, Galveston, Drake's House
    ];

    // Sample image data
    const displayimages = [
        { location:"American Airlines Center", id: "aacenter", name: "americanairlines", alias: "the american airlines center stadium, american airlines center stadium", tags: [4] },
        { location:"Ancient Greece", id: "anicentgreece", name: "aincentgreece", alias: "greece,rome,aincent greece,aincent rome,ancient rome,ancient greece", tags: [7] },
        { location:"At&t Stadium", id: "attstad", name: "at&tcenter", alias: "at&t stadium,at and t stadium,atant stadium,atandt stadium,at8t stadium,cowboys", tags: [4] },
        { location:"The Bartley House", id: "bartleyhouse", name: "bartleyhouse", alias: "bartley house,bartly house,bartely house,the bartley house,the bartly house,the bartely house,the bartleys,the bartelys,the bartlys,the bartley's,the bartely's,the bartly's,tommy's house,tommys house", tags: [3] },
        { location:"Bikini Bottom", id: "bikinibottom", name: "bikinibottom", alias: "the bikini bottom,bikini bottom,spongebob bikini bottom,sponge bob bikini bottom", tags: [6, 8] },
        { location:"Branded Burger", id: "brandedburger", name: "brandedburger", alias: "branded burger", tags: [1] },
        { location:"Chuck E Cheese", id: "chuckecheese", name: "chuckycheesepizza", alias: "chuck e cheese", tags: [4] },
        { location:"CS2 Office", id: "de_office", name: "cs2office", alias: "office,csoffice,cs office,csgo office,cs2 office,the office", tags: [2, 6] },
        { location:"Drake's House", id: "drakehouse", name: "drakehouse", alias: "drake house,drakes house,drake's house,diddy party", tags: [9] },
        { location:"Galveston", id: "galveston", name: "galveston", alias: "the beach,galveston beach", tags: [9] },
        { location:"Great Britain", id: "greatbritain", name: "uk", alias: "great britain,britain,uk,the uk,the u.k.,u.k.,chewsday innit,innit,hell", tags: [7] },
        { location:"Hogwarts", id: "hogwarts", name: "hogwarts", alias: "hogwarts school of witchcraft and wizardry,harry potter", tags: [6, 8] },
        { location:"Hibachio", id: "hibachio", name: "hibachio", alias: "hibachio grill", tags: [1] },
        { location:"Hooters", id: "hooters", name: "hooters", alias: "owen's ideal woman,owen's ideal women,brayden's ideal woman,brayden's ideal women,tommy's ideal woman,tommy's ideal women,twin peaks", tags: [1] },
        { location:"Luke's Classroom", id: "lukesclassroom", name: "lukeclassroom", alias: "lukes classroom,luke's classroom,classroom", tags: [3] },
        { location:"Midlo Community Park", id: "midlopark", name: "midlothianpark", alias: "the midlothian community park,midlothian community park,midlothian park,the spot", tags: [3] },
        { location:"Midlo High School", id: "mhs", name: "mhs", alias: "midlothian highschool,midlothian high school,hell", tags: [3] },
        { location:"O-Block", id: "oblock", name: "oblock", alias: "oblock,the hood", tags: [8, 9] },
        { location:"Ravenswood Bluff", id: "ravenswoodbluff", name: "ravenswood", alias: "ravenswood bluff,ravens wood bluff,raven's wood bluff", tags: [6] },
        { location:"Showbiz Cinema", id: "showbiz", name: "showbiz", alias: "showbiz theater,showbiz theatre,showbiz cinema waxahachie,waxahachie theatre,waxahachie theater,waxahachie showbiz cinema theater", tags: [4] },
        { location:"Six Flags", id: "sixflags", name: "sixflags", alias: "six flags,rollercoaster park,amusement park", tags: [4] },
        { location:"The Skeld", id: "skeld", name: "theskeld", alias: "amongus,among us,amog us,amogus,the skeld,sussy baka,vented,electrical,imposter", tags: [2, 6] },
        { location:"SOM Discord", id: "som", name: "somdiscord", alias: "som discord server,society of merchants,som server, som chat,som call,discord server", tags: [9] },
        { location:"Summoner's Rift", id: "summonersrift", name: "summonersrift", alias: "league of legends,lol,summoners rift,summoner's rift,aram", tags: [2, 6] },
        { location:"Tilted Towers", id: "tiltedtowers", name: "tiltedtowers", alias: "fortnite,tilted towers", tags: [2, 6] },
        { location:"The Shire", id: "theshire", name: "theshire", alias: "the shire,shire,hobbits,lord of the rings,lotr", tags: [6, 8] },
        { location:"The White House", id: "thewhitehouse", name: "whitehouse", alias: "the white house,white house", tags: [7] },
        { location:"The Twin Towers", id: "twintowers", name: "twintowers", alias: "twin towers,world trade center,wtc,9/11", tags: [7] },
        { location:"UT Austin", id: "utaustin", name: "utaustin", alias: "austin,ut austin,college,lhr twerk day", tags: [9] },
        { location:"Whiterun", id: "whiterun", name: "whiterun", alias: "skyrim", tags: [2, 6] }
    ];

    function createTagElement(tag) {
        return `
            <span id="tag-${tag.id}" class="tag-item bg-gray-300 text-gray-700 rounded-full px-3 py-1 text-xs font-medium inline-flex items-center relative cursor-pointer">
                <span class="tag-number bg-white text-gray-700 rounded-full w-5 h-5 flex items-center justify-center shadow mr-2 hover:bg-green-500 hover:text-white cursor-pointer">${tag.count}</span>
                ${tag.name}
            </span>
        `;
    }

    function createImageElement(displayimages) {
        return `
            <button id="${displayimages.id}" class="group bg-gray-300 h-28 w-48 rounded-md flex items-center justify-center overflow-hidden relative text-white" data-alias="${displayimages.alias}" onclick="toggleOpacity('${displayimages.id}')">
                <img src="css/images/${displayimages.name}.jpg" alt="${displayimages.name}" class="h-full w-full object-cover" />
                <div class="absolute inset-0 bg-black bg-opacity-50 group-hover:opacity-0 transition-opacity duration-300"></div>
                <div class="absolute opacity-0 group-hover:opacity-100">
                    <span class="text-xl font-bold">${displayimages.location}</span>
                </div>
            </button>
        `;
    }

    function loadTags() {
        const container = document.getElementById('sideBarTags');
        container.innerHTML = tags.map(createTagElement).join('');
    }

    function hideTags() {
        const container = document.getElementById('sideBarTags');
        container.innerHTML = '';
    }

    function loadImages() {
        const container = document.querySelector('.griddy');
        const staticButton = container.querySelector('.add-new-item');
        if (staticButton) {
            staticButton.remove();
        }

        container.innerHTML = '';
        const dynamicButtons = displayimages.map(createImageElement).join('');
        container.insertAdjacentHTML('beforeend', dynamicButtons);

        if (staticButton) {
            container.appendChild(staticButton);
        }
    }

    function hideImages() {
        const container = document.querySelector('.griddy');
        container.innerHTML = '';
    }

    function showCustomizePopup() {
        const popup = document.getElementById('customize-map-popup');
        popup.classList.remove('hidden');
        loadTags();
    }

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

    // Select all tabs and tab content sections
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    function showTabContent(tabId) {
        tabContents.forEach(content => {
            content.classList.add('hidden');
        });
        document.getElementById(tabId).classList.remove('hidden');
    }

    // Event listener for tab clicks
    tabs.forEach(tab => {
        tab.addEventListener('click', (event) => {
            const tabId = event.target.getAttribute('data-tab');
            showTabContent(tabId);

            switch (tabId) {
                case 'generateTab':
                    loadTags();
                    hideImages();
                    //hidePresets();
                    break;
                case 'customTab':
                    loadImages();
                    hideTags();
                    reapplyTints();
                    //hidePresets();
                    break;
                case 'presetTab':
                    //loadPresets();
                    hideTags();
                    hideImages();
                    break;
            }
        });
    });

    // Initialize the first tab as active
    if (tabs.length > 0) {
        const firstTab = tabs[0];
        const defaultTabId = firstTab.getAttribute('data-tab');
        showTabContent(defaultTabId);
    }
});