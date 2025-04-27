// Game constants
const GAME_WIDTH = 1000;
const GAME_HEIGHT = 700;
const PLAYER_SPEED_RED = 0.15;    // Red agent is standard speed
const PLAYER_SPEED_BLUE = 0.15;   // Blue agent is slightly slower
const PLAYER_SPEED_GOLD = 0.15;   // Gold agent is faster
const GAME_TIME = 30; // seconds
const AGENT_SIZE = 0.5;
const LETTER_SIZE = 0.4;
const WORLD_SIZE = 20; // Size of the 3D space
const FLOOR_SIZE = 30;
const TOTAL_LEVELS = 5; // Total number of themed levels

// Word banks for different space-themed levels
const SUN_WORDS = [
    { word: "SUPERNOVA", hint: "A powerful explosion of a star, creating a brilliant burst of light" },
    { word: "SOLAR", hint: "Relating to the Sun" },
    { word: "CORONA", hint: "The outermost layer of the Sun's atmosphere, visible during a total solar eclipse" },
    { word: "SUNSPOT", hint: "A dark spot on the Sun's surface, caused by magnetic activity" },
    { word: "RADIATION", hint: "Energy emitted by the Sun in the form of electromagnetic waves" },
    { word: "ULTRAVIOLET", hint: "The part of the electromagnetic spectrum that is invisible to the human eye" },
    { word: "SOLARFLARE", hint: "A sudden flash of increased brightness on the Sun's surface" },
    { word: "STELLAR", hint: "Relating to stars" },
    { word: "ECLIPSE", hint: "When one celestial body passes in front of another, blocking its light" },
    { word: "FUSION", hint: "The process of combining two atoms to form a single atom, how the Sun creates energy" }
];

const EARTH_WORDS = [
    { word: "ATMOSPHERE", hint: "The envelope of gases surrounding Earth, made up of mostly nitrogen and oxygen" },
    { word: "OCEAN", hint: "A vast body of saltwater that covers most of Earth's surface, there are 5 of them" },
    { word: "CONTINENT", hint: "One of Earth's main landmasses, there are 7 of them" },
    { word: "EQUATOR", hint: "An imaginary line dividing Earth into northern and southern hemispheres" },
    { word: "MOUNTAIN", hint: "A large natural elevation of Earth's surface, Mount Everest is the highest" },
    { word: "RAINFOREST", hint: "A dense forest with high annual rainfall, Amazon ______" },
    { word: "VOLCANO", hint: "An opening in Earth's crust from which lava erupts" },
    { word: "GLACIER", hint: "A slowly moving mass of ice, mostly found in the North and South Poles" },
    { word: "CLIMATE", hint: "The weather conditions of an area over a long period" },
    { word: "MOON", hint: "A natural satellite that orbits Earth" }
];

const MARS_WORDS = [
    { word: "OLYMPUS", hint: "The largest volcano in the solar system, located on Mars" },
    { word: "PHOBOS", hint: "The larger and innermost of Mars's two moons" },
    { word: "DEIMOS", hint: "The smaller and outermost of Mars's two moons" },
    { word: "VALLES", hint: "Part of a giant canyon system on Mars" },
    { word: "ROVER", hint: "A vehicle sent to explore the Martian surface" },
    { word: "DUST", hint: "Fine particles that create storms on the red planet" },
    { word: "POLAR", hint: "Mars has these icy caps at its north and south ends" },
    { word: "CRATER", hint: "A bowl-shaped depression formed by impact on Mars's surface" },
    { word: "CURIOSITY", hint: "Famous Mars rover that landed in 2012" },
    { word: "RED", hint: "A word used to describe the color of Mars, Mars is the ___ planet" }
];

const JUPITER_WORDS = [
    { word: "STORM", hint: "Jupiter's Great Red Spot is a massive one of these" },
    { word: "GANYMEDE", hint: "Jupiter's largest moon and the largest in our solar system" },
    { word: "EUROPA", hint: "Icy moon of Jupiter that might have an ocean under its surface" },
    { word: "CALLISTO", hint: "One of Jupiter's four Galilean moons" },
    { word: "BANDS", hint: "The colorful horizontal strips across Jupiter" },
    { word: "GAS", hint: "Jupiter is primarily made of this type of substance" },
    { word: "MAGNETOSPHERE", hint: "Jupiter has the strongest one of these in the solar system" },
    { word: "GALILEAN", hint: "The four largest moons of Jupiter are called this" },
    { word: "JUNO", hint: "NASA spacecraft currently orbiting Jupiter" },
    { word: "LIGHTNING", hint: "Jupiter has powerful bolts of this electrical phenomenon" }
];

const PLUTO_WORDS = [
    { word: "DWARF", hint: "Type of planet that Pluto is classified as" },
    { word: "CHARON", hint: "Pluto's largest moon" },
    { word: "HEART", hint: "Nickname for Pluto's distinctive light-colored region" },
    { word: "NITROGEN", hint: "Main component of Pluto's thin atmosphere" },
    { word: "KUIPER", hint: "Belt beyond Neptune where Pluto is located" },
    { word: "ICE", hint: "Pluto's surface is mostly made of this material" },
    { word: "HORIZONS", hint: "NASA's New ___ mission explored Pluto in 2015" },
    { word: "TOMBAUGH", hint: "Astronomer who discovered Pluto" },
    { word: "MOUNTAINS", hint: "Pluto has ranges of these made of water ice" },
    { word: "ORBIT", hint: "Pluto's path around the sun is highly eccentric" }
];

// All level word banks
const LEVEL_WORD_BANKS = [
    SUN_WORDS,    // Level 1: Sun
    EARTH_WORDS,    // Level 2: Earth
    MARS_WORDS,     // Level 3: Mars
    JUPITER_WORDS,  // Level 4: Jupiter
    PLUTO_WORDS     // Level 5: Pluto
];

// Level names for UI
const LEVEL_NAMES = [
    "Sun",
    "Earth",
    "Mars",
    "Jupiter",
    "Pluto"
];

// Game state
let gameRunning = false;
let currentLevel = 1;
let completedLevels = []; // Array to track which levels have been completed
let timeLeft = GAME_TIME;
let timer;
let wordList = []; // Will be populated with selected words for the current level
let currentWord = "";
let currentHint = "";
let foundLetters = [];
let letterObjects = [];
let playerScores = {
    red: 0,
    blue: 0,
    gold: 0
};
let gameEnding = false; // Flag to prevent multiple end states
let levelSelectionActive = false; // Flag to indicate if we're in level selection mode
let playerTrails = {
    red: [],
    blue: [],
    gold: []
};
let lastTrailTime = {
    red: 0,
    blue: 0,
    gold: 0
};

// Three.js variables
let scene, camera, renderer;
let playerMeshes = {};
let letterMeshes = [];
let floor;

// Player characters
const players = {
    red: {
        x: -5,
        z: 0,
        color: 0xFF3232,
        keys: {up: "w", left: "a", down: "s", right: "d"},
        input: {up: false, left: false, down: false, right: false}
    },
    blue: {
        x: 0,
        z: 0,
        color: 0x3232FF,
        keys: {up: "ArrowUp", left: "ArrowLeft", down: "ArrowDown", right: "ArrowRight"},
        input: {up: false, left: false, down: false, right: false}
    },
    gold: {
        x: 5,
        z: 0,
        color: 0xFFD700,
        keys: {up: "i", left: "j", down: "k", right: "l"},
        input: {up: false, left: false, down: false, right: false}
    }
};

// Speed constants
const BASE_SPEED = 0.15;
const SPEED_UPGRADE_COSTS = [100, 200, 300];
const SPEED_UPGRADE_VALUES = [0.18, 0.21, 0.24];

// Trail upgrade constants
const TRAIL_UPGRADE_COSTS = [100, 200, 300];
const TRAIL_UPGRADE_VALUES = [
    { size: 0.4, opacity: 0.8, duration: 1200, count: 12 },
    { size: 0.5, opacity: 0.9, duration: 1500, count: 15 },
    { size: 0.6, opacity: 1.0, duration: 1800, count: 18 }
];

// Add these objects to store player speeds and upgrades
const playerSpeeds = {
    red: BASE_SPEED,
    blue: BASE_SPEED,
    gold: BASE_SPEED
};

const speedUpgrades = {
    red: 0,
    blue: 0,
    gold: 0
};

const trailUpgrades = {
    red: 0,
    blue: 0,
    gold: 0
};

// Add this function to save upgrades
function saveUpgrades() {
    localStorage.setItem('playerSpeeds', JSON.stringify(playerSpeeds));
    localStorage.setItem('speedUpgrades', JSON.stringify(speedUpgrades));
    localStorage.setItem('trailUpgrades', JSON.stringify(trailUpgrades));
}

// Add this function to load upgrades
function loadUpgrades() {
    const savedSpeeds = localStorage.getItem('playerSpeeds');
    const savedSpeedUpgrades = localStorage.getItem('speedUpgrades');
    const savedTrailUpgrades = localStorage.getItem('trailUpgrades');
    
    if (savedSpeeds) {
        Object.assign(playerSpeeds, JSON.parse(savedSpeeds));
    }
    if (savedSpeedUpgrades) {
        Object.assign(speedUpgrades, JSON.parse(savedSpeedUpgrades));
    }
    if (savedTrailUpgrades) {
        Object.assign(trailUpgrades, JSON.parse(savedTrailUpgrades));
    }
}

// Add this function to handle trail upgrades
function upgradeTrail(color) {
    console.log(`Attempting to upgrade trail for ${color} agent`);
    
    const currentUpgrades = trailUpgrades[color];
    if (currentUpgrades >= 3) {
        console.log(`${color} agent has reached maximum trail upgrades`);
        return;
    }
    
    const upgradeCost = TRAIL_UPGRADE_COSTS[currentUpgrades];
    if (playerScores[color] < upgradeCost) {
        console.log(`${color} agent doesn't have enough points for trail upgrade`);
        return;
    }
    
    // Deduct points and apply upgrade
    playerScores[color] -= upgradeCost;
    trailUpgrades[color]++;
    saveUpgrades();
    savePlayerScores();
    
    console.log(`${color} agent trail upgraded to level ${trailUpgrades[color]}`);
    
    // Update displays
    updateScoreDisplay();
    updateTrailDisplay();
    document.getElementById(`store-${color}`).textContent = playerScores[color];
    
    // Play success sound
    playSound('success', 0.3);
}

// Add this function to handle speed upgrades
function upgradeSpeed(color) {
    console.log(`Attempting to upgrade speed for ${color} agent`);
    
    const currentUpgrades = speedUpgrades[color];
    if (currentUpgrades >= 3) {
        console.log(`${color} agent has reached maximum upgrades`);
        return;
    }
    
    const cost = SPEED_UPGRADE_COSTS[currentUpgrades];
    if (playerScores[color] < cost) {
        console.log(`${color} agent doesn't have enough points for upgrade`);
        return;
    }
    
    // Deduct points
    playerScores[color] -= cost;
    console.log(`Deducted ${cost} points from ${color} agent`);
    
    // Apply upgrade
    playerSpeeds[color] = SPEED_UPGRADE_VALUES[currentUpgrades];
    speedUpgrades[color]++;
    console.log(`Upgraded ${color} agent speed to ${playerSpeeds[color]}`);
    
    // Save changes
    savePlayerScores();
    saveUpgrades();
    
    // Update displays
    updateScoreDisplay();
    updateSpeedDisplay();
    updateTrailDisplay(); // Add this line to update trail buttons
    document.getElementById(`store-${color}`).textContent = playerScores[color];
    
    // Play success sound
    playSound('success', 0.3);
}

// Function to select random words for a specific level
function selectRandomWordsForLevel(levelIndex, count = 5) {
    // Get the appropriate word bank for this level
    const wordBank = LEVEL_WORD_BANKS[levelIndex];
    if (!wordBank) {
        console.error(`No word bank found for level ${levelIndex + 1}`);
        return [];
    }
    
    // Create a copy of the word bank to avoid modifying the original
    const availableWords = [...wordBank];
    const selectedWords = [];
    
    // Select random words
    for (let i = 0; i < count; i++) {
        // If we've used all words in the bank, break
        if (availableWords.length === 0) break;
        
        // Select a random word
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        selectedWords.push(availableWords[randomIndex]);
        
        // Remove the selected word from available words
        availableWords.splice(randomIndex, 1);
    }
    
    console.log(`Selected ${selectedWords.length} random words for level ${levelIndex + 1}`);
    return selectedWords;
}

// Get DOM elements
const startScreen = document.getElementById("start-screen");
const briefingScreen = document.getElementById("briefing-screen");
const gameScreen = document.getElementById("game-screen");
const gameOverScreen = document.getElementById("game-over-screen");
const levelCompleteScreen = document.getElementById("level-complete-screen");
const gameCompleteScreen = document.getElementById("game-complete-screen");
const wordContainer = document.getElementById("word-container");
const timeLeftDisplay = document.getElementById("time-left");
const currentLevelDisplay = document.getElementById("current-level");
const canvasContainer = document.getElementById("game-canvas-container");
const hintText = document.getElementById("hint-text");

// Sound effects
const soundEffects = {
    intro: 'https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3',      // Sci-fi intro sound
    success: 'https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3',    // Letter collection success
    error: 'https://assets.mixkit.co/active_storage/sfx/885/885-preview.mp3',      // Wrong letter - quick negative beep
    levelComplete: 'https://assets.mixkit.co/active_storage/sfx/647/647-preview.mp3', // Level complete - achievement sound
    gameComplete: 'https://assets.mixkit.co/active_storage/sfx/220/220-preview.mp3',  // Game complete - victory tune
    collect: 'https://assets.mixkit.co/active_storage/sfx/240/240-preview.mp3',     // Generic collection sound
    click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'      // Short button click sound
};

// Audio context for sound effects
let audioContext;
const audioBuffers = {};

