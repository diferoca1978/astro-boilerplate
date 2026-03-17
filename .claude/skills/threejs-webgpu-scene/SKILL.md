---
name: threejs-webgpu-scene
description: >
  Complete setup guide for Three.js WebGPU scenes: renderer initialization, animation loop,
  Vite configuration, post-processing pipeline, OrbitControls, resize handling, and scene
  organization patterns. Use this skill whenever a user is setting up a new Three.js project
  with WebGPURenderer, asking how to initialize WebGPU, configure Vite for Three.js WebGPU,
  integrate the RenderPipeline for post-processing, or structure a Three.js WebGPU scene from
  scratch. Also trigger when the user is migrating from WebGLRenderer to WebGPURenderer, setting
  up the animation loop with setAnimationLoop, adding OrbitControls to a WebGPU scene, or
  integrating Three.js WebGPU in Astro. Always use this skill alongside tsl-threejs when writing
  custom shaders or materials.
---

# Three.js WebGPU Scene Setup

Since **r171 (September 2025)**, WebGPU in Three.js is production-ready with zero configuration. All major browsers support it (Safari 26 was the last to add support). The renderer automatically falls back to WebGL 2 when WebGPU is unavailable.

## Critical differences vs WebGLRenderer

| WebGLRenderer                        | WebGPURenderer                                |
| ------------------------------------ | --------------------------------------------- |
| `import * as THREE from 'three'`     | `import * as THREE from 'three/webgpu'`       |
| `new THREE.WebGLRenderer()`          | `new THREE.WebGPURenderer()`                  |
| `renderer.render(scene, camera)`     | `renderer.render(scene, camera)` ✓ same       |
| `requestAnimationFrame(loop)`        | `renderer.setAnimationLoop(loop)` ✓ preferred |
| `EffectComposer` + passes            | `RenderPipeline` + TSL node composition       |
| `ShaderMaterial` / `onBeforeCompile` | `NodeMaterial` + TSL                          |

**Not supported in WebGPURenderer:** `ShaderMaterial`, `RawShaderMaterial`, `onBeforeCompile()`, `EffectComposer`.

---

## Minimal Vanilla JS/TS Boilerplate

```js
import * as THREE from "three/webgpu";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
);
camera.position.set(0, 1, 3);

// Renderer — WebGPU with WebGL 2 fallback automatic
const renderer = new THREE.WebGPURenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Scene content
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshStandardNodeMaterial({ color: 0x0066ff }),
);
scene.add(mesh);
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
scene.add(new THREE.DirectionalLight(0xffffff, 1));

// Animation loop — setAnimationLoop handles async WebGPU init automatically
renderer.setAnimationLoop(() => {
  controls.update();
  renderer.render(scene, camera);
});
```

---

## Async Init (when needed outside animation loop)

Use `await renderer.init()` only when you need the renderer before the first frame, e.g. in a setup function:

```js
const renderer = new THREE.WebGPURenderer({ antialias: true });
await renderer.init(); // Explicitly wait for GPU adapter + device
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Now safe to use renderer immediately
```

`setAnimationLoop()` handles init automatically — no need for `await renderer.init()` when using it.

---

## Vite Configuration

### Basic (r171+, zero config needed)

```js
// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  // No special config required for three/webgpu since r171
});
```

### If you hit top-level await errors (older setups / Threlte)

```js
// vite.config.js
import { defineConfig } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
  plugins: [topLevelAwait()],
  optimizeDeps: {
    exclude: ["three/webgpu"],
  },
});
```

### Import map (for non-bundler HTML setups)

```html
<script type="importmap">
  {
    "imports": {
      "three": "./node_modules/three/build/three.webgpu.js",
      "three/webgpu": "./node_modules/three/build/three.webgpu.js",
      "three/tsl": "./node_modules/three/build/three.tsl.js",
      "three/addons/": "./node_modules/three/examples/jsm/"
    }
  }
</script>
```

---

## Astro Integration

```astro
---
// src/components/ThreeScene.astro
---

<canvas id="three-canvas"></canvas>

<script>
  import * as THREE from "three/webgpu";
  import { OrbitControls } from "three/addons/controls/OrbitControls.js";

  const canvas = document.getElementById("three-canvas") as HTMLCanvasElement;

  const renderer = new THREE.WebGPURenderer({ canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    100,
  );
  camera.position.z = 3;

  const controls = new OrbitControls(camera, canvas);

  renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
  });
</script>

<style>
  canvas {
    width: 100%;
    height: 100vh;
    display: block;
  }
</style>
```

