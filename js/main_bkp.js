// import { StereographicShader } from './StereographicShader.js';

var panorama1, panorama2,  panorama3, viewer, imageContainer, infospot;

var lookAtPositions = [
    new THREE.Vector3(-5000, 0, 0),
    new THREE.Vector3(-2000, -0.4, 2000),
    new THREE.Vector3(0, 0, 0)
  ];

imageContainer = document.querySelector( '#container' );

panorama1 = new PANOLENS.ImagePanorama('./image/pano1.jpg');
panorama1.addEventListener( 'enter-fade-start', function(){
    viewer.tweenControlCenter( lookAtPositions[0], 0 );
});

panorama2 = new PANOLENS.ImagePanorama('./image/pano2.jpg');
panorama2.addEventListener( 'enter-fade-start', function(){
    viewer.tweenControlCenter( lookAtPositions[1], 0 );
    applyStereographicTransition(panorama1);
});

panorama3 = new PANOLENS.ImagePanorama('./image/pano3.jpg');
panorama3.addEventListener( 'enter-fade-start', function(){
    viewer.tweenControlCenter( lookAtPositions[2], 0 );
});

// infospot
/* infospot = new PANOLENS.Infospot( 500, PANOLENS.DataImage.Info );
infospot.position.set( -100, -500, -5000 );
infospot.addHoverText( "The Story" );
infospot.addEventListener( 'click', function(){
  viewer.setPanorama( panorama2 );
} );

panorama1.add( infospot ); */

// stereographic shader for stereographic transition
/* function createStereographicMaterial(texture) {
  return new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(StereographicShader.uniforms),
      vertexShader: StereographicShader.vertexShader,
      fragmentShader: StereographicShader.fragmentShader,
      side: THREE.DoubleSide
  });
}

// Apply the shader material to a panorama
function applyStereographicTransition(panorama) {
  var texture = new THREE.TextureLoader().load(panorama.image.src);
  var material = createStereographicMaterial(texture);

  // Create a mesh with a plane geometry and apply the shader material
  var geometry = new THREE.PlaneGeometry(2, 2);
  var mesh = new THREE.Mesh(geometry, material);

  panorama.add(mesh);

  // Set initial values for uniforms
  material.uniforms.tDiffuse.value = texture;
  material.uniforms.resolution.value = 1.0;
  material.uniforms.transform.value = new THREE.Matrix4();
  material.uniforms.zoom.value = 1.0;
  material.uniforms.opacity.value = 1.0;

  // Transition effect setup
  var tween = new TWEEN.Tween(material.uniforms.zoom)
      .to({ value: 1.0 }, 2000) // Adjust duration as needed
      .easing(TWEEN.Easing.Quadratic.Out)
      .start();

  var tweenOpacity = new TWEEN.Tween(material.uniforms.opacity)
      .to({ value: 0.0 }, 2000) // Fade out
      .easing(TWEEN.Easing.Quadratic.Out)
      .onComplete(function() {
          panorama.remove(mesh);
      })
      .start();
} */

viewer = new PANOLENS.Viewer({
container: imageContainer,
output: 'console',
autoRotate: true,
autoRotateSpeed: 0.3,
controlBar: true,
cameraFov: 100
});

viewer.add( panorama1, panorama2, panorama3 );


viewer.addUpdateCallback(function(){
  
});

// Linking between panoramas
panorama1.link( panorama2, new THREE.Vector3(-2000, 0, -1300));
panorama2.link( panorama1, new THREE.Vector3(-2300, -500, 2000));

panorama1.link( panorama3, new THREE.Vector3(-1500, 0, 2000));
panorama3.link( panorama1, new THREE.Vector3(-2000, 2000, 1500));