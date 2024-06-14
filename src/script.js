import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Sky } from "three/addons/objects/Sky.js";
import { Timer } from "three/addons/misc/Timer.js";
import GUI from "lil-gui";
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise.js"; // Ensure ImprovedNoise is imported
import { FontLoader, TextGeometry } from "three/examples/jsm/Addons.js";

// Initialize Perlin noise
const noise = new ImprovedNoise();
const timer = new Timer();
const fontLoader = new FontLoader();

/**
 * Base
 */
// Debug
const gui = new GUI();
gui.close();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Floor Textures
const textureLoader = new THREE.TextureLoader();
const floorAlphaTexture = textureLoader.load("./floor/alpha.webp");
const floorColorTexture = textureLoader.load(
  "./floor/forest_leaves_02_1k/forest_leaves_02_diffuse_1k.webp"
);
const floorARMTexture = textureLoader.load(
  "./floor/forest_leaves_02_1k/forest_leaves_02_arm_1k.webp"
);
const floorNormalTexture = textureLoader.load(
  "./floor/forest_leaves_02_1k/forest_leaves_02_nor_gl_1k.webp"
);
const floorDisplacementTexture = textureLoader.load(
  "./floor/forest_leaves_02_1k/forest_leaves_02_disp_1k.webp"
);

floorColorTexture.colorSpace = THREE.SRGBColorSpace;

floorColorTexture.repeat.set(8, 8);
floorARMTexture.repeat.set(8, 8);
floorNormalTexture.repeat.set(8, 8);
floorDisplacementTexture.repeat.set(8, 8);

floorColorTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapS = THREE.RepeatWrapping;

floorColorTexture.wrapT = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWrapping;

// Wall textures
// Wall
const wallColorTexture = textureLoader.load(
  "./wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.webp"
);
const wallARMTexture = textureLoader.load(
  "./wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.webp"
);
const wallNormalTexture = textureLoader.load(
  "./wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.webp"
);

wallColorTexture.colorSpace = THREE.SRGBColorSpace;

// Roof
const roofColorTexture = textureLoader.load(
  "./roof/thatch_roof_angled_1k/thatch_roof_angled_diff_1k.webp"
);
const roofARMTexture = textureLoader.load(
  "./roof/thatch_roof_angled_1k/thatch_roof_angled_arm_1k.webp"
);
const roofNormalTexture = textureLoader.load(
  "./roof/thatch_roof_angled_1k/thatch_roof_angled_nor_gl_1k.webp"
);

roofColorTexture.colorSpace = THREE.SRGBColorSpace;

roofColorTexture.repeat.set(3, 1);
roofARMTexture.repeat.set(3, 1);
roofNormalTexture.repeat.set(3, 1);

roofColorTexture.wrapS = THREE.RepeatWrapping;
roofARMTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrapS = THREE.RepeatWrapping;

// Bush
const bushColorTexture = textureLoader.load(
  "./bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.webp"
);
const bushARMTexture = textureLoader.load(
  "./bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.webp"
);
const bushNormalTexture = textureLoader.load(
  "./bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.webp"
);

bushColorTexture.colorSpace = THREE.SRGBColorSpace;

bushColorTexture.repeat.set(2, 1);
bushARMTexture.repeat.set(2, 1);
bushNormalTexture.repeat.set(2, 1);

bushColorTexture.wrapS = THREE.RepeatWrapping;
bushARMTexture.wrapS = THREE.RepeatWrapping;
bushNormalTexture.wrapS = THREE.RepeatWrapping;

// Grave
const graveColorTexture = textureLoader.load(
  "./grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.webp"
);
const graveARMTexture = textureLoader.load(
  "./grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.webp"
);
const graveNormalTexture = textureLoader.load(
  "./grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.webp"
);

graveColorTexture.colorSpace = THREE.SRGBColorSpace;

graveColorTexture.repeat.set(0.3, 0.4);
graveARMTexture.repeat.set(0.3, 0.4);
graveNormalTexture.repeat.set(0.3, 0.4);

