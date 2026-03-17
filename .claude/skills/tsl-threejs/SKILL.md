---
name: tsl-threejs
description: >
  Expert guidance for writing shaders using Three.js Shading Language (TSL) — the modern
  JavaScript-native shader system introduced with Three.js WebGPU renderer. Use this skill
  whenever the user asks about TSL, NodeMaterial, shader nodes, WebGPU shaders in Three.js,
  post-processing with TSL, compute shaders in Three.js, or migrating from GLSL/onBeforeCompile
  to TSL. Also trigger when users ask about MeshStandardNodeMaterial, MeshPhysicalNodeMaterial,
  colorNode, positionNode, Fn(), uniform(), texture nodes, or any Three.js node-based material
  property. If the user is writing Three.js shaders or visual effects in any form, check if TSL
  applies before answering.
---

# TSL — Three.js Shading Language

TSL is Three.js's JavaScript-native shader abstraction that compiles to both WGSL (WebGPU) and GLSL (WebGL2). It replaces `onBeforeCompile` with a composable node graph — write once, run anywhere.

## Quick Reference

**Import path:** `import { ... } from 'three/tsl'`  
**Renderer import:** `import * as THREE from 'three/webgpu'`  
**Material classes:** `MeshStandardNodeMaterial`, `MeshPhysicalNodeMaterial`, `MeshPhongNodeMaterial`, `SpriteNodeMaterial`

### Minimal example

```js
import { texture, uv } from "three/tsl";

const detail = texture(detailMap, uv().mul(10));
const material = new THREE.MeshStandardNodeMaterial();
material.colorNode = texture(colorMap).mul(detail);
```

---

## Core Concepts

### Everything is a Node

All TSL components extend `Node`. Nodes compose, share, and reuse — the system deduplicates identical calculations automatically. Importing `positionWorld` in two places computes it only once.

### Fn() — Defining TSL Functions

`Fn()` creates a controllable shader environment that supports `assign`, conditionals, loops, and `Return()`. Use it for any non-trivial logic. Inline arrow functions only work for simple expression chains.

```js
const myEffect = Fn(([t = time]) => {
  return t
    .mul(Math.PI * 2)
    .sin()
    .mul(0.5)
    .add(0.5);
});

// Call it:
material.colorNode = myEffect(someTime);
```

Parameters can be arrays or named objects:

```js
const col = Fn(({ r, g, b }) => vec3(r, g, b));
material.colorNode = col({ r: 0, g: 1, b: 0 });
// or: col(0, 1, 0)
```

For tree-shaking exports: `export const myFn = /*@__PURE__*/ Fn(() => { ... });`

### uniform() — Reactive Values

```js
const myColor = uniform(new THREE.Color(0x0066ff));
material.colorNode = myColor;

// Update at runtime:
myColor.value.set(0xff0000);

// Auto-update events:
const posY = uniform(0);
posY.onObjectUpdate(({ object }) => object.position.y);
posY.onRenderUpdate(({ scene }) => ...);
posY.onFrameUpdate(({ delta }) => ...);
```

---

## Type System & Conversions

### Constructor functions (constants + explicit conversions)

`float`, `int`, `uint`, `bool`, `color`, `vec2`, `vec3`, `vec4`, `mat2`, `mat3`, `mat4`  
Integer variants: `ivec2/3/4`, `uvec2/3/4`, `bvec2/3/4`

```js
material.colorNode = color(0x0066ff); // hex color constant
material.colorNode = vec2(positionWorld); // converts to .xy
```

### Method-chain conversions

`.toFloat()`, `.toInt()`, `.toVec2()`, `.toVec3()`, `.toVec4()`, `.toColor()`, etc.

### Swizzle

```js
const v = vec3(1, 2, 3);
v.zyx; // vec3(3, 2, 1)
v.xy; // vec2(1, 2)
// use xyzw / rgba / stpq
```

---

## Operators (Method Chaining)

All operators return new nodes:

| Op   | Method                 |
| ---- | ---------------------- |
| `+`  | `.add(v)`              |
| `-`  | `.sub(v)`              |
| `*`  | `.mul(v)`              |
| `/`  | `.div(v)`              |
| `%`  | `.mod(v)`              |
| `==` | `.equal(v)`            |
| `!=` | `.notEqual(v)`         |
| `<`  | `.lessThan(v)`         |
| `>`  | `.greaterThan(v)`      |
| `<=` | `.lessThanEqual(v)`    |
| `>=` | `.greaterThanEqual(v)` |

