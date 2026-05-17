# Standalone Parking Car

This folder is a copied-out version of the car used in the simulator.

Files:
- `carGltf.js`: inline body model generator
- `parkingCar.js`: standalone Three.js mesh builder plus matching Cannon body helper
- `index.js`: simple re-export file

Minimal usage:

```js
import * as THREE from "three";
import * as CANNON from "cannon-es";
import {
  createParkingCarMesh,
  createParkingCarBody,
  syncParkingCarMeshFromBody,
} from "./index.js";

const scene = new THREE.Scene();
const world = new CANNON.World();

const carMesh = await createParkingCarMesh({ parent: scene });
const carBody = createParkingCarBody({ world, position: [0, 0.82, 0] });

function tick() {
  world.step(1 / 60);
  syncParkingCarMeshFromBody(carMesh, carBody);
}
```