// Initialize the game
function init() {
    console.log("Initializing game...");
    
    // Check if this is the first load or if a reset is requested
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('reset')) {
        resetAllProgress();
    }
    
    // Load game progress
    loadGameProgress();
    
    // Load player scores
    loadPlayerScores();
    
    // Add event listeners for menu buttons
    document.getElementById("start-btn").addEventListener("click", showLevelSelect);
    document.getElementById("briefing-btn").addEventListener("click", showBriefing);
    document.getElementById("back-to-menu-btn").addEventListener("click", showStartScreen);
    document.getElementById("try-again-btn").addEventListener("click", restartCurrentLevel);
    document.getElementById("next-level-btn").addEventListener("click", showLevelSelect);
    document.getElementById("play-again-btn").addEventListener("click", showResetConfirmationModal);
    document.getElementById("game-over-back-btn").addEventListener("click", showStartScreen);
    document.getElementById("game-complete-back-btn").addEventListener("click", showStartScreen);
    document.getElementById("level-complete-back-btn").addEventListener("click", showStartScreen);
    
    // Add event listener for reset progress button
    document.getElementById("reset-progress-btn").addEventListener("click", showResetConfirmationModal);
    
    // Add event listeners for confirmation modal buttons
    document.getElementById("confirm-reset-btn").addEventListener("click", performResetProgress);
    document.getElementById("cancel-reset-btn").addEventListener("click", hideResetConfirmationModal);
    
    // Add keyboard event listeners
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    
    // Initialize sound system
    initSoundSystem();
    
    // Add button click sounds
    addButtonClickSounds();
    
    // Show start screen
    showStartScreen();
    
    // Create start screen particles
    createStartScreenParticles();
    
    // Add this with your other event listeners in the init function
    document.getElementById("store-btn").addEventListener("click", showStore);
    document.getElementById("store-back-btn").addEventListener("click", showStartScreen);
    
    // Load speed upgrades
    loadUpgrades();
    
    // Add event listeners for speed upgrade buttons
    ['red', 'blue', 'gold'].forEach(color => {
        const upgradeButton = document.getElementById(`${color}-speed-upgrade`);
        if (upgradeButton) {
            upgradeButton.addEventListener('click', () => upgradeSpeed(color));
        }
    });
    
    // Add event listeners for trail upgrade buttons
    ['red', 'blue', 'gold'].forEach(color => {
        const upgradeButton = document.getElementById(`${color}-trail-upgrade`);
        if (upgradeButton) {
            upgradeButton.addEventListener('click', () => upgradeTrail(color));
        }
    });
    
    console.log("Game initialized successfully");
}

// Add click sounds to all menu buttons except planet selection buttons
function addButtonClickSounds() {
    // Get all menu buttons
    const menuButtons = document.querySelectorAll('.menu-button');
    
    // Add click sound to each button
    menuButtons.forEach(button => {
        // Skip planet selection buttons
        const buttonText = button.textContent.trim();
        if (["Sun", "Earth", "Mars", "Jupiter", "Pluto"].includes(buttonText)) {
            return;
        }
        
        // Add click sound
        button.addEventListener('click', () => {
            playSound('click', 0.3);
        });
    });
    
    // Also handle dynamically created buttons later
    // Create a mutation observer to watch for new buttons
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach(node => {
                    // Check if the added node is a button or contains buttons
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // If the node itself is a button
                        if (node.classList && node.classList.contains('menu-button')) {
                            const buttonText = node.textContent.trim();
                            if (!["Sun", "Earth", "Mars", "Jupiter", "Pluto"].includes(buttonText)) {
                                node.addEventListener('click', () => {
                                    playSound('click', 0.3);
                                });
                            }
                        }
                        
                        // If the node contains buttons
                        const buttons = node.querySelectorAll('.menu-button');
                        buttons.forEach(button => {
                            const buttonText = button.textContent.trim();
                            if (!["Sun", "Earth", "Mars", "Jupiter", "Pluto"].includes(buttonText)) {
                                button.addEventListener('click', () => {
                                    playSound('click', 0.3);
                                });
                            }
                        });
                    }
                });
            }
        });
    });
    
    // Start observing the document body for added nodes
    observer.observe(document.body, { childList: true, subtree: true });
    
    console.log("Added click sounds to all menu buttons except planet selection buttons");
}

// Show the reset confirmation modal
function showResetConfirmationModal() {
    const modal = document.getElementById("reset-confirmation-modal");
    modal.classList.remove("hidden");
}

// Hide the reset confirmation modal
function hideResetConfirmationModal() {
    const modal = document.getElementById("reset-confirmation-modal");
    modal.classList.add("hidden");
}

// Perform the reset progress action
function performResetProgress() {
    resetAllProgress();
    hideResetConfirmationModal();
    
    // Show feedback with a small delay to allow the modal to close
    setTimeout(() => {
        // Create a notification element
        const notification = document.createElement("div");
        notification.className = "reset-notification";
        notification.textContent = "Progress has been reset. Only Sun level is now available.";
        document.body.appendChild(notification);
        
        // Remove the notification after a few seconds
        setTimeout(() => {
            notification.classList.add("notification-hidden");
            setTimeout(() => notification.remove(), 500);
        }, 3000);
        
        // Check if we're on the game complete screen
        const gameCompleteScreen = document.getElementById("game-complete-screen");
        if (!gameCompleteScreen.classList.contains("hidden")) {
            // If on game complete screen, go to level select
            showLevelSelect();
        } else {
            // Otherwise, go to start screen
            showStartScreen();
        }
    }, 300);
}

// Reset all game progress
function resetAllProgress() {
    console.log("Resetting all game progress");
    localStorage.removeItem('completedLevels');
    localStorage.removeItem('playerScores');
    localStorage.removeItem('playerSpeeds');
    localStorage.removeItem('speedUpgrades');
    localStorage.removeItem('trailUpgrades');
    completedLevels = [];
    playerScores = {
        red: 0,
        blue: 0,
        gold: 0
    };
    // Reset speeds to base values
    Object.keys(playerSpeeds).forEach(color => {
        playerSpeeds[color] = BASE_SPEED;
        speedUpgrades[color] = 0;
        trailUpgrades[color] = 0;
    });
    updateScoreDisplay();
}

// Show level selection screen
function showLevelSelect() {
    console.log("Showing level select screen");
    
    // First hide all screens
    hideAllScreens();
    
    // If level select screen doesn't exist, create it
    let levelSelectScreen = document.getElementById("level-select-screen");
    if (!levelSelectScreen) {
        console.log("Creating level select screen");
        
        // Create the level select screen
        levelSelectScreen = document.createElement("div");
        levelSelectScreen.id = "level-select-screen";
        levelSelectScreen.className = "screen";
        
        // Add title
        const title = document.createElement("h2");
        title.textContent = "Select Expedition";
        levelSelectScreen.appendChild(title);
        
        // Create container for level buttons
        const levelContainer = document.createElement("div");
        levelContainer.className = "level-container";
        
        // Create level buttons
        for (let i = 0; i < TOTAL_LEVELS; i++) {
            const levelNumber = i + 1;
            const levelButton = document.createElement("button");
            levelButton.className = "level-button menu-button";
            levelButton.id = `level-${levelNumber}-btn`;
            levelButton.dataset.level = levelNumber;
            
            // Update button text with level name
            levelButton.textContent = `${LEVEL_NAMES[i]}`;
            
            // Add locked class if level is not unlocked
            if (!isLevelUnlocked(levelNumber)) {
                levelButton.classList.add("locked");
            } else {
                // Add click event listener for unlocked levels
                levelButton.addEventListener("click", () => {
                    startLevel(levelNumber);
                });
            }
            
            levelContainer.appendChild(levelButton);
        }
        
        levelSelectScreen.appendChild(levelContainer);
        
        // Back button
        const backButton = document.createElement("button");
        backButton.className = "menu-button";
        backButton.id = "level-select-back-btn";
        backButton.textContent = "Back to Menu";
        backButton.addEventListener("click", showStartScreen);
        levelSelectScreen.appendChild(backButton);
        
        // Add the level select screen to the game container
        document.getElementById("game-container").appendChild(levelSelectScreen);
    } else {
        // Update level button states
        for (let i = 0; i < TOTAL_LEVELS; i++) {
            const levelNumber = i + 1;
            const levelButton = document.getElementById(`level-${levelNumber}-btn`);
            
            // Reset button state
            levelButton.className = "level-button menu-button";
            levelButton.id = `level-${levelNumber}-btn`;
            levelButton.dataset.level = levelNumber;
            levelButton.textContent = `${LEVEL_NAMES[i]}`;
            
            // Remove any existing event listeners
            const newButton = levelButton.cloneNode(true);
            levelButton.parentNode.replaceChild(newButton, levelButton);
            
            // Add locked class if level is not unlocked
            if (!isLevelUnlocked(levelNumber)) {
                newButton.classList.add("locked");
            } else {
                // Add click event listener for unlocked levels
                newButton.addEventListener("click", () => {
                    startLevel(levelNumber);
                });
            }
        }
    }
    
    // Show the level select screen
    levelSelectScreen.classList.remove("hidden");
    levelSelectionActive = true;
}

// Start a specific level
function startLevel(levelNumber) {
    console.log(`Starting level ${levelNumber}`);
    
    // Set the current level
    currentLevel = levelNumber;
    
    // Hide all screens and show game screen
    hideAllScreens();
    gameScreen.classList.remove("hidden");
    
    // Initialize 3D scene if it doesn't exist
    if (!scene) {
        console.log("Initializing ThreeJS scene");
        initThreeJS();
        
        // Add window resize handler
        window.addEventListener('resize', onWindowResize);
    }
    
    // Update background for this level
    updateLevelBackground(levelNumber);
    
    // Load saved scores before resetting game state
    loadPlayerScores();
    
    // Reset game state
    resetGameState();
    
    // Setup the level with the first word (1/5)
    setupLevel(1); // This is the word number within the level, not the game level
    
    // Start game loop
    gameRunning = true;
    requestAnimationFrame(gameLoop);
    
    // Start timer
    timeLeft = GAME_TIME;
    timeLeftDisplay.textContent = timeLeft;
    startTimer();
    
    // Play intro sound
    playSound('intro', 0.7);
    
    levelSelectionActive = false;
    console.log(`Level ${levelNumber} started with first word (1/${wordList.length})`);
}

// Restart current level
function restartCurrentLevel() {
    console.log("Restarting current level:", currentLevel);
    
    // Ensure we're restarting from the correct word bank
    wordList = selectRandomWordsForLevel(currentLevel - 1, 5);
    
    // Reset the game state
    timeLeft = GAME_TIME;
    gameEnding = false;
    
    // Load saved scores
    loadPlayerScores();
    
    // Reset player positions
    players.red.x = -5;
    players.red.z = 0;
    players.blue.x = 0;
    players.blue.z = 0;
    players.gold.x = 5;
    players.gold.z = 0;
    
    // Update player meshes if they exist
    if (playerMeshes.red) {
        playerMeshes.red.position.set(players.red.x, AGENT_SIZE, players.red.z);
        playerMeshes.blue.position.set(players.blue.x, AGENT_SIZE, players.blue.z);
        playerMeshes.gold.position.set(players.gold.x, AGENT_SIZE, players.gold.z);
    }
    
    // Hide all screens and show game screen
    hideAllScreens();
    gameScreen.classList.remove("hidden");
    
    // Make sure the correct level background is used
    updateLevelBackground(currentLevel);
    
    // Setup the level with the first word (1/5)
    setupLevel(1);
    
    // Update score display
    updateScoreDisplay();
    
    // Make sure game is running
    gameRunning = true;
    requestAnimationFrame(gameLoop);
    
    // Reset and start the timer
    timeLeft = GAME_TIME;
    timeLeftDisplay.textContent = timeLeft;
    startTimer();
    
    // Play intro sound
    playSound('intro', 0.7);
    
    console.log("Level restarted with fresh words from level", currentLevel);
}

// Show start screen
function showStartScreen() {
    console.log("Showing start screen");
    hideAllScreens();
    startScreen.classList.remove("hidden");
    
    // Check if all levels are completed
    const allLevelsCompleted = completedLevels.includes(TOTAL_LEVELS);
    
    // Hide reset progress button if all levels are completed
    const resetProgressBtn = document.getElementById("reset-progress-btn");
}

// Show briefing screen
function showBriefing() {
    hideAllScreens();
    briefingScreen.classList.remove("hidden");
}

// Hide all screens
function hideAllScreens() {
    const screens = document.querySelectorAll(".screen");
    screens.forEach(screen => screen.classList.add("hidden"));
}

// Initialize Three.js scene
function initThreeJS() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080816);
    
    // Get container dimensions for correct aspect ratio
    const containerWidth = canvasContainer.clientWidth;
    const containerHeight = canvasContainer.clientHeight;
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, containerWidth / containerHeight, 0.1, 1000);
    camera.position.set(0, 12, 15);
    camera.lookAt(0, 0, 0);
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerWidth, containerHeight);
    canvasContainer.appendChild(renderer.domElement);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    
    // Add directional light (sunlight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Create futuristic floor - match the grid size
    const floorSize = 20; // Match the grid size
    const floorGeometry = new THREE.PlaneGeometry(floorSize, floorSize);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x1a1a3a,
        metalness: 0.5,
        roughness: 0.2
    });
    floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.5;
    scene.add(floor);
    
    // Add grid lines to floor - use a size that matches the player boundary
    const gridSize = 20; // Size of the grid (10 units in each direction)
    const gridHelper = new THREE.GridHelper(gridSize, 20, 0x3333cc, 0x222266);
    gridHelper.position.y = -0.49;
    scene.add(gridHelper);
    
    // Create player meshes
    createPlayerMeshes();
    
    // Add fog for atmosphere
    scene.fog = new THREE.Fog(0x080816, 15, 40);
    
    // Add a skybox
    createSkybox();
    
    // Create a universe background with stars
    createStars();
}

// Create player meshes
function createPlayerMeshes() {
    Object.keys(players).forEach(playerId => {
        const player = players[playerId];
        
        // Create player mesh
        const geometry = new THREE.SphereGeometry(AGENT_SIZE, 32, 32);
        const material = new THREE.MeshStandardMaterial({ 
            color: player.color,
            metalness: 0.7,
            roughness: 0.2,
            emissive: player.color,
            emissiveIntensity: 0.2
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(player.x, AGENT_SIZE, player.z);
        scene.add(mesh);
        
        // Add player label
        const labelCanvas = document.createElement('canvas');
        const labelCtx = labelCanvas.getContext('2d');
        labelCanvas.width = 256;
        labelCanvas.height = 128;
        
        labelCtx.font = 'bold 48px Arial';
        labelCtx.textAlign = 'center';
        labelCtx.textBaseline = 'middle';
        
        // Draw text outline
        labelCtx.strokeStyle = 'black';
        labelCtx.lineWidth = 6;
        labelCtx.strokeText(`Agent ${playerId.charAt(0).toUpperCase() + playerId.slice(1)}`, labelCanvas.width / 2, labelCanvas.height / 2);
        
        // Draw text
        labelCtx.fillStyle = player.color === 0xFF3232 ? '#FF3232' : (player.color === 0x3232FF ? '#3232FF' : '#FFD700');
        labelCtx.fillText(`Agent ${playerId.charAt(0).toUpperCase() + playerId.slice(1)}`, labelCanvas.width / 2, labelCanvas.height / 2);
        
        const labelTexture = new THREE.CanvasTexture(labelCanvas);
        const labelMaterial = new THREE.SpriteMaterial({ map: labelTexture, transparent: true });
        const labelSprite = new THREE.Sprite(labelMaterial);
        labelSprite.scale.set(2, 1, 1);
        labelSprite.position.set(0, AGENT_SIZE * 2.5, 0);
        
        mesh.add(labelSprite);
        mesh.userData.labelSprite = labelSprite;
        
        playerMeshes[playerId] = mesh;
    });
}

// Create skybox
function createSkybox() {
    const skyboxGeometry = new THREE.BoxGeometry(100, 100, 100);
    const skyboxMaterials = [];
    
    for (let i = 0; i < 6; i++) {
        const color = new THREE.Color(0x000005);
        skyboxMaterials.push(new THREE.MeshBasicMaterial({
            color: color,
            side: THREE.BackSide
        }));
    }
    
    const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterials);
    skybox.name = "skybox"; // Add name for easy reference
    scene.add(skybox);
}

// Create stars for the background
function createStars() {
    // Remove any existing stars first
    const existingStars = scene.children.find(child => child.name === "stars");
    if (existingStars) {
        scene.remove(existingStars);
    }

    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true,
        opacity: 1.0
    });
    
    const starsVertices = [];
    for (let i = 0; i < 1000; i++) {
        const x = (Math.random() - 0.5) * 100;
        const y = (Math.random() - 0.5) * 100;
        const z = (Math.random() - 0.5) * 100;
        starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    stars.name = "stars"; // Add name for easy reference
    scene.add(stars);
}