// Door
const doorColorTexture = textureLoader.load("./door/color.webp");
const doorAlphaTexture = textureLoader.load("./door/alpha.webp");
const doorAmbientOcclusionTexture = textureLoader.load(
  "./door/ambientOcclusion.webp"
);
const doorHeightTexture = textureLoader.load("./door/height.webp");
const doorNormalTexture = textureLoader.load("./door/normal.webp");
const doorMetalnessTexture = textureLoader.load("./door/metalness.webp");
const doorRoughnessTexture = textureLoader.load("./door/roughness.webp");

doorColorTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * House
 */
// Temporary sphere
// const sphere = new THREE.Mesh(
//   new THREE.SphereGeometry(1, 32, 32),
//   new THREE.MeshStandardMaterial({ roughness: 0.7 })
// );
// scene.add(sphere);

//  Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 100, 100),
  new THREE.MeshStandardMaterial({
    alphaMap: floorAlphaTexture,
    transparent: true,
    map: floorColorTexture,
    aoMap: floorARMTexture,
    roughnessMap: floorARMTexture,
    metalnessMap: floorARMTexture,
    normalMap: floorNormalTexture,
    displacementMap: floorDisplacementTexture,
    displacementScale: 0.3,
    displacementBias: -0.1,
  })
);

gui
  .add(floor.material, "displacementScale")
  .min(0)
  .max(1)
  .step(0.001)
  .name("floorDisplacementScale");

gui
  .add(floor.material, "displacementBias")
  .min(-1)
  .max(1)
  .step(0.001)
  .name("floorDisplacementBias");

floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

// House container
const house = new THREE.Group();
scene.add(house);

// Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallARMTexture,
    roughnessMap: wallARMTexture,
    metalnessMap: wallARMTexture,
    normalMap: wallNormalTexture,
  })
);

walls.position.y += 2.5 / 2;

house.add(walls);

// Create windows
const windowGeometry = new THREE.BoxGeometry(1.15, 1, 0.1);
const windowMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });

const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
// position the windowon the left side of the wall
window1.position.set(-2, 1.5, -0.1);
window1.rotation.y = Math.PI * 0.5;

// add a glass material to the window1
const glassMaterial = new THREE.MeshStandardMaterial({
  color: 0x6699ff,
  transparent: true,
  opacity: 0.5,
  roughness: 0.1,
  metalness: 0.1,
});

const glass1 = new THREE.Mesh(windowGeometry, glassMaterial);
glass1.position.set(-2, 1.5, -0.1);
glass1.rotation.y = Math.PI * 0.5;

house.add(glass1);

// Add flickering light effect to the windows
const flickeringLight = new THREE.PointLight(0xffaa33, 1, 10);
flickeringLight.position.set(-2, 1.5, -0.1);
house.add(flickeringLight);

const flickerLight = () => {
  const elapsedTime = timer.getElapsed();
  flickeringLight.intensity = Math.abs(Math.sin(elapsedTime * 10)) * 2;
};

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1.5, 4),
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    aoMap: roofARMTexture,
    roughnessMap: roofARMTexture,
    metalnessMap: roofARMTexture,
    normalMap: roofNormalTexture,
  })
);

roof.position.y = 2.5 + 1.5 / 2;
roof.rotation.y = Math.PI * 0.25; // half a cercle / 2

house.add(roof);

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    transparent: true,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
    displacementScale: 0.15,
    displacementBias: -0.04,
  })
);
door.position.y = 1;
door.position.z = 2 + 0.01;
house.add(door);

// Bushes
const busheGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  map: bushColorTexture,
  aoMap: bushARMTexture,
  roughnessMap: bushARMTexture,
  metalnessMap: bushARMTexture,
  normalMap: bushNormalTexture,
  color: "#ccffcc",
});

const bush1 = new THREE.Mesh(busheGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);
bush1.rotation.x = -0.75;

const bush2 = new THREE.Mesh(busheGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);
bush2.rotation.x = -0.75;

const bush3 = new THREE.Mesh(busheGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);
bush3.rotation.x = -0.75;

const bush4 = new THREE.Mesh(busheGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);
bush4.rotation.x = -0.75;

house.add(bush1, bush2, bush3, bush4);

// Graves
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({
  map: graveColorTexture,
  aoMap: graveARMTexture,
  roughnessMap: graveARMTexture,
  metalnessMap: graveARMTexture,
  normalMap: graveNormalTexture,
});

