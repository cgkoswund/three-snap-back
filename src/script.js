import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import { Vector3 } from "three";
console.log(gsap);
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */

const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("./textures/matcaps/1.png");

const geometry = new THREE.SphereGeometry(0.5, 8, 8);
console.log(geometry);
const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
let mesh, group;

const noOfSquares = 60; //edit this to get longer spiral
const yShear = 1.4;
for (let k = 0; k < noOfSquares; k++) {
  group = new THREE.Group();
  const newMeshScale = 0.9 - (0.8 * k) / noOfSquares;
  for (let i = 0, j = 5; i < 5; i++, j--) {
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(i, j * yShear, 0);
    mesh.scale.setScalar(newMeshScale);
    group.add(mesh);

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(j, -i * yShear, 0);
    mesh.scale.setScalar(newMeshScale);
    group.add(mesh);

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(-i, -j * yShear, 0);
    mesh.scale.setScalar(newMeshScale);
    group.add(mesh);

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(-j, i * yShear, 0);
    mesh.scale.setScalar(newMeshScale);
    group.add(mesh);
  }
  group.position.set(0, 0, -k * 1.4);
  group.rotation.set(0, 0, -(0.25 + k * 0.1));
  const newSquareScale = 1 + (1.2 * k) / noOfSquares;
  group.scale.setScalar(newSquareScale);
  scene.add(group);
}

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

camera.position.set(6.3, 0, 11.3);
camera.lookAt(0, 0, 0);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.enableZoom = false;

let snapEvent = new Event("end");
window.addEventListener("pointerup", () => {
  window.dispatchEvent(snapEvent);
});
camera.position.set(6.3, 0, 11.3);
controls.addEventListener("end", () => {
  const radius = camera.position.distanceTo(controls.target);
  gsap.to(camera.position, {
    x: 6,
    y: 0,
    z: 11.3,
    onUpdate: () => {
      camera.lookAt(controls.target);
      //move camera in a circular path
      camera.position.normalize().multiplyScalar(radius);
    },
  });
});

const tick = () => {
  // controls.update();
  // console.log(camera.position);
  // console.log(camera.rotation);

  renderer.render(scene, camera);
  // console.log(camera.position);
  // camera.lookAt(0, 0, 0);
  window.requestAnimationFrame(tick);

  // console.log(camera.position);(0,0,11)
};

tick();