// Show a screen transition effect
function transitionToScreen(fromScreen, toScreen) {
    console.log(`Transitioning from ${fromScreen.id} to ${toScreen.id}`);
    
    // Create a transition overlay
    const overlay = document.createElement('div');
    overlay.className = 'transition-overlay';
    document.getElementById('game-container').appendChild(overlay);
    
    // Animate overlay in
    setTimeout(() => {
        overlay.classList.add('active');
        
        // Switch screens
        setTimeout(() => {
            // First hide all screens
            const allScreens = document.querySelectorAll('.screen');
            allScreens.forEach(screen => {
                screen.classList.add('hidden');
            });
            
            // Then show the target screen
            toScreen.classList.remove('hidden');
            toScreen.style.display = 'flex'; // Ensure flex display is applied
            
            // Force a reflow to ensure the screen is properly rendered
            void toScreen.offsetWidth;
            
            // Animate overlay out
            setTimeout(() => {
                overlay.classList.remove('active');
                
                // Remove overlay
                setTimeout(() => {
                    overlay.remove();
                    
                    // Log the visibility state of important elements
                    console.log(`Screen transition complete. ${toScreen.id} is now visible.`);
                    if (toScreen.id === 'level-complete-screen' || toScreen.id === 'game-complete-screen') {
                        const content = toScreen.querySelector('.briefing-content');
                        console.log(`Briefing content display: ${window.getComputedStyle(content).display}`);
                        console.log(`Briefing content visibility: ${window.getComputedStyle(content).visibility}`);
                    }
                }, 500);
            }, 300);
        }, 500);
    }, 10);
}

// Reset game state
function resetGameState() {
    // If we're starting a specific level, select words for that level
    wordList = selectRandomWordsForLevel(currentLevel - 1, 5);
    
    timeLeft = GAME_TIME;
    gameEnding = false; // Reset the gameEnding flag
    
    // Reset player positions
    players.red.x = -5;
    players.red.z = 0;
    players.blue.x = 0;
    players.blue.z = 0;
    players.gold.x = 5;
    players.gold.z = 0;
    
    // Update player meshes if they exist
    if (playerMeshes.red) {
        playerMeshes.red.position.set(players.red.x, AGENT_SIZE, players.red.z);
        playerMeshes.blue.position.set(players.blue.x, AGENT_SIZE, players.blue.z);
        playerMeshes.gold.position.set(players.gold.x, AGENT_SIZE, players.gold.z);
    }
    
    updateScoreDisplay();
}

// Setup level with word and letters
function setupLevel(level) {
    // Validate level number (1-5 corresponds to progress through the 5 words for this game level)
    if (level < 1 || level > wordList.length) {
        console.error(`Invalid word number: ${level} (wordList length: ${wordList.length})`);
        level = 1; // Default to first word
    }
    
    // Get current word and hint (convert from 1-based level to 0-based array index)
    const wordIndex = level - 1;
    currentWord = wordList[wordIndex].word;
    currentHint = wordList[wordIndex].hint;
    
    // Update UI - level is displayed as 1-5 (indicating which word we're on)
    currentLevelDisplay.textContent = level;
    hintText.textContent = currentHint;
    
    console.log(`Setting up word ${level}/${wordList.length} for game level ${currentLevel}`);
    console.log(`Word: ${currentWord}, Hint: ${currentHint}`);
    
    // Clear previous letters
    foundLetters = [];
    letterObjects = [];
    
    // Remove previous letter meshes
    if (letterMeshes && letterMeshes.length > 0) {
        console.log(`Removing ${letterMeshes.length} previous letter meshes`);
        letterMeshes.forEach(mesh => {
            if (mesh && mesh.parent) {
                scene.remove(mesh);
            }
        });
        letterMeshes = [];
    }
    
    // Create letter boxes in UI
    wordContainer.innerHTML = "";
    for (let i = 0; i < currentWord.length; i++) {
        const letterBox = document.createElement("div");
        letterBox.className = "letter-box";
        wordContainer.appendChild(letterBox);
    }
    
    // Generate letters to collect
    generateLetters();
    
    console.log(`Word ${level}/${wordList.length} setup complete.`);
}

// Generate letters to collect
function generateLetters() {
    console.log(`Generating letters for word: ${currentWord}`);
    
    // Get unique letters from the word
    const uniqueLetters = [...new Set(currentWord.split(''))];
    console.log(`Unique letters in word: ${uniqueLetters.join(', ')}`);
    
    // Define a spawn area that takes up almost the entire grid
    const spawnAreaSize = 18; // Increased from 9 to 18 to use more of the grid space
    
    // Create a grid of possible spawn positions
    const gridSize = 5; // Increased from 4x4 to 5x5 for more positions
    const gridSpacing = spawnAreaSize / (gridSize - 1);
    const gridPositions = [];
    
    // Define default positions to avoid
    const defaultPositions = [
        {x: -5, z: 0},  // Red agent
        {x: 0, z: 0},   // Blue agent
        {x: 5, z: 0}    // Gold agent
    ];
    
    // Generate grid positions, excluding default positions
    for (let x = 0; x < gridSize; x++) {
        for (let z = 0; z < gridSize; z++) {
            const posX = (x * gridSpacing - spawnAreaSize/2);
            const posZ = (z * gridSpacing - spawnAreaSize/2);
            
            // Check if this position is too close to any default position
            const isTooCloseToDefault = defaultPositions.some(defaultPos => {
                const dx = posX - defaultPos.x;
                const dz = posZ - defaultPos.z;
                const distance = Math.sqrt(dx * dx + dz * dz);
                return distance < 2; // Minimum distance from default positions
            });
            
            if (!isTooCloseToDefault) {
                gridPositions.push({x: posX, z: posZ});
            }
        }
    }
    
    // Shuffle the grid positions
    for (let i = gridPositions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gridPositions[i], gridPositions[j]] = [gridPositions[j], gridPositions[i]];
    }
    
    // Create correct letters (one instance per unique letter)
    for (let i = 0; i < uniqueLetters.length; i++) {
        const letter = uniqueLetters[i];
        const position = gridPositions[i];
        
        letterObjects.push({
            letter: letter,
            x: position.x,
            z: position.z,
            correct: true
        });
        
        createLetterMesh(letter, position.x, position.z, true);
    }
    
    // Add some wrong letters
    const wrongLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
        .filter(l => !currentWord.includes(l));
    
    // Add half as many wrong letters as correct ones
    const wrongLetterCount = Math.floor(uniqueLetters.length / 2);
    
    // Use remaining grid positions for wrong letters
    for (let i = 0; i < wrongLetterCount; i++) {
        const randomIndex = Math.floor(Math.random() * wrongLetters.length);
        const letter = wrongLetters[randomIndex];
        const position = gridPositions[uniqueLetters.length + i];
        
        letterObjects.push({
            letter: letter,
            x: position.x,
            z: position.z,
            correct: false
        });
        
        createLetterMesh(letter, position.x, position.z, false);
    }
    
    console.log(`Generated ${letterObjects.length} letter objects (${letterMeshes.length} meshes)`);
}

// Create a 3D mesh for a letter
function createLetterMesh(letter, x, z, isCorrect) {
    // Create a more subtle, translucent sphere as a background for the letter
    const geometry = new THREE.SphereGeometry(LETTER_SIZE * 0.8, 16, 16);
    const material = new THREE.MeshStandardMaterial({ 
        color: 0xFFFFFF,        // White base color
        emissive: 0xCCCCFF,     // Slight blue glow
        emissiveIntensity: 0.1,
        metalness: 0.3,
        roughness: 0.7,
        transparent: true,
        opacity: 0.5            // Make sphere semi-transparent
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, LETTER_SIZE, z);
    
    // Add floating animation
    mesh.userData = {
        initialY: LETTER_SIZE,
        floatOffset: Math.random() * Math.PI * 2,
        letter: letter,
        isCorrect: isCorrect,  // Keep this for gameplay logic, but don't show visually
        frontCollisionRadius: LETTER_SIZE * 3.5,    // Updated front collision radius
        backCollisionRadius: LETTER_SIZE * 1.0      // Updated back collision radius
    };
    
    // For visual debugging of hitboxes - uncomment if needed
    /*
    // Create front hitbox visualization (green)
    const frontHitboxGeometry = new THREE.SphereGeometry(LETTER_SIZE * 3.5, 8, 8);
    const frontHitboxMaterial = new THREE.MeshBasicMaterial({
        color: 0x00FF00,
        transparent: true,
        opacity: 0.1,
        wireframe: true
    });
    const frontHitbox = new THREE.Mesh(frontHitboxGeometry, frontHitboxMaterial);
    
    // Position the front hitbox based on the camera direction
    const frontDirection = new THREE.Vector3(-camera.position.x, 0, -camera.position.z).normalize();
    frontHitbox.position.copy(frontDirection.multiplyScalar(LETTER_SIZE * 0.5));
    mesh.add(frontHitbox);
    
    // Create back hitbox visualization (red)
    const backHitboxGeometry = new THREE.SphereGeometry(LETTER_SIZE * 1.0, 8, 8);
    const backHitboxMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF0000,
        transparent: true,
        opacity: 0.1,
        wireframe: true
    });
    const backHitbox = new THREE.Mesh(backHitboxGeometry, backHitboxMaterial);
    
    // Position the back hitbox in the opposite direction
    const backDirection = new THREE.Vector3(camera.position.x, 0, camera.position.z).normalize();
    backHitbox.position.copy(backDirection.multiplyScalar(LETTER_SIZE * 0.5));
    mesh.add(backHitbox);
    */
    
    scene.add(mesh);
    letterMeshes.push(mesh);
    
    // Create text label for the letter
    createLetterLabel(letter, mesh);
    
    return mesh;
}

// Create a text label for a letter
function createLetterLabel(letter, parentMesh) {
    // Create a canvas texture for the text
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;  // Increased canvas size for better resolution
    canvas.height = 512; // Increased canvas size for better resolution
    
    // Draw background with a more visible circular gradient
    const gradient = context.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 4
    );
    
    // Use a dark background for better contrast
    gradient.addColorStop(0, 'rgba(30, 30, 50, 0.9)');
    gradient.addColorStop(0.7, 'rgba(20, 20, 40, 0.7)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw text with outline for better visibility
    context.font = 'bold 300px Arial'; // Much larger font
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    // Draw text outline
    context.strokeStyle = 'black';
    context.lineWidth = 16;
    context.strokeText(letter, canvas.width / 2, canvas.height / 2);
    
    // Draw text - use player's color
    context.fillStyle = '#ffffff';
    context.fillText(letter, canvas.width / 2, canvas.height / 2);
    
    // Create texture and sprite
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true,
        opacity: 1,
        depthTest: false,  // Make sure text renders on top
        depthWrite: false  // Make sure text renders on top
    });
    
    const sprite = new THREE.Sprite(material);
    sprite.position.set(0, 0, 0.1);
    
    // Position the sprite slightly in front of the sphere
    sprite.position.set(0, 0, 0.1);
    
    // Add the sprite to the parent mesh
    parentMesh.add(sprite);
    
    // Store reference to the sprite
    parentMesh.userData.sprite = sprite;
}

// Start the game timer
function startTimer() {
    // Clear any existing timer
    clearInterval(timer);
    
    // Reset timer color to default
    timeLeftDisplay.classList.remove('time-warning', 'time-penalty');
    
    // Start a new timer
    timer = setInterval(() => {
        timeLeft--;
        timeLeftDisplay.textContent = timeLeft;
        
        // Add warning color when time is low
        if (timeLeft <= 10) {
            timeLeftDisplay.classList.add('time-warning');
        } else {
            timeLeftDisplay.classList.remove('time-warning');
        }
        
        if (timeLeft <= 0) {
            gameOver();
        }
    }, 1000);
}

// Deduct time with visual feedback
function deductTime(seconds) {
    // Deduct the seconds
    timeLeft = Math.max(1, timeLeft - seconds);
    timeLeftDisplay.textContent = timeLeft;
    
    // Visual feedback - flash the timer red
    timeLeftDisplay.classList.remove('time-warning'); // Remove warning class if it exists
    timeLeftDisplay.classList.add('time-penalty');
    setTimeout(() => {
        if (timeLeftDisplay) {
            timeLeftDisplay.classList.remove('time-penalty');
            
            // If time is still critically low after penalty, reapply warning
            if (timeLeft <= 10) {
                timeLeftDisplay.classList.add('time-warning');
            }
        }
    }, 500);
    
    // Show time penalty text below timer
    const timerElement = document.getElementById('timer');
    if (!timerElement) {
        console.error("Could not find timer element");
        return;
    }
    
    // Create and position penalty indicator
    const penaltyElement = document.createElement('div');
    penaltyElement.textContent = `-${seconds}s`;
    penaltyElement.style.position = 'absolute';
    penaltyElement.style.color = '#ff3030';
    penaltyElement.style.fontWeight = 'bold';
    penaltyElement.style.fontSize = '18px';
    penaltyElement.style.textShadow = '1px 1px 2px black';
    penaltyElement.style.left = '50%';
    penaltyElement.style.transform = 'translateX(-50%)';
    penaltyElement.style.top = '100%';
    penaltyElement.style.opacity = '1';
    penaltyElement.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
    
    timerElement.appendChild(penaltyElement);
    
    // Animate the penalty indicator
    setTimeout(() => {
        if (!penaltyElement) return;
        penaltyElement.style.opacity = '0';
        penaltyElement.style.transform = 'translateX(-50%) translateY(10px)';
        setTimeout(() => {
            if (penaltyElement && penaltyElement.parentNode) {
                penaltyElement.parentNode.removeChild(penaltyElement);
            }
        }, 500);
    }, 1000);
    
    // If time is critically low, keep the warning color
    if (timeLeft <= 10) {
        timeLeftDisplay.classList.add('time-warning');
    }
}

