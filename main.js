import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { MeshBasicMaterial } from "three";
import {
  spaceTextureUrl,
  moonTextureUrl,
  normalTextureUrl,
  kobelevTextureUrl,
} from "./textures";

let camera, scene, renderer, controls;

function init() {
  // Camera setup
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.setZ(30);

  // Scene setup
  scene = new THREE.Scene();

  // Renderer setup
  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg"),
    antialias: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Controls setup
  controls = new OrbitControls(camera, renderer.domElement);

  // Torus
  const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
  const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
  const torus = new THREE.Mesh(geometry, material);
  scene.add(torus);

  // Lights
  const pointLight = new THREE.PointLight(0xffffff);
  pointLight.position.set(20, 20, 20);
  const ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(pointLight, ambientLight);

  // Stars
  Array(200).fill().forEach(addStar);

  // Background
  const spaceTexture = new THREE.TextureLoader().load(spaceTextureUrl);
  scene.background = spaceTexture;

  // Avatar
  const kobTexture = new THREE.TextureLoader().load(kobelevTextureUrl);
  const kobelev = new THREE.Mesh(
    new THREE.BoxGeometry(3, 3, 3),
    new MeshBasicMaterial({ map: kobTexture })
  );
  scene.add(kobelev);

  // Moon
  const moonTexture = new THREE.TextureLoader().load(moonTextureUrl);
  const normalTexture = new THREE.TextureLoader().load(normalTextureUrl);
  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(3, 32, 32),
    new THREE.MeshStandardMaterial({
      map: moonTexture,
      normalMap: normalTexture,
    })
  );
  scene.add(moon);
  moon.position.z = 30;
  moon.position.setX(-10);

  window.addEventListener("resize", onWindowResize, false);
}

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}

function animate() {
  requestAnimationFrame(animate);

  // Rotate torus
  scene.children[0].rotation.x += 0.001;
  scene.children[0].rotation.y += 0.005;
  scene.children[0].rotation.z += 0.01;

  // Rotate moon
  scene.children[scene.children.length - 1].rotation.x += 0.005;
  scene.children[scene.children.length - 1].rotation.y += 0.0075;

  controls.update();
  renderer.render(scene, camera);
}

init();
animate();
document.body.onscroll = moveCamera;
