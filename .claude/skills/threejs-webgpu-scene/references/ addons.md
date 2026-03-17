# Three.js Addons — Import Paths Reference

All addons import from `three/addons/`. This path resolves to `three/examples/jsm/` in the package.

## Controls

```js
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import { DragControls } from "three/addons/controls/DragControls.js";
import { FlyControls } from "three/addons/controls/FlyControls.js";
import { FirstPersonControls } from "three/addons/controls/FirstPersonControls.js";
```

## Loaders

```js
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { EXRLoader } from "three/addons/loaders/EXRLoader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { KTX2Loader } from "three/addons/loaders/KTX2Loader.js";
```

## Environments

```js
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { GroundedSkybox } from "three/addons/objects/GroundedSkybox.js";
```

## Helpers

```js
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// Built-in helpers (from three/webgpu directly):
const axesHelper = new THREE.AxesHelper(5);
const gridHelper = new THREE.GridHelper(10, 10);
const arrowHelper = new THREE.ArrowHelper(dir, origin, length, color);
const boxHelper = new THREE.BoxHelper(mesh, color);
const cameraHelper = new THREE.CameraHelper(camera);
const skeletonHelper = new THREE.SkeletonHelper(model);
```

## TSL Post-Processing Nodes

```js
// From three/tsl (built-in)
import { pass, mrt, output, emissive, velocity } from "three/tsl";
import { grayscale, saturation, hue, luminance } from "three/tsl";
import { sepia, dotScreen, film, rgbShift } from "three/tsl"; // some may be addons

// From three/addons/tsl/display/
import { bloom } from "three/addons/tsl/display/BloomNode.js";
import { fxaa } from "three/addons/tsl/display/FXAANode.js";
import { smaa } from "three/addons/tsl/display/SMAANode.js";
import { gaussianBlur } from "three/addons/tsl/display/GaussianBlurNode.js";
import { ao } from "three/addons/tsl/display/GTAONode.js";
import { ssr } from "three/addons/tsl/display/SSRNode.js";
import { dof } from "three/addons/tsl/display/DepthOfFieldNode.js";
import { motionBlur } from "three/addons/tsl/display/MotionBlurNode.js";
import { traa } from "three/addons/tsl/display/TRAANode.js";
import { denoise } from "three/addons/tsl/display/DenoiseNode.js";
import { outline } from "three/addons/tsl/display/OutlineNode.js";
import { lut3D } from "three/addons/tsl/display/LUT3DNode.js";
import { anamorphic } from "three/addons/tsl/display/AnamorphicNode.js";
import { chromaticAberration } from "three/addons/tsl/display/ChromaticAberrationNode.js";
import { afterImage } from "three/addons/tsl/display/AfterImageNode.js";
import { transition } from "three/addons/tsl/display/TransitionNode.js";
import { renderOutput } from "three/addons/tsl/display/RenderOutputNode.js";
```

## Geometry Utilities

```js
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { ParametricGeometry } from "three/addons/geometries/ParametricGeometry.js";
```

## Stats / GUI

```js
import Stats from "three/addons/libs/stats.module.js";
// lil-gui is separate: npm install lil-gui
import GUI from "lil-gui";
```

## GLTF with Draco Compression

```js
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(
  "https://www.gstatic.com/draco/versioned/decoders/1.5.6/",
);

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

const gltf = await gltfLoader.loadAsync("/model.glb");
scene.add(gltf.scene);
```