// Game over - time ran out
function gameOver() {
    // If the level is already ending (e.g. through completion), don't trigger game over
    if (gameEnding) return;
    
    gameEnding = true;
    clearInterval(timer);
    gameRunning = false;
    
    // Reset input states
    Object.keys(players).forEach(playerId => {
        const player = players[playerId];
        player.input.up = false;
        player.input.down = false;
        player.input.left = false;
        player.input.right = false;
    });
    
    // Play game over sound with lower volume
    playSound('levelComplete', 0.4);
    
    // Show game over screen with transition
    transitionToScreen(gameScreen, gameOverScreen);
}

// Level complete
function levelComplete() {
    console.log("Level complete function called");
    
    // If the game is already ending (e.g. through timeout), don't trigger level complete
    if (gameEnding) return;
    
    gameEnding = true;
    
    // Stop game loop
    gameRunning = false;
    clearInterval(timer);
    
    // Reset input states to prevent movement carrying over to next level
    Object.keys(players).forEach(playerId => {
        const player = players[playerId];
        player.input.up = false;
        player.input.down = false;
        player.input.left = false;
        player.input.right = false;
    });
    
    // Play level complete sound (at a slightly lower volume)
    playSound('levelComplete', 0.5);
    
    // Use proper screen transition instead of directly hiding all screens
    transitionToScreen(gameScreen, levelCompleteScreen);
    
    // Add particle celebration effect after a small delay to ensure the screen is visible
    setTimeout(() => {
        createCelebrationEffect();
    }, 600);
}

// Add a separate function to check level completion
function checkLevelCompletion() {
    try {
        // Get unique letters in the current word
        const uniqueLetters = [...new Set(currentWord.split(''))];
        
        console.log(`Checking level completion:`);
        console.log(`- Word: ${currentWord} (${uniqueLetters.length} unique letters)`);
        console.log(`- Found: ${foundLetters.join(', ')} (${foundLetters.length} letters)`);
        console.log(`- Current game level: ${currentLevel}`);
        
        // Check if we've found all unique letters in the word
        let allLettersFound = true;
        const missingLetters = [];
        
        for (const letter of uniqueLetters) {
            if (!foundLetters.includes(letter)) {
                allLettersFound = false;
                missingLetters.push(letter);
            }
        }
        
        if (missingLetters.length > 0) {
            console.log(`Missing letters: ${missingLetters.join(', ')}`);
        }
        
        if (allLettersFound) {
            console.log("✅ All letters found! Word complete.");
            setTimeout(() => {
                // Get the current word index (1-5)
                const wordIndex = parseInt(currentLevelDisplay.textContent);
                console.log(`Current word: ${wordIndex}/5`);
                
                if (wordIndex < 5) {
                    // If this is not the last word for this level, move to next word
                    console.log(`Moving to next word (${wordIndex + 1}/5)`);
                    
                    // Reset the timer color to default (in case it was in warning state)
                    timeLeftDisplay.classList.remove('time-warning', 'time-penalty');
                    
                    // Reset the timer to GAME_TIME (30 seconds)
                    timeLeft = GAME_TIME;
                    timeLeftDisplay.textContent = timeLeft;
                    clearInterval(timer);
                    startTimer();
                    console.log(`Timer reset to ${GAME_TIME} seconds for next word`);
                    
                    // Reset player positions to default
                    players.red.x = -5;
                    players.red.z = 0;
                    players.blue.x = 0;
                    players.blue.z = 0;
                    players.gold.x = 5;
                    players.gold.z = 0;
                    
                    // Update player meshes
                    if (playerMeshes.red) {
                        playerMeshes.red.position.set(players.red.x, AGENT_SIZE, players.red.z);
                        playerMeshes.blue.position.set(players.blue.x, AGENT_SIZE, players.blue.z);
                        playerMeshes.gold.position.set(players.gold.x, AGENT_SIZE, players.gold.z);
                    }
                    
                    // Setup the next word
                    setupLevel(wordIndex + 1);
                } else {
                    // If this is the last word (5/5), mark the entire game level as completed
                    console.log(`Final word (5/5) complete for level ${currentLevel}!`);
                    
                    // Mark the GAME level as completed
                    markLevelCompleted(currentLevel);
                    
                    // Check if this is the last game level
                    if (currentLevel === TOTAL_LEVELS) {
                        console.log("Last level completed. Going to game complete screen.");
                        gameComplete();
                    } else {
                        // Move to level complete screen
                        console.log("Level completed, showing level complete screen");
                        levelComplete();
                    }
                }
            }, 500); // Small delay to show completion
        }
    } catch (error) {
        console.error("Error in level completion check:", error);
    }
}

// Create celebration particle effect
function createCelebrationEffect() {
    try {
        const celebrationParticles = [];
        const particleCount = 150; // Increased particles for better effect
        
        // Get the container (either level complete or game complete screen)
        const container = document.querySelector('.screen:not(.hidden)');
        if (!container) {
            console.error("No visible screen found for celebration effect");
            return;
        }
        
        // Create particle wrapper for easier cleanup
        const particleWrapper = document.createElement('div');
        particleWrapper.className = 'celebration-particle-wrapper';
        particleWrapper.style.position = 'absolute';
        particleWrapper.style.top = '0';
        particleWrapper.style.left = '0';
        particleWrapper.style.width = '100%';
        particleWrapper.style.height = '100%';
        particleWrapper.style.pointerEvents = 'none';
        particleWrapper.style.zIndex = '50';
        container.appendChild(particleWrapper);
        
        // Create particles with staggered timing
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                if (!particleWrapper.parentNode) return; // Safety check
                
                const particle = document.createElement('div');
                particle.className = 'celebration-particle';
                
                // Random position
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                
                // Random color
                particle.style.backgroundColor = getRandomColor();
                
                // Random size
                const size = Math.random() * 12 + 5;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                
                // Staggered animation
                particle.style.animationDelay = `${Math.random() * 0.5}s`;
                
                // Set random translation values for movement
                const randomX = (Math.random() - 0.5) * 300;
                const randomY = (Math.random() - 0.5) * 300;
                particle.style.setProperty('--random-x', `${randomX}px`);
                particle.style.setProperty('--random-y', `${randomY}px`);
                
                // Add to wrapper
                particleWrapper.appendChild(particle);
                celebrationParticles.push(particle);
            }, i * 10); // Stagger particle creation for more natural effect
        }
        
        // Remove all particles with a smooth transition after animation
        setTimeout(() => {
            if (particleWrapper.parentNode) {
                particleWrapper.style.transition = 'opacity 1s ease-out';
                particleWrapper.style.opacity = '0';
                
                // Remove from DOM after transition
                setTimeout(() => {
                    if (particleWrapper.parentNode) {
                        particleWrapper.parentNode.removeChild(particleWrapper);
                    }
                }, 1000);
            }
        }, 4000); // Allow enough time for all particles to complete their animation
        
    } catch (error) {
        console.error("Error creating celebration effect:", error);
    }
}

