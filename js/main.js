import * as THREE from 'three';
import CameraControls from 'camera-controls';

CameraControls.install({ THREE: THREE });

let viewer, camera, cameraControls;
let firstVisit = true;
const clock = new THREE.Clock();
const animationSpeed = 0.2;

const imageContainer = document.querySelector('#container');

// Set up panoramas
const panorama1 = new PANOLENS.ImagePanorama('./image/pano1.jpg');
const panorama2 = new PANOLENS.ImagePanorama('./image/pano2.jpg');
const panorama3 = new PANOLENS.ImagePanorama('./image/pano3.jpg');

const infospot = new PANOLENS.Infospot(350, PANOLENS.DataImage.Info);
infospot.position.set(-5000, 0, 0);
infospot.addHoverElement(document.getElementById('desc-container'), 200);
panorama1.add(infospot);

// Set custom initial lookat position
panorama2.initialLookAt = new THREE.Vector3(-2000, -0.4, 2000);
panorama3.initialLookAt = new THREE.Vector3(0, 0, 0);

// Initialize the viewer and camera
viewer = new PANOLENS.Viewer({
    container: imageContainer,
    output: 'overlay',
    cameraFov: 100,
    controlButtons: ['fullscreen']
});

viewer.add(panorama1, panorama2, panorama3);

// Initialize CameraControls after setting up the viewer
camera = viewer.camera;
camera.position.set(0, 5000, 0);  // Position for "little planet" effect
camera.lookAt(new THREE.Vector3(0, 0, 0));
camera.updateProjectionMatrix();

cameraControls = new CameraControls(camera, imageContainer);
cameraControls.draggingDampingFactor = 0.5;  // Increase damping to make dragging smoother and slower
cameraControls.mouseDragSpeed = 0.1;  // Lower value for slower drag speed

// Linking between panoramas
panorama1.link(panorama2, new THREE.Vector3(-5000, 0, -1300));
panorama1.link(panorama3, new THREE.Vector3(-1500, 0, 2000));
panorama2.link(panorama1, new THREE.Vector3(-2300, -500, 2000));
panorama3.link(panorama1, new THREE.Vector3(-2000, 2000, 1500));

// Handle the "little planet" transition when the first panorama is fully loaded
panorama1.addEventListener('enter-fade-complete', function () {
    if (firstVisit) {
        firstVisit = false;

        // After 1 second, automatically transition to the panoramic view
        setTimeout(() => {
            setView({
                distanceFromCenter: 0.01,
                horizontalAngle: 70,
                verticalAngle: 100,
                zoomFactor: 1,
                animated: true
            });
        }, 500);  // Delay of 0.5 second
    }
});

// Function to set the camera view using CameraControls
function setView({ distanceFromCenter, horizontalAngle, verticalAngle, zoomFactor, animated }) {
    cameraControls.setPosition(0, 0, distanceFromCenter, animated);  // Move camera
    cameraControls.rotateTo(THREE.MathUtils.degToRad(horizontalAngle), THREE.MathUtils.degToRad(verticalAngle), animated);  // Rotate camera
    cameraControls.zoomTo(zoomFactor, animated);  // Zoom in or out
}

// Custom zoom handling with mouse wheel
imageContainer.addEventListener('wheel', function (event) {
    event.preventDefault();
    const delta = event.deltaY;

    // Adjust the FOV (zoom in or out)
    const zoomSpeed = 0.05;  // Adjust zoom sensitivity
    camera.fov += delta * zoomSpeed;
    camera.fov = THREE.MathUtils.clamp(camera.fov, 30, 120);  // Limit FOV range
    camera.updateProjectionMatrix();
});

// Animation loop to continuously update CameraControls
function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();  // Get time since last frame
    cameraControls.update(delta * animationSpeed);  // Update CameraControls
    viewer.renderer.render(viewer.scene, camera);  // Render the scene
}

animate();