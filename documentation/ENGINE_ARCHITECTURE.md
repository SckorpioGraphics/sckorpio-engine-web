# SckorpioWebEngine Architecture Guide

## 1. Purpose and philosophy

SckorpioWebEngine is a small browser 3D engine built on WebGL 2.0. It keeps the rendering pipeline explicit: scenes assemble entities, components hold state, transforms produce model matrices, and the WebGL renderer binds resources and performs draw calls.

The engine uses a lightweight ECS-inspired design rather than a strict ECS framework. This keeps the code close to the underlying WebGL concepts and makes it suitable for experiments, demos, and learning.

## 2. Runtime layers

The runtime is organized into six cooperating layers:

1. **Application projects** define scene-specific resources and entities.
2. **Scene orchestration** initializes the renderer, camera, resource books, helper entities, systems, and frame loop.
3. **ECS-inspired objects** provide entities, nodes, and components.
4. **Transform and animation systems** calculate hierarchical transforms and animated TRS values.
5. **WebGL rendering** uploads mesh data and issues normal or instanced draw calls.
6. **Canvas utilities** provide the WebGL context, title overlay, and logger overlay.

## 3. Project bootstrap

The browser starts at [index.html](../index.html), which creates the WebGL, title, and logger canvases and loads `gl-matrix` before [main.js](../main.js).

`main.js` selects a project directory and dynamically imports its `scene.js` module. The current selection is `./projects/testing1Basic`:

```js
const project = "./projects/testing1Basic";
const { Scene } = await import(project + "/scene.js");

var setProject = async function () {
    var scene = new Scene(project);
    await scene.init();
}

setProject();
```

The current entry point initializes the selected scene only. Applications can continue the full lifecycle by calling `initResources()`, `createScene()`, `load()`, and `play()`. The [projects/](../projects/) directory contains demos, tests, and the template project; [sckorpioProject/scene.js](../sckorpioProject/scene.js) remains an additional showcase project.

## 4. Scene orchestration

[sckorpioScene.js](../sckorpioEngine/core/scene/sckorpioScene.js) is the engine composition root. Its lifecycle is:

1. `init()` creates the `WebGLRenderer`, `AnimationSystem`, `Camera`, and singleton resource books.
2. Default shaders, textures, materials, grid, and axis helpers are initialized.
3. The project scene's `initResources()` loads custom textures when the application invokes it.
4. The project scene's `createScene()` populates `entitiesList`.
5. `load()` updates the scene graph, registers animated entities, adds entities to the renderer, and uploads GPU data.
6. `play()` starts the `requestAnimationFrame` loop.

Each frame, `update(timestamp)` calculates delta time, updates animations, refreshes world and instance transforms, uploads changed entity data, renders, and schedules the next frame.

The scene also handles keyboard controls for grid visibility (`G`), axis visibility (`Y`), and light/dark mode (`M`).

## 5. ECS-inspired model

The base [Entity](../sckorpioEngine/core/ecs/entity/entity.js) stores an identifier and component list. The base [Component](../sckorpioEngine/core/ecs/component/component.js) stores a component identifier. Specialized entities and components add behavior:

- **Node** manages parent-child relationships, hierarchy depth, and transforms.
- **Mesh** combines transform and mesh components and exposes material, texture, color, visibility, and instancing helpers.
- **Camera** owns camera movement and its camera component.
- **TransformComponent** stores local/current TRS values, world matrices, parent references, and instance matrices.
- **MeshComponent** stores vertex/index data, layouts, material state, visibility, and the render component.
- **RenderComponent** owns VAOs, vertex/index/instance buffers, draw settings, and material bindings.
- **AnimationComponent** stores an animation clip and playback state.

The public facade in [sckorpioEngine.js](../sckorpioEngine/sckorpioEngine.js) exposes `Scene`, `Node`, `Cube`, `Sphere`, `Cone`, `Cylinder`, `Star`, `Plane`, `AnimationClip`, and `AnimationTrack` through the `Sckorpio` object.

## 6. Scene graph and transforms

