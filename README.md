## Images Disclaimer:
All images in this project, are inside jokes and are not intended for an end result (There may be some goofy images).

## Code Notice
At this point in time code can only be found by searching the repo. Since this project is currently being worked on, that code is prime to change therefore I have not written a readme to showcase my solutions/functions.

---

# FullstackBG: Backend Overview

## Tech Stack

- **Node.js**: Backend runtime for building and running the application.
- **Express.js**: Web framework used for handling routing, middleware, and more.
- **Socket.io**: For real-time, bidirectional communication between the client and the server, essential for game interactions.
- **Passport.js**: For user authentication, supporting Google and Discord OAuth strategies.
- **Multer**: Middleware for handling file uploads, such as profile pictures.
- **Bcrypt**: For password hashing to securely store user credentials.
- **JWT (jsonwebtoken)**: For securely transmitting and verifying user authentication tokens.
- **Axios**: For making HTTP requests, primarily used for verifying Google reCAPTCHA responses.
- **Express-Validator**: For validating and sanitizing user input during sign-up and login processes.

## Environment Variables

This project uses a `.env` file for securely storing sensitive information. If you decide to clone this repo, ensure you set the required variables.

## API Endpoints

### Authentication and User Management

- **POST** `/signup`: Registers a new user. It validates the username, password, and Google reCAPTCHA response. Passwords are hashed before storage.
  
- **POST** `/login`: Logs in an existing user by comparing the provided password with the stored hashed password. On success, a JWT token is returned.

- **GET** `/auth/google`: Redirects to Google OAuth for authentication.

- **GET** `/auth/google/callback`: Callback URL for Google OAuth, which authenticates the user.

- **GET** `/auth/discord`: Redirects to Discord OAuth for authentication.

- **GET** `/auth/discord/callback`: Callback URL for Discord OAuth, which authenticates the user.

### Profile Management

- **POST** `/profile/upload`: Allows users to upload profile pictures. It uses Multer for handling the image upload, ensuring only valid image formats are accepted, with a file size limit of 3MB.

- **POST** `/profile/update`: Allows users to update their name and status in their profile.

- **GET** `/profile`: Fetches the user's profile, including their profile picture, name, status, level, and wins.

- **GET** `/friends`: Retrieves the authenticated user's friend list and their basic profile information.

### Game Management

- **POST** `/startGame`: Handles game start logic by randomly assigning roles (Spy or Location Holder) to connected players.

- **WebSockets**: Real-time communication for game events such as player connections, game start, location selection, and role assignment. The server uses JWT tokens to authenticate players in real-time via Socket.io.

### Middleware

- **authenticateToken**: Middleware that verifies the JWT token for protected routes. If the token is invalid or missing, the request is rejected with an appropriate error.

## Game Logic

The game logic is managed using WebSockets with the following features:

1. **Player Authentication**: Each player is authenticated via a JWT token before establishing a connection to the game.
2. **Location Selection**: Players can set available locations on the game board, which are then broadcast to all players.
3. **Role Assignment**: When the game starts, one player is randomly assigned the role of the "Spy," while the others are given a "Location" role.
4. **Real-Time Communication**: Players receive real-time updates about their assigned roles and game state via WebSocket events.

## Running the Backend Locally

To run the backend locally:

1. Clone the repository and install dependencies:
   ```bash
   npm install passport passport-google-oauth20 bcrypt jsonwebtoken express-validator axios dotenv passport-discord express-session mutler
   ```

2. Create a `.env` file with the appropriate environment variables (as listed above).

3. Start the server:
   ```bash
   npm start
   ```

4. The backend will run on the specified port (default is 3000). You can test the API and WebSocket functionality through the connected frontend or any API testing tool like Postman.

---

# FullstackBG Frontend Overview:

# `boardConfigGenerate.js`

This script provides functionality to manage tags, update item counts, and enforce item limits dynamically in a web-based environment. It allows users to interact with tags in a sidebar, add them to an active table, and adjust item counts, while respecting a predefined maximum limit.

## Features

### 1. **Dynamic Item Count Management**
   - A cap of 25 items is enforced (`MAX_ITEM_COUNT`).
   - Users can select the number of items associated with a tag via dropdowns in a table.
   - Once the total number of items reaches the cap, further additions are disabled.
   - Dropdown options are dynamically adjusted based on the remaining available items.

### 2. **Tag Visibility and Interaction**
   - Tags in the sidebar can be clicked to add them to the active table.
   - Tags are hidden from the sidebar when added to the table and reappear when removed.
   - A search feature allows users to filter tags by name.

### 3. **Dynamic Dropdowns**
   - Each tag added to the table has a dropdown for adjusting the number of items associated with it.
   - Dropdowns are disabled dynamically based on available capacity.
   
### 4. **Dropdown Menus**
   - Each row in the active table has a dropdown button with several actions:
     - Remove the tag from the table.
     - View or modify tag details.

### 5. **Random Location Generation**
   - Users can generate up to 25 random locations from selected tags.
   - Locations are selected based on weighted randomness, considering the quantity of each tag.
   
### 6. **Mutation Observer**
   - The script listens for changes in the sidebar and updates event listeners accordingly using a `MutationObserver`.

