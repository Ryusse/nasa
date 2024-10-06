import Moon from "../images/textures/2k_moon.jpg";
import Sun from "../images/textures/Map_of_the_full_sun.jpg";
import SunClouds from "../images/textures/sun2.jpg";
import Mercury from "../images/textures/mercury.jpg";
import Venus from "../images/textures/venus.jpg";
import EarthMapearthmap1k from "../images/textures/earthmap1k.jpg";
import Mars from "../images/textures/marte.jpg";
import Jupiter from "../images/textures/jupiter.jpg";
import Saturn from "../images/textures/saturno.jpeg";
import Netpune from "../images/textures/neptuno.jpg";
import Uranus from "../images/textures/urano.jpg";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import * as THREE from "three";
import { fetcher } from "./utils";

(async () => {
	const orbitsData = await fetcher(
		"https://cosmicview-back.onrender.com/all/",
		{
			method: "GET",
		}
	);
	const container = document.querySelector("#app");
	const axesHelper = new THREE.AxesHelper(3);
	const localSunTexture = Sun;
	const localSunClouds = SunClouds;
	const localEarth = EarthMapearthmap1k;
	const localNeptune = Netpune;
	const localJupiter = Jupiter;
	const localMercury= Mercury;
	const localMoon = Moon;
	const localVenus = Venus;
	const localSaturn = Saturn;
	const localMars = Mars;
	const localUranus = Uranus;
	const earthTexture = new THREE.TextureLoader().load(localEarth);
	const jupiterTexture = new THREE.TextureLoader().load(localJupiter);
	const texture_moon = new THREE.TextureLoader().load(localMoon);
	const sunTexture = new THREE.TextureLoader().load(localSunClouds);
	const sunClouds = new THREE.TextureLoader().load(localSunTexture);
	const mercuryTexture = new THREE.TextureLoader().load(localMercury);
	const venusTexture = new THREE.TextureLoader().load(localVenus);
	const neptuneTexture = new THREE.TextureLoader().load(localNeptune);
	const saturnTexture = new THREE.TextureLoader().load(localSaturn);
	const marsTexture = new THREE.TextureLoader().load(localMars);
	const uranusTexture = new THREE.TextureLoader().load(localUranus);

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
	const sunGeometry = new THREE.SphereGeometry(36, 128, 128);
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
	const sunCloudGeometry = new THREE.SphereGeometry(20.25, 128, 128);
	const sunCloudMaterial = new THREE.MeshLambertMaterial({
		color: "yelow",
		alphaMap: sunClouds,
	});
	sunCloudMaterial.transparent = true;
	const sunCloudsObject = new THREE.Mesh(sunCloudGeometry, sunCloudMaterial);

	//Camera
	const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 10000);
	camera.position.z = 2000;
	camera.position.y = 500;

	const defaultCamera = camera.clone();

	//SHADOWS
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
		points.forEach((point) => {
			points.push(
				new THREE.Vector3(
					point.x / 1000000,
					point.y / 1000000,
					point.z / 1000000
				)
			);
		});

		const radioGeom = new THREE.BufferGeometry().setFromPoints(points);
		const radioMat = new THREE.LineBasicMaterial({ color: 0xffffff });
		return new THREE.Line(radioGeom, radioMat);
	};

	orbitsData.planets.forEach((planet) => {
		const orbits = paintOrbit(planet.orbit);
		scene.add(orbits);
		const planetGeometry = new THREE.SphereGeometry(planet.radius * 2);
		let planetMaterial;
		switch (planet.name) {
			case "Mercury":
				planetMaterial = new THREE.MeshPhongMaterial({
					map: mercuryTexture,
				});
				break;

			case "Venus":
				planetMaterial = new THREE.MeshPhongMaterial({
					map: venusTexture,
				});
				break;

			case "Earth":
				planetMaterial = new THREE.MeshPhongMaterial({
					map: earthTexture,
				});
				break;

			case "Mars":
				planetMaterial = new THREE.MeshPhongMaterial({
					map: marsTexture,
				});
				break;

			case "Jupiter":
				planetMaterial = new THREE.MeshPhongMaterial({
					map: jupiterTexture,
				});
				break;

			case "Neptune":
				planetMaterial = new THREE.MeshPhongMaterial({
					map: neptuneTexture,
				});
				break;

			case "Saturn":
				planetMaterial = new THREE.MeshPhongMaterial({
					map: saturnTexture,
				});
				break;

			case "Uranus":
				planetMaterial = new THREE.MeshPhongMaterial({
					map: uranusTexture,
				});
				break;

			default:
				planetMaterial = new THREE.MeshPhongMaterial({
					map: venusTexture,
				});
				break;
		}
		const newplanet = new THREE.Mesh(planetGeometry, planetMaterial);
		newplanet.position.x = planet.position[0];
		newplanet.position.y = planet.position[1];
		newplanet.position.z = planet.position[2];
		newplanet.receiveShadow = true;
		scene.add(newplanet);
	});

	scene.add(sunMesh);
	scene.add(sunCloudsObject);

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
		sunMesh.rotation.y += delta * 0.03;
		sunCloudsObject.rotation.y += delta * 0.03;

		//moon.rotation.y += delta * 0.3;
		// orbitMovement(elapsedTime * 0.01, 1000, earthGroup);

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
})();
