function simulateSensor() {
  // Placeholder for sensor simulation.
  // For example, we could add noise to the theta variable.
  const noise = Math.random() * 0.001 - 0.0005;  // Small random noise
  theta += noise;

  let temperature = Math.random() * 100; // Example random temperature
  let altitude = Math.sqrt(
    Math.pow(satellite.position.x, 2) +
    Math.pow(satellite.position.y, 2) +
    Math.pow(satellite.position.z, 2)
  );
  return { temperature, altitude };
}

function animate() {
  let sensorData = simulateSensor();
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#ffffff"; // Set text color to white
  context.fillText(`position: ${theta.toFixed(2)}`, 10, 50);
  context.fillText(`temperature: ${sensorData.temperature.toFixed(2)} C`, 10, 70);
  context.fillText(`altitude: ${sensorData.altitude.toFixed(2)} km`, 10, 90);
  labelTexture.needsUpdate = true;

}
