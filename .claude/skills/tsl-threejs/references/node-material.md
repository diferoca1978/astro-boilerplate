# NodeMaterial — Full Property Reference

## NodeMaterial (all materials inherit these)

### Core / Geometry

| Property       | Description                             | Reference Node | Type   |
| -------------- | --------------------------------------- | -------------- | ------ |
| `fragmentNode` | Replaces ALL built-in fragment logic    | —              | `vec4` |
| `vertexNode`   | Replaces ALL built-in vertex logic      | —              | `vec4` |
| `geometryNode` | Execute a TSL Fn to manipulate geometry | —              | `Fn()` |

### Basic

| Property        | Replaces                                                                          | Reference Node      | Type    |
| --------------- | --------------------------------------------------------------------------------- | ------------------- | ------- |
| `colorNode`     | `material.color * material.map`                                                   | `materialColor`     | `vec4`  |
| `depthNode`     | depth output                                                                      | `depth`             | `float` |
| `opacityNode`   | `material.opacity * material.alphaMap`                                            | `materialOpacity`   | `float` |
| `alphaTestNode` | `material.alphaTest` threshold                                                    | `materialAlphaTest` | `float` |
| `positionNode`  | Local vertex positions / `displacementMap * displacementScale + displacementBias` | `positionLocal`     | `vec3`  |

### Lighting

| Property       | Replaces                                                     | Reference Node     | Type                |
| -------------- | ------------------------------------------------------------ | ------------------ | ------------------- |
| `emissiveNode` | `material.emissive * emissiveIntensity * emissiveMap`        | `materialEmissive` | `color`             |
| `normalNode`   | `material.normalMap * normalScale` and `bumpMap * bumpScale` | `materialNormal`   | `vec3` (view-space) |
| `lightsNode`   | Defines lights and lighting model                            | —                  | `lights()`          |
| `envNode`      | `material.envMap * envMapRotation * envMapIntensity`         | —                  | `color`             |

### Backdrop (transmission/refraction)

| Property            | Description                                                    | Type    |
| ------------------- | -------------------------------------------------------------- | ------- |
| `backdropNode`      | Set render color before specular (for transmission/refraction) | `color` |
| `backdropAlphaNode` | Alpha of `backdropNode`                                        | `float` |

### Shadows

| Property                     | Description                              | Reference Node        | Type    |
| ---------------------------- | ---------------------------------------- | --------------------- | ------- |
| `castShadowNode`             | Color and opacity of projected shadow    | —                     | `vec4`  |
| `maskShadowNode`             | Custom shadow mask                       | —                     | `bool`  |
| `receivedShadowNode`         | Handle shadow cast on material           | —                     | `Fn()`  |
| `receivedShadowPositionNode` | Shadow projection position (world-space) | `shadowPositionWorld` | `vec3`  |
| `aoNode`                     | `material.aoMap * aoMapIntensity`        | `materialAO`          | `float` |

### Output

| Property     | Description                                                | Reference Node | Type    |
| ------------ | ---------------------------------------------------------- | -------------- | ------- |
| `maskNode`   | Material mask — discarded early, more optimal than opacity | —              | `bool`  |
| `mrtNode`    | Override MRT for this material                             | —              | `mrt()` |
| `outputNode` | Final output override                                      | `output`       | `vec4`  |

---

## LineDashedNodeMaterial

| Property        | Replaces              | Reference Node           | Type    |
| --------------- | --------------------- | ------------------------ | ------- |
| `dashScaleNode` | `material.scale`      | `materialLineScale`      | `float` |
| `dashSizeNode`  | `material.dashSize`   | `materialLineDashSize`   | `float` |
| `gapSizeNode`   | `material.gapSize`    | `materialLineGapSize`    | `float` |
| `offsetNode`    | `material.dashOffset` | `materialLineDashOffset` | `float` |

---

## MeshPhongNodeMaterial

| Property        | Replaces             | Reference Node      | Type    |
| --------------- | -------------------- | ------------------- | ------- |
| `shininessNode` | `material.shininess` | `materialShininess` | `float` |
| `specularNode`  | `material.specular`  | `materialSpecular`  | `color` |

---

## MeshStandardNodeMaterial

Inherits all NodeMaterial properties, plus:

| Property        | Replaces                                     | Reference Node      | Type    |
| --------------- | -------------------------------------------- | ------------------- | ------- |
| `metalnessNode` | `material.metalness * material.metalnessMap` | `materialMetalness` | `float` |
| `roughnessNode` | `material.roughness * material.roughnessMap` | `materialRoughness` | `float` |

---

## MeshPhysicalNodeMaterial

Inherits MeshStandardNodeMaterial, plus:

| Property                   | Replaces                                                       | Reference Node                 | Type    |
| -------------------------- | -------------------------------------------------------------- | ------------------------------ | ------- |
| `clearcoatNode`            | `material.clearcoat * clearcoatMap`                            | `materialClearcoat`            | `float` |
| `clearcoatRoughnessNode`   | `material.clearcoatRoughness * clearcoatRoughnessMap`          | `materialClearcoatRoughness`   | `float` |
| `clearcoatNormalNode`      | `material.clearcoatNormalMap * clearcoatNormalMapScale`        | `materialClearcoatNormal`      | `vec3`  |
| `sheenNode`                | `material.sheenColor * sheenColorMap`                          | `materialSheen`                | `color` |
| `iridescenceNode`          | `material.iridescence`                                         | `materialIridescence`          | `float` |
| `iridescenceIORNode`       | `material.iridescenceIOR`                                      | `materialIridescenceIOR`       | `float` |
| `iridescenceThicknessNode` | `material.iridescenceThicknessRange * iridescenceThicknessMap` | `materialIridescenceThickness` | `float` |
| `specularIntensityNode`    | `material.specularIntensity * specularIntensityMap`            | `materialSpecularIntensity`    | `float` |
| `specularColorNode`        | `material.specularColor * specularColorMap`                    | `materialSpecularColor`        | `color` |
| `iorNode`                  | `material.ior`                                                 | `materialIOR`                  | `float` |
| `transmissionNode`         | `material.transmission * transmissionMap`                      | `materialTransmission`         | `color` |
| `thicknessNode`            | `material.thickness * thicknessMap`                            | `materialTransmission`         | `float` |
| `attenuationDistanceNode`  | `material.attenuationDistance`                                 | `materialAttenuationDistance`  | `float` |
| `attenuationColorNode`     | `material.attenuationColor`                                    | `materialAttenuationColor`     | `color` |
| `dispersionNode`           | `material.dispersion`                                          | `materialDispersion`           | `float` |
| `anisotropyNode`           | `material.anisotropy * anisotropyMap`                          | `materialAnisotropy`           | `vec2`  |

---

## SpriteNodeMaterial

| Property       | Description     | Type    |
| -------------- | --------------- | ------- |
| `positionNode` | Sprite position | `vec3`  |
| `rotationNode` | Sprite rotation | `float` |
| `scaleNode`    | Sprite scale    | `vec2`  |
