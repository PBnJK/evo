/* script.js
 * Main script
 *
 * TODO:
 * - [ ] Modularize
 */

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

class Renderer {
  #renderer = null;

  #camera = null;
  #orbitControls = null;

  #scene = null;

  constructor() {
    this.#renderer = this.#createRenderer();

    this.#camera = this.#createCamera();
    this.#orbitControls = new OrbitControls(
      this.#camera,
      this.#renderer.domElement,
    );

    this.#camera.position.z = 4;
    this.#orbitControls.update();

    this.#scene = this.#createScene();
  }

  #createRenderer() {
    const canvas = document.getElementById("canvas");
    return new THREE.WebGLRenderer({ antialias: true, canvas });
  }

  #createCamera() {
    const fov = 75;
    const aspect = 2;
    const near = 0.1;
    const far = 20;

    return new THREE.PerspectiveCamera(fov, aspect, near, far);
  }

  #createScene() {
    return new THREE.Scene();
  }

  #resizeRendererToDisplaySize() {
    const canvas = this.#renderer.domElement;
    const pixelRatio = window.devicePixelRatio;

    const width = Math.floor(canvas.clientWidth * pixelRatio);
    const height = Math.floor(canvas.clientHeight * pixelRatio);

    if (canvas.width !== width || canvas.height !== height) {
      this.#renderer.setSize(width, height, false);
      this.#camera.aspect = canvas.clientWidth / canvas.clientHeight;
      this.#camera.updateProjectionMatrix();
    }
  }

  render() {
    this.#resizeRendererToDisplaySize();

    this.#orbitControls.update();
    this.#renderer.render(this.#scene, this.#camera);
  }

  addMesh(mesh) {
    this.#scene.add(mesh);
  }

  removeMesh(mesh) {
    this.#scene.remove(mesh);
  }
}

const Direction = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3,
};

const HALF_PI = Math.PI / 2;
const TAU = Math.PI * 2;

class Entity {
  #pivot = null;
  #id = -1;

  #dir = Direction.UP;

  static idCounter = 0;

  constructor() {
    this.#pivot = this.#createPivot();
    this.#id = this.idCounter++;
  }

  #createPivot() {
    return new THREE.Object3D();
  }

  update(_time) {}

  move() {}

  turnLeft() {
    this.#pivot.rotation.y -= HALF_PI;
  }

  turnLeft() {
    this.#pivot.rotation.y += TAU;
  }

  addMesh(mesh) {
    this.#pivot.add(mesh);
  }

  removeMesh(mesh) {
    this.#pivot.remove(mesh);
  }

  getMesh() {
    return this.#pivot;
  }
}

class CreatureEntity extends Entity {
  #faceMaterial = null;
  #skinMaterial = null;

  #head = null;
  #body = null;

  constructor() {
    super();

    this.#skinMaterial = this.#createSkinMaterial();
    this.#faceMaterial = this.#createFaceMaterial();

    this.#head = this.#createHead();
    this.#body = this.#createBody();
    this.#body.position.y -= 1;

    this.addMesh(this.#head);
    this.addMesh(this.#body);
  }

  #createSkinMaterial() {
    return new THREE.MeshBasicMaterial({ color: 0x44aa88 });
  }

  #createFaceMaterial() {
    const texture = new THREE.TextureLoader().load(
      "../public/texture/tex_face.jpg",
    );

    const material = new THREE.MeshBasicMaterial({
      color: 0x44aa88,
      map: texture,
    });

    material.map.minFilter = THREE.LinearMipMapLinearFilter;
    material.map.magFilter = THREE.NearestFilter;

    return material;
  }

  #createHead() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    return new THREE.Mesh(geometry, [
      this.#skinMaterial /* Right */,
      this.#skinMaterial /* Left */,
      this.#skinMaterial /* Top */,
      this.#skinMaterial /* Bottom */,
      this.#skinMaterial /* Back */,
      this.#faceMaterial /* Front */,
    ]);
  }

  #createBody() {
    const geometry = new THREE.BoxGeometry(0.8, 1, 0.8);
    return new THREE.Mesh(geometry, this.#skinMaterial);
  }
}

class Simulation {
  #renderer = null;
  #entities = {};

  constructor() {
    this.#renderer = new Renderer();
  }

  begin() {
    const simCallback = (time) => {
      for (const key in this.#entities) {
        this.#entities[key].update(time);
      }

      this.#renderer.render();
      requestAnimationFrame(simCallback);
    };

    requestAnimationFrame(simCallback);
  }

  addEntity(entity) {
    this.#entities[entity.id] = entity;

    const mesh = entity.getMesh();
    this.#renderer.addMesh(mesh);
  }

  removeEntity(entity) {
    delete this.#entities[entity.id];

    const mesh = entity.getMesh();
    this.#renderer.removeMesh(mesh);
  }
}

export function main() {
  const sim = new Simulation();

  const e = new CreatureEntity();
  sim.addEntity(e);

  sim.begin();
}