const graves = new THREE.Group();
scene.add(graves);

for (let i = 0; i < 30; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 4;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.x = x;
  grave.position.y = 0.8 / 2;
  grave.position.z = z;
  grave.rotation.x = Math.random() * -0.5 * 0.4;
  grave.rotation.y = Math.random() * -0.5 * 0.4;
  grave.rotation.z = Math.random() * -0.5 * 0.4;

  const random1 = Math.floor(Math.random() * 30) + 1;
  const random2 = Math.floor(Math.random() * 30) + 1;
  const random3 = Math.floor(Math.random() * 30) + 1;

  if (i === random1 || i === random2 || i === random3) {
    fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
      const textGeometry = new TextGeometry("R.I.P", {
        font,
        size: 0.1,
        depth: 0.01,
      });

      const textMaterial = new THREE.MeshBasicMaterial();
      const text = new THREE.Mesh(textGeometry, textMaterial);
      textMaterial.color = new THREE.Color("#000000");
      // make it write up on the graves and rotate it
      text.position.x = -0.1;
      text.position.y = -0.01;
      text.position.z = 0.1;

      // text.rotation.y = Math.PI * 0.5;
      grave.add(text);
    });
  }

  graves.add(grave);
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#86cdff", 0.275);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight("#86cdff", 1);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

// Door light
const doorLight = new THREE.PointLight("#ff7d46", 5);
doorLight.position.set(0, 2.2, 2.5);
house.add(doorLight);

// Ghosts
const ghost1 = new THREE.PointLight("#8800ff", 6);
const ghost2 = new THREE.PointLight("#ff0088", 6);
const ghost3 = new THREE.PointLight("#ff0000", 6);
scene.add(ghost1, ghost2, ghost3);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Create a group to hold the eyes
const eyesGroup = new THREE.Group();

// Define eye geometry and material
const eyeGeometry = new THREE.SphereGeometry(0.1, 32, 32); // Adjust size as needed
const eyeMaterial = new THREE.MeshStandardMaterial({
  color: 0x000000, // Base color of the eyes (black)
  emissive: "#212121", // Emissive color (red), adjust as needed
  emissiveIntensity: 1, // Intensity of the emissive glow
  side: THREE.DoubleSide, // Ensure both sides are visible
  transparent: true, // Allow transparency for emissive glow
  opacity: 0.8, // Adjust opacity as needed
});

// Create eyes and position them
const eye1 = new THREE.Mesh(eyeGeometry, eyeMaterial);
const eye2 = new THREE.Mesh(eyeGeometry, eyeMaterial);
eye1.position.set(-0.2, 0.8, -2 + 0.001); // Adjust positions according to your scene
eye2.position.set(0.2, 0.8, -2 + 0.001);
eyesGroup.add(eye1, eye2);

// Add eyes group to the scene
scene.add(eyesGroup);

// Animation loop (optional)
function animateEyes() {
  // Add animation logic here, for example:
  const time = performance.now() * 0.001; // Convert to seconds

  // Example: Make eyes flicker by changing emissive intensity
  const flickerIntensity = Math.sin(time * 10) * 0.2 + 0.8; // Adjust frequency and amplitude
  eyeMaterial.emissiveIntensity = flickerIntensity;

  // Request animation frame
  requestAnimationFrame(animateEyes);
}

// Start the animation loop
animateEyes();

// Define a ghost-like shape using THREE.Shape
var ghostShape = new THREE.Shape();
ghostShape.moveTo(0, 0);
ghostShape.lineTo(0, 2);
ghostShape.quadraticCurveTo(1, 2.5, 2, 2);
ghostShape.quadraticCurveTo(3, 2.5, 4, 2);
ghostShape.quadraticCurveTo(5, 2.5, 6, 2);
ghostShape.lineTo(6, 0);
ghostShape.lineTo(3, -1);

// Create geometry from the shape
var ghostGeometry = new THREE.ShapeGeometry(ghostShape);

// Create a semi-transparent material for the ghost shape
var ghostMaterial = new THREE.MeshBasicMaterial({
  color: "black",
  transparent: true,
  opacity: 0.4,
  side: THREE.DoubleSide,
});