---

## WebGPU Detection

Three.js handles fallback automatically. If you need to know which backend is active:

```js
await renderer.init();
const isWebGPU = renderer.backend.isWebGPUBackend === true;
console.log("Backend:", isWebGPU ? "WebGPU" : "WebGL 2");
```

Force WebGL 2 for testing:

```js
const renderer = new THREE.WebGPURenderer({
  antialias: true,
  forceWebGL: true,
});
```

---

## Render Pipeline (Post-Processing)

The `RenderPipeline` replaces `EffectComposer`. Effects are composed as TSL node graphs.

```js
import * as THREE from "three/webgpu";
import { pass } from "three/tsl";
import { bloom } from "three/addons/tsl/display/BloomNode.js";
import { fxaa } from "three/addons/tsl/display/FXAANode.js";

const renderer = new THREE.WebGPURenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Create pipeline
const pipeline = new THREE.RenderPipeline(renderer);

// Scene pass
const scenePass = pass(scene, camera);
const output = scenePass.getTextureNode();

// Compose effects
pipeline.outputNode = fxaa(bloom(output, 1.0, 0.5, 0.8));

// In animation loop — use pipeline.render() instead of renderer.render()
renderer.setAnimationLoop(() => {
  controls.update();
  pipeline.render();
});
```

### Update pipeline at runtime

```js
pipeline.outputNode = showBloom ? bloomPass : output;
pipeline.needsUpdate = true;
```

---

## Environment & Lighting

```js
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

// Quick environment setup
const pmremGenerator = new THREE.PMREMGenerator(renderer);
scene.environment = pmremGenerator.fromSceneAsync(
  new RoomEnvironment(),
).texture;
scene.environmentIntensity = 0.8;

// Or HDRI
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
const hdri = await new RGBELoader().loadAsync("/envmap.hdr");
scene.environment = pmremGenerator.fromEquirectangular(hdri).texture;
```

---

## Material Migration Cheatsheet

| Old (WebGLRenderer)                | New (WebGPURenderer)                    |
| ---------------------------------- | --------------------------------------- |
| `new THREE.MeshStandardMaterial()` | `new THREE.MeshStandardNodeMaterial()`  |
| `new THREE.MeshPhysicalMaterial()` | `new THREE.MeshPhysicalNodeMaterial()`  |
| `new THREE.MeshPhongMaterial()`    | `new THREE.MeshPhongNodeMaterial()`     |
| `new THREE.MeshBasicMaterial()`    | `new THREE.MeshBasicNodeMaterial()`     |
| `new THREE.SpriteMaterial()`       | `new THREE.SpriteNodeMaterial()`        |
| Custom GLSL via `ShaderMaterial`   | `NodeMaterial` + TSL                    |
| `onBeforeCompile()`                | TSL node properties (`colorNode`, etc.) |

Regular Three.js materials (`MeshStandardMaterial`, etc.) **still work** with WebGPURenderer for simple cases — you only need NodeMaterial variants when using TSL node properties.

---

## With Compute Shaders (async loop)

When using compute shaders, use `renderAsync` to ensure GPU synchronization:

```js
renderer.setAnimationLoop(async () => {
  await renderer.computeAsync(computeShader);
  await renderer.renderAsync(scene, camera);
});
```

---

## Scene Structure Pattern (recommended)

```
src/
├── main.ts          — renderer, camera, resize, animation loop
├── scene.ts         — scene assembly, lights, environment
├── materials/       — TSL materials (one file per material)
│   ├── dissolve.ts
│   └── rimLight.ts
├── compute/         — compute shaders
│   └── particles.ts
└── postprocessing/  — pipeline setup
    └── pipeline.ts
```

---

## Common Gotchas

- **`three/webgpu` ≠ `three`** — always import from `three/webgpu` or you'll use the WebGL build
- **`EffectComposer` won't work** — use `RenderPipeline` + TSL post-processing nodes
- **`ShaderMaterial` won't work** — port to `NodeMaterial` + TSL
- **Async init is automatic** with `setAnimationLoop()` — only use `await renderer.init()` for manual control
- **`renderer.render()` works** for simple scenes; use `renderer.renderAsync()` when you have compute passes
- **`setAnimationLoop(null)`** stops the loop cleanly (use in component cleanup / Astro `onDestroy`)

---

## References

→ `references/addons.md` — OrbitControls, loaders, helpers, RoomEnvironment, common addons import paths  
→ `references/boilerplates.md` — Full copy-paste boilerplates: vanilla, Astro, with post-processing
