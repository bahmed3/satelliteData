class Satellite {
    constructor(name, altitude, velocity, direction) {
        this.name = name;
        this.altitude = altitude;
        this.velocity = velocity;
        this.direction = direction;
        this.currentAngle = 0; 

        // Initialize Three.js objects for this satellite
        const satelliteGeometry = new THREE.SphereGeometry(0.1, 32, 32);
        const satelliteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.mesh = new THREE.Mesh(satelliteGeometry, satelliteMaterial);

        // Add the mesh to the scene
        scene.add(this.mesh);
    }
    
    updatePosition(timeDelta) {
        // Calculate the angle change based on velocity and time
        const angleDelta = this.velocity * timeDelta;

        // Update the current angle of the satellite
        this.currentAngle += angleDelta;

        // Calculate the new x and z position based on the altitude and current angle
        const x = this.altitude * Math.cos(this.currentAngle);
        const z = this.altitude * Math.sin(this.currentAngle);

        // Set the new position. We'll keep y constant for now
        this.mesh.position.set(x, 0, z);

        
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

// Initialize Earth
const earthGeometry = new THREE.SphereGeometry(1, 32, 32);

// Create a new Satellite instance and add to the satellites array
const newSatellite = new Satellite('Neuron X2-4', 1.5, 0.0001, 0);
satellites.push(newSatellite);

// Load and apply Earth texture
const textureLoader = new THREE.TextureLoader();
textureLoader.load('./8k_earth_daymap.jpg', function(texture) {
    const earthMaterial = new THREE.MeshBasicMaterial({ map: texture });
    earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);
});

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
newSatellite.mesh.add(label);

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
    const altitude = parseFloat(document.getElementById('altitudeSlider').value);
    const velocity = parseFloat(document.getElementById('velocitySlider').value);
    const direction = parseFloat(document.getElementById('directionSlider').value) * (Math.PI / 180);
    const name = document.getElementById('satelliteName').value || 'Unnamed Satellite';
    const newSatellite = new Satellite(name, altitude, velocity, direction);
    satellites.push(newSatellite);
}

let lastUpdateTime = Date.now();

function animate() {
    requestAnimationFrame(animate);
    const now = Date.now();
    const timeDelta = now - lastUpdateTime;
    lastUpdateTime = now;
    updatePhysics();
    const sensorData = simulateSensor();

    for (const satellite of satellites) {
        satellite.updatePosition(timeDelta);
    }

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(satellites.map(s => s.mesh));

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#ffffff";
    context.fillText(`Neuron X2-4`, 10, 30);

    if (intersects.length > 0) {
        context.fillText(`Position: ${theta.toFixed(2)}`, 10, 50);
        context.fillText(`Temperature: ${sensorData.temperature.toFixed(2)} C`, 10, 70);
        context.fillText(`Altitude: ${sensorData.altitude.toFixed(2)} km`, 10, 90);
    }

    labelTexture.needsUpdate = true;

    if (earth) {
        earth.rotation.y += 0.0005;
    }

    renderer.render(scene, camera);
}

camera.position.z = 3;
animate();
