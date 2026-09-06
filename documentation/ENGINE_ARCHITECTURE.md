# SckorpioWebEngine Architecture Guide

## 1. Engine purpose and philosophy

SckorpioWebEngine is a small, explicit browser 3D engine built on top of WebGL. It is not a large game-engine framework, and it does not try to hide WebGL behind a heavy abstraction layer. Instead, it exposes the core rendering flow very directly:

- objects are represented as entities and nodes
- data is stored on components
- transforms and animation flow through the scene graph
- geometry and instance data are staged into GPU buffers
- the renderer binds shaders, textures, and uniforms and performs draw calls

The architectural idea is simple: keep the engine readable and traceable. Each major concept remains close to the underlying WebGL concepts, which makes the engine easier to reason about and easier to extend for demos, experiments, and custom visual systems.

---

## 2. High-level architecture overview

The engine is organized into a layered structure that follows the lifecycle of a runtime 3D scene.

### Layer 1: Scene orchestration
This is the runtime shell of the engine. The main scene class coordinates the whole system:

- creates the renderer
- creates the camera
- initializes resource books
- creates helper objects such as the grid and axes
- adds entities to the render/update lists
- starts the frame loop

The primary class here is the scene object in [SckorpioEngine/core/scene/sckorpioScene.js](../SckorpioEngine/core/scene/sckorpioScene.js).

### Layer 2: ECS-style entity and component model
The engine uses an ECS-inspired structure, but it is intentionally lightweight and flexible rather than strict.

- entities are the world objects
- components store data
- nodes participate in hierarchy and transform composition
- the renderer reads component state and converts it to draw commands

The core pieces live in:

- [SckorpioEngine/core/ecs/entity](../SckorpioEngine/core/ecs/entity)
- [SckorpioEngine/core/ecs/component](../SckorpioEngine/core/ecs/component)
- [SckorpioEngine/core/ecs/system](../SckorpioEngine/core/ecs/system)

### Layer 3: Scene graph and transform system
The engine has a real hierarchical transform model. Nodes can parent to other nodes, and the transform system propagates world transforms down the hierarchy. This is what makes composite meshes and grouped structures possible.

This is one of the most significant architectural features of the engine.

### Layer 4: Render data and WebGL bindings
The mesh and render components hold the visible geometry and GPU-facing state. They prepare vertex data, index data, material references, and instance transforms before handing them to the renderer.

### Layer 5: Resource books and WebGL subsystem
The engine manages resources through singleton books:

- shader book
- material book
- texture book

These resource books are central to the architecture because they provide a clean lookup layer between authored scene objects and actual GPU resources.

### Layer 6: Browser integration and debug overlays
The canvas layer provides WebGL context access, logger output, and UI overlays. This keeps the engine display/debug infrastructure separate from the core render path.

---

## 3. Runtime bootstrap flow

The engine starts from the page bootstrap and then builds up the runtime in stages.

### Startup sequence

1. The page creates the WebGL canvas and debug overlay canvases.
2. The main entry script initializes the selected scene.
3. The scene calls `init()` to create the renderer, camera, and resource books.
4. It loads default resources and creates helper objects.
5. The scene creates user objects and custom meshes.
6. The scene calls `load()` to add entities and upload entity data to the GPU.
7. The scene starts the render loop with `play()`.

### Why this staged flow matters

The engine does not assume all GPU resources are immediately available. Many objects depend on the WebGL context, compiled shaders, loaded textures, and valid canvas sizing. The runtime therefore intentionally separates:

- setup
- resource generation
- entity creation
- GPU transfer
- render loop

This stage-based startup is a key part of the engine’s architecture.

---

## 4. Scene class as the engine coordinator

The scene object is the main composition root of the engine.

In the current implementation, the scene owns the following responsibilities:

- renderer instance
- camera instance
- animation system
- shader/material/texture books
- default helper entities like grid and axes
- toggle logic for theme and visibility
- entity registry for render and animation
- frame update loop

The scene does not render itself directly. Instead, it orchestrates other systems and hands execution to the renderer and animation system.

