// Game constants
const GAME_WIDTH = 1000;
const GAME_HEIGHT = 700;
const PLAYER_SPEED = 0.15;
const GAME_TIME = 30; // seconds
const AGENT_SIZE = 0.5;
const LETTER_SIZE = 0.4;
const WORLD_SIZE = 20; // Size of the 3D space
const FLOOR_SIZE = 30;
const TOTAL_LEVELS = 5; // Total number of themed levels

// Word banks for different space-themed levels
const SPACE_WORDS = [
    { word: "GALAXY", hint: "A vast system of stars, gas, and dust held together by gravity" },
    { word: "NEBULA", hint: "A cloud of gas and dust in outer space" },
    { word: "COMET", hint: "An icy object that releases gas as it orbits the sun" },
    { word: "ASTEROID", hint: "A small rocky body orbiting the sun" },
    { word: "SUPERNOVA", hint: "The explosive death of a star" },
    { word: "SATELLITE", hint: "An object that orbits a planet" },
    { word: "CELESTIAL", hint: "Relating to the sky or outer space" },
    { word: "COSMOS", hint: "The universe seen as a well-ordered whole" },
    { word: "ORBIT", hint: "The curved path of an object around a star or planet" },
    { word: "METEOR", hint: "A small body of matter that enters Earth's atmosphere" }
];

const EARTH_WORDS = [
    { word: "ATMOSPHERE", hint: "The envelope of gases surrounding Earth" },
    { word: "OCEAN", hint: "A vast body of saltwater that covers most of Earth's surface" },
    { word: "CONTINENT", hint: "One of Earth's main landmasses" },
    { word: "EQUATOR", hint: "An imaginary line dividing Earth into northern and southern hemispheres" },
    { word: "MOUNTAIN", hint: "A large natural elevation of Earth's surface" },
    { word: "RAINFOREST", hint: "A dense forest with high annual rainfall" },
    { word: "VOLCANO", hint: "An opening in Earth's crust from which lava erupts" },
    { word: "GLACIER", hint: "A slowly moving mass of ice" },
    { word: "CLIMATE", hint: "The weather conditions of an area over a long period" },
    { word: "BIOSPHERE", hint: "All the areas on Earth where organisms live" }
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
    { word: "PERSEVERANCE", hint: "Recent Mars rover that landed in 2021" }
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
    { word: "ICY", hint: "Pluto's surface is mostly made of this type of material" },
    { word: "HORIZONS", hint: "NASA's New ___ mission explored Pluto in 2015" },
    { word: "TOMBAUGH", hint: "Astronomer who discovered Pluto" },
    { word: "MOUNTAINS", hint: "Pluto has ranges of these made of water ice" },
    { word: "ORBIT", hint: "Pluto's path around the sun is highly eccentric" }
];

// All level word banks
const LEVEL_WORD_BANKS = [
    SPACE_WORDS,    // Level 1: Space
    EARTH_WORDS,    // Level 2: Earth
    MARS_WORDS,     // Level 3: Mars
    JUPITER_WORDS,  // Level 4: Jupiter
    PLUTO_WORDS     // Level 5: Pluto
];

// Level names for UI
const LEVEL_NAMES = [
    "Space",
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
    collect: 'https://assets.mixkit.co/active_storage/sfx/240/240-preview.mp3'     // Generic collection sound
};

// Audio context for sound effects
let audioContext;
const audioBuffers = {};

