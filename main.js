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

// Responsive resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

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

  renderer.render(scene, camera);
}
animate(); 