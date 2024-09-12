const express = require('express'); // npm install passport passport-google-oauth20 bcrypt jsonwebtoken express-validator axios dotenv passport-discord express-session mutler
const http = require('http');
const socketIo = require('socket.io');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const axios = require('axios');
const bcrypt = require('bcrypt');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const DiscordStrategy = require('passport-discord').Strategy;
const session = require('express-session');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    try {
        done(null, user.id);
    } catch (error) {
        console.error('Error during serialization:', error);
        done(error, null);
    }
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await getUserById(id); // Fetch the user from DB
        done(null, user);
    } catch (error) {
        console.error('Error during deserialization:', error);
        done(error, null);
    }
});

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'boardgame.html'));
});

const users = {}; // This should be replaced by a database in production.

async function getUserById(id) {
    return users[id] || null;
}

// Signup route
app.post('/signup', [
    body('username').isLength({ min: 3 }),
    body('password').isLength({ min: 5 }),
    body('recaptchaToken').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, recaptchaToken } = req.body;
    
    if (users[username]) {
        return res.status(400).json({ message: 'Username already exists' });
    }
    
    // Verify reCAPTCHA
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
        params: {
            secret: secretKey,
            response: recaptchaToken
        }
    });

    if (!response.data.success) {
        return res.status(400).json({ message: 'Captcha verification failed' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users[username] = { password: hashedPassword };

    res.status(201).json({ message: 'User created successfully' });
});

// Login route
app.post('/login', [
    body('username').isLength({ min: 3 }),
    body('password').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    
    if (!users[username]) {
        return res.status(400).json({ message: 'User does not exist' });
    }

    const match = await bcrypt.compare(password, users[username].password);
    if (!match) {
        return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    // Here, you can find or create a user in your database based on the Google profile
    return done(null, profile);
}));

// Initialize passport
app.use(passport.initialize());

// Routes
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/');
    }
);

passport.use(new DiscordStrategy({
    clientID: DISCORD_CLIENT_ID,
    clientSecret: DISCORD_CLIENT_SECRET,
    callbackURL: "/auth/discord/callback",
    scope: ['identify', 'email']
}, (accessToken, refreshToken, profile, done) => {
    // Find or create a user in your database based on the Discord profile
    return done(null, profile);
}));

// Routes
app.get('/auth/discord',
    passport.authenticate('discord')
);

app.get('/auth/discord/callback',
    passport.authenticate('discord', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication
        res.redirect('/');
    }
);

// Function for in-game auth
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Profile Settings

// Set storage for profile pictures
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, req.user.username + path.extname(file.originalname));
    }
});

// Init multer upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 3000000 }, // Limit size to 1MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
}).single('profilePic');

// Route to upload profile picture
app.post('/profile/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err });
        }
        // Save the uploaded file's path to the user's profile
        users[req.user.username].profilePic = `/uploads/${req.file.filename}`;
        res.json({ message: 'Profile picture updated successfully' });
    });
});

app.post('/profile/update', (req, res) => {
    const { name, status } = req.body;

    if (!name || !status) {
        return res.status(400).json({ message: 'Name and status are required' });
    }

    // Update user's profile data
    users[req.user.username].name = name;
    users[req.user.username].status = status;

    res.json({ message: 'Profile updated successfully' });
});

// Fetch user profile data
app.get('/profile', (req, res) => {
    const user = users[req.user.username];
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json({
        profilePic: user.profilePic || '/default-avatar.png',
        name: user.name || req.user.username,
        status: user.status || 'offline',
        level: user.level || 1,
        wins: user.wins || 0
    });
});

// Fetch friends list
app.get('/friends', (req, res) => {
    const friends = req.user.friends || [];

    const friendProfiles = friends.map(friendUsername => {
        const friend = users[friendUsername];
        return {
            name: friend.name,
            profilePic: friend.profilePic || '/default-avatar.png',
            status: friend.status || 'offline',
            level: friend.level || 1,
            wins: friend.wins || 0
        };
    });

    res.json(friendProfiles);
});


// Game Logic Starts Here
let availableLocations = [];

io.use((socket, next) => {
    const token = socket.handshake.query.token;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return next(new Error('Authentication error'));
            socket.user = user;
            next();
        });
    } else {
        next(new Error('Authentication error'));
    }
}).on('connection', (socket) => {
    console.log('A player connected:', socket.user.username);

    socket.on('setLocations', (locations) => {
        if (locations.length > 0) {
            availableLocations = locations;
            console.log('Available locations updated:', availableLocations);
        } else {
            socket.emit('errorMessage', 'Please choose locations from the map-board.');
        }
    });

    socket.on('startGame', () => {
        const players = getPlayers();
        if (availableLocations.length === 0) {
            socket.emit('errorMessage', 'Please choose locations from the map-board.');
            return;
        }

        const location = chooseRandomLocation(availableLocations);
        const roles = assignRoles(players, location);

        players.forEach(player => {
            io.to(player.id).emit('assignedRole', {
                role: player.role,
                location: player.location
            });
        });
    });

    socket.on('disconnect', () => {
        console.log('A player disconnected');
    });
});

function chooseRandomLocation(locations) {
    const randomIndex = Math.floor(Math.random() * locations.length);
    return locations[randomIndex].location;
}

function getPlayers() {
    return Array.from(io.sockets.sockets.values()).map(socket => ({
        id: socket.id,
        username: socket.user.username,
        socket: socket,
    }));
}

function assignRoles(players, location) {
    let spyIndex = Math.floor(Math.random() * players.length);

    players.forEach((player, index) => {
        if (index === spyIndex) {
            player.role = 'spy';
            player.location = null;
        } else {
            player.role = 'location';
            player.location = location;
        }
    });

    return players;
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));