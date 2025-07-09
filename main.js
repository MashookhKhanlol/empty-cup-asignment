// Basic Three.js setup
const container = document.getElementById('container');
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 40, 120);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x111111);
container.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);
const sunLight = new THREE.PointLight(0xffffff, 2, 0, 2);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

// Sun
const sunGeometry = new THREE.SphereGeometry(8, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFDB813 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Planet data: name, color, size, distance from Sun, orbital speed (radians/sec)
const planetData = [
  { name: 'Mercury', color: 0xb1b1b1, size: 1.2, distance: 14, speed: 0.034 },
  { name: 'Venus',   color: 0xeccc9a, size: 2.1, distance: 18, speed: 0.027 },
  { name: 'Earth',   color: 0x2a6bd6, size: 2.2, distance: 23, speed: 0.022 },
  { name: 'Mars',    color: 0xb55327, size: 1.7, distance: 28, speed: 0.018 },
  { name: 'Jupiter', color: 0xe0c38a, size: 4.5, distance: 36, speed: 0.012 },
  { name: 'Saturn',  color: 0xf7e7b6, size: 3.8, distance: 44, speed: 0.009 },
  { name: 'Uranus',  color: 0x7ad6e3, size: 3.2, distance: 51, speed: 0.006 },
  { name: 'Neptune', color: 0x4062b3, size: 3.1, distance: 58, speed: 0.005 }
];

// Store planet meshes and their orbital angles
const planets = [];
const planetAngles = [];

planetData.forEach((planet, i) => {
  const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: planet.color });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  planets.push(mesh);
  planetAngles.push(Math.random() * Math.PI * 2); // random start angle
});

// --- Speed Control Panel ---
const planetControlsDiv = document.getElementById('planet-controls');

planetData.forEach((planet, i) => {
  const wrapper = document.createElement('div');
  wrapper.style.marginBottom = '10px';
  const label = document.createElement('label');
  label.innerText = `${planet.name}: `;
  label.htmlFor = `speed-${i}`;
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = 0.001;
  slider.max = 0.07;
  slider.step = 0.001;
  slider.value = planet.speed;
  slider.id = `speed-${i}`;
  slider.style.width = '100px';
  const valueSpan = document.createElement('span');
  valueSpan.innerText = planet.speed;
  valueSpan.style.marginLeft = '8px';

  slider.addEventListener('input', (e) => {
    planetData[i].speed = parseFloat(slider.value);
    valueSpan.innerText = slider.value;
  });

  wrapper.appendChild(label);
  wrapper.appendChild(slider);
  wrapper.appendChild(valueSpan);
  planetControlsDiv.appendChild(wrapper);
});

const clock = new THREE.Clock();

// --- Pause/Resume Animation ---
let isPaused = false;
const pauseBtn = document.getElementById('pause-btn');
pauseBtn.addEventListener('click', () => {
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
});

// --- Dark/Light Mode Toggle ---
let isDark = true;
const themeToggle = document.getElementById('theme-toggle');
function setTheme(dark) {
  isDark = dark;
  document.body.style.background = dark ? '#111' : '#f4f4f4';
  document.body.style.color = dark ? '#fff' : '#222';
  renderer.setClearColor(dark ? 0x111111 : 0xf4f4f4);
  themeToggle.textContent = dark ? 'Light Mode' : 'Dark Mode';
}
themeToggle.addEventListener('click', () => setTheme(!isDark));
setTheme(true);

// --- Background Stars ---
function addStars(numStars = 400) {
  const starGeometry = new THREE.BufferGeometry();
  const starVertices = [];
  for (let i = 0; i < numStars; i++) {
    const x = (Math.random() - 0.5) * 800;
    const y = (Math.random() - 0.5) * 800;
    const z = (Math.random() - 0.5) * 800;
    starVertices.push(x, y, z);
  }
  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1 });
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
}
addStars();

// --- Planet Labels/Tooltips ---
const tooltip = document.getElementById('tooltip');
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredPlanetIdx = null;

function onPointerMove(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}
window.addEventListener('pointermove', onPointerMove);

function updateTooltip() {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(planets);
  if (intersects.length > 0) {
    const idx = planets.indexOf(intersects[0].object);
    if (idx !== -1) {
      hoveredPlanetIdx = idx;
      tooltip.style.display = 'block';
      tooltip.textContent = planetData[idx].name;
      tooltip.style.left = (window.event.clientX + 12) + 'px';
      tooltip.style.top = (window.event.clientY - 10) + 'px';
      return;
    }
  }
  hoveredPlanetIdx = null;
  tooltip.style.display = 'none';
}

// --- Camera Zoom/Focus on Planet Click ---
let cameraTarget = null;
let cameraLerpAlpha = 0;
renderer.domElement.addEventListener('click', (event) => {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(planets);
  if (intersects.length > 0) {
    const idx = planets.indexOf(intersects[0].object);
    if (idx !== -1) {
      // Focus camera on planet
      cameraTarget = {
        position: new THREE.Vector3(
          planets[idx].position.x,
          10,
          planets[idx].position.z + 10
        ),
        lookAt: planets[idx].position.clone()
      };
      cameraLerpAlpha = 0;
    }
  }
});

// Responsive resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  if (!isPaused) {
    const delta = clock.getDelta();
    // Animate planet orbits
    planets.forEach((mesh, i) => {
      planetAngles[i] += planetData[i].speed * delta;
      const angle = planetAngles[i];
      const dist = planetData[i].distance;
      mesh.position.set(
        Math.cos(angle) * dist,
        0,
        Math.sin(angle) * dist
      );
      // Optional: planet self-rotation
      mesh.rotation.y += 0.02;
    });
  }

  // Camera smooth zoom/focus
  if (cameraTarget) {
    cameraLerpAlpha += 0.04;
    camera.position.lerp(cameraTarget.position, cameraLerpAlpha);
    camera.lookAt(cameraTarget.lookAt);
    if (cameraLerpAlpha >= 1) cameraTarget = null;
  }

  updateTooltip();
  renderer.render(scene, camera);
}
animate(); 