// Create mesh for the ghost shape
var ghostMesh = new THREE.Mesh(ghostGeometry, ghostMaterial);
ghostMesh.position.set(-0.9, 0.4, -2.01); // Adjust position near the eyes
ghostMesh.scale.set(0.3, 0.3, 0.3); // Adjust scale as needed
scene.add(ghostMesh);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Cast and receive
directionalLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
walls.receiveShadow = true;
roof.castShadow = true;
floor.receiveShadow = true;

graves.children.forEach((grave) => {
  grave.castShadow = true;
  grave.receiveShadow = true;
});

// Mapping
directionalLight.shadow.mapSize.width = 256;
directionalLight.shadow.mapSize.height = 256;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -8;
directionalLight.shadow.camera.far = 20;
directionalLight.shadow.camera.near = 1;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 10;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 10;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 10;

// Sky
const sky = new Sky();
sky.scale.set(100, 100, 100);
sky.material.uniforms["turbidity"].value = 10;
sky.material.uniforms["rayleigh"].value = 3;
sky.material.uniforms["mieCoefficient"].value = 0.1;
sky.material.uniforms["mieDirectionalG"].value = 0.95;
sky.material.uniforms["sunPosition"].value.set(0.3, -0.038, -0.95);

// add gui for sky
gui
  .add(sky.material.uniforms["turbidity"], "value")
  .min(0)
  .max(20)
  .step(0.1)
  .name("turbidity");
gui
  .add(sky.material.uniforms["rayleigh"], "value")
  .min(0)
  .max(4)
  .step(0.001)
  .name("rayleigh");
gui
  .add(sky.material.uniforms["mieCoefficient"], "value")
  .min(0)
  .max(0.1)
  .step(0.0001)
  .name("mieCoefficient");

gui
  .add(sky.material.uniforms["mieDirectionalG"], "value")
  .min(0)
  .max(1)
  .step(0.0001)
  .name("mieDirectionalG");

gui
  .add(sky.material.uniforms["sunPosition"].value, "x")
  .min(-1)
  .max(1)
  .step(0.0001)
  .name("sunPositionX");

scene.add(sky);

// Fog
scene.fog = new THREE.FogExp2("#04343f", 0.1);

const mapRange = (value, inMin, inMax, outMin, outMax) => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

const updateDoorLightIntensity = (elapsedTime) => {
  // Generate smooth noise for slower, natural variation
  const noiseValue = noise.noise(elapsedTime * 0.1, 0, 0);
  const mappedNoise = mapRange(noiseValue, -1, 1, 0.8, 1.2); // Map noise to a smaller range

  // Base intensity using a sine wave for smooth oscillation
  const baseIntensity = Math.sin(elapsedTime * 0.2) * 1.5 + 2;

  // Add small random fluctuation to simulate flickering
  const randomFlicker = (Math.random() - 0.5) * 0.1;

  // Combine base intensity, noise-based variation, and random flicker
  const doorLightIntensity = baseIntensity * mappedNoise + randomFlicker;

  // Ensure intensity is clamped to a positive range
  return Math.max(0, doorLightIntensity);
};

/**
 * Animate
 */

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  //   Ghosts animation
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y =
    Math.sin(ghost1Angle) *
    Math.sin(ghost1Angle * 2.34) *
    Math.sin(ghost1Angle * 3.45);

  const ghost2Angle = elapsedTime * 0.38;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y =
    Math.sin(ghost2Angle) *
    Math.sin(ghost2Angle * 2.34) *
    Math.sin(ghost2Angle * 3.45);

  const ghost3Angle = elapsedTime * 0.23;
  ghost3.position.x = Math.cos(ghost3Angle) * 6;
  ghost3.position.z = Math.sin(ghost3Angle) * 6;
  ghost3.position.y =
    Math.sin(ghost3Angle) *
    Math.sin(ghost3Angle * 2.34) *
    Math.sin(ghost3Angle * 3.45);

  // Door light flickering
  doorLight.intensity = updateDoorLightIntensity(elapsedTime);

  flickerLight();

  // Create and play positional audio

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