Assignment operators: `.assign(v)`, `.addAssign(v)`, `.subAssign(v)`, `.mulAssign(v)`, `.divAssign(v)`

Logical: `.and(v)`, `.or(v)`, `.not()`, `.xor(v)`  
Bitwise: `.bitAnd(v)`, `.bitOr(v)`, `.bitNot()`, `.bitXor(v)`, `.shiftLeft(v)`, `.shiftRight(v)`

---

## Variables

```js
const uvScaled = uv().mul(10).toVar(); // reusable shader variable
const c = float(0.5).toConst(); // inline constant
const p = property("vec3", "myProp"); // uninitialized property
```

---

## Built-in Nodes

### Position

| Node                    | Space                        | Type |
| ----------------------- | ---------------------------- | ---- |
| `positionGeometry`      | geometry attribute           | vec3 |
| `positionLocal`         | local (after skinning/morph) | vec3 |
| `positionWorld`         | world space                  | vec3 |
| `positionView`          | view/camera space            | vec3 |
| `positionViewDirection` | normalized view dir          | vec3 |

### Normal / Tangent

`normalGeometry`, `normalLocal`, `normalView`, `normalWorld`  
`tangentGeometry`, `tangentLocal`, `tangentView`, `tangentWorld`  
`bitangentGeometry/Local/View/World`

### Camera

`cameraNear`, `cameraFar`, `cameraPosition`, `cameraViewMatrix`, `cameraProjectionMatrix`, `cameraWorldMatrix`, `cameraNormalMatrix`

### Model

`modelWorldMatrix`, `modelViewMatrix`, `modelNormalMatrix`, `modelPosition`, `modelScale`, `modelViewPosition`  
High-precision: `highpModelViewMatrix`, `highpModelNormalViewMatrix`

### Screen / Viewport

`screenUV` (normalized), `screenCoordinate` (pixels), `screenSize`, `screenDPR`  
`viewportUV`, `viewport` (vec4), `viewportCoordinate`, `viewportSize`  
`viewportSharedTexture(uv)` — read already-rendered pixels  
`viewportLinearDepth`, `viewportDepthTexture(uv)`

### Time

`time` (seconds elapsed), `deltaTime` (frame delta)

### Attributes & UV

`uv(index?)`, `vertexColor(index?)`, `attribute(name, type?)`, `instanceIndex`, `vertexIndex`

---

## Textures

```js
texture(map, uv(), level?)        // vec4 — sampled texture
textureLoad(map, uv, level?)      // vec4 — unfiltered fetch
textureStore(map, uv, value)      // void — write (compute)
textureSize(map, level?)          // ivec2
cubeTexture(map, uvw?)            // vec4
texture3D(map, uvw?)              // vec4
triplanarTexture(tx, ty, tz, scale, position, normal)
textureBicubic(textureNode)       // vec4 — mipped bicubic
```

---

## Math Functions

`abs`, `acos`, `asin`, `atan`, `ceil`, `cbrt`, `clamp(x,min,max)`, `cos`, `cross`, `dFdx`, `dFdy`  
`degrees`, `distance`, `dot`, `exp`, `exp2`, `floor`, `fract`, `fwidth`  
`inverseSqrt`, `length`, `lengthSq`, `log`, `log2`, `max`, `min`  
`mix(x,y,a)`, `normalize`, `pow`, `pow2`, `pow3`, `pow4`  
`radians`, `reflect`, `refract`, `round`, `saturate`, `sign`, `sin`  
`smoothstep(e0,e1,x)`, `sqrt`, `step(edge,x)`, `tan`, `trunc`  
`negate`, `oneMinus`, `reciprocal`, `difference`, `transformDirection`

Constants: `PI`, `TWO_PI`, `HALF_PI`, `EPSILON`, `INFINITY`

Method-chain versions available on any node: `.abs()`, `.sin()`, `.cos()`, `.normalize()`, etc.

---

## Control Flow (inside Fn())

### If / ElseIf / Else

```js
If(result.y.greaterThan(10), () => {
  result.y.assign(10);
})
  .ElseIf(result.y.lessThan(-10), () => {
    result.y.assign(-10);
  })
  .Else(() => {
    // ...
  });
```