## Code Breakdown

### 1. **Main Initialization**
   - On DOM content load, the script initializes several functions:
     - **`toggleTagVisibility(tagId, isVisible)`**: Manages visibility of tags in the sidebar.
     - **`updateTotalItemCount()`**: Updates and validates the total item count in the table.
     - **`disableAdditions()`/`enableAdditions()`**: Disables or enables adding new tags based on item count limits.
     - **`adjustSelectOptions(selectElement, remainingItems)`**: Dynamically adjusts dropdown options.

### 2. **Tag Table Management**
   - **`addTagToTable(tagElement)`**: Adds a tag to the active table.
   - **Tag Removal**: Tags can be removed via a remove button or the dropdown menu.
   - **Dropdown Handling**: Custom dropdowns for each row are handled, including "Remove from table" actions.

### 3. **Random Location Generation**
   - **`generateRandomLocations(selectedTags)`**: Generates random locations based on selected tags, ensuring a unique selection and maximum of 25 items.
   
### 4. **Event Listeners**
   - Sidebar tags are clickable to add them to the table.
   - Dropdown menus respond to user interactions.
   - A mutation observer watches for dynamic updates in the sidebar and adjusts event listeners accordingly.

### 5. **Search Functionality**
   - **`tagSearch`** input enables dynamic searching of tags in the sidebar, filtering visible tags based on the search query.

---

# `boardConfigCustomize.js`

This script manages the customization of location selection for the Spyfall board game. Players can search and toggle between different locations to create a customized game setup.

## Features

### 1. **Location Data**
A list of predefined locations is stored in the `window.images` array. Each location object includes:
- `location`: The name of the location.
- `id`: A unique identifier for the location.
- `tags`: An array of tags associated with the location for categorization.

### 2. **Search Functionality**
The script listens for user input in a search field (`#customSearch`). As the player types, it dynamically filters the displayed locations based on the following:
- Matches the location's `id`.
- Matches any location aliases (from the `data-alias` attribute of each location element).

Matching locations are shown, while non-matching ones are hidden.

### 3. **Toggling Locations**
- Players can toggle the selection of a location by clicking on the corresponding button.
- When a location is toggled, its visual overlay is removed to indicate selection.
- A maximum of 25 locations can be selected. Once the limit is reached, remaining buttons become unclickable.
- The script dynamically updates a displayed count of selected locations (`#toggledCountDisplay`).

### 4. **Submit Button**
The submit button (`#customSubmitButton`) becomes active only when exactly 25 locations are selected. Otherwise, it alerts the player to adjust their selection.

### 5. **Generate Selected Locations**
Once the player selects 25 locations and clicks the submit button, the script:
- Gathers the selected locations.
- Sends the selected data to the server for further game setup.

## Key Methods

- **toggleOpacity(id)**: Manages the selection/deselection of a location and updates the visual state.
- **updateToggledCountDisplay()**: Displays the number of selected locations.
- **generateSelectedLocations()**: Gathers the selected locations and triggers further processing.
- **reapplyTints()**: Ensures the visual tint is reapplied to already selected locations.

## Event Listeners

- **Search Input**: The search functionality is triggered by the `input` event on the search field.
- **Location Buttons**: Each location button can be toggled by clicking it.
- **Submit Button**: Triggers validation and final selection submission when clicked.

---

# `configWindowHandler.js`

The `configWindowHandler` script powers the interactive tag and image management system on my website. This script dynamically generates and manages tags and image displays based on user interactions, and provides a customizable interface for users to explore different locations and categories.

## Features

- **Tag Management**: Dynamically loads and displays tags associated with various categories like Restaurants, Video Games, Historical locations, and more. Each tag shows the number of associated images.
- **Image Display**: Populates a grid with location-based images, which can be interacted with and customized. Each image corresponds to a location and has an alias to ensure proper tagging.
- **Interactive Tabs**: Users can switch between tabs to show different content:
  - **Generate Tab**: Displays the available tags, hiding the images.
  - **Custom Tab**: Shows images and allows customization, hiding the tags.
  - **Preset Tab**: Currently reserved for future use, but will hide both tags and images.
- **Popup Window**: A customizable pop-up for selecting tags, allowing users to filter the image content based on tag categories.
- **Smooth Transition Effects**: Hover effects and transitions are applied to images for better user experience.

## Script Breakdown

### Data Structures
1. **Tags**:
   - Contains predefined tags with `id`, `name`, and `count` representing the number of related images.
   
2. **Images**:
   - Each image is associated with a `location`, `id`, and `alias` for matching search terms, and is tagged for filtering purposes.

---

## Temporary Development Pictures
![Screenshot 2024-09-05 103402](https://github.com/user-attachments/assets/9cb2212b-f360-4784-968f-d2d6b0afa264)
![Screenshot 2024-09-05 103442](https://github.com/user-attachments/assets/8239287e-7082-478b-8584-b444544b3371)
![Screenshot 2024-09-05 103608](https://github.com/user-attachments/assets/dc7b3c8a-9e80-4563-88fb-662ae08895ef)
![Screenshot 2024-09-05 103725](https://github.com/user-attachments/assets/5c166bc9-fc11-4eac-a208-f313808bee9b)
