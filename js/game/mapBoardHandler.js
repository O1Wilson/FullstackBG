// Function to toggle icon visibility and button
function toggleIcon(element, color) {
    const parent = element.closest('.relative');
    const overlay = parent.querySelector('.inset-0');
    const button = parent.querySelector('button');
    const icons = parent.querySelectorAll('i');

    // Toggle visibility of the clicked icon
    if (element.classList.contains('opacity-0')) {
        element.classList.remove('opacity-0');
    } else {
        element.classList.add('opacity-0');
    }

    // If the red icon is clicked, keep the overlay visible
    if (color === 'red') {
        overlay.classList.toggle('opacity-50', element.classList.contains('opacity-100'));
    }

    // Show the button if any icon is visible
    const anyVisible = Array.from(icons).some(icon => icon.classList.contains('opacity-100'));
    button.classList.toggle('opacity-100', anyVisible);
}

// Function to open a popup with the image
function openPopup(button) {
    const parent = button.closest('.relative');
    const imgSrc = parent.querySelector('img').src;

    // Create a popup container
    const popupOverlay = document.createElement('div');
    popupOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50';
    popupOverlay.onclick = function(event) {
        if (event.target === popupOverlay) {
            document.body.removeChild(popupOverlay);
        }
    };

    // Create the popup content
    const popupContent = document.createElement('div');
    popupContent.className = 'bg-white p-5 rounded-lg shadow-lg relative max-w-full max-h-full';
    popupContent.onclick = function(event) {
        event.stopPropagation();
    };

    // Add the image to the popup
    const img = document.createElement('img');
    img.src = imgSrc;
    img.className = 'rounded-md max-w-full max-h-full';
    popupContent.appendChild(img);

    // Add a close button to the popup
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.className = 'absolute top-2 right-2 bg-gray-200 text-gray-800 px-3 py-1 rounded';
    closeButton.onclick = function() {
        document.body.removeChild(popupOverlay);
    };
    popupContent.appendChild(closeButton);

    // Append the content to the overlay and the overlay to the body
    popupOverlay.appendChild(popupContent);
    document.body.appendChild(popupOverlay);
}