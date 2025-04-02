# Word Quest: The Lost Library (3D Edition)

An educational children's game designed for kids ages 5-10 to learn spelling, develop hand-eye coordination, and foster collaboration.

## Game Description

In the year 2142, humanity's last hope lies in reconstructing the lost knowledge of the ancient Library of Alexandria. As members of the Galactic Library Corps, players must collaborate to gather letter fragments and reconstruct critical knowledge before time runs out.

Players control three agents (Red, Blue, and Gold) and work together to collect letters that form the target word displayed at the bottom of the screen. Correct letters add points to the player's score, while incorrect letters subtract points.

## Features

- Full 3D gameplay in a futuristic space environment
- Multiplayer gameplay with 3 players (can be played with 1-3 players)
- 5 progressively challenging levels with different words
- 30-second timer for each level
- Scoring system to track individual contributions
- Futuristic space theme with glowing agents and floating letter orbs
- Particle effects and animations for an immersive experience

## How to Play

1. Open `index.html` in a web browser
2. Click "Start Mission" to begin or "Briefing" to view instructions
3. Use the controls to move your agent and collect letters
4. Complete all five levels to win the game

## Running the Game

### Quick Start
Simply open the `index.html` file in your web browser.

### Using the Development Server
For a better experience, you can run the game using the included Node.js server:

1. Make sure you have [Node.js](https://nodejs.org/) installed
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm start
   ```
4. Open your browser and go to `http://localhost:3000`

For development with auto-reload:
```
npm run dev
```

## Controls

### Agent Red (Player 1)
- W - Move Forward
- A - Move Left
- S - Move Down
- D - Move Right

### Agent Blue (Player 2)
- Up Arrow Key - Move Forward
- Left Arrow Key - Move Left
- Down Arrow Key - Move Down
- Right Arrow Key - Move Right

### Agent Gold (Player 3)
- I - Move Forward
- J - Move Left
- K - Move Down
- L - Move Right

## Technical Details

The game uses the following technologies:
- Three.js for 3D rendering
- HTML5 and CSS3 for UI
- JavaScript for game logic
- Node.js for the optional development server 