[node.js](../sckorpioEngine/core/ecs/entity/entities/node/node.js) provides `setParent`, `addChild`, and `updateDepth`. A child links its transform component to the parent's transform component, so parent movement and rotation propagate to descendants.

Before rendering, the scene sorts entities by depth and calls `setWorldTransform()` and `setWorldInstancesTransforms()`. This makes parent transforms available before child transforms and prepares instance matrices for GPU upload.

The transform component composes translation, X/Y/Z rotation in degrees, and scale with `gl-matrix`. Animation is additive for position and rotation and multiplicative for scale.

## 7. Animation system

Animation is implemented under [core/ecs/system/animation](../sckorpioEngine/core/ecs/system/animation):

- `KeyFrame` stores a time/value pair.
- `interpolators.js` provides scalar and vector linear interpolation.
- `AnimationTrack` manages sorted keyframes for one property.
- `AnimationClip` combines tracks and uses the longest track as its duration.
- `AnimationComponent` provides clip, time, playing, loop, and speed state.
- `AnimationSystem` advances active clips and applies results to transform components.

The current animation scope is transform properties: position, rotation, and scale. It supports looping, one-shot playback, playback speed, scene graph hierarchies, and instanced meshes. The examples are [testing4Animations](../projects/testing4Animations/), [testing5AnimationsInstances](../projects/testing5AnimationsInstances/), and [testing6AnimationsCombo](../projects/testing6AnimationsCombo/).

## 8. Resource books

The renderer uses singleton books to centralize GPU resources:

- [ShaderBook](../sckorpioEngine/renderer/webgl/shader/shaderBook.js) loads built-in shader programs from `renderer/webgl/resources/shaders/`.
- [MaterialBook](../sckorpioEngine/renderer/webgl/material/materialBook.js) creates named materials and connects them to shaders and optional textures.
- [TextureBook](../sckorpioEngine/renderer/webgl/texture/textureBook.js) loads built-in textures and project-specific textures into a map.

Scene objects request materials and textures by name, allowing the draw path to reuse resources without rebuilding them for every mesh.

## 9. Renderer pipeline

[webglRenderer.js](../sckorpioEngine/renderer/webgl/webglRenderer.js) performs the GPU-facing frame work:

1. Clear color and depth buffers and enable depth testing/blending.
2. Reset logger counters.
3. Skip hidden meshes.
4. Bind the render component's VAO, buffers, shader, and texture.
5. For normal meshes, set model, view, and projection matrices.
6. For instanced meshes, set view and projection matrices and use instance attributes.
7. Issue `gl.drawArrays`, `gl.drawElements`, `gl.drawArraysInstanced`, or `gl.drawElementsInstanced`.
8. Unbind vertex-array state and display logger statistics.

The lower-level buffer classes in [renderer/webgl/buffer](../sckorpioEngine/renderer/webgl/buffer) map directly to WebGL vertex buffers, index buffers, instance buffers, VAOs, and attribute layouts.

## 10. Canvas and input integration

[canvas/utils.js](../sckorpioEngine/canvas/utils.js) obtains the WebGL 2 context and provides canvas sizing, aspect-ratio, and resource-ID helpers. [title.js](../sckorpioEngine/canvas/title.js) draws the engine title, while [logger.js](../sckorpioEngine/canvas/logger.js) tracks FPS, frame time, draw calls, and triangles. The logger can be toggled with `L`.

The camera component handles keyboard movement, mouse rotation, mouse-wheel movement, and projection updates when the window is resized.

## 11. Project layout

```text
.
├── index.html
├── main.js
├── sckorpioEngine/
│   ├── canvas/
│   ├── core/
│   │   ├── ecs/
│   │   └── scene/
│   ├── renderer/webgl/
│   └── sckorpioEngine.js
├── sckorpioProject/
│   ├── scene.js
│   └── resources/textures/
└── projects/
    ├── project*/
    ├── testing*/
    └── templateProject/
```

## 12. Architectural takeaway

The most accurate mental model is:

> A project scene creates entities, nodes compose their transforms, components prepare render state, resource books provide GPU assets, and the renderer turns that state into WebGL draw calls.