// Initialize the game
function init() {
    // Check if this is the first load or if a reset is requested
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('reset')) {
        resetAllProgress();
    }
    
    // Load saved game progress first
    loadGameProgress();
    
    // Add event listeners for menu buttons
    document.getElementById("start-btn").addEventListener("click", showLevelSelect);
    document.getElementById("briefing-btn").addEventListener("click", showBriefing);
    document.getElementById("back-to-menu-btn").addEventListener("click", showStartScreen);
    document.getElementById("try-again-btn").addEventListener("click", restartCurrentLevel);
    document.getElementById("next-level-btn").addEventListener("click", showLevelSelect); // Changed from nextLevel to showLevelSelect
    document.getElementById("play-again-btn").addEventListener("click", resetGame);
    document.getElementById("game-over-back-btn").addEventListener("click", showStartScreen);
    document.getElementById("game-complete-back-btn").addEventListener("click", showStartScreen);
    document.getElementById("level-complete-back-btn").addEventListener("click", showStartScreen); // Changed from showLevelSelect to showStartScreen
    
    // Add event listener for reset progress button
    document.getElementById("reset-progress-btn").addEventListener("click", showResetConfirmationModal);
    
    // Add event listeners for confirmation modal buttons
    document.getElementById("confirm-reset-btn").addEventListener("click", performResetProgress);
    document.getElementById("cancel-reset-btn").addEventListener("click", hideResetConfirmationModal);
    
    // Add keyboard event listeners
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    
    // Show the start screen
    showStartScreen();

    // Initialize sound system
    initSoundSystem();
    
    // Add start screen particles
    createStartScreenParticles();
    
    console.log("Game initialized");
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
        notification.textContent = "Progress has been reset. Only Space level is now available.";
        document.body.appendChild(notification);
        
        // Remove the notification after a few seconds
        setTimeout(() => {
            notification.classList.add("notification-hidden");
            setTimeout(() => notification.remove(), 500);
        }, 3000);
        
        // Redirect to start screen
        showStartScreen();
    }, 300);
}

// Reset all game progress
function resetAllProgress() {
    console.log("Resetting all game progress");
    localStorage.removeItem('completedLevels');
    completedLevels = [];
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
        title.textContent = "Select Mission";
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
                // Add lock icon
                const lockIcon = document.createElement("span");
                lockIcon.className = "lock-icon";
                lockIcon.innerHTML = "🔒";
                levelButton.appendChild(lockIcon);
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
            
            // Reset button
            levelButton.classList.remove("locked");
            levelButton.innerHTML = `${LEVEL_NAMES[i]}`;
            
            // Remove existing event listeners
            const newButton = levelButton.cloneNode(true);
            levelButton.parentNode.replaceChild(newButton, levelButton);
            
            // Add locked class if level is not unlocked
            if (!isLevelUnlocked(levelNumber)) {
                newButton.classList.add("locked");
                // Add lock icon
                const lockIcon = document.createElement("span");
                lockIcon.className = "lock-icon";
                lockIcon.innerHTML = "🔒";
                newButton.appendChild(lockIcon);
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
    
    // Reset game state
    resetGameState();
    
    // Setup the level with the first word (1/5)
    setupLevel(1);
    
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
    playerScores = {
        red: 0,
        blue: 0,
        gold: 0
    };
    
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
    hideAllScreens();
    startScreen.classList.remove("hidden");
    
    // Recreate particle effect for the start screen
    createStartScreenParticles();
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
    
    // Create futuristic floor
    const floorGeometry = new THREE.PlaneGeometry(FLOOR_SIZE, FLOOR_SIZE);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x1a1a3a,
        metalness: 0.5,
        roughness: 0.2
    });
    floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.5;
    scene.add(floor);
    
    // Add grid lines to floor
    const gridHelper = new THREE.GridHelper(FLOOR_SIZE, 20, 0x3333cc, 0x222266);
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
    scene.add(skybox);
}

// Create stars for the background
function createStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true
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
    playerScores = {
        red: 0,
        blue: 0,
        gold: 0
    };
    
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
    
    // Generate letter objects to collect
    generateLetters();
    
    console.log(`Word ${level}/${wordList.length} setup complete.`);
}