### Switch / Case / Default

```js
Switch(indexNode)
  .Case(0, () => {
    col.assign(color(1, 0, 0));
  })
  .Case(1, 2, () => {
    col.assign(color(0, 1, 0));
  }) // multi-value
  .Default(() => {
    col.assign(color(1, 1, 1));
  });
// No fallthrough — each Case has implicit break
```

### Ternary (usable outside Fn)

```js
const result = select(value.greaterThan(1), 1.0, value);
// equivalent to: value > 1 ? 1.0 : value
```

### Loops

```js
Loop(10, ({ i }) => {
  /* i: 0..9 */
});

Loop(
  { start: int(0), end: int(10), type: "int", condition: "<" },
  ({ i }) => {},
);

Loop(10, 5, ({ i, j }) => {}); // nested

// while-style:
Loop(value.lessThan(10), () => {
  value.addAssign(1);
});

Break();
Continue(); // loop control
```

### Flow control

`Discard()` — discard fragment  
`Return()` — return from Fn

---

## Varying

```js
// Force vertex-stage execution, interpolate to fragment
const normalView = vertexStage(modelNormalMatrix.mul(normalLocal));
material.colorNode = normalView.normalize();

// Named varying:
varying(positionWorld, "vWorldPos");
varyingProperty("vec3", "myVarying");
```

---

## Arrays

```js
// Constant arrays
const colors = array([vec3(1, 0, 0), vec3(0, 1, 0), vec3(0, 0, 1)]);
const green = colors.element(1);

// Fixed size
const a = array("vec3", 2);

// Fill with default
const b = vec3(0, 0, 1).toArray(2);

// Typed
const c = array([0, 1, 2], "uint");

// Uniform arrays (CPU-updatable)
const tints = uniformArray([new Color(1, 0, 0), new Color(0, 1, 0)], "color");
const first = tints.element(0);
// a[1] = constant index only; a.element(i) = dynamic index ok
```

---

## Structs

```js
const BoundingBox = struct({ min: "vec3", max: "vec3" });
const bb = BoundingBox(vec3(0), vec3(1));
const min = bb.get("min");
min.assign(vec3(-1, -1, -1));
```

---

## Oscillators & UV Utils

```js
oscSine(time)      // 0..1 sine wave
oscSquare(time)    // square wave
oscTriangle(time)  // triangle wave
oscSawtooth(time)  // sawtooth wave

rotateUV(uv(), angle, center?)
spherizeUV(uv(), strength, center?)
spritesheetUV(frameCount, uv(), frame)
equirectUV(direction?)
matcapUV
```

---

## Blend Modes & Color Utils

```js
blendBurn(a, b);
blendDodge(a, b);
blendOverlay(a, b);
blendScreen(a, b);
blendColor(a, b);

grayscale(color);
saturation(node, amount); // 1 = unchanged
vibrance(node, amount);
hue(node, radians);
posterize(node, steps);
luminance(node); // float
```

---

## Reflect & Refract

`reflectView` (view space), `reflectVector` (world space)

---

## Random & Range

```js
hash(seed); // float 0..1
range(minColor, maxColor); // instance-level random attribute
```

---

## NodeMaterial Inputs

> See `references/node-material.md` for full per-material property tables.

### Core slots (all NodeMaterials)

| Property        | Replaces                                 | Type              |
| --------------- | ---------------------------------------- | ----------------- |
| `colorNode`     | `material.color * map`                   | vec4              |
| `opacityNode`   | `material.opacity * alphaMap`            | float             |
| `alphaTestNode` | `material.alphaTest`                     | float             |
| `positionNode`  | local vertex positions / displacementMap | vec3              |
| `normalNode`    | normalMap / bumpMap                      | vec3 (view-space) |
| `emissiveNode`  | emissive \* emissiveMap                  | color             |
| `depthNode`     | depth output                             | float             |
| `fragmentNode`  | full fragment replacement                | vec4              |
| `vertexNode`    | full vertex replacement                  | vec4              |
| `outputNode`    | final output                             | vec4              |
| `envNode`       | environment map                          | color             |
| `lightsNode`    | lighting model                           | lights()          |

### MeshStandardNodeMaterial