This is important: the scene is not just a container. It is the engine assembly point.

---

## 5. Entity and component model

The engine is built around a very lightweight ECS approach.

### Base entity

The base entity in [SckorpioEngine/core/ecs/entity/entity.js](../SckorpioEngine/core/ecs/entity/entity.js) is intentionally minimal:

- unique id
- list of attached components

This gives every world object a common identity and a container for component data.

### Base component

The base component in [SckorpioEngine/core/ecs/component/component.js](../SckorpioEngine/core/ecs/component/component.js) is also intentionally simple, with a shared `uid` field. The real logic is implemented in derived components.

### Core component responsibilities

The main concrete components reflect the engine’s architecture closely:

- `TransformComponent`
  - stores position, rotation, scale, local matrix, world matrix
  - manages instance transforms and hierarchical updates

- `MeshComponent`
  - stores mesh geometry, material, visibility, texture UVs
  - prepares data for GPU upload

- `RenderComponent`
  - owns WebGL buffers, VAO, shader/material state, and draw settings

- `CameraComponent`
  - owns camera vectors, projection matrix, view matrix, mouse/keyboard controls

This is the engine’s functional data model: any object in the scene can be meaningfully described by a transform, a mesh, and/or a camera.

---

## 6. Scene graph and hierarchy

The scene graph is one of the core architectural features of the engine.

### Node as the hierarchy primitive

The hierarchy root is the `Node` class in [SckorpioEngine/core/ecs/entity/entities/node/node.js](../SckorpioEngine/core/ecs/entity/entities/node/node.js).

A node can:

- have a parent
- contain child nodes
- update its depth in the hierarchy
- own a transform component
- compose local and world transforms
- serve as the base for mesh objects

The `setParent`, `addChild`, and `updateDepth` methods are central to this model. They allow the engine to construct composite object trees instead of treating every mesh as a flat independent object.

### Why this matters architecturally

The hierarchy is not just a convenience. It is how the engine supports:

- grouped objects
- assembled models
- parent-driven motion
- child-local transforms
- instanced object generation

This is the engine’s structural backbone for complex scenes.

---

## 7. Transform system design

The transform layer is the most important data flow in the engine.

The `TransformComponent` in [SckorpioEngine/core/ecs/component/components/transformComponent.js](../SckorpioEngine/core/ecs/component/components/transformComponent.js) stores:

- local position, rotation, scale
- current animation-driven transforms
- world transform matrix
- parent transform reference
- instance transforms for instanced rendering

It creates TRS matrices using gl-matrix operations based on:

1. translation
2. rotation
3. scaling

The transform system supports both source objects and per-instance transforms. The same logic is used for standard meshes and for instanced copies.

This means the architecture is built around the idea that all renderable objects ultimately produce a valid model/world transform before drawing.

### Deep update flow

Before rendering, the scene performs a graph refresh:

- sort entities by depth
- recompute world transforms for each entity
- recompute instance transforms if needed
- mark instanced state when instance count is present

That step ensures the GPU sees consistent transforms before any draw call is issued.

---

## 8. Mesh data and render data pipeline

### Mesh entity

The mesh class in [SckorpioEngine/core/ecs/entity/entities/mesh/mesh.js](../SckorpioEngine/core/ecs/entity/entities/mesh/mesh.js) adds the concrete visual behavior expected by the engine:

- mesh component
- visibility toggling
- material assignment
- color and texture helpers
- GPU upload calls
- instancing support

### Mesh component

The `MeshComponent` in [SckorpioEngine/core/ecs/component/components/meshComponent.js](../SckorpioEngine/core/ecs/component/components/meshComponent.js) is the CPU-side data container for a mesh. It stores:

- vertex data
- index data
- vertex layout
- instance layout
- material reference
- visibility flag
- texture UV state
- the render component object

The most important method here is `loadGPUData(transformComponent)`. This is the handoff point where CPU mesh data becomes GPU-ready state.

### Render component

The `RenderComponent` in [SckorpioEngine/core/ecs/component/components/renderComponent.js](../SckorpioEngine/core/ecs/component/components/renderComponent.js) is the bridge between the engine and WebGL. It owns:

- VertexArray
- VertexBuffer
- IndexBuffer
- InstanceBuffer
- buffer layouts
- shader/material assignment
- draw topology and count

This component is where the engine finally binds a shader, texture, and uniforms, then emits the draw call. It is the crucial point where ECS data turns into actual GPU commands.

---

## 9. Camera architecture

The camera is implemented as an entity with a camera component, not as a global singleton. This is a good match for the engine’s ECS-like composition model.

The camera component in [SckorpioEngine/core/ecs/component/components/cameraComponent.js](../SckorpioEngine/core/ecs/component/components/cameraComponent.js) owns:

- camera position
- front/up vectors
- yaw, pitch, and roll
- view matrix
- projection matrix
- input listeners and resize logic

The architecture is intentionally direct:

- movement comes from keyboard and mouse events
- view matrix is computed via `mat4.lookAt(...)`
- projection is recomputed with the canvas aspect ratio
- the renderer consumes the camera’s matrices every frame

This is a classical real-time rendering camera setup expressed in a component-based form.

---

## 10. Animation architecture

The animation system is a separate subsystem built around keyframes and tracks.

### Classes involved

- [SckorpioEngine/core/ecs/system/animation/animationSystem.js](../SckorpioEngine/core/ecs/system/animation/animationSystem.js)
- [SckorpioEngine/core/ecs/system/animation/animationClip.js](../SckorpioEngine/core/ecs/system/animation/animationClip.js)
- [SckorpioEngine/core/ecs/system/animation/animationTrack.js](../SckorpioEngine/core/ecs/system/animation/animationTrack.js)
- [SckorpioEngine/core/ecs/system/animation/keyFrame.js](../SckorpioEngine/core/ecs/system/animation/keyFrame.js)
- [SckorpioEngine/core/ecs/system/animation/interpolators.js](../SckorpioEngine/core/ecs/system/animation/interpolators.js)

### Runtime model

At runtime, the animation system does this:

1. finds entities with an animation component
2. checks whether a clip is active
3. advances time using delta time and speed
4. evaluates the active clip
5. applies the result to transform data

The engine currently applies animation to transform values, not to arbitrary material or light properties. This is enough for the engine’s use cases and keeps the system lightweight.

### Why this is important

The animation system is a major example of the engine’s architecture philosophy: small subsystems, clear responsibilities, direct data flow, and no hidden abstraction layer.

---

## 11. Resource books and data centralization

The engine centralizes its GPU resources in singleton resource books.

### Shader book

[shaderBook.js](../SckorpioEngine/renderer/webgl/shader/shaderBook.js) loads and stores built-in shaders such as:

- basic
- basic3D
- colorVertex3D
- textureVertex3D
- uvVertex3D

### Material book

[materialBook.js](../SckorpioEngine/renderer/webgl/material/materialBook.js) creates the engine’s named materials and attaches a shader to each one.

### Texture book

[textureBook.js](../SckorpioEngine/renderer/webgl/texture/textureBook.js) manages the asset pool used by materials and meshes.

### Architectural impact

These resource books create a simple but effective pattern:

- scene objects ask for a material by name
- material points to a shader and optional texture
- draw code binds those resources without scene code having to manually rebuild them

This is one of the engine’s clearest architectural design patterns.

---

## 12. Renderer pipeline and draw loop

The actual render loop is in [SckorpioEngine/renderer/webgl/webglRenderer.js](../SckorpioEngine/renderer/webgl/webglRenderer.js).

### What the renderer does every frame

1. clear the screen and enable depth testing/blending
2. reset logger counters
3. iterate over all entities in the scene
4. skip hidden meshes
5. bind VAO, shader, texture, and uniforms
6. issue draw calls
7. unbind the state
8. update log overlays

### Normal draw path

For non-instanced meshes, the renderer sets:

- model matrix
- view matrix
- projection matrix
- color uniform if needed

Then it calls `gl.drawArrays()` or `gl.drawElements()`.

