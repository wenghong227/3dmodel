import * as THREE from 'three';
import CameraControls from 'camera-controls';

CameraControls.install({ THREE: THREE });

var panorama1, panorama2, panorama3, viewer, imageContainer, infospot;

imageContainer = document.querySelector('#container');

panorama1 = new PANOLENS.ImagePanorama('./image/pano1.jpg');
panorama2 = new PANOLENS.ImagePanorama('./image/pano2.jpg');
panorama3 = new PANOLENS.ImagePanorama('./image/pano3.jpg');

infospot = new PANOLENS.Infospot(350, PANOLENS.DataImage.Info);
infospot.position.set(-5000, 0, 0);
infospot.addHoverElement(document.getElementById('desc-container'), 200);

panorama1.add(infospot);

// Set custom initial lookat position
panorama1.initialLookAt = new THREE.Vector3(-5000, 0, 0);
panorama2.initialLookAt = new THREE.Vector3(-2000, -0.4, 2000);
panorama3.initialLookAt = new THREE.Vector3(0, 0, 0);

viewer = new PANOLENS.Viewer({
    container: imageContainer,
    output: 'overlay',
    autoRotate: true,
    autoRotateSpeed: 0.3,
    controlBar: true,
    cameraFov: 100
});

viewer.add(panorama1, panorama2, panorama3);

// Linking between panoramas
panorama1.link(panorama2, new THREE.Vector3(-2000, 0, -1300));
panorama2.link(panorama1, new THREE.Vector3(-2300, -500, 2000));
panorama1.link(panorama3, new THREE.Vector3(-1500, 0, 2000));
panorama3.link(panorama1, new THREE.Vector3(-2000, 2000, 1500));

// Fade Out transition effect
const fadeOut = PANOLENS.Panorama.prototype.fadeOut;
const tweenDuration = 2000;
const zoomDistance = 3000;
const zoomDuration = 2000;

PANOLENS.Panorama.prototype.fadeOut = function () {
    fadeOut.call(this);

    const onComplete = function () {
        this.position.set(0, 0, 0);
        this.renderOrder = -1;
    }.bind(this);

    // Set max render order or value larger than next panorama
    this.renderOrder = Number.MAX_VALUE;

    // Tween distance
    new TWEEN.Tween(this.position)
        .to(viewer.camera.getWorldDirection().negate().multiplyScalar(zoomDistance), zoomDuration)
        .easing(TWEEN.Easing.Exponential.Out)
        .onComplete(onComplete)
        .start();
};

// Create the CameraControls instance
const camera = viewer.camera;
const cameraControls = new CameraControls(camera, imageContainer);
// Used for CameraControls update
const clock = new THREE.Clock();
// Speed of camera control animations
const animationSpeed = 0.2;

let firstVisit = true;  // Flag to track if it's the first time panorama1 is loaded

// Set up initial "little planet" view only on the first page load
panorama1.addEventListener('enter-fade-complete', function () {
    if (firstVisit) {
        firstVisit = false;  // Mark that the transition has happened

        // Set up the initial "little planet" view
        setView({
            distanceFromCenter: -5000,  // Move camera away from center for "little planet" effect
            horizontalAngle: 200,
            verticalAngle: 0,
            zoomFactor: 0.15,
            animated: false
        });

        // After 1 second, automatically transition to the panoramic view
        setTimeout(() => {
            setView({
                distanceFromCenter: 0.01,
                horizontalAngle: 70,
                verticalAngle: 100,
                zoomFactor: 1,
                animated: true
            });
        }, 1000);  // Delay of 1 second
    }
});

// Function to set the camera view using CameraControls
function setView({ distanceFromCenter, horizontalAngle, verticalAngle, zoomFactor, animated }) {
    cameraControls.enabled = true;  // Ensure controls are enabled
    cameraControls.setPosition(0, 0, distanceFromCenter, animated);  // Move camera
    cameraControls.rotateTo(THREE.MathUtils.degToRad(horizontalAngle), THREE.MathUtils.degToRad(verticalAngle), animated);  // Rotate camera
    cameraControls.zoomTo(zoomFactor, animated);  // Zoom in or out
}

// Animation loop to continuously update CameraControls
function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();  // Get time since last frame
    cameraControls.update(delta * animationSpeed);  // Update CameraControls
    viewer.renderer.render(viewer.scene, camera);  // Render the scene
}

animate();
