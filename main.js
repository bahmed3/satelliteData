class Satellite {
    constructor(name, altitude, velocity, direction) {
        this.name = name;
        this.altitude = altitude;
        this.velocity = velocity;
        this.direction = direction;

        // Initialize Three.js objects for this satellite
        const satelliteGeometry = new THREE.SphereGeometry(0.1, 32, 32);
        const satelliteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.mesh = new THREE.Mesh(satelliteGeometry, satelliteMaterial);

        // Add the mesh to the scene
        scene.add(this.mesh);
    }

    updatePosition(timeDelta) {
        // The below is just an example. You'd typically use real physics calculations.
        const angleDelta = this.velocity * timeDelta;
        const x = this.altitude * Math.cos(angleDelta);
        const y = this.altitude * Math.sin(angleDelta) * Math.cos(this.direction);
        const z = this.altitude * Math.sin(angleDelta) * Math.sin(this.direction);

        this.mesh.position.set(x, y, z);
    }
}


// Initialize scene, camera, and renderer
let earth;
const satellites = [];
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Initialize Earth and Satellite
const earthGeometry = new THREE.SphereGeometry(1, 32, 32);

// Create a new Satellite instance and add to the satellites array
const newSatellite = new Satellite('Neuron X2-4', 1.5, 0.002, 0);
satellites.push(newSatellite);

// Load and apply Earth texture
const textureLoader = new THREE.TextureLoader();
textureLoader.load('./8k_earth_daymap.jpg', function(texture) {
    const earthMaterial = new THREE.MeshBasicMaterial({ map: texture });
    earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);
});

const satelliteGeometry = new THREE.SphereGeometry(0.1, 32, 32);
const satelliteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
scene.add(satellite);

// Create label canvas
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
context.font = '24px Arial';

// Create texture and material from canvas
const labelTexture = new THREE.CanvasTexture(canvas);
const labelMaterial = new THREE.SpriteMaterial({ map: labelTexture });

// Create sprite and add to the scene
const label = new THREE.Sprite(labelMaterial);
label.position.set(0.2, 0.2, 0.2);
satellite.add(label);

// Initialize simulation variables
let theta = 0;

// Function to update physics
function updatePhysics() {
    theta += 0.002;
}

// Function to simulate sensor data
function simulateSensor() {
    const noise = Math.random() * 0.001 - 0.0005;
    theta += noise;

    const temperature = Math.random() * 100;
    const altitude = 1.5;
    return { temperature, altitude };
}

// Mouse move event listener
window.addEventListener('mousemove', onMouseMove, false);

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function addSatellite() {
    // Read values from sliders
    const altitude = parseFloat(document.getElementById('altitudeSlider').value);
    const velocity = parseFloat(document.getElementById('velocitySlider').value);
    const direction = parseFloat(document.getElementById('directionSlider').value);

    // Read satellite name from text box
    const name = document.getElementById('satelliteName').value || 'Unnamed Satellite';
  
    // Create a new Satellite object
    const newSatellite = new Satellite(name, altitude, velocity, direction);

    // Add it to the array of satellites
    satellites.push(newSatellite);
}


let lastUpdateTime = Date.now();

function animate() {
    requestAnimationFrame(animate);

   // Calculate the time delta
   const now = Date.now();
   const timeDelta = now - lastUpdateTime;
   lastUpdateTime = now;

   // Update physics and sensor
   updatePhysics();
   const sensorData = simulateSensor();

   // Update all satellites
   for (const satellite of satellites) {
       satellite.updatePosition(timeDelta);
   }

    // Update Satellite Position
    satellite.position.x = 1.5 * Math.cos(theta);
    satellite.position.y = 0;
    satellite.position.z = 1.5 * Math.sin(theta);

    // Perform raycasting
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([satellite]);

    // Clear previous content
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#ffffff";

    // Show satellite name always
    context.fillText(`Neuron X2-4`, 10, 30);

    // Show info only if the mouse is over the satellite
    if (intersects.length > 0) {
        context.fillText(`Position: ${theta.toFixed(2)}`, 10, 50);
        context.fillText(`Temperature: ${sensorData.temperature.toFixed(2)} C`, 10, 70);
        context.fillText(`Altitude: ${sensorData.altitude.toFixed(2)} km`, 10, 90);
    }

    labelTexture.needsUpdate = true;

    // Rotate Earth
    if (earth) {
        earth.rotation.y += 0.0005;
    }

    // Render the scene
    renderer.render(scene, camera);
}

// Move camera back
camera.position.z = 3;

// Start the animation loop
animate();