### Instanced draw path

For instanced meshes, it uses the same mesh geometry but distinct instance transforms. In that case it:

- sets view and projection only
- enables instancing in the shader
- calls `gl.drawArraysInstanced()` or `gl.drawElementsInstanced()`

This is a very direct and practical architecture for efficient repeated objects.

---

## 13. WebGL buffer and GPU state layer

This is the lowest level of the engine architecture.

### Buffer classes

The buffer system is intentionally manual and explicit:

- `VertexBuffer`
- `IndexBuffer`
- `InstanceBuffer`
- `VertexArray`
- `BufferLayout`

Each class maps directly to a WebGL concept and is responsible for either data upload or attribute specification.

### Why this matters

The engine is designed so the GPU layout remains visible and understandable. Instead of depending on a high-level abstraction, it chooses explicit state transitions and layout matching. That makes it easy to debug issues where the shader layout and the buffer layout do not match.

This is one of the clearest signs that the engine is intentionally low-level and educational in nature.

---

## 14. Data flow from scene to GPU

The complete runtime path is simple and traceable:

1. A scene object creates a node or mesh.
2. The mesh gets a transform and a mesh description.
3. Geometry and material data are attached to the mesh component.
4. The mesh’s `loadGPUData()` method uploads CPU data to GPU buffers.
5. The renderer binds the mesh’s render state and shader/material resources.
6. The renderer sets uniforms and emits the draw call.
7. The logger records frame statistics and draw counts.

This is the heart of the engine architecture: transform and scene data become GPU commands in a very direct pipeline.

---

## 15. Architectural strengths

This engine has several strong design characteristics:

- clear lifecycle from scene assembly to draw call
- readable scene graph transform model
- direct mapping to WebGL concepts
- explicit resource management via books
- simple animation system with keyframe evaluation
- lightweight ECS-like composition
- good fit for experiments and learning real-time rendering

In other words, the engine is intentionally understandable rather than abstract.

---

## 16. Architectural caveats

The design is also intentionally simple and has some prototype characteristics:

- the scene object mixes orchestration and setup responsibilities
- some browser state is handled explicitly
- the ECS model is lightweight, not full formal ECS
- the renderer is not deeply layered into modern frame graph or render passes
- the engine is more educational and demo-oriented than production-engine grade

These caveats are important to keep in mind, but they do not weaken the core architecture. They simply reflect the engine’s focused design goal.

---

## 17. Most important takeaway

The most accurate mental model for this engine is:

> A scene assembles objects, a node hierarchy drives transforms, components hold render data, the renderer binds GPU resources, and WebGL executes the final draw calls.

That is the central architectural idea of the engine.

The animation system, camera, and resource books all fit into this same model: data flows through the engine in a clear, direct, and inspectable way.

---

## 18. Suggested reading order

To understand the engine in the right order, read these in sequence:

1. [SckorpioEngine/core/scene/sckorpioScene.js](../SckorpioEngine/core/scene/sckorpioScene.js)
2. [SckorpioEngine/core/ecs/entity/entities/node/node.js](../SckorpioEngine/core/ecs/entity/entities/node/node.js)
3. [SckorpioEngine/core/ecs/component/components/transformComponent.js](../SckorpioEngine/core/ecs/component/components/transformComponent.js)
4. [SckorpioEngine/core/ecs/component/components/meshComponent.js](../SckorpioEngine/core/ecs/component/components/meshComponent.js)
5. [SckorpioEngine/core/ecs/component/components/renderComponent.js](../SckorpioEngine/core/ecs/component/components/renderComponent.js)
6. [SckorpioEngine/renderer/webgl/webglRenderer.js](../SckorpioEngine/renderer/webgl/webglRenderer.js)
7. [SckorpioEngine/core/ecs/system/animation/animationSystem.js](../SckorpioEngine/core/ecs/system/animation/animationSystem.js)
8. [SckorpioEngine/renderer/webgl/material/materialBook.js](../SckorpioEngine/renderer/webgl/material/materialBook.js)

This order follows the actual architecture rather than the project folder layout.