// Get random color for particles
function getRandomColor() {
    const colors = ['#ff3232', '#3232ff', '#FFD700', '#5d89ff', '#45aaf2'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Game complete - all levels finished
function gameComplete() {
    console.log("🎮 Game completed! All levels finished.");
    
    // Clear any remaining timers or animations
    clearInterval(timer);
    gameRunning = false;
    
    // Reset input states
    Object.keys(players).forEach(playerId => {
        const player = players[playerId];
        player.input.up = false;
        player.input.down = false;
        player.input.left = false;
        player.input.right = false;
    });
    
    // Play game complete victory sound
    playSound('gameComplete', 0.6);
    
    // Use proper screen transition instead of directly hiding all screens
    transitionToScreen(gameScreen, gameCompleteScreen);
    
    // Show final scores
    document.getElementById("final-red").textContent = playerScores.red;
    document.getElementById("final-blue").textContent = playerScores.blue;
    document.getElementById("final-gold").textContent = playerScores.gold;
    
    // Update game complete text to match space theme
    const gameCompleteText = document.querySelector("#game-complete-screen .briefing-content p");
    if (gameCompleteText) {
        gameCompleteText.textContent = "You've successfully explored the entire solar system!";
    }
    
    // Hide the reset progress button since all levels are completed
    const resetProgressBtn = document.getElementById("reset-progress-btn");
    if (resetProgressBtn) {
        resetProgressBtn.style.display = 'none';
    }
    
    // Hide the play again button in the game complete screen
    const playAgainBtn = document.getElementById("play-again-btn");
    if (playAgainBtn) {
        playAgainBtn.style.display = 'none';
    }
    
    // Determine the winner
    const scores = [
        { player: "Agent Red", score: playerScores.red },
        { player: "Agent Blue", score: playerScores.blue },
        { player: "Agent Gold", score: playerScores.gold }
    ];
    
    scores.sort((a, b) => b.score - a.score);
    
    if (scores[0].score > 0) {
        console.log(`Top score: ${scores[0].player} with ${scores[0].score} points`);
    }
    
    // Add celebration effect for completion after a small delay to ensure the screen is visible
    setTimeout(() => {
        createCelebrationEffect();
    }, 600);
}

// Reset the game completely
function resetGame() {
    console.log("Resetting game and returning to level select");
    console.log("BEFORE reset - completedLevels:", JSON.stringify(completedLevels));
    
    // Get levels that are actually marked as completed
    const savedLevels = localStorage.getItem('completedLevels');
    if (savedLevels) {
        // Force reload from localStorage to ensure we're using the most current data
        completedLevels = JSON.parse(savedLevels);
    }
    
    console.log("AFTER loading from localStorage - completedLevels:", JSON.stringify(completedLevels));
    
    // Find the highest completed level
    const maxCompletedLevel = completedLevels.length > 0 ? Math.max(...completedLevels) : 0;
    
    // Reset the completedLevels array and only keep progress up to the next level
    const originalCompletedLevels = [...completedLevels]; // Save for debugging
    completedLevels = [];
    
    // Only add the current level as completed if it's not the first level
    if (maxCompletedLevel >= 1) {
        completedLevels.push(maxCompletedLevel);
    }
    
    console.log("AFTER reset - maxCompletedLevel:", maxCompletedLevel);
    console.log("AFTER reset - completedLevels:", JSON.stringify(completedLevels));
    console.log("Original completedLevels was:", JSON.stringify(originalCompletedLevels));
    
    // Save the updated completedLevels to localStorage
    localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
    
    // Show the level selection screen
    showLevelSelect();
    
    // Double check level locking status for verification
    for (let i = 1; i <= TOTAL_LEVELS; i++) {
        console.log(`Level ${i} (${LEVEL_NAMES[i-1]}) unlocked: ${isLevelUnlocked(i)}`);
    }
}

// Start the game 
// This is now replaced by startLevel function
function startGame() {
    // Redirect to level select
    showLevelSelect();
}

// Transition to next level
function nextLevel() {
    console.log("Next level function called, transitioning to level", currentLevel + 1);
    
    // Reset the gameEnding flag for the new level
    gameEnding = false;
    
    // Remove any celebration particles
    document.querySelectorAll('.celebration-particle').forEach(p => p.remove());
    
    // Increment level
    currentLevel++;
    
    if (currentLevel <= wordList.length) {
        console.log(`Starting level ${currentLevel}`);
        
        // Show game screen with simple transition
        hideAllScreens();
        gameScreen.classList.remove("hidden");
        
        // Play intro sound for the new level
        if (audioContext && audioBuffers['intro']) {
            playSound('intro', 0.7);
            console.log("Playing intro sound for level", currentLevel);
        }
        
        // Reset player positions for the new level
        players.red.x = -5;
        players.red.z = 0;
        players.blue.x = 0;
        players.blue.z = 0;
        players.gold.x = 5;
        players.gold.z = 0;
        
        // Update player meshes
        if (playerMeshes.red) {
            playerMeshes.red.position.set(players.red.x, AGENT_SIZE, players.red.z);
            playerMeshes.blue.position.set(players.blue.x, AGENT_SIZE, players.blue.z);
            playerMeshes.gold.position.set(players.gold.x, AGENT_SIZE, players.gold.z);
        }
        
        // Reset input states
        Object.keys(players).forEach(playerId => {
            const player = players[playerId];
            player.input.up = false;
            player.input.down = false;
            player.input.left = false;
            player.input.right = false;
        });
        
        // Setup next level
        setupLevel(currentLevel);
        
        // Reset timer
        timeLeft = GAME_TIME;
        timeLeftDisplay.textContent = timeLeft;
        startTimer();
        
        // Start game loop
        gameRunning = true;
        requestAnimationFrame(gameLoop);
        
        console.log("Next level started, game loop reactivated");
    } else {
        // Game complete
        gameComplete();
    }
}

// Handle keyboard input - key down
function handleKeyDown(e) {
    if (!gameRunning) return;
    
    const key = e.key.toLowerCase();
    
    // Player Red controls
    if (key === players.red.keys.up) players.red.input.up = true;
    if (key === players.red.keys.left) players.red.input.left = true;
    if (key === players.red.keys.down) players.red.input.down = true;
    if (key === players.red.keys.right) players.red.input.right = true;
    
    // Player Blue controls
    if (key === players.blue.keys.up.toLowerCase()) players.blue.input.up = true;
    if (key === players.blue.keys.left.toLowerCase()) players.blue.input.left = true;
    if (key === players.blue.keys.down.toLowerCase()) players.blue.input.down = true;
    if (key === players.blue.keys.right.toLowerCase()) players.blue.input.right = true;
    
    // Player Gold controls
    if (key === players.gold.keys.up) players.gold.input.up = true;
    if (key === players.gold.keys.left) players.gold.input.left = true;
    if (key === players.gold.keys.down) players.gold.input.down = true;
    if (key === players.gold.keys.right) players.gold.input.right = true;
}

// Handle keyboard input - key up
function handleKeyUp(e) {
    if (!gameRunning) return;
    
    const key = e.key.toLowerCase();
    
    // Player Red controls
    if (key === players.red.keys.up) players.red.input.up = false;
    if (key === players.red.keys.left) players.red.input.left = false;
    if (key === players.red.keys.down) players.red.input.down = false;
    if (key === players.red.keys.right) players.red.input.right = false;
    
    // Player Blue controls
    if (key === players.blue.keys.up.toLowerCase()) players.blue.input.up = false;
    if (key === players.blue.keys.left.toLowerCase()) players.blue.input.left = false;
    if (key === players.blue.keys.down.toLowerCase()) players.blue.input.down = false;
    if (key === players.blue.keys.right.toLowerCase()) players.blue.input.right = false;
    
    // Player Gold controls
    if (key === players.gold.keys.up) players.gold.input.up = false;
    if (key === players.gold.keys.left) players.gold.input.left = false;
    if (key === players.gold.keys.down) players.gold.input.down = false;
    if (key === players.gold.keys.right) players.gold.input.right = false;
}

// Update player positions based on input
function updatePlayers() {
    // Red player movement
    if (players.red.input.up) players.red.z -= playerSpeeds.red;
    if (players.red.input.down) players.red.z += playerSpeeds.red;
    if (players.red.input.left) players.red.x -= playerSpeeds.red;
    if (players.red.input.right) players.red.x += playerSpeeds.red;

    // Blue player movement
    if (players.blue.input.up) players.blue.z -= playerSpeeds.blue;
    if (players.blue.input.down) players.blue.z += playerSpeeds.blue;
    if (players.blue.input.left) players.blue.x -= playerSpeeds.blue;
    if (players.blue.input.right) players.blue.x += playerSpeeds.blue;

    // Gold player movement
    if (players.gold.input.up) players.gold.z -= playerSpeeds.gold;
    if (players.gold.input.down) players.gold.z += playerSpeeds.gold;
    if (players.gold.input.left) players.gold.x -= playerSpeeds.gold;
    if (players.gold.input.right) players.gold.x += playerSpeeds.gold;

    // Keep players within bounds
    keepPlayerInBounds(players.red);
    keepPlayerInBounds(players.blue);
    keepPlayerInBounds(players.gold);

    // Update player meshes and create trail particles
    const currentTime = Date.now();
    
    // Base trail interval that decreases with upgrades
    const getTrailInterval = (color) => {
        const baseInterval = 100; // Base interval in milliseconds
        const upgradeLevel = trailUpgrades[color];
        // Each upgrade level reduces the interval by 20ms
        return Math.max(20, baseInterval - (upgradeLevel * 20));
    };

    // Update red player
    if (playerMeshes.red) {
        playerMeshes.red.position.set(players.red.x, AGENT_SIZE, players.red.z);
        if (isPlayerMoving('red') && currentTime - lastTrailTime.red > getTrailInterval('red')) {
            createTrailParticle('red', players.red.x, players.red.z);
            lastTrailTime.red = currentTime;
        }
    }

    // Update blue player
    if (playerMeshes.blue) {
        playerMeshes.blue.position.set(players.blue.x, AGENT_SIZE, players.blue.z);
        if (isPlayerMoving('blue') && currentTime - lastTrailTime.blue > getTrailInterval('blue')) {
            createTrailParticle('blue', players.blue.x, players.blue.z);
            lastTrailTime.blue = currentTime;
        }
    }

    // Update gold player
    if (playerMeshes.gold) {
        playerMeshes.gold.position.set(players.gold.x, AGENT_SIZE, players.gold.z);
        if (isPlayerMoving('gold') && currentTime - lastTrailTime.gold > getTrailInterval('gold')) {
            createTrailParticle('gold', players.gold.x, players.gold.z);
            lastTrailTime.gold = currentTime;
        }
    }

    // Make player labels always face the camera
    Object.values(playerMeshes).forEach(mesh => {
        if (mesh.children[0]) {
            mesh.children[0].lookAt(camera.position);
        }
    });
}

// Check if a player is moving
function isPlayerMoving(playerId) {
    const player = players[playerId];
    return player.input.up || player.input.down || player.input.left || player.input.right;
}

// Keep player within bounds
function keepPlayerInBounds(player) {
    // Use a slightly larger boundary size to allow more movement while still keeping players visible
    // The camera is positioned at (0, 12, 15) looking at (0, 0, 0), so we need to keep players
    // within a reasonable distance from the center to ensure they're visible
    const boundarySize = 10; // Increased from 8 to 10 to allow more movement
    
    if (player.x < -boundarySize) player.x = -boundarySize;
    if (player.x > boundarySize) player.x = boundarySize;
    if (player.z < -boundarySize) player.z = -boundarySize;
    if (player.z > boundarySize) player.z = boundarySize;
}

// Create a trail particle for a player
function createTrailParticle(playerId, x, z) {
    const upgradeLevel = trailUpgrades[playerId];
    const trailValues = upgradeLevel > 0 ? TRAIL_UPGRADE_VALUES[upgradeLevel - 1] : {
        size: 0.3,
        opacity: 0.7,
        duration: 1000,
        count: 10
    };
    
    // Create a small sphere for the trail particle
    const geometry = new THREE.SphereGeometry(AGENT_SIZE * trailValues.size, 8, 8);
    const material = new THREE.MeshBasicMaterial({
        color: players[playerId].color,
        transparent: true,
        opacity: trailValues.opacity
    });
    
    const particle = new THREE.Mesh(geometry, material);
    particle.position.set(x, AGENT_SIZE * 0.5, z);
    scene.add(particle);
    
    // Add to player's trail array
    playerTrails[playerId].push({
        mesh: particle,
        createdAt: Date.now(),
        opacity: trailValues.opacity,
        duration: trailValues.duration
    });
    
    // Limit the number of trail particles per player based on upgrade level
    if (playerTrails[playerId].length > trailValues.count) {
        const oldestTrail = playerTrails[playerId].shift();
        scene.remove(oldestTrail.mesh);
    }
}

// Update trail particles
function updateTrails() {
    const currentTime = Date.now();
    
    // Update each player's trail particles
    Object.keys(playerTrails).forEach(playerId => {
        for (let i = playerTrails[playerId].length - 1; i >= 0; i--) {
            const trail = playerTrails[playerId][i];
            const age = currentTime - trail.createdAt;
            
            if (age > trail.duration) {
                // Remove expired trail particles
                scene.remove(trail.mesh);
                playerTrails[playerId].splice(i, 1);
            } else {
                // Fade out trail particles over time
                const progress = age / trail.duration;
                trail.mesh.material.opacity = trail.opacity * (1 - progress);
                
                // Make trail particles slightly smaller over time
                const scale = 1 - (progress * 0.5);
                trail.mesh.scale.set(scale, scale, scale);
            }
        }
    });
}

// Animate letters with floating effect
function animateLetters() {
    const time = Date.now() * 0.001; // Convert to seconds
    
    letterMeshes.forEach(mesh => {
        const initialY = mesh.userData.initialY;
        const floatOffset = mesh.userData.floatOffset;
        
        // Floating animation
        mesh.position.y = initialY + Math.sin(time + floatOffset) * 0.2;
        
        // Rotation animation for the sphere only
        mesh.rotation.y += 0.01;
        
        // Check if any player is close to this letter (for visual feedback)
        let closestDistance = Infinity;
        let isAnyPlayerApproachingFromFront = false;
        
        Object.values(playerMeshes).forEach(playerMesh => {
            const letterPos = mesh.position;
            const playerPos = playerMesh.position;
            
            // Calculate vector from letter to player
            const dx = playerPos.x - letterPos.x;
            const dz = playerPos.z - letterPos.z;
            const distance = Math.sqrt(dx * dx + dz * dz);
            
            closestDistance = Math.min(closestDistance, distance);
            
            // Calculate if player is approaching from front using dot product
            const cameraXZ = new THREE.Vector2(-camera.position.x, -camera.position.z).normalize();
            const letterToPlayerXZ = new THREE.Vector2(dx, dz).normalize();
            const dotProduct = cameraXZ.dot(letterToPlayerXZ);
            
            // Player is in front if dot product is negative
            const isPlayerApproachingFromFront = dotProduct < 0;
            
            if (isPlayerApproachingFromFront && distance < 5) {
                isAnyPlayerApproachingFromFront = true;
            }
        });
        
        // Visual feedback as players get closer
        const frontProximityThreshold = LETTER_SIZE * 3.5 + AGENT_SIZE;
        const backProximityThreshold = LETTER_SIZE * 1.0 + AGENT_SIZE;
        
        // Use the appropriate threshold based on approach direction
        const proximityThreshold = isAnyPlayerApproachingFromFront ? 
            frontProximityThreshold * 1.2 : backProximityThreshold * 1.2;
        
        if (closestDistance < proximityThreshold) {
            // Calculate intensity based on distance (closer = more intense)
            const intensity = 1 - (closestDistance / proximityThreshold);
            
            // Make the letter pulse/glow more intensely when players are very close
            const scale = 1 + (0.3 * intensity * Math.sin(time * 8));
            mesh.scale.set(scale, scale, scale);
            
            // Increase glow/emissive as player gets closer
            if (mesh.material) {
                mesh.material.emissiveIntensity = 0.1 + (0.6 * intensity);
                
                // Change opacity to make it more visible when close to collection
                mesh.material.opacity = 0.5 + (0.5 * intensity);
            }
            
            // Make the letter label (sprite) scale up as player gets closer
            if (mesh.userData.sprite) {
                const spriteScale = 3 + (intensity * 0.5);
                mesh.userData.sprite.scale.set(spriteScale, spriteScale, 1);
            }
        } else {
            // Reset to normal state when no players are nearby
            mesh.scale.set(1, 1, 1);
            if (mesh.material) {
                mesh.material.emissiveIntensity = 0.1;
                mesh.material.opacity = 0.5;
            }
            
            // Reset sprite scale
            if (mesh.userData.sprite) {
                mesh.userData.sprite.scale.set(3, 3, 1);
            }
        }
        
        // Ensure letter sprites always face the camera directly
        if (mesh.userData.sprite) {
            // Get the direction vector from the camera to the sprite
            const direction = new THREE.Vector3();
            direction.subVectors(camera.position, mesh.position).normalize();
            
            // Set the sprite to face the camera directly
            mesh.userData.sprite.lookAt(camera.position);
            
            // Ensure the sprite doesn't inherit parent rotation
            mesh.userData.sprite.quaternion.copy(camera.quaternion);
        }
    });
}

// Check collisions between players and letters
function checkCollisions() {
    for (let i = letterMeshes.length - 1; i >= 0; i--) {
        const letterMesh = letterMeshes[i];
        if (!letterMesh || !letterMesh.userData) continue;
        
        const letter = letterMesh.userData.letter;
        const isCorrect = letterMesh.userData.isCorrect;
        
        // Check collision with red player
        if (isCollidingWithPlayer(letterMesh, playerMeshes.red)) {
            collectLetter(letter, isCorrect, "red");
            scene.remove(letterMesh);
            letterMeshes.splice(i, 1);
            continue;
        }
        
        // Check collision with blue player
        if (isCollidingWithPlayer(letterMesh, playerMeshes.blue)) {
            collectLetter(letter, isCorrect, "blue");
            scene.remove(letterMesh);
            letterMeshes.splice(i, 1);
            continue;
        }
        
        // Check collision with gold player
        if (isCollidingWithPlayer(letterMesh, playerMeshes.gold)) {
            collectLetter(letter, isCorrect, "gold");
            scene.remove(letterMesh);
            letterMeshes.splice(i, 1);
            continue;
        }
    }
}

// Check if player and letter are colliding
function isCollidingWithPlayer(letterMesh, playerMesh) {
    try {
        if (!letterMesh || !playerMesh || !letterMesh.position || !playerMesh.position) {
            return false;
        }
        
        // Get positions
        const letterPos = letterMesh.position;
        const playerPos = playerMesh.position;
        
        // Calculate vector from letter to player
        const dx = playerPos.x - letterPos.x;
        const dz = playerPos.z - letterPos.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        // Simple fixed-size hitbox as a fallback
        const simpleCollisionRadius = LETTER_SIZE * 1.8;
        
        // DEBUG: Use a simple hitbox for all directions if needed
        // return distance < (AGENT_SIZE + simpleCollisionRadius);
        
        // Get camera position in XZ plane
        const cameraXZ = new THREE.Vector2(-camera.position.x, -camera.position.z).normalize();
        
        // Get direction from letter to player in XZ plane
        const letterToPlayerXZ = new THREE.Vector2(dx, dz).normalize();
        
        // Calculate dot product to determine if player is in front or behind
        // Dot product > 0 means the vectors are pointing in similar directions (player is behind the letter from camera view)
        // Dot product < 0 means the vectors are pointing in opposite directions (player is in front of the letter from camera view)
        const dotProduct = cameraXZ.dot(letterToPlayerXZ);
        
        // Consider the player to be in front if the dot product is negative (vectors pointing in opposite directions)
        const isApproachingFromFront = dotProduct < 0;
        
        // Use different collision radii based on approach direction
        let collisionRadius;
        
        if (isApproachingFromFront) {
            // Player is approaching from front (side facing camera)
            collisionRadius = LETTER_SIZE * 3.5; // Larger hitbox in front
        } else {
            // Player is approaching from behind (side away from camera)
            collisionRadius = LETTER_SIZE * 1.0; // Smaller hitbox in back
        }
        
        // Debug visuals - make the letter flash if close to collision threshold
        if (Math.abs(distance - (AGENT_SIZE + collisionRadius)) < 0.2) {
            if (letterMesh.material) {
                letterMesh.material.emissiveIntensity = 0.8; // Flash when at collision boundary
                setTimeout(() => {
                    if (letterMesh.material) {
                        letterMesh.material.emissiveIntensity = 0.1;
                    }
                }, 100);
            }
        }
        
        return distance < (AGENT_SIZE + collisionRadius);
    } catch (error) {
        console.error("Error in collision detection:", error);
        return false;
    }
}

// Collect a letter
function collectLetter(letter, isCorrect, playerColor) {
    try {
        if (isCorrect) {
            // Letter is part of the word
            if (!foundLetters.includes(letter)) {
                foundLetters.push(letter);
                
                // Update letter boxes
                updateWordDisplay();
                
                // Count how many instances of this letter are in the word
                const letterCount = currentWord.split('').filter(l => l === letter).length;
                
                // Add points based on how many instances of the letter occur in the word
                // 10 points per instance
                const pointsEarned = letterCount * 10;
                playerScores[playerColor] += pointsEarned;
                updateScoreDisplay();
                
                // Save scores to localStorage
                savePlayerScores();
                
                // Show a floating score indicator with player's color
                showFloatingText(`+${pointsEarned}`, playerMeshes[playerColor].position, 0x5d89ff, playerColor);
                
                // Play success sound
                playSound('success');
                
                // Create particle effect with player's color
                createParticleEffect(playerMeshes[playerColor].position, players[playerColor].color);
                
                // Check if level is complete
                checkLevelCompletion();
            }
        } else {
            console.log(`Player ${playerColor} collected incorrect letter: ${letter}`);
            
            // Wrong letter - subtract 7 points
            playerScores[playerColor] = Math.max(0, playerScores[playerColor] - 7);
            updateScoreDisplay();
            
            // Deduct 7 seconds from the timer
            deductTime(7);
            
            // Show a floating score indicator with player's color
            showFloatingText(`-7`, playerMeshes[playerColor].position, 0xff5d5d, playerColor);
            
            // Play error sound at normal volume
            if (audioContext && audioBuffers['error']) {
                console.log("Playing error sound");
                playSound('error', 0.6);
            } else {
                console.warn("Error sound not available", audioBuffers['error'] ? "Audio context issue" : "Sound not loaded");
            }
            
            // Create particle effect with player's color
            createParticleEffect(playerMeshes[playerColor].position, players[playerColor].color);
        }
    } catch (error) {
        console.error("Error in collectLetter:", error);
    }
}

// Initialize sound system
function initSoundSystem() {
    try {
        // Create audio context
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContext();
        
        // Fix for browsers that suspend AudioContext until user interaction
        if (audioContext.state === 'suspended') {
            console.log('AudioContext is suspended. Will resume on user interaction.');
            
            // Add event listeners to resume audio context on user interaction
            const resumeAudioContext = () => {
                if (audioContext.state === 'suspended') {
                    audioContext.resume().then(() => {
                        console.log('AudioContext resumed successfully');
                    }).catch(err => {
                        console.error('Failed to resume AudioContext:', err);
                    });
                }
            };
            
            // Add event listeners to common user interactions
            document.addEventListener('click', resumeAudioContext, { once: false });
            document.addEventListener('keydown', resumeAudioContext, { once: false });
            document.addEventListener('touchstart', resumeAudioContext, { once: false });
        }
        
        // Preload sound effects
        Object.keys(soundEffects).forEach(key => {
            loadSound(key, soundEffects[key]);
        });
        
        // Make sure error sound is loaded (critical sound)
        loadSound('error', soundEffects['error'])
            .then(() => {
                console.log('Error sound loaded successfully');
            })
            .catch(error => {
                console.error('Failed to load error sound:', error);
            });
        
        console.log('Sound system initialized, AudioContext state:', audioContext.state);
    } catch (e) {
        console.warn('Web Audio API is not supported in this browser. Sound effects disabled.', e);
    }
}

// Load a sound file
function loadSound(name, url) {
    if (!audioContext) return Promise.resolve(null);
    
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.arrayBuffer();
        })
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
            audioBuffers[name] = audioBuffer;
            console.log(`Loaded sound: ${name}`);
            return audioBuffer;
        })
        .catch(error => {
            console.error(`Error loading sound: ${name}`, error);
            return null;
        });
}

