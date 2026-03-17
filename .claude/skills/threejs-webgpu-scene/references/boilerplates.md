# Full Boilerplates — Copy-Paste Ready

## 1. Vanilla JS + Vite (minimal)

```js
// src/main.js
import * as THREE from "three/webgpu";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
);
camera.position.set(0, 1, 3);

const renderer = new THREE.WebGPURenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 0, 0);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const sun = new THREE.DirectionalLight(0xffffff, 2);
sun.position.set(5, 10, 5);
scene.add(sun);

// Content
const mesh = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.6, 0.2, 128, 32),
  new THREE.MeshStandardNodeMaterial({
    color: 0x0088ff,
    roughness: 0.3,
    metalness: 0.5,
  }),
);
scene.add(mesh);

renderer.setAnimationLoop(() => {
  mesh.rotation.y += 0.005;
  controls.update();
  renderer.render(scene, camera);
});
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        overflow: hidden;
        background: #000;
      }
      canvas {
        display: block;
      }
    </style>
  </head>
  <body>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

---

## 2. TypeScript + Vite

```ts
// src/main.ts
import * as THREE from "three/webgpu";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

class App {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGPURenderer;
  private controls: OrbitControls;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    this.camera.position.set(0, 1, 3);

    this.renderer = new THREE.WebGPURenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    window.addEventListener("resize", this.onResize.bind(this));

    this.setupScene();
    this.renderer.setAnimationLoop(this.animate.bind(this));
  }

  private setupScene() {
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(5, 10, 5);
    this.scene.add(light);

    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshStandardNodeMaterial({ color: 0x0066ff }),
    );
    this.scene.add(mesh);
  }

  private onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private animate() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

new App();
```

---

## 3. Astro Component (full scene)

```astro
---
// src/components/ThreeScene.astro
---

<div class="scene-container">
  <canvas id="three-canvas"></canvas>
</div>

<script>
  import * as THREE from "three/webgpu";
  import { OrbitControls } from "three/addons/controls/OrbitControls.js";
  import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

  const container = document.querySelector(".scene-container") as HTMLElement;
  const canvas = document.getElementById("three-canvas") as HTMLCanvasElement;

  const W = container.clientWidth;
  const H = container.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
  camera.position.set(0, 1.5, 4);

  const renderer = new THREE.WebGPURenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  // Environment
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromSceneAsync(new RoomEnvironment()).texture;
  scene.environmentIntensity = 0.6;

  // Controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.minDistance = 1;
  controls.maxDistance = 20;

  // Resize (ResizeObserver for container-relative sizing)
  const ro = new ResizeObserver(() => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
  ro.observe(container);

  // Content
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 32),
    new THREE.MeshStandardNodeMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.9,
    }),
  );
  scene.add(mesh);

  renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
  });

  // Cleanup on navigation
  document.addEventListener(
    "astro:before-swap",
    () => {
      renderer.setAnimationLoop(null);
      renderer.dispose();
      ro.disconnect();
    },
    { once: true },
  );
</script>

<style>
  .scene-container {
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }
  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>
```

---

## 4. With Post-Processing (Bloom + FXAA)

```js
import * as THREE from "three/webgpu";
import { pass } from "three/tsl";
import { bloom } from "three/addons/tsl/display/BloomNode.js";
import { fxaa } from "three/addons/tsl/display/FXAANode.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
);
camera.position.set(0, 1, 3);

const renderer = new THREE.WebGPURenderer({ antialias: false }); // FXAA handles AA
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Post-processing pipeline
const pipeline = new THREE.RenderPipeline(renderer);
const scenePass = pass(scene, camera);
const output = scenePass.getTextureNode();

pipeline.outputNode = fxaa(bloom(output, 1.5, 0.5, 0.8));

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.2));
const light = new THREE.DirectionalLight(0xffffff, 5);
light.position.set(5, 5, 5);
scene.add(light);

// Emissive objects pop with bloom
const mat = new THREE.MeshStandardNodeMaterial({
  color: 0x000000,
  emissive: 0x00aaff,
  emissiveIntensity: 3,
});
scene.add(new THREE.Mesh(new THREE.SphereGeometry(0.5), mat));

renderer.setAnimationLoop(() => {
  controls.update();
  pipeline.render(); // use pipeline.render() instead of renderer.render()
});
```

---

## 5. WebGPU + TSL Custom Material (combined)

```js
import * as THREE from 'three/webgpu'
import { uniform, time, sin, vec3, uv, texture } from 'three/tsl'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(0, 1, 3)

const renderer = new THREE.WebGPURenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// TSL material
const speed = uniform(1.0)
const amplitude = uniform(0.3)

const material = new THREE.MeshStandardNodeMaterial()

// Animated vertex displacement
material.positionNode = /* positionLocal */ (() => {
  const { positionLocal } = await import('three/tsl')
  return positionLocal.add(
    vec3(0, sin(positionLocal.x.mul(3).add(time.mul(speed))).mul(amplitude), 0)
  )
})()

// Dynamic color
material.colorNode = vec3(
  sin(time).mul(0.5).add(0.5),
  sin(time.add(2.1)).mul(0.5).add(0.5),
  sin(time.add(4.2)).mul(0.5).add(0.5)
)

const mesh = new THREE.Mesh(new THREE.PlaneGeometry(4, 4, 32, 32), material)
scene.add(mesh)
scene.add(new THREE.AmbientLight(0xffffff, 1))

renderer.setAnimationLoop(() => {
  controls.update()
  renderer.render(scene, camera)
})
```

> Note: Import `positionLocal` from `'three/tsl'` at the top of the file, not inline. The example above shows the concept — in real code, all TSL imports go at the top.
