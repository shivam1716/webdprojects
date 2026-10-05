# Fruit Ninja: Hand Slash 🍉🥷

A browser-based, hand-controlled Fruit Ninja clone. Play using only your webcam and hand movements!

## Features

- **Real-time Hand Tracking**: Uses MediaPipe Tasks Vision to track your index finger as a blade.
- **Physics & Collisions**: Precise line-segment to circle collision detection for accurate slicing.
- **Progressive Difficulty**: Faster spawn rates as you survive.
- **Combos & Scoring**: Slice multiple fruits quickly for a combo multiplier.
- **Bombs & Lives**: Avoid the bombs! 3 strikes and you're out.
- **Procedural Audio**: Sound effects generated natively via Web Audio API.
- **Privacy First**: All processing runs locally in your browser. No video is uploaded or saved.

## Technologies

- Vanilla JavaScript, HTML5 Canvas, CSS
- Vite (Bundler)
- MediaPipe Tasks Vision (`@mediapipe/tasks-vision`) for ML Hand Tracking
- Web Audio API

## How to Run Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open the game:**
   Navigate to the URL provided by Vite (usually `http://localhost:5173`).

## How to Play

1. **Allow Camera Access**: The game requires your webcam to function.
2. **Move Your Hand**: Hold your hand up to the camera. A glowing trail will follow your index finger.
3. **Slash**: Make fast, sweeping motions across the screen to slice the flying fruits.
4. **Avoid Bombs**: Slicing a black bomb will cost you a life!

## Project Structure

- `index.html`: Main entry point and UI overlays.
- `style.css`: UI styling and layout.
- `src/main.js`: Main game loop and application state.
- `src/hand/HandTracker.js`: MediaPipe initialization and tracking logic.
- `src/game/`: Core game entities (Fruit, Bomb, Particles) and collision math.
- `src/audio/AudioManager.js`: Procedural sound synthesis.
- `src/utils/config.js`: Central game configuration.