// Play a sound effect
function playSound(name, volume = 0.5) {
    if (!audioContext) {
        console.warn('Cannot play sound: AudioContext not initialized');
        return;
    }
    
    if (!audioBuffers[name]) {
        console.warn(`Cannot play sound: Sound "${name}" not loaded`);
        return;
    }
    
    try {
        // Check if context is in suspended state and try to resume it
        if (audioContext.state === 'suspended') {
            console.log('Attempting to resume AudioContext before playing sound');
            audioContext.resume().catch(err => {
                console.error('Failed to resume AudioContext:', err);
            });
        }
        
        // Create source
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffers[name];
        
        // Create gain node for volume
        const gainNode = audioContext.createGain();
        gainNode.gain.value = volume;
        
        // Connect nodes
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Play sound
        source.start();
        console.log(`Playing sound: ${name} (volume: ${volume}, context state: ${audioContext.state})`);
    } catch (e) {
        console.warn(`Error playing sound: ${name}`, e);
    }
}

// Create a particle effect
function createParticleEffect(position, color) {
    const particleCount = 30;
    const particleGeometry = new THREE.BufferGeometry();
    const particlesMaterial = new THREE.PointsMaterial({
        color: color,
        size: 0.2,
        transparent: true,
        opacity: 1
    });
    
    const particlePositions = [];
    
    for (let i = 0; i < particleCount; i++) {
        // Start all particles at the player's position
        particlePositions.push(
            position.x,
            position.y,
            position.z
        );
    }
    
    particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
    
    const particles = new THREE.Points(particleGeometry, particlesMaterial);
    scene.add(particles);
    
    // Store velocities for each particle
    const velocities = [];
    for (let i = 0; i < particleCount; i++) {
        velocities.push({
            x: (Math.random() - 0.5) * 0.2,
            y: Math.random() * 0.2,
            z: (Math.random() - 0.5) * 0.2
        });
    }
    
    // Animate the particles
    const animateParticles = () => {
        if (!gameRunning) {
            scene.remove(particles);
            return;
        }
        
        const positions = particleGeometry.attributes.position.array;
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] += velocities[i].x;
            positions[i3 + 1] += velocities[i].y;
            positions[i3 + 2] += velocities[i].z;
        }
        
        particleGeometry.attributes.position.needsUpdate = true;
        particlesMaterial.opacity -= 0.02;
        
        if (particlesMaterial.opacity <= 0) {
            scene.remove(particles);
        } else {
            requestAnimationFrame(animateParticles);
        }
    };
    
    animateParticles();
}

// Update word display with found letters
function updateWordDisplay() {
    const letterBoxes = wordContainer.querySelectorAll(".letter-box");
    
    for (let i = 0; i < currentWord.length; i++) {
        const currentLetter = currentWord[i];
        if (foundLetters.includes(currentLetter)) {
            letterBoxes[i].textContent = currentLetter;
            letterBoxes[i].classList.add("filled");
        } else {
            letterBoxes[i].textContent = "";
            letterBoxes[i].classList.remove("filled");
        }
    }
}

// Update score display
function updateScoreDisplay() {
    // Update game UI scores
    document.querySelector("#player-red span").textContent = playerScores.red;
    document.querySelector("#player-blue span").textContent = playerScores.blue;
    document.querySelector("#player-gold span").textContent = playerScores.gold;
    
    // Update store scores if they exist
    const storeRed = document.getElementById("store-red");
    const storeBlue = document.getElementById("store-blue");
    const storeGold = document.getElementById("store-gold");
    
    if (storeRed) storeRed.textContent = playerScores.red;
    if (storeBlue) storeBlue.textContent = playerScores.blue;
    if (storeGold) storeGold.textContent = playerScores.gold;
}

// Show floating text for score changes
function showFloatingText(text, position, color, playerColor) {
    // Create a canvas texture for the text
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 256;
    
    // Get the player's color in hex format
    let playerColorHex;
    switch(playerColor) {
        case 'red':
            playerColorHex = '#FF3232';
            break;
        case 'blue':
            playerColorHex = '#3232FF';
            break;
        case 'gold':
            playerColorHex = '#FFD700';
            break;
        default:
            playerColorHex = '#FFFFFF';
    }
    
    // Use a neutral color gradient for the background
    const gradient = context.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 4
    );
    
    // Check if it's a score increase or decrease
    const isPositive = text.includes('+');
    
    gradient.addColorStop(0, isPositive ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.7)');
    gradient.addColorStop(1, isPositive ? 'rgba(255, 255, 255, 0)' : 'rgba(255, 255, 255, 0)');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw text with outline for better visibility
    context.font = 'bold 120px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    // Draw text outline
    context.strokeStyle = 'black';
    context.lineWidth = 8;
    context.strokeText(text, canvas.width / 2, canvas.height / 2);
    
    // Draw text - use player's color
    context.fillStyle = playerColorHex;
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    // Create texture and sprite
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true,
        opacity: 1,
        depthTest: false,  // Make sure text renders on top
        depthWrite: false  // Make sure text renders on top
    });
    
    const sprite = new THREE.Sprite(material);
    sprite.position.set(position.x, position.y + 1.5, position.z);
    sprite.scale.set(2, 2, 1);  // Make it larger
    scene.add(sprite);
    
    // Make it face the camera
    sprite.lookAt(camera.position);
    
    // Animate the text floating up and fading out
    let elapsed = 0;
    const duration = 2; // seconds
    
    const animate = () => {
        if (!gameRunning) {
            scene.remove(sprite);
            return;
        }
        
        elapsed += 0.02;
        const progress = elapsed / duration;
        
        // Move upward
        sprite.position.y += 0.03;
        
        // Make it face the camera constantly
        sprite.lookAt(camera.position);
        
        // Fade out near the end of the animation
        if (progress > 0.7) {
            material.opacity = 1 - ((progress - 0.7) / 0.3);
        }
        
        if (progress >= 1) {
            scene.remove(sprite);
        } else {
            requestAnimationFrame(animate);
        }
    };
    
    animate();
    
    // Also update the UI score display with a flash effect
    if (playerColor) {
        const scoreElement = document.querySelector(`#player-${playerColor} span`);
        if (scoreElement) {
            scoreElement.classList.add('score-flash');
            setTimeout(() => {
                scoreElement.classList.remove('score-flash');
            }, 500);
        }
    }
}

// Main game loop
function gameLoop() {
    if (!gameRunning) return;
    
    // Update player positions
    updatePlayers();
    
    // Update trail particles
    updateTrails();
    
    // Update letter meshes
    animateLetters();
    
    // Check collisions
    checkCollisions();
    
    // Update planetary objects if any
    const planet = scene.children.find(child => child.name === "planet");
    if (planet && planet.userData.rotationSpeed) {
        planet.rotation.y += planet.userData.rotationSpeed;
    }
    
    // Update Sun's layers if they exist
    const sunCore = scene.children.find(child => child.name === "sunCore");
    const sunSurface = scene.children.find(child => child.name === "sunSurface");
    const corona = scene.children.find(child => child.name === "corona");
    
    if (sunCore && sunCore.userData.rotationSpeed) {
        sunCore.rotation.y += sunCore.userData.rotationSpeed;
    }
    if (sunSurface && sunSurface.userData.rotationSpeed) {
        sunSurface.rotation.y += sunSurface.userData.rotationSpeed;
    }
    if (corona && corona.userData.rotationSpeed) {
        corona.rotation.y += corona.userData.rotationSpeed;
    }
    
    // Render the scene
    renderer.render(scene, camera);
    
    // Continue the game loop
    requestAnimationFrame(gameLoop);
}

// Handle window resize
function onWindowResize() {
    // Get the current dimensions of the container
    const width = canvasContainer.clientWidth;
    const height = canvasContainer.clientHeight;
    
    // Update camera aspect ratio
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    // Resize renderer
    renderer.setSize(width, height);
}

// Add window resize event listener
window.addEventListener('resize', onWindowResize);

// Create floating particles for the start screen
function createStartScreenParticles() {
    const startScreen = document.getElementById('start-screen');
    const particleCount = 40; // Number of particles
    const colors = ['#5d89ff', '#45aaf2', '#6a5acd', '#9370db', '#ffffff'];
    
    // Remove any existing particles
    document.querySelectorAll('.start-particle').forEach(particle => particle.remove());
    
    // Create new particles
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'start-particle';
        
        // Random position
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        particle.style.left = `${left}%`;
        particle.style.top = `${top}%`;
        
        // Random size (3-12px)
        const size = Math.random() * 9 + 3;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random color
        particle.style.color = colors[Math.floor(Math.random() * colors.length)];
        
        // Add to start screen
        startScreen.appendChild(particle);
        
        // Animate the particle
        animateStartParticle(particle);
    }
}

// Animate a single start screen particle
function animateStartParticle(particle) {
    // Random starting position
    let x = parseFloat(particle.style.left);
    let y = parseFloat(particle.style.top);
    
    // Random velocity (-0.05 to 0.05 percent per frame)
    const vx = (Math.random() - 0.5) * 0.1;
    const vy = (Math.random() - 0.5) * 0.1;
    
    // Set random pulse animation duration
    const pulseSpeed = Math.random() * 3 + 2; // 2-5 seconds
    particle.style.animation = `pulse ${pulseSpeed}s infinite alternate`;
    
    // Animation function
    function move() {
        if (!document.body.contains(particle)) return;
        
        // Update position
        x += vx;
        y += vy;
        
        // Wrap around edges
        if (x < -5) x = 105;
        if (x > 105) x = -5;
        if (y < -5) y = 105;
        if (y > 105) y = -5;
        
        // Apply position
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        
        // Continue animation
        requestAnimationFrame(move);
    }
    
    // Start animation
    move();
}

// Check if a level is unlocked
function isLevelUnlocked(levelNumber) {
    // Level 1 is always unlocked
    if (levelNumber === 1) return true;
    
    // A level is only unlocked if the IMMEDIATELY previous level has been completed
    if (levelNumber > 1) {
        // This ensures ONLY the next level is unlocked after completing the previous one
        return completedLevels.includes(levelNumber - 1);
    }
    
    return false;
}

// Mark a level as completed
function markLevelCompleted(levelNumber) {
    if (!completedLevels.includes(levelNumber)) {
        completedLevels.push(levelNumber);
        // Save completed levels to localStorage for persistence across game sessions
        localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
        console.log(`Level ${levelNumber} marked as completed. Unlocking level ${levelNumber + 1}`);
    }
}

// Load saved game progress
function loadGameProgress() {
    try {
        const savedLevels = localStorage.getItem('completedLevels');
        if (savedLevels) {
            completedLevels = JSON.parse(savedLevels);
            console.log('Loaded completed levels:', completedLevels);
        } else {
            // Reset completedLevels to ensure only level 1 is available on first load
            completedLevels = [];
            console.log('No saved progress found. Only Sun level is unlocked.');
        }
    } catch (error) {
        console.error('Error loading game progress:', error);
        completedLevels = [];
        // Clear potentially corrupted data
        localStorage.removeItem('completedLevels');
    }
}

// Initialize the game when the page loads
window.addEventListener("load", init); 

