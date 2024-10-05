//Styles
import "../styles/main.css";
//Fonts
import "@fontsource-variable/tourney";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import EarthMapearthmap1k from "../images/earthmap1k.jpg";
import EarthClouds from "../images/2k_earth_clouds.jpg";
import Moon from "../images/2k_moon.jpg";
import Sun from "../images/Map_of_the_full_sun.jpg";
import SunClouds from "../images/sun2.jpg";
import Mercury from "../images/mercury.jpg";
import Venus from "../images/venus.jpg";
import VenusClouds from "../images/venusClouds.jpg";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import * as THREE from "three";
import { animate, createElementDiv, createOrbit, fetcher } from "./utils";

const orbitsData = await fetcher("https://cosmicview-back.onrender.com/all", {
  method: "GET",
});

const container = document.querySelector("#app");
const localEarth = EarthMapearthmap1k;
const localCloud = EarthClouds;
const localMoon = Moon;
const texture = new THREE.TextureLoader().load(localEarth);
const texture_clouds = new THREE.TextureLoader().load(localCloud);
const texture_moon = new THREE.TextureLoader().load(localMoon);
const axesHelper = new THREE.AxesHelper(3);
const localSunTexture = Sun;
const localSunClouds = SunClouds;
const localMercuryTexture = Mercury;
const localVenusTexture = Venus;
const localVenusClouds = VenusClouds;
const sunTexture = new THREE.TextureLoader().load(localSunClouds);
const sunClouds = new THREE.TextureLoader().load(localSunTexture);
const mercuryTexture = new THREE.TextureLoader().load(localMercuryTexture);
const venusTexture = new THREE.TextureLoader().load(localVenusTexture);
const venusClouds = new THREE.TextureLoader().load(localVenusClouds);

//Scene
const scene = new THREE.Scene();
// choosing colors
const xColor = new THREE.Color(0xff00ff);
const yColor = new THREE.Color(0xffff00);
const zColor = new THREE.Color(0x00ffff);

// setting colors
axesHelper.setColors(xColor, yColor, zColor);

scene.add(axesHelper);
scene.background = new THREE.Color("black");

const width = window.innerWidth;
const height = window.innerHeight;

// Objects
// Sun
const sunGeometry = new THREE.SphereGeometry(100, 128, 128);
const sunMaterial = new THREE.MeshBasicMaterial({
  map: sunTexture,
});
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);

//LIGHTS
const pointLight = new THREE.PointLight(0xffffff, 1.5);
pointLight.position.copy(sunMesh.position);
pointLight.castShadow = true;
const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);

scene.add(pointLight);
scene.add(ambientLight);

// Sun Clouds
const sunCloudGeometry = new THREE.SphereGeometry(100.25, 128, 128);
const sunCloudMaterial = new THREE.MeshLambertMaterial({
  color: "yelow",
  alphaMap: sunClouds,
});
sunCloudMaterial.transparent = true;
const sunCloudsObject = new THREE.Mesh(sunCloudGeometry, sunCloudMaterial);

//Mercury
const mercuryGeometry = new THREE.SphereGeometry(8, 100, 100);
const planetMercuryMaterial = new THREE.MeshPhongMaterial({
  map: mercuryTexture,
});
const planetMercury = new THREE.Mesh(mercuryGeometry, planetMercuryMaterial);

//Venus
const venusGeometry = new THREE.SphereGeometry(10, 128, 128);
const planetVenusMaterial = new THREE.MeshPhongMaterial({
  map: venusTexture,
});
const planetVenus = new THREE.Mesh(venusGeometry, planetVenusMaterial);

//VenusClouds
const venusCloudGeometry = new THREE.SphereGeometry(10.5, 128, 128);
const venusCloudMaterial = new THREE.MeshLambertMaterial({
  map: venusClouds,
  opacity: 0.76,
});
venusCloudMaterial.transparent = true;
const venusCloudsMesh = new THREE.Mesh(venusCloudGeometry, venusCloudMaterial);

//Earth
const sphereGeometry = new THREE.SphereGeometry(10, 128, 128);
const planetEarthMaterial = new THREE.MeshPhongMaterial({ map: texture });
const planetEarth = new THREE.Mesh(sphereGeometry, planetEarthMaterial);
planetEarth.rotation.x = (23 / 180) * Math.PI;

//Clouds
const cloudGeometry = new THREE.SphereGeometry(10.5, 128, 128);
const cloudMaterial = new THREE.MeshLambertMaterial({
  color: "white",
  alphaMap: texture_clouds,
});

cloudMaterial.transparent = true;
const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);

//Camera
const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 10000);
camera.position.z = 2000;
camera.position.y = 500;

const defaultCamera = camera.clone();

const moonGeo = new THREE.SphereGeometry(2.7, 128, 128);
const moonMat = new THREE.MeshLambertMaterial({
  color: "white",
  map: texture_moon,
});
const moon = new THREE.Mesh(moonGeo, moonMat);
moon.position.copy(planetEarth.position);