// Generate letters to collect
function generateLetters() {
    console.log(`Generating letters for word: ${currentWord}`);
    
    // Get unique letters from the word
    const uniqueLetters = [...new Set(currentWord.split(''))];
    console.log(`Unique letters in word: ${uniqueLetters.join(', ')}`);
    
    // Create correct letters (one instance per unique letter)
    for (let i = 0; i < uniqueLetters.length; i++) {
        const letter = uniqueLetters[i];
        const x = (Math.random() - 0.5) * WORLD_SIZE;
        const z = (Math.random() - 0.5) * WORLD_SIZE;
        
        letterObjects.push({
            letter: letter,
            x: x,
            z: z,
            correct: true
        });
        
        createLetterMesh(letter, x, z, true);
    }
    
    // Add some wrong letters
    const wrongLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
        .filter(l => !currentWord.includes(l));
    
    // Add half as many wrong letters as correct ones
    const wrongLetterCount = Math.floor(uniqueLetters.length / 2);
    
    for (let i = 0; i < wrongLetterCount; i++) {
        const randomIndex = Math.floor(Math.random() * wrongLetters.length);
        const letter = wrongLetters[randomIndex];
        const x = (Math.random() - 0.5) * WORLD_SIZE;
        const z = (Math.random() - 0.5) * WORLD_SIZE;
        
        letterObjects.push({
            letter: letter,
            x: x,
            z: z,
            correct: false
        });
        
        createLetterMesh(letter, x, z, false);
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
    
    // Draw text in bright white for better contrast
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
    // Player Red movement
    if (players.red.input.up) players.red.z -= PLAYER_SPEED;
    if (players.red.input.left) players.red.x -= PLAYER_SPEED;
    if (players.red.input.down) players.red.z += PLAYER_SPEED;
    if (players.red.input.right) players.red.x += PLAYER_SPEED;
    
    // Player Blue movement
    if (players.blue.input.up) players.blue.z -= PLAYER_SPEED;
    if (players.blue.input.left) players.blue.x -= PLAYER_SPEED;
    if (players.blue.input.down) players.blue.z += PLAYER_SPEED;
    if (players.blue.input.right) players.blue.x += PLAYER_SPEED;
    
    // Player Gold movement
    if (players.gold.input.up) players.gold.z -= PLAYER_SPEED;
    if (players.gold.input.left) players.gold.x -= PLAYER_SPEED;
    if (players.gold.input.down) players.gold.z += PLAYER_SPEED;
    if (players.gold.input.right) players.gold.x += PLAYER_SPEED;
    
    // Keep players within bounds
    keepPlayerInBounds(players.red);
    keepPlayerInBounds(players.blue);
    keepPlayerInBounds(players.gold);
    
    // Update player meshes
    playerMeshes.red.position.set(players.red.x, AGENT_SIZE, players.red.z);
    playerMeshes.blue.position.set(players.blue.x, AGENT_SIZE, players.blue.z);
    playerMeshes.gold.position.set(players.gold.x, AGENT_SIZE, players.gold.z);
    
    // Make player labels always face the camera
    Object.values(playerMeshes).forEach(mesh => {
        if (mesh.userData.labelSprite) {
            mesh.userData.labelSprite.lookAt(camera.position);
        }
    });
}

// Keep player within bounds
function keepPlayerInBounds(player) {
    const boundarySize = FLOOR_SIZE / 2 - AGENT_SIZE;
    if (player.x < -boundarySize) player.x = -boundarySize;
    if (player.x > boundarySize) player.x = boundarySize;
    if (player.z < -boundarySize) player.z = -boundarySize;
    if (player.z > boundarySize) player.z = boundarySize;
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
    document.querySelector("#player-red span").textContent = playerScores.red;
    document.querySelector("#player-blue span").textContent = playerScores.blue;
    document.querySelector("#player-gold span").textContent = playerScores.gold;
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
    
    updatePlayers();
    animateLetters();
    checkCollisions();
    
    renderer.render(scene, camera);
    
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
            console.log('No saved progress found. Only Space level is unlocked.');
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