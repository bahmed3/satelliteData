# Satellite Data Visualization

This project aims to create a 3D visualization of satellites orbiting an Earth model using the Three.js library. 

## Objective 

The main goal of this project is to provide a 3D representation of satellites, allowing users to see their movement, visualize sensor data, and gain insights into satellite positioning and behaviors in real-time.

## Technologies 
- Three.js
- JavaScript (ES6)
- HTML5
- CSS3

## Strategy

Here are the critical strategies I employed:

### Three.js
- **Satellite Creation:** Each satellite is represented using a mesh made up of a sphere geometry and a basic material.
- **Earth Model:** A textured sphere is used to represent the Earth.
- **Animation:** The animate function provides continuous rendering, and satellites update their positions based on physics and time.
- **Interactivity:** Raycasting allows for the detection of mouse-over events on satellites, showing relevant information to the user.

### JavaScript
- **Object-Oriented Design:** The Satellite class encapsulates the behavior and properties of each satellite.
- **Physics Simulation:** The updatePhysics function is responsible for simulating basic physics for satellite movement.
- **Sensor Data Simulation:** To simulate a real-world scenario, random sensor data is generated to represent metrics like temperature.

### CSS
- **Canvas Styling:** Styling for the canvas ensures it takes up the full window and provides a clean background for our visualization.

## Lessons Learned
Through this project, I gained a deeper understanding of 3D graphics on the web using Three.js. Handling the complexities of 3D animation, interactions, and rendering gave insights into the potential of web-based simulations and graphics. The integration of raycasting to display information based on user interaction enriched the user experience, allowing for more engagement.

## Future Work
I plan to enhance the user experience by introducing more controls, allowing users to add or remove satellites, adjust their paths, and maybe even introduce potential collision detection. Additionally, I will look into integrating real-time satellite data using APIs, providing a more accurate representation of satellite constellations around our planet.