//SHADOWS
moon.castShadow = true;
planetEarth.receiveShadow = true;
clouds.castShadow = true;
// dirLight.castShadow = true;
camera.position.y = 0;

//Renderer
const renderer = new THREE.WebGLRenderer();
container.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;
renderer.setSize(width, height);
renderer.setPixelRatio(window.devicePixelRatio);

const clock = new THREE.Clock();

const paintOrbit = (points) => {
  console.log("points=>", typeof points);
  console.log("points array=>", points);
  points.forEach((point) => {
    console.log("test=>", point);
    points.push(
      new THREE.Vector3(point.x / 1000000, point.y / 1000000, point.z / 1000000)
    );
  });

  const radioGeom = new THREE.BufferGeometry().setFromPoints(points);
  const radioMat = new THREE.LineBasicMaterial({ color: 0xffffff });
  return new THREE.Line(radioGeom, radioMat);
};
const moonOrbitRadius = 25;
const moonOrbitSpeed = 0.06;

orbitsData.planets.forEach((planet) => {
  console.log("orbitsss=>", planet.orbit);
  const orbits = paintOrbit(planet.orbit);
  const earthGroup = new THREE.Group();
  earthGroup.add(planetEarth);
  scene.add(orbits);
});

// const moonOrbit = paintOrbit(moonOrbitRadius);
// const earthOrbit = paintOrbit(1000, false);
// const mercuryOrbit = paintOrbit(333, false);
// const venusOrbit = paintOrbit(500, false);

// const earthGroup = new THREE.Group();
// // earthGroup.add(moonOrbit);
// earthGroup.add(planetEarth);
// earthGroup.add(clouds);
// earthGroup.add(moon);

// scene.add(earthGroup);
// scene.add(earthOrbit);
scene.add(sunMesh);
scene.add(sunCloudsObject);
scene.add(planetMercury);
// scene.add(mercuryOrbit);
scene.add(planetVenus);
// scene.add(venusOrbit);
scene.add(venusCloudsMesh);

const orbitControl = new OrbitControls(camera, renderer.domElement);

//Events
let target;
let startAnim = false;

const getPlanetZoomIn = (planet, reset = false) => {
  return {
    target: planet.position.clone(),
    targetSize: new THREE.Box3()
      .setFromObject(planet)
      .getSize(new THREE.Vector3()),
    cameraLookat: reset ? scene.position : planet.position,
  };
};

document.getElementById("reset").addEventListener("click", () => {
  target = null;
  startAnim = true;
});

const addPlanetClickListener = (planet) => {
  document.getElementById(planet).addEventListener("click", () => {
    target = planet;
    startAnim = true;
  });
};

// addPlanetClickListener("sun");
addPlanetClickListener("earth");
addPlanetClickListener("venus");
addPlanetClickListener("mercury");

const orbitMovement = (theta, radius, mesh, affectY = false) => {
  mesh.position.x = Math.sin(theta) * radius;
  mesh.position.y = affectY ? Math.sin(theta) * (radius / 3) : 0;
  mesh.position.z = Math.cos(theta) * radius;
};
//LOOP
const loop = () => {
  const delta = clock.getDelta();
  const elapsedTime = clock.getElapsedTime();
  clouds.rotation.y += delta * 0.03;
  venusCloudsMesh.rotation.y += delta * 0.03;
  planetEarth.rotation.y += delta * 0.2;
  sunMesh.rotation.y += delta * 0.03;
  sunCloudsObject.rotation.y += delta * 0.03;
  planetMercury.rotation.y += delta * 0.3;
  planetVenus.rotation.y += delta * 0.3;
  //moon.rotation.y += delta * 0.3;
  // orbitMovement(elapsedTime * 0.01, 1000, earthGroup);
  orbitMovement(elapsedTime * 0.005, 333, planetMercury);
  orbitMovement(elapsedTime * 0.012, 500, planetVenus);
  orbitMovement(elapsedTime * 0.012, 500, venusCloudsMesh);
  orbitMovement(elapsedTime * moonOrbitSpeed, moonOrbitRadius, moon, true);

  // camera animation

  if (startAnim) {
    let data;

    switch (target) {
      case "sun":
        data = getPlanetZoomIn(sunMesh);
        break;
      case "earth":
        data = getPlanetZoomIn(earthGroup);
        break;
      case "venus":
        data = getPlanetZoomIn(planetVenus);
        break;
      case "mercury":
        data = getPlanetZoomIn(planetMercury);
        break;
      default: {
        data = {
          target: defaultCamera.position.clone(),
          targetSize: new THREE.Vector3(),
          cameraLookat: new THREE.Vector3(),
        };
        break;
      }
    }

    const distancedTarget = data.target;
    distancedTarget.z += data.targetSize.z;
    orbitControl.target.copy(data.cameraLookat);
    orbitControl.update();
    orbitControl.enabled = false;
    camera.position.lerp(distancedTarget, delta);

    if (camera.position.distanceTo(distancedTarget) < 10) {
      orbitControl.enabled = true;
      startAnim = false;
    }
  }

  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};

loop();
