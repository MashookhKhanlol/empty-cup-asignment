# 3D Solar System Simulation

This project is a mobile-responsive, interactive 3D simulation of the solar system built with [Three.js](https://threejs.org/). It features the Sun and all 8 planets, each orbiting with realistic motion, and includes a variety of interactive controls and visual enhancements.

## Features
- **3D Solar System**: Sun at the center, 8 planets orbiting with realistic speeds and distances.
- **Realistic Earth**: Earth uses a real texture, other planets use colored spheres.
- **Speed Controls**: Adjust the orbital speed of each planet in real time using sliders.
- **Pause/Resume**: Pause or resume the animation with a button.
- **Dark/Light Mode**: Toggle between dark and light backgrounds.
- **Top View & Reset View**: Instantly switch to a top-down view or return to the default camera angle.
- **Camera Focus**: Click a planet to smoothly zoom in and focus on it.
- **Background Stars**: Realistic star field for a space effect.
- **Planet Tooltips**: Hover over a planet to see its name.
- **Mobile Responsive**: Works on all modern browsers and devices.

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari, etc.)
- (Optional) [VS Code Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) or Python/Node.js for running a local server

### Running Locally
1. **Clone or Download** this repository to your computer.
2. **Open the project folder** (`EmptyCup Assignment`).
3. **Start a local web server** (recommended):
   - **VS Code Live Server**: Right-click `index.html` and select "Open with Live Server".
   - **Python 3**: Run `python -m http.server 8000` and open [http://localhost:8000/](http://localhost:8000/) in your browser.
   - **Node.js**: Run `npx serve .` and open the provided URL.
4. **Open `index.html` in your browser** if you don't want to use a server (some features may not work due to browser security restrictions).

## Controls & Usage
- **Sliders**: Adjust the orbital speed of each planet.
- **Pause/Resume**: Toggle animation.
- **Dark/Light Mode**: Switch background and UI theme.
- **Top View**: Move camera to a top-down view.
- **Reset View**: Return camera to the default angle.
- **Click a Planet**: Zoom in and focus on that planet.
- **Hover a Planet**: See the planet's name as a tooltip.

## Customization
- To use textures for other planets, update the `main.js` planet creation logic.
- To adjust planet distances, edit the `distance` property in the `planetData` array in `main.js`.

## Credits
- [Three.js](https://threejs.org/) for 3D rendering
- NASA/JPL for Earth texture
- Solar system data from public domain sources

---

Enjoy exploring the solar system! 