`metalnessNode`, `roughnessNode`

### MeshPhysicalNodeMaterial

`clearcoatNode`, `clearcoatRoughnessNode`, `clearcoatNormalNode`, `sheenNode`, `iridescenceNode`, `transmissionNode`, `iorNode`, `thicknessNode`, `dispersionNode`, `anisotropyNode`

### Shadow control

`castShadowNode`, `receivedShadowNode`, `maskShadowNode`, `aoNode`

---

## Post-Processing

```js
import { pass, grayscale } from "three/tsl";
import { gaussianBlur } from "three/addons/tsl/display/GaussianBlurNode.js";

const pipeline = new THREE.RenderPipeline(renderer);
const scenePass = pass(scene, camera);
const output = scenePass.getTextureNode(); // 'output' buffer

pipeline.outputNode = grayscale(gaussianBlur(output, 4));
```

Available effects: `bloom`, `fxaa`, `smaa`, `traa`, `dof`, `motionBlur`, `chromaticAberration`, `ssgi`, `ssr`, `ao`, `film`, `gaussianBlur`, `boxBlur`, `hashBlur`, `sobel`, `outline`, `dotScreen`, `sepia`, `rgbShift`, `lut3D`, `anamorphic`, `afterImage`, `denoise`, `transition`, `renderOutput`

---

## Multiple Render Targets (MRT)

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

const colorTex = scenePass.getTextureNode("output");
const normalTex = scenePass.getTextureNode("normal");
const depthTex = scenePass.getTextureNode("depth"); // always available

// Optimize memory:
scenePass.getTexture("normal").type = THREE.UnsignedByteType;
```

---

## Compute Shaders

```js
import { Fn, instancedArray, instanceIndex, deltaTime } from "three/tsl";

const count = 1000;
const positions = instancedArray(count, "vec3");

const updatePositions = Fn(() => {
  const pos = positions.element(instanceIndex);
  pos.x.addAssign(deltaTime);
})().compute(count);

renderer.computeAsync(updatePositions);
```

Atomic operations: `atomicAdd`, `atomicSub`, `atomicMax`, `atomicMin`, `atomicAnd`, `atomicOr`, `atomicXor`, `atomicStore`, `atomicLoad`  
Barriers: `workgroupBarrier()`, `storageBarrier()`, `textureBarrier()`, `barrier()`  
IDs: `workgroupId`, `localId`, `globalId`, `numWorkgroups`, `subgroupSize`

---

## Fog

```js
import { fog, rangeFogFactor, densityFogFactor, color } from "three/tsl";

scene.fogNode = fog(color(0x000000), rangeFogFactor(10, 100)); // linear
scene.fogNode = fog(color(0xcccccc), densityFogFactor(0.02)); // exponential²
```

---

## Billboarding

```js
material.vertexNode = billboarding(); // horizontal (like trees)
material.vertexNode = billboarding({ horizontal: true, vertical: true }); // full (like particles)
```

---

## Sharing Across Materials

```js
const sharedColor = uniform(new THREE.Color());

materialA.colorNode = sharedColor.div(2);
materialB.colorNode = sharedColor.mul(0.5);
materialC.colorNode = sharedColor.add(0.5);
```

---

## GLSL → TSL Migration

| GLSL                | TSL                      |
| ------------------- | ------------------------ |
| `position`          | `positionGeometry`       |
| `transformed`       | `positionLocal`          |
| `transformedNormal` | `normalLocal`            |
| `vWorldPosition`    | `positionWorld`          |
| `vUv` / `uv`        | `uv()`                   |
| `vNormal`           | `normalView`             |
| `vColor`            | `vertexColor()`          |
| `viewMatrix`        | `cameraViewMatrix`       |
| `modelMatrix`       | `modelWorldMatrix`       |
| `modelViewMatrix`   | `modelViewMatrix`        |
| `projectionMatrix`  | `cameraProjectionMatrix` |
| `diffuseColor`      | `material.colorNode`     |
| `gl_FragColor`      | `material.fragmentNode`  |
| `onBeforeCompile()` | TSL node graph           |

---

## Extended Reference

For complete material property tables and advanced patterns, read:  
→ `references/node-material.md` — full NodeMaterial input tables per material type  
→ `references/patterns.md` — common patterns: detail maps, noise, dissolve, rim light, etc.
