import * as THREE from "three";
import { Vector3 } from "three";
import { ARM_X_DIST, SPIRAL } from "./config/galaxyConfig.js";

export const animate = (earthOrbit, marsOrbit, mercuryOrbit, venusOrbit) => {
  requestAnimationFrame(animate);

  const earth = createPlanet(0x0000ff, 0.05); // Tierra azul
  const mars = createPlanet(0xff0000, 0.04); // Marte rojo
  const mercury = createPlanet(0x888888, 0.03); // Mercurio gris
  const venus = createPlanet(0xffdd44, 0.045); // Venus amarillo

  const time = Date.now() * 0.0001;

  earth.position.x = Math.cos(time) * earthOrbit.x[0];
  earth.position.z = Math.sin(time) * earthOrbit.y[0];

  mars.position.x = Math.cos(time * marsOrbit.period) * marsOrbit.x[0];
  mars.position.z = Math.sin(time * marsOrbit.period) * marsOrbit.y[0];

  mercury.position.x = Math.cos(time * mercuryOrbit.period) * mercuryOrbit.x[0];
  mercury.position.z = Math.sin(time * mercuryOrbit.period) * mercuryOrbit.y[0];

  venus.position.x = Math.cos(time * venusOrbit.period) * venusOrbit.x[0];
  venus.position.z = Math.sin(time * venusOrbit.period) * venusOrbit.y[0];

  renderer.render(scene, camera);
};

export const createPlanet = (color, radius) => {
  const geometry = new THREE.SphereGeometry(radius, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: color });
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);
  return sphere;
};

export const createOrbit = (radius, scene) => {
  const geometry = new THREE.CircleGeometry(radius, 64);
  const material = new THREE.LineBasicMaterial({ color: 0xffffff });
  const orbit = new THREE.LineLoop(geometry, material);
  orbit.rotation.x = Math.PI / 2; // Rotar para que sea un plano horizontal
  scene.add(orbit);
  return orbit;
};

export const createElementDiv = (titulo) => {
  const div = document.createElement("div");
  const tituloElement = document.createElement("p");
  tituloElement.textContent = titulo;
  div.appendChild(tituloElement);
  return div;
};

export const fetcher = async (url = "", headers = {}) => {
  try {
    const response = await fetch(url, headers);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();

    return data;

    // const [earthOrbit, marsOrbit, mercuryOrbit, venusOrbit] = data;
    // createOrbit(1.0, scene); // Tierra
    // createOrbit(1.523, scene); // Marte
    // createOrbit(0.387, scene); // Mercurio
    // createOrbit(0.723, scene); // Venus

    // animate(earthOrbit, marsOrbit, mercuryOrbit, venusOrbit);
  } catch (error) {
    console.error("Error fetching orbits:", error);

    const alert = document.querySelector("[data-alert]");
    alert.appendChild(createElementDiv("Error fetching orbits"));
  }
};

export function gaussianRandom(mean = 0, stdev = 1) {
  let u = 1 - Math.random();
  let v = Math.random();
  let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

  return z * stdev + mean;
}

export function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

export function spiral(x, y, z, offset) {
  let r = Math.sqrt(x ** 2 + y ** 2);
  let theta = offset;
  theta += x > 0 ? Math.atan(y / x) : Math.atan(y / x) + Math.PI;
  theta += (r / ARM_X_DIST) * SPIRAL;
  return new Vector3(r * Math.cos(theta), r * Math.sin(theta), z);
}
