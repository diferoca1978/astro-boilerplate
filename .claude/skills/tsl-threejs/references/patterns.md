# TSL Common Patterns

## Detail Map (texture layering)

```js
import { texture, uv } from "three/tsl";

const detail = texture(detailMap, uv().mul(10));
const material = new THREE.MeshStandardNodeMaterial();
material.colorNode = texture(colorMap).mul(detail);
```

---

## Vertex Displacement (wave)

```js
import { positionLocal, sin, time, vec3 } from "three/tsl";

const material = new THREE.MeshStandardNodeMaterial();
material.positionNode = positionLocal.add(
  vec3(0, sin(positionLocal.x.add(time)).mul(0.2), 0),
);
```

---

## Rim Light Effect

```js
import {
  Fn,
  normalView,
  positionViewDirection,
  pow,
  vec3,
  vec4,
} from "three/tsl";

const rimLight = Fn(() => {
  const rim = float(1).sub(normalView.dot(positionViewDirection).abs());
  return pow(rim, 3.0).mul(vec3(0, 0.5, 1));
});

const material = new THREE.MeshStandardNodeMaterial();
material.emissiveNode = rimLight();
```

---

## Dissolve / Cutout with Noise

```js
import { texture, uv, uniform, Discard, Fn } from "three/tsl";

const dissolveAmount = uniform(0.5);

const dissolve = Fn(() => {
  const noise = texture(noiseMap, uv()).r;
  If(noise.lessThan(dissolveAmount), () => {
    Discard();
  });
  return vec4(1);
});

material.fragmentNode = dissolve();
```

---

## Animated UV Scrolling

```js
import { texture, uv, time, vec2 } from "three/tsl";

const scrollSpeed = vec2(0.1, 0.0);
const scrolledUV = uv().add(time.mul(scrollSpeed));

material.colorNode = texture(map, scrolledUV);
```

---

## Checkerboard Pattern

```js
import { checker, uv } from "three/tsl";

material.colorNode = checker(uv().mul(10));
```

---

## Color from World Position (debug)

```js
import { positionWorld } from "three/tsl";

material.colorNode = positionWorld.fract(); // nice debug visualization
```

---

## Instance Color Randomization

```js
import { range } from "three/tsl";

const randomColor = range(new THREE.Color(0x000000), new THREE.Color(0xffffff));
material.colorNode = randomColor;

const mesh = new THREE.InstancedMesh(geometry, material, 1000);
```

---

## Triplanar Texture Mapping

```js
import { triplanarTexture } from "three/tsl";

material.colorNode = triplanarTexture(rockTex, null, null, float(0.5));
```

---

## Matcap Shading

```js
import { texture, matcapUV } from "three/tsl";

const material = new THREE.MeshPhongNodeMaterial();
material.colorNode = texture(matcapMap, matcapUV);
// Disable lights for pure matcap:
material.lightsNode = lights([]);
```

---

## Refraction / Backdrop

```js
import { viewportSharedTexture, screenUV } from "three/tsl";

const material = new THREE.MeshPhysicalNodeMaterial();
material.backdropNode = viewportSharedTexture(screenUV);
material.transparent = true;
```

---

## Grayscale Background (simple refraction)

```js
import { grayscale, viewportSharedTexture, screenUV } from "three/tsl";

material.colorNode = grayscale(viewportSharedTexture(screenUV));
material.transparent = true;
```

---

## Full Post-Processing Pipeline with Bloom

```js
import * as THREE from "three/webgpu";
import { pass } from "three/tsl";
import { bloom } from "three/addons/tsl/display/BloomNode.js";

const pipeline = new THREE.RenderPipeline(renderer);
const scenePass = pass(scene, camera);
const output = scenePass.getTextureNode();

pipeline.outputNode = bloom(output, 1.0, 0.5, 0.8);

function animate() {
  pipeline.render();
}
```

---

## Dynamic Material Conditional (Fn with NodeBuilder)

```js
import { Fn, uniform, vec3 } from "three/tsl";

const customColor = Fn(({ material }) => {
  if (material.userData.customColor !== undefined) {
    return uniform(material.userData.customColor);
  }
  return vec3(0);
});

material.colorNode = customColor();
```

---

## Compute: Particle Simulation

```js
import { Fn, instancedArray, instanceIndex, deltaTime, float } from "three/tsl";

const count = 10000;
const positions = instancedArray(count, "vec3");
const velocities = instancedArray(count, "vec3");

const updateParticles = Fn(() => {
  const pos = positions.element(instanceIndex);
  const vel = velocities.element(instanceIndex);
  pos.addAssign(vel.mul(deltaTime));
  // gravity
  vel.y.subAssign(float(9.8).mul(deltaTime));
})().compute(count);

// In render loop:
renderer.computeAsync(updateParticles);
```

---

## Shared Uniform Across Materials

```js
import { uniform } from "three/tsl";

const globalTime = uniform(0);
globalTime.onFrameUpdate(({ time }) => time);

materialA.colorNode = texture(mapA, uv().add(globalTime.mul(0.1)));
materialB.emissiveNode = vec3(globalTime.sin().mul(0.5).add(0.5));
```

---

## Vertex Stage Optimization (varyings)

```js
import { vertexStage, modelNormalMatrix, normalLocal } from "three/tsl";

// Heavy calc done once per vertex, not per fragment
const normalView = vertexStage(modelNormalMatrix.mul(normalLocal));

material.colorNode = normalView.normalize().toColor();
```

---

## MRT Deferred-Style Setup

```js
import {
  pass,
  mrt,
  output,
  normalView,
  directionToColor,
  velocity,
} from "three/tsl";

const scenePass = pass(scene, camera);

scenePass.setMRT(
  mrt({
    output: output,
    normal: directionToColor(normalView),
    velocity: velocity,
  }),
);

// Optimize buffer formats:
scenePass.getTexture("normal").type = THREE.UnsignedByteType;

const colorNode = scenePass.getTextureNode("output");
const normalNode = scenePass.getTextureNode("normal");
const depthNode = scenePass.getTextureNode("depth");

// Compose in post:
pipeline.outputNode = ao(depthNode, normalNode, camera);
```

---

## Dynamic Pipeline Switching

```js
pipeline.outputNode = showDebug ? normalPass : bloomPass;
pipeline.needsUpdate = true;
```
