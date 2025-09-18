/* script.js
 * Main script
 *
 * TODO:
 * - [ ] Modularize
 */

import * as THREE from "three";

class Renderer {
  #renderer = null;
  #camera = null;
  #scene = null;

  constructor() {
    this.#renderer = this.#createRenderer();
    this.#camera = this.#createCamera();
    this.#scene = this.#createScene();

    this.#camera.position.z = 2;

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 });
    const cube = new THREE.Mesh(geometry, material);
    this.#scene.add(cube);
  }

  #createRenderer() {
    const canvas = document.getElementById("canvas");
    return new THREE.WebGLRenderer({ antialias: true, canvas });
  }

  #createCamera() {
    const fov = 75;
    const aspect = 2;
    const near = 0.1;
    const far = 5;

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

  beginRendering() {
    const renderCallback = (time) => {
      time *= 0.001;

      this.#resizeRendererToDisplaySize();

      this.#renderer.render(this.#scene, this.#camera);
      requestAnimationFrame(renderCallback);
    };

    requestAnimationFrame(renderCallback);
  }
}

class Entity {
  constructor() {}
}

class Simulation {
  #renderer = null;

  constructor() {
    this.#renderer = new Renderer();
  }

  begin() {
    this.#renderer.beginRendering();
  }
}

export function main() {
  const sim = new Simulation();
  sim.begin();
}