// Update the scene background based on the current level
function updateLevelBackground(levelNumber) {
    console.log("Updating background for level:", levelNumber);
    
    // If no scene, return early
    if (!scene) {
        console.error("Cannot update background: Scene not initialized");
        return;
    }
    
    // Remove existing planetary objects
    const existingPlanets = scene.children.filter(child => child.name === "planet" || child.name === "planetaryObject");
    existingPlanets.forEach(planet => {
        scene.remove(planet);
    });
    
    // Find existing skybox
    const skybox = scene.children.find(child => child.name === "skybox");
    if (skybox) {
        skybox.visible = false; // Hide default skybox for planetary backgrounds
    }
    
    // Find existing stars
    const stars = scene.children.find(child => child.name === "stars");
    if (stars) stars.visible = true; // Keep stars visible for all levels but may adjust visibility later
    
    // Create a planet object based on level
    let planetSize, planetColor, atmosphereColor, planetPos, bgColor;
    
    switch(levelNumber) {
        case 1: // Sun
            planetSize = 25;
            planetColor = 0xff4500;
            atmosphereColor = 0xffd700;
            planetPos = new THREE.Vector3(0, 0, -40);
            bgColor = 0x000006;
            break;
            
        case 2: // Earth
            planetSize = 25;
            planetColor = 0x1a66ff;
            atmosphereColor = 0x4d94ff;
            planetPos = new THREE.Vector3(0, 0, -40);
            bgColor = 0x000006;
            break;
            
        case 3: // Mars
            planetSize = 25;
            planetColor = 0xcc3300;
            atmosphereColor = 0xff6633;
            planetPos = new THREE.Vector3(0, 0, -40);
            bgColor = 0x000006;
            break;
            
        case 4: // Jupiter
            planetSize = 25;
            planetColor = 0xd2b48c;
            atmosphereColor = 0xffd700;
            planetPos = new THREE.Vector3(0, 0, -40);
            bgColor = 0x000006;
            break;
            
        case 5: // Pluto
            planetSize = 25;
            planetColor = 0xcccccc;
            atmosphereColor = 0xe6e6e6;
            planetPos = new THREE.Vector3(0, 0, -40);
            bgColor = 0x000006;
            break;
            
        default:
            console.warn(`Invalid level number: ${levelNumber}`);
            return; // Invalid level
    }
    
    // Update scene background and fog color
    scene.background = new THREE.Color(bgColor);
    scene.fog = new THREE.Fog(bgColor, 15, 40);
    
    console.log(`Creating planet for level ${levelNumber} with size ${planetSize}`);
    
    // Create planet sphere
    const planetGeometry = new THREE.SphereGeometry(planetSize, 64, 64);
    
    let planetMaterial;
    if (levelNumber === 1) { // Sun
        // Create Sun's core
        const sunCoreGeometry = new THREE.SphereGeometry(planetSize, 64, 64);
        const sunCoreMaterial = new THREE.MeshBasicMaterial({
            color: 0xff4500,
            transparent: true,
            opacity: 0.9
        });
        const sunCore = new THREE.Mesh(sunCoreGeometry, sunCoreMaterial);
        sunCore.position.copy(planetPos);
        sunCore.name = "sunCore";
        scene.add(sunCore);
        
        // Create Sun's surface layer with texture
        const sunSurfaceGeometry = new THREE.SphereGeometry(planetSize * 1.02, 64, 64);
        const sunCanvas = document.createElement('canvas');
        sunCanvas.width = 2048;
        sunCanvas.height = 1024;
        const ctx = sunCanvas.getContext('2d');
        
        // Create detailed surface texture
        const gradient = ctx.createRadialGradient(
            sunCanvas.width/2, sunCanvas.height/2, 0,
            sunCanvas.width/2, sunCanvas.height/2, sunCanvas.width/2
        );
        gradient.addColorStop(0, '#ff4500');    // Core
        gradient.addColorStop(0.3, '#ff6b00');  // Inner surface
        gradient.addColorStop(0.6, '#ff8c00');  // Middle surface
        gradient.addColorStop(1, '#ffa500');    // Outer surface
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, sunCanvas.width, sunCanvas.height);
        
        // Add sunspots and granulation
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * sunCanvas.width;
            const y = Math.random() * sunCanvas.height;
            const size = 20 + Math.random() * 40;
            
            // Sunspots
            ctx.fillStyle = '#8B0000';
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
            
            // Granulation
            ctx.fillStyle = '#ff6b00';
            for (let j = 0; j < 5; j++) {
                const gx = x + (Math.random() - 0.5) * size;
                const gy = y + (Math.random() - 0.5) * size;
                const gsize = 5 + Math.random() * 10;
                ctx.beginPath();
                ctx.arc(gx, gy, gsize, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        const sunTexture = new THREE.CanvasTexture(sunCanvas);
        const sunSurfaceMaterial = new THREE.MeshBasicMaterial({
            map: sunTexture,
            transparent: true,
            opacity: 0.95
        });
        
        const sunSurface = new THREE.Mesh(sunSurfaceGeometry, sunSurfaceMaterial);
        sunSurface.position.copy(planetPos);
        sunSurface.name = "sunSurface";
        scene.add(sunSurface);
        
        // Create corona layer
        const coronaGeometry = new THREE.SphereGeometry(planetSize * 1.1, 64, 64);
        const coronaMaterial = new THREE.MeshBasicMaterial({
            color: 0xffd700,
            transparent: true,
            opacity: 0.3
        });
        const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
        corona.position.copy(planetPos);
        corona.name = "corona";
        scene.add(corona);
        
        // Add solar flares
        const flareGeometry = new THREE.ConeGeometry(planetSize * 0.2, planetSize * 0.5, 32);
        const flareMaterial = new THREE.MeshBasicMaterial({
            color: 0xff4500,
            transparent: true,
            opacity: 0.6
        });
        
        for (let i = 0; i < 8; i++) {
            const flare = new THREE.Mesh(flareGeometry, flareMaterial);
            const angle = (i / 8) * Math.PI * 2;
            flare.position.set(
                planetPos.x + Math.cos(angle) * planetSize * 0.8,
                planetPos.y + Math.sin(angle) * planetSize * 0.8,
                planetPos.z
            );
            flare.rotation.z = angle;
            flare.name = "solarFlare";
            scene.add(flare);
        }
        
        // Add point lights for dynamic lighting
        const coreLight = new THREE.PointLight(0xff4500, 2, 50);
        coreLight.position.copy(planetPos);
        scene.add(coreLight);
        
        const coronaLight = new THREE.PointLight(0xffd700, 1, 30);
        coronaLight.position.copy(planetPos);
        scene.add(coronaLight);
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        scene.add(ambientLight);
        
        // Add rotation animation
        sunCore.userData = { rotationSpeed: 0.001 };
        sunSurface.userData = { rotationSpeed: 0.0008 };
        corona.userData = { rotationSpeed: 0.0006 };
        
        return; // Early return for Sun as it's handled differently
    } else if (levelNumber === 2) { // Earth
        // Create Earth with blue oceans and green landmasses
        const earthCanvas = document.createElement('canvas');
        earthCanvas.width = 1024;
        earthCanvas.height = 512;
        const ctx = earthCanvas.getContext('2d');
        
        // Fill the background with deep blue (oceans)
        const gradient = ctx.createLinearGradient(0, 0, 0, earthCanvas.height);
        gradient.addColorStop(0, '#0a3b8c'); // Deeper blue at poles
        gradient.addColorStop(0.5, '#1a66ff'); // Blue at equator
        gradient.addColorStop(1, '#0a3b8c'); // Deeper blue at poles
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, earthCanvas.width, earthCanvas.height);
        
        // Draw green continents (more detailed)
        // North America
        ctx.fillStyle = '#2d862d';
        ctx.beginPath();
        ctx.moveTo(200, 150);
        ctx.lineTo(280, 120);
        ctx.lineTo(320, 180);
        ctx.lineTo(300, 200);
        ctx.lineTo(340, 240);
        ctx.lineTo(280, 280);
        ctx.lineTo(240, 260);
        ctx.lineTo(220, 220);
        ctx.closePath();
        ctx.fill();
        
        // Add brown mountain ranges
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.moveTo(240, 180);
        ctx.lineTo(250, 210);
        ctx.lineTo(230, 230);
        ctx.closePath();
        ctx.fill();
        
        // South America
        ctx.fillStyle = '#227722';
        ctx.beginPath();
        ctx.moveTo(320, 250);
        ctx.lineTo(340, 280);
        ctx.lineTo(350, 350);
        ctx.lineTo(330, 380);
        ctx.lineTo(300, 400);
        ctx.lineTo(280, 350);
        ctx.lineTo(290, 300);
        ctx.closePath();
        ctx.fill();
        
        // Add Amazon rainforest (darker green)
        ctx.fillStyle = '#0c5c0c';
        ctx.beginPath();
        ctx.moveTo(310, 280);
        ctx.lineTo(330, 310);
        ctx.lineTo(320, 350);
        ctx.lineTo(300, 330);
        ctx.closePath();
        ctx.fill();
        
        // Europe
        ctx.fillStyle = '#2d862d';
        ctx.beginPath();
        ctx.moveTo(500, 150);
        ctx.lineTo(530, 140);
        ctx.lineTo(550, 170);
        ctx.lineTo(530, 200);
        ctx.lineTo(510, 190);
        ctx.closePath();
        ctx.fill();
        
        // Africa
        ctx.fillStyle = '#7d9331'; // olive green for savanna
        ctx.beginPath();
        ctx.moveTo(500, 200);
        ctx.lineTo(550, 220);
        ctx.lineTo(560, 300);
        ctx.lineTo(520, 350);
        ctx.lineTo(490, 330);
        ctx.lineTo(480, 250);
        ctx.closePath();
        ctx.fill();
        
        // Add Sahara desert (tan)
        ctx.fillStyle = '#c2b280';
        ctx.beginPath();
        ctx.moveTo(490, 220);
        ctx.lineTo(540, 230);
        ctx.lineTo(530, 270);
        ctx.lineTo(500, 260);
        ctx.closePath();
        ctx.fill();
        
        // Asia
        ctx.fillStyle = '#2d862d';
        ctx.beginPath();
        ctx.moveTo(550, 140);
        ctx.lineTo(650, 130);
        ctx.lineTo(700, 150);
        ctx.lineTo(750, 180);
        ctx.lineTo(730, 240);
        ctx.lineTo(670, 250);
        ctx.lineTo(630, 220);
        ctx.lineTo(570, 180);
        ctx.closePath();
        ctx.fill();
        
        // Add Himalayan mountains (brown)
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.moveTo(620, 200);
        ctx.lineTo(660, 210);
        ctx.lineTo(640, 230);
        ctx.lineTo(610, 220);
        ctx.closePath();
        ctx.fill();
        
        // Australia
        ctx.fillStyle = '#b36b00'; // reddish for outback
        ctx.beginPath();
        ctx.moveTo(700, 350);
        ctx.lineTo(760, 340);
        ctx.lineTo(770, 380);
        ctx.lineTo(740, 410);
        ctx.lineTo(710, 390);
        ctx.closePath();
        ctx.fill();
        
        // Add greener coastal areas
        ctx.fillStyle = '#2d862d';
        ctx.beginPath();
        ctx.arc(710, 350, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(760, 380, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Add white for polar ice caps
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(512, 30, 120, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(512, 482, 120, 0, Math.PI * 2);
        ctx.fill();
        
        // Add some cloud patterns with variation
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * earthCanvas.width;
            const y = 100 + Math.random() * 312; // Keep clouds away from poles
            const size = 15 + Math.random() * 40;
            const opacity = 0.6 + Math.random() * 0.4;
            
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            
            // Create cloud clusters
            for (let j = 0; j < 3 + Math.floor(Math.random() * 3); j++) {
                const offsetX = (Math.random() - 0.5) * 30;
                const offsetY = (Math.random() - 0.5) * 20;
                const cloudSize = size * (0.7 + Math.random() * 0.6);
                
                ctx.beginPath();
                ctx.arc(x + offsetX, y + offsetY, cloudSize, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        const texture = new THREE.CanvasTexture(earthCanvas);
        planetMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: false,
            opacity: 1.0
        });
    } else if (levelNumber === 3) { // Mars
        // Create Mars with red surface, craters, and polar caps
        const marsCanvas = document.createElement('canvas');
        marsCanvas.width = 1024;
        marsCanvas.height = 512;
        const ctx = marsCanvas.getContext('2d');
        
        // Fill the background with varied rust red (Mars surface)
        const gradient = ctx.createRadialGradient(
            marsCanvas.width/2, marsCanvas.height/2, 50,
            marsCanvas.width/2, marsCanvas.height/2, marsCanvas.width/2
        );
        gradient.addColorStop(0, '#d94e16'); // Brighter center
        gradient.addColorStop(0.6, '#b73000'); // Standard rust
        gradient.addColorStop(1, '#8b2500'); // Darker edges
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, marsCanvas.width, marsCanvas.height);
        
        // Add darker areas (maria)
        ctx.fillStyle = '#681a00';
        for (let i = 0; i < 12; i++) {
            const x = Math.random() * marsCanvas.width;
            const y = Math.random() * marsCanvas.height;
            const size = 40 + Math.random() * 100;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Add Valles Marineris (Grand Canyon of Mars)
        ctx.fillStyle = '#541400';
        ctx.beginPath();
        ctx.moveTo(400, 240);
        ctx.lineTo(700, 230);
        ctx.lineTo(680, 270);
        ctx.lineTo(420, 280);
        ctx.closePath();
        ctx.fill();
        
        // Add Olympus Mons (largest volcano)
        const centerX = 300;
        const centerY = 240;
        // Create gradient for the volcano
        const volcanoGradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, 80
        );
        volcanoGradient.addColorStop(0, '#ff6600'); // Bright at center
        volcanoGradient.addColorStop(0.3, '#cc3300'); // Mid red
        volcanoGradient.addColorStop(1, '#8b2500'); // Dark at edges
        
        // Draw the volcano base
        ctx.fillStyle = volcanoGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw the caldera (crater at top)
        ctx.fillStyle = '#3d0e00';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 25, 0, Math.PI * 2);
        ctx.fill();
        
        // Add craters
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * marsCanvas.width;
            const y = Math.random() * marsCanvas.height;
            const size = 5 + Math.random() * 30;
            
            // Crater rim (lighter)
            ctx.fillStyle = '#ff6600';
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
            
            // Crater interior (darker)
            ctx.fillStyle = '#3d0e00';
            ctx.beginPath();
            ctx.arc(x, y, size * 0.7, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Add white for polar ice caps
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(512, 30, 80, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(512, 482, 80, 0, Math.PI * 2);
        ctx.fill();
        
        // Add surface dust storms
        ctx.fillStyle = 'rgba(255, 153, 102, 0.3)';
        for (let i = 0; i < 5; i++) {
            const x = Math.random() * marsCanvas.width;
            const y = 100 + Math.random() * 312;
            const size = 40 + Math.random() * 100;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        const texture = new THREE.CanvasTexture(marsCanvas);
        planetMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: false,
            opacity: 1.0
        });
    } else if (levelNumber === 4) { // Jupiter
        // Create Jupiter with banded appearance
        const jupiterCanvas = document.createElement('canvas');
        jupiterCanvas.width = 1024;
        jupiterCanvas.height = 512;
        const ctx = jupiterCanvas.getContext('2d');
        
        // Create the bands
        const bands = [
            { color: '#ead2ac', width: 30 },  // Beige
            { color: '#eaba6b', width: 40 },  // Darker beige
            { color: '#eae0cc', width: 25 },  // Light beige
            { color: '#f3d3bd', width: 35 },  // Medium beige
            { color: '#e68b64', width: 45 },  // Gold
            { color: '#eaba6b', width: 30 },  // Darker beige
            { color: '#eae0cc', width: 50 },  // Light beige
            { color: '#f3d3bd', width: 20 },  // Medium beige
            { color: '#f0c987', width: 35 },  // Yellow
            { color: '#ead2ac', width: 40 },  // Beige
            { color: '#e27658', width: 30 },  // Amber
            { color: '#eaba6b', width: 45 },  // Darker beige
            { color: '#e68b64', width: 25 },  // Gold
            { color: '#f3d3bd', width: 40 }   // Medium beige
        ];
        
        let y = 0;
        for (const band of bands) {
            ctx.fillStyle = band.color;
            ctx.fillRect(0, y, jupiterCanvas.width, band.width);
            y += band.width;
            
            // If we've gone past the canvas height, stop
            if (y > jupiterCanvas.height) break;
        }
        
        // Add the Great Red Spot
        ctx.fillStyle = '#cc0000';
        ctx.beginPath();
        ctx.ellipse(300, 250, 100, 50, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Add some turbulence/swirls
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * jupiterCanvas.width;
            const y = Math.random() * jupiterCanvas.height;
            const size = 10 + Math.random() * 30;
            
            // Get a color slightly darker than the band
            const bandIndex = Math.floor(y / jupiterCanvas.height * bands.length);
            if (bandIndex < bands.length) {
                // Create a darker shade of the band color
                ctx.fillStyle = bands[bandIndex].color + '99'; // Add transparency
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        const texture = new THREE.CanvasTexture(jupiterCanvas);
        planetMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: false,
            opacity: 1.0
        });
    } else if (levelNumber === 5) { // Pluto
        // Create Pluto with its distinctive heart feature and more detailed terrain
        const plutoCanvas = document.createElement('canvas');
        plutoCanvas.width = 1024;
        plutoCanvas.height = 512;
        const ctx = plutoCanvas.getContext('2d');
        
        // Create a more interesting base texture with varied coloration
        // Pluto has a mix of reddish-brown, gray, and white areas
        const gradient = ctx.createRadialGradient(
            plutoCanvas.width/2, plutoCanvas.height/2, 50,
            plutoCanvas.width/2, plutoCanvas.height/2, plutoCanvas.width/2
        );
        gradient.addColorStop(0, '#a0a0a0'); // Light gray center
        gradient.addColorStop(0.4, '#808080'); // Medium gray
        gradient.addColorStop(0.7, '#706060'); // Slight reddish-gray
        gradient.addColorStop(1, '#605050');   // Darker reddish-gray
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, plutoCanvas.width, plutoCanvas.height);
        
        // Add crater-like textures across the surface
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * plutoCanvas.width;
            const y = Math.random() * plutoCanvas.height;
            const size = 10 + Math.random() * 40;
            
            // Create crater rim (slightly lighter)
            ctx.fillStyle = '#909090';
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
            
            // Create crater interior (darker)
            ctx.fillStyle = '#505050';
            ctx.beginPath();
            ctx.arc(x, y, size * 0.8, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Add dark "whale" region (Cthulhu Macula) - the large dark area
        ctx.fillStyle = '#3a3a3a';
        ctx.beginPath();
        ctx.ellipse(200, 250, 180, 140, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Add texture to the dark region
        ctx.fillStyle = '#303030';
        for (let i = 0; i < 15; i++) {
            const x = 150 + Math.random() * 200;
            const y = 200 + Math.random() * 100;
            const size = 10 + Math.random() * 25;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Add distinctive reddish-brown regions (tholin-rich areas)
        ctx.fillStyle = 'rgba(139, 69, 19, 0.6)';
        for (let i = 0; i < 3; i++) {
            const x = 200 + Math.random() * 600;
            const y = 100 + Math.random() * 300;
            const radiusX = 50 + Math.random() * 80;
            const radiusY = 40 + Math.random() * 70;
            ctx.beginPath();
            ctx.ellipse(x, y, radiusX, radiusY, Math.random() * Math.PI, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Create the "Sputnik Planitia" (heart feature) with more detail
        
        // First, create the basic heart shape with a brighter white
        ctx.fillStyle = '#ffffff';
        
        // Left lobe (Al-Idrisi Montes)
        ctx.beginPath();
        ctx.arc(450, 250, 100, 0, Math.PI * 2);
        ctx.fill();
        
        // Right lobe (Tartarus Dorsa)
        ctx.beginPath();
        ctx.arc(580, 250, 100, 0, Math.PI * 2);
        ctx.fill();
        
        // Connect the lobes
        ctx.beginPath();
        ctx.moveTo(450, 250);
        ctx.lineTo(580, 250);
        ctx.lineTo(580, 370);
        ctx.lineTo(450, 370);
        ctx.closePath();
        ctx.fill();
        
        // Add cellular texture to the heart feature (nitrogen ice plains)
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 2;
        for (let i = 0; i < 40; i++) {
            const x = 400 + Math.random() * 230;
            const y = 200 + Math.random() * 170;
            const size = 15 + Math.random() * 30;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + size, y + size/2);
            ctx.lineTo(x + size/2, y + size);
            ctx.lineTo(x - size/2, y + size/2);
            ctx.closePath();
            ctx.stroke();
        }
        
        // Add mountain ranges along the western edge of the heart (Hillary Montes)
        ctx.fillStyle = '#d0d0d0';
        for (let i = 0; i < 10; i++) {
            const x = 370 + Math.random() * 30;
            const y = 200 + Math.random() * 180;
            const width = 10 + Math.random() * 20;
            const height = 20 + Math.random() * 40;
            
            ctx.beginPath();
            ctx.moveTo(x, y + height);
            ctx.lineTo(x + width/2, y);
            ctx.lineTo(x + width, y + height);
            ctx.closePath();
            ctx.fill();
        }
        
        // Add dark spots in the heart's right lobe (Voyager Terra)
        ctx.fillStyle = '#b0b0b0';
        for (let i = 0; i < 20; i++) {
            const x = 550 + Math.random() * 80;
            const y = 230 + Math.random() * 100;
            const size = 5 + Math.random() * 15;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Add darker pits in the nitrogen ice (sublimation pits)
        ctx.fillStyle = '#c0c0c0';
        for (let i = 0; i < 30; i++) {
            const x = 420 + Math.random() * 180;
            const y = 220 + Math.random() * 130;
            const size = 3 + Math.random() * 8;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Add the "bladed terrain" texture in the eastern regions (Tartarus Dorsa)
        ctx.strokeStyle = '#909090';
        ctx.lineWidth = 1;
        for (let i = 0; i < 20; i++) {
            const x = 650 + Math.random() * 200;
            const y = 150 + Math.random() * 200;
            const length = 20 + Math.random() * 40;
            const angle = Math.random() * Math.PI;
            
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
            ctx.stroke();
        }
        
        const texture = new THREE.CanvasTexture(plutoCanvas);
        planetMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: false,
            opacity: 1.0
        });
    } else {
        // Default material if no specific texture
        planetMaterial = new THREE.MeshBasicMaterial({
            color: planetColor,
            transparent: false,
            opacity: 1.0
        });
    }
    
    // Create the planet
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planet.position.copy(planetPos);
    planet.name = "planet";
    
    // Add lighting for better visibility - more even lighting from multiple directions
    const planetLight = new THREE.PointLight(0xffffff, 1.5, 200);
    planetLight.position.set(planetPos.x + 10, planetPos.y + 10, planetPos.z + 5);
    planetLight.name = "planetLight";
    scene.add(planetLight);
    
    // Add a second light from another direction for more even lighting
    const planetLight2 = new THREE.PointLight(0xffffff, 1.0, 200);
    planetLight2.position.set(planetPos.x - 10, planetPos.y - 5, planetPos.z + 15);
    planetLight2.name = "planetLight2";
    scene.add(planetLight2);
    
    // Add stronger ambient light to improve visibility of planets
    if (!scene.children.find(child => child.name === "ambientLight")) {
        const ambientLight = new THREE.AmbientLight(0x808080, 1.0); // Brighter ambient light
        ambientLight.name = "ambientLight";
        scene.add(ambientLight);
    }
    
    // Adjust planet rotation for better visibility
    planet.rotation.y = Math.PI / 4;
    
    // Add planet to scene
    scene.add(planet);
    
    // Add a simple rotation animation for the planet
    planet.userData.rotationSpeed = 0.001; // Speed of rotation
    
    console.log(`Created planet for level ${levelNumber} at position:`, planetPos);
}

// Save player scores to localStorage
function savePlayerScores() {
    localStorage.setItem('playerScores', JSON.stringify(playerScores));
    console.log('Player scores saved:', playerScores);
}

// Load player scores from localStorage
function loadPlayerScores() {
    const savedScores = localStorage.getItem('playerScores');
    if (savedScores) {
        playerScores = JSON.parse(savedScores);
        console.log('Player scores loaded:', playerScores);
        updateScoreDisplay();
    }
}

// Add this new function to show the store
function showStore() {
    console.log("Showing store screen");
    hideAllScreens();
    
    // Update store scores
    document.getElementById("store-red").textContent = playerScores.red;
    document.getElementById("store-blue").textContent = playerScores.blue;
    document.getElementById("store-gold").textContent = playerScores.gold;
    
    // Update displays
    updateSpeedDisplay();
    updateTrailDisplay();
    
    // Show the store screen
    document.getElementById("store-screen").classList.remove("hidden");
}

// Add this function to update the store display
function updateSpeedDisplay() {
    ['red', 'blue', 'gold'].forEach(color => {
        const currentSpeedEl = document.getElementById(`${color}-current-speed`);
        const nextSpeedEl = document.getElementById(`${color}-next-speed`);
        const upgradeCostEl = document.getElementById(`${color}-upgrade-cost`);
        const upgradesLeftEl = document.getElementById(`${color}-upgrades-left`);
        const upgradeButton = document.getElementById(`${color}-speed-upgrade`);
        
        currentSpeedEl.textContent = playerSpeeds[color].toFixed(2);
        
        const upgradesLeft = 3 - speedUpgrades[color];
        upgradesLeftEl.textContent = upgradesLeft;
        
        if (upgradesLeft > 0) {
            nextSpeedEl.textContent = SPEED_UPGRADE_VALUES[speedUpgrades[color]].toFixed(2);
            upgradeCostEl.textContent = SPEED_UPGRADE_COSTS[speedUpgrades[color]];
            upgradeButton.disabled = playerScores[color] < SPEED_UPGRADE_COSTS[speedUpgrades[color]];
        } else {
            nextSpeedEl.textContent = "MAX";
            upgradeCostEl.textContent = "MAX";
            upgradeButton.disabled = true;
        }
    });
}

// Add this function to handle speed upgrades
function upgradeSpeed(color) {
    console.log(`Attempting to upgrade speed for ${color} agent`);
    
    const currentUpgrades = speedUpgrades[color];
    if (currentUpgrades >= 3) {
        console.log(`${color} agent has reached maximum upgrades`);
        return;
    }
    
    const cost = SPEED_UPGRADE_COSTS[currentUpgrades];
    if (playerScores[color] < cost) {
        console.log(`${color} agent doesn't have enough points for upgrade`);
        return;
    }
    
    // Deduct points
    playerScores[color] -= cost;
    console.log(`Deducted ${cost} points from ${color} agent`);
    
    // Apply upgrade
    playerSpeeds[color] = SPEED_UPGRADE_VALUES[currentUpgrades];
    speedUpgrades[color]++;
    console.log(`Upgraded ${color} agent speed to ${playerSpeeds[color]}`);
    
    // Save changes
    savePlayerScores();
    saveUpgrades();
    
    // Update displays
    updateScoreDisplay();
    updateSpeedDisplay();
    updateTrailDisplay(); // Add this line to update trail buttons
    document.getElementById(`store-${color}`).textContent = playerScores[color];
    
    // Play success sound
    playSound('success', 0.3);
}

// Add this function to handle trail upgrades
function upgradeTrail(color) {
    console.log(`Attempting to upgrade trail for ${color} agent`);
    
    const currentUpgrades = trailUpgrades[color];
    if (currentUpgrades >= 3) {
        console.log(`${color} agent has reached maximum trail upgrades`);
        return;
    }
    
    const upgradeCost = TRAIL_UPGRADE_COSTS[currentUpgrades];
    if (playerScores[color] < upgradeCost) {
        console.log(`${color} agent doesn't have enough points for trail upgrade`);
        return;
    }
    
    // Deduct points and apply upgrade
    playerScores[color] -= upgradeCost;
    trailUpgrades[color]++;
    saveUpgrades();
    savePlayerScores();
    
    console.log(`${color} agent trail upgraded to level ${trailUpgrades[color]}`);
    
    // Update displays
    updateScoreDisplay();
    updateTrailDisplay();
    updateSpeedDisplay();
    document.getElementById(`store-${color}`).textContent = playerScores[color];
    
    // Play success sound
    playSound('success', 0.3);
}

// Add this function to update the trail display
function updateTrailDisplay() {
    ['red', 'blue', 'gold'].forEach(color => {
        const currentTrailEl = document.getElementById(`${color}-current-trail`);
        const nextTrailEl = document.getElementById(`${color}-next-trail`);
        const trailUpgradeCostEl = document.getElementById(`${color}-trail-upgrade-cost`);
        const trailUpgradesLeftEl = document.getElementById(`${color}-trail-upgrades-left`);
        const trailUpgradeButton = document.getElementById(`${color}-trail-upgrade`);
        
        const currentLevel = trailUpgrades[color];
        currentTrailEl.textContent = currentLevel === 0 ? "Basic" : `Level ${currentLevel}`;
        
        const upgradesLeft = 3 - currentLevel;
        trailUpgradesLeftEl.textContent = upgradesLeft;
        
        if (upgradesLeft > 0) {
            nextTrailEl.textContent = `Level ${currentLevel + 1}`;
            trailUpgradeCostEl.textContent = TRAIL_UPGRADE_COSTS[currentLevel];
            trailUpgradeButton.disabled = playerScores[color] < TRAIL_UPGRADE_COSTS[currentLevel];
        } else {
            nextTrailEl.textContent = "MAX";
            trailUpgradeCostEl.textContent = "MAX";
            trailUpgradeButton.disabled = true;
        }
    });
}