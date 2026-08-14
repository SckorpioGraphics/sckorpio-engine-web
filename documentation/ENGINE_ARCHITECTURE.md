# SckorpioWebEngine Architecture Guide

## 1. What this engine is

SckorpioWebEngine is a lightweight, browser-based 3D rendering engine written in JavaScript and built on top of WebGL 2.0. Its design is inspired by a hybrid approach of:

- **Entity-Component-System (ECS)** ideas for scene objects
- **Resource books** for shaders, materials, and textures
- **Manual GPU buffer management** for geometry and instancing
- **A scene-based execution model** that mirrors a game engine loop

The engine is intentionally small and explicit: instead of hiding WebGL complexity behind a large framework, it exposes the main pipeline clearly through simple classes and helper systems.

---

## 2. High-level architecture

The engine can be thought of as a layered stack:

1. **Application layer**
   - User-defined scenes live inside the `projects/` folder.
   - Each scene decides what entities exist and how they are configured.

2. **Scene orchestration layer**
   - `SckorpioScene` initializes the engine, loads resources, builds scene entities, and starts rendering.

3. **Core ECS layer**
   - Entities store components.
   - Components hold data.
   - The renderer consumes entity/component data and sends it to the GPU.

4. **Renderer layer**
   - WebGL renderer handles the draw loop, camera updates, clear state, depth testing, blending, and draw calls.

5. **GPU resource layer**
   - Shaders, materials, textures, and buffers are created and managed in a centralized way.

6. **Canvas layer**
   - The HTML canvas setup, title overlay, and FPS/logger overlays are handled here.

---

## 3. Startup flow

The application begins in [index.html](index.html) and [main.js](main.js).

### Boot sequence

1. `index.html` loads:
   - the WebGL canvas
   - the title canvas
   - the logger canvas
   - the external `gl-matrix` library
   - the module script `main.js`

2. `main.js` calls `initSckorpioWebEngine()`.

3. `initSckorpioWebEngine()` does the following:
   - verifies that WebGL is available
   - creates a scene object using the selected project scene
   - awaits `scene.init()`
   - awaits `scene.initResources()`
   - awaits `scene.createScene()`
   - calls `scene.load()`
   - calls `scene.play()`

### Important runtime idea

The engine is not “instant-on” in the sense of preloading everything at page load. Instead, it performs a staged startup:

- setup runtime context
- initialize renderer/camera
- load shader and texture resources
- create scene entities
- transfer geometry to GPU
- start the frame loop

That staging is important because several WebGL objects are only valid once the WebGL context is ready and the DOM is fully loaded.

---

## 4. Project layout and responsibilities

### Root files

- [index.html](index.html)
  - defines the three canvases
  - loads the engine entry point

- [main.js](main.js)
  - bootstraps the application
  - chooses the scene to run

- [README.md](README.md)
  - project overview and usage information

### Engine core ([sckorpioEngineWeb/](sckorpioEngineWeb/))

- **[canvas/](sckorpioEngineWeb/canvas/)**
  - Canvas access utilities
  - User-facing overlays (title, logger)
  - WebGL context management
  - Files: `utils.js`, `title.js`, `logger.js`

- **[core/](sckorpioEngineWeb/core/)**
  - **[ecs/](sckorpioEngineWeb/core/ecs/)** - Entity-Component-System architecture
    - **[entity/](sckorpioEngineWeb/core/ecs/entity/)** - Base entity class and entity types
      - `entity.js` - Base Entity class
      - **[entities/](sckorpioEngineWeb/core/ecs/entity/entities/)** - Concrete entity implementations
        - `camera/` - Camera entity
        - `mesh/` - Mesh base class and primitive types (cube, sphere, cone, etc.)
        - `node/` - Node entity with scene graph support
    - **[component/](sckorpioEngineWeb/core/ecs/component/)** - Component system
      - `component.js` - Base Component class
      - **[components/](sckorpioEngineWeb/core/ecs/component/components/)** - Concrete components
        - `transformComponent.js` - Transform/hierarchy data
        - `meshComponent.js` - Mesh rendering data
        - `renderComponent.js` - GPU render state
        - `cameraComponent.js` - Camera data
    - **[system/](sckorpioEngineWeb/core/ecs/system/)** - Game systems
      - `animation/` - Animation system (reserved for future use)
  - **[scene/](sckorpioEngineWeb/core/scene/)**
    - `sckorpioScene.js` - Main scene orchestration class

- **[renderer/](sckorpioEngineWeb/renderer/)**
  - **[webgl/](sckorpioEngineWeb/renderer/webgl/)**
    - `webglRenderer.js` - Main WebGL rendering pipeline
    - **[buffer/](sckorpioEngineWeb/renderer/webgl/buffer/)** - GPU buffer management
    - **[shader/](sckorpioEngineWeb/renderer/webgl/shader/)** - Shader compilation and binding
    - **[material/](sckorpioEngineWeb/renderer/webgl/material/)** - Material definitions and book
    - **[texture/](sckorpioEngineWeb/renderer/webgl/texture/)** - Texture loading and book
    - **[resources/](sckorpioEngineWeb/renderer/webgl/resources/)**
      - `shaders/` - GLSL shader files (.txt)
      - `textures/` - Built-in texture resources

### Scene projects ([projects/](projects/))

- Contains demo scenes and test scenes built on top of the engine
- Each project defines its own scene logic and entities
- Naming convention:
  - **projectX/** - Main demonstration projects
    - `projectCastle/` - Castle scene demo
    - `projectChristmas/` - Christmas-themed scene
    - `projectFIFA26/` - FIFA 26 football demo
  - **testingX/** - Testing and experimentation scenes
    - `testing1Basic/` - Basic rendering tests
    - `testing2Instances/` - Instancing feature tests
    - `testing3SceneGraph/` - Scene graph hierarchy tests
  - `templateProject/` - Template for creating new scenes

---

## 5. Scene system

The scene layer is the engine’s main coordinator.

The central class is `SckorpioScene`, defined in [sckorpioEngineWeb/core/scene/sckorpioScene.js](sckorpioEngineWeb/core/scene/sckorpioScene.js).

### Responsibilities

`SckorpioScene` is responsible for:

- creating the renderer
- creating the camera
- wiring camera to renderer
- initializing shader, material, and texture books
- creating default helper objects like grid/axes
- attaching keyboard listeners for mode toggles and visibility toggles
- adding entities to the renderer
- starting the render loop

### Scene lifecycle

The lifecycle is essentially:

1. `init()`
   - creates renderer
   - creates camera
   - configures renderer clear color
   - loads default shader resources
   - loads default textures
   - generates default materials
   - creates helper entities
   - sets event listeners

2. `load()`
   - adds default entities and user entities to the renderer
   - calls `loadEntityDataToGPU()`

3. `play()`
   - calls `renderer.render()`
   - schedules the next frame with `requestAnimationFrame()`

### Why this matters

The scene object is the “game/application shell.” It is the one place where the engine is assembled into a runnable world.

---

## 6. ECS model in this engine

Although the implementation is not a full formal ECS framework, it follows ECS patterns closely.

### Core idea

- **Entities** represent objects in the scene.
- **Components** store data about those objects.
- **The renderer** uses the entity/component data to issue draw calls.

### Base entity

The base entity class is [sckorpioEngineWeb/core/ecs/entity/entity.js](sckorpioEngineWeb/core/ecs/entity/entity.js).

It holds:

- `uid`: an identifier
- `components`: a list of attached components

This is intentionally simple and generic.

### Base component

The base component class is [sckorpioEngineWeb/core/ecs/component/component.js](sckorpioEngineWeb/core/ecs/component/component.js).

It provides a shared `uid` field for every component, but the real behavior is implemented in specialized subclasses.

---

## 7. Entity types and components

### Mesh entities

The engine uses `Mesh` as a common base for mesh-like objects.

The class in [sckorpioEngineWeb/core/ecs/entity/entities/mesh/primitives/mesh.js](sckorpioEngineWeb/core/ecs/entity/entities/mesh/primitives/mesh.js) adds:

- `transformComponent`
- `meshComponent`

It also exposes helper methods like:

- `setPosition()`
- `setScale()`
- `setRotation()`
- `setMaterial()`
- `setVisible()`
- `addInstance()`

### Scene Graph (Node Hierarchy)

The engine implements a scene graph through the `Node` class, defined in [sckorpioEngineWeb/core/ecs/entity/entities/node/node.js](sckorpioEngineWeb/core/ecs/entity/entities/node/node.js).

**What is a Node?**

A `Node` is an entity that can have parent-child relationships, forming a hierarchical tree structure. All visual mesh entities extend from `Node` to support this hierarchy.

**Scene graph features:**

- **Parent-child relationships**: Each node can have one parent and multiple children
- **Hierarchical transforms**: Child transforms are automatically composed with parent transforms
- **Depth tracking**: The hierarchy depth is maintained and updated automatically
- **Transform propagation**: When a parent moves/rotates/scales, all children inherit those transformations

**Key methods:**

```js
setParent(parentNode)
  // Set this node's parent
  // Automatically adds this node as a child to the parent
  // Updates the transform hierarchy

addChild(childNode)
  // Add a child node
  // Automatically calls childNode.setParent(this)

updateDepth(newDepth)
  // Updates this node's depth and recursively updates all children
  // Ensures hierarchy consistency
```

**How transforms work in the hierarchy:**

- **Local transform**: Position, rotation, and scale relative to the parent
- **World transform**: Position, rotation, and scale in world space, computed by multiplying parent's world transform with this node's local transform
- **Automatic propagation**: Changing a parent's transform automatically affects all descendants

**Example usage:**

```js
// Create entities
let parent = new Cube({mode: 'basic'});
let child = new Sphere({mode: 'basic'});

// Position parent at origin
parent.setPosition(5, 0, 0);

// Set child to be relative to parent
child.setParent(parent);

// Now child's world position is parent's position + child's local position
child.setPosition(2, 0, 0);  // 2 units relative to parent
```

**Testing and Demo:**

The [projects/testing3SceneGraph](projects/testing3SceneGraph) scene demonstrates the scene graph feature with multiple parent-child relationships and instancing.

### Transform component

The transform logic is in [sckorpioEngineWeb/core/ecs/component/components/transformComponent.js](sckorpioEngineWeb/core/ecs/component/components/transformComponent.js).

This component stores:

**Local transform data:**
- position
- scale
- rotation
- local transform matrix

**World transform data:**
- world transform matrix (computed by combining parent's world transform with local transform)
- parent transform reference (for hierarchical transforms)

**Instance transform data:**
- `isInstanced` - flag to enable/disable instancing
- `localInstancesCount` - number of local instances
- `localInstancesTransforms` - array of local instance transformation matrices
- `worldInstancesCount` - number of world instances
- `worldInstancesTransforms` - array of world instance transformation matrices

It computes matrices using `gl-matrix` by combining:

1. translation
2. rotation
3. scaling

**Hierarchical transform calculation:**
- **Local transform**: computed from local position, rotation, and scale
- **World transform**: computed by multiplying the parent's world transform with the local transform
- This allows child entities to inherit parent transformations automatically

The matrices are regenerated whenever the object's transform changes or when parent relationships are established.

For instanced objects, the component stores both local and world instance matrices, applying the same hierarchical logic.

### Mesh component

The mesh component is in [sckorpioEngineWeb/core/ecs/component/components/meshComponent.js](sckorpioEngineWeb/core/ecs/component/components/meshComponent.js).

This is one of the most important components because it ties together:

- CPU-side geometry data
- GPU-side render data
- material/reference information
- visibility state

It stores:

- `vertexData`
- `indexData`
- `vertexLayout`
- `instanceLayout`
- `textureUV`
- `renderComponent`
- `isInstanced` - flag to enable/disable instancing

The `loadGPUData(transformComponent)` method is especially important because it moves CPU geometry into WebGL buffers. It accepts the `transformComponent` as a parameter to access instance data stored there.

### Render component

The render component is in [sckorpioEngineWeb/core/ecs/component/components/renderComponent.js](sckorpioEngineWeb/core/ecs/component/components/renderComponent.js).

This component is the bridge between the ECS world and the GPU.

It owns:

- `vertexArray`
- `vertexBuffer`
- `indexBuffer`
- `instanceBuffer`
- `buffer layouts`
- shader/material binding
- draw configuration

It is responsible for:

- creating VAOs and buffers
- setting attribute layouts
- configuring instancing
- binding shader and texture resources
- applying uniform values for MVP matrices and color
- issuing `gl.drawElements()` or `gl.drawArrays()` calls

### Camera entity

The camera entity is defined in [sckorpioEngineWeb/core/ecs/entity/entities/camera/camera.js](sckorpioEngineWeb/core/ecs/entity/entities/camera/camera.js).

It contains a `CameraComponent` that stores:

- position
- front vector
- up vector
- yaw/pitch/roll
- view matrix
- projection matrix

The camera component also manages:

- keyboard controls
- mouse dragging
- mouse wheel zooming
- window resize behavior

The view matrix is computed through `mat4.lookAt(...)`, and the projection matrix is computed using a perspective projection.

---

## 8. Renderer pipeline

The renderer implementation is in [sckorpioEngineWeb/renderer/webgl/webglRenderer.js](sckorpioEngineWeb/renderer/webgl/webglRenderer.js).

### Core role

The renderer is the engine’s main execution system for drawing everything in a scene.

### Responsibilities

- store a camera reference
- store all scene entities to be rendered
- clear the screen each frame
- enable WebGL state (`DEPTH_TEST`, blending)
- upload entity geometry to GPU if needed
- loop through entities and draw them
- update frame statistics for the logger

### Render process per frame

The `render()` method does this:

1. call `init()`
   - clear buffer
   - enable depth testing
   - enable blending

2. reset logger counters

3. iterate through all entities

4. for each visible entity:
   - get the entity’s render component
   - bind VAO, buffers, shader, and texture
   - set shader uniforms
   - issue draw call
   - unbind resources

5. display logger overlay

### Draw call logic

There are two cases:

- **normal mesh**
  - sets model/view/projection uniforms
  - uses `gl.drawArrays()` or `gl.drawElements()`

- **instanced mesh**
  - sets view/projection uniforms only
  - uses `gl.drawArraysInstanced()` or `gl.drawElementsInstanced()`
  - increments triangle count using instance count

The logic is intentionally explicit rather than abstracted into a full shader/material pipeline.

---

## 9. WebGL resource system

The engine manually creates and manages several GPU resources.

### Buffer architecture

The buffer system is in [sckorpioEngineWeb/renderer/webgl/buffer](sckorpioEngineWeb/renderer/webgl/buffer).

#### `VertexBuffer`

- stores vertex attribute data
- uses `gl.ARRAY_BUFFER`
- uploads `Float32Array` data

#### `IndexBuffer`

- stores index data for indexed geometry
- uses `gl.ELEMENT_ARRAY_BUFFER`
- uploads `Uint16Array` data

#### `VertexArray`

- creates VAOs
- binds buffers and configures attribute pointers
- enables attributes
- configures divisors for instancing

#### `BufferLayout`

- describes the layout of each attribute in a buffer
- tracks stride and offsets
- supports:
  - float
  - unsigned int
  - unsigned byte
  - 4x4 matrices

### Why this matters

The engine uses a low-level WebGL approach, so the buffer layout is extremely important. If the shader expects a particular attribute layout, the renderer must match it exactly.

---

## 10. Shader system

The shader system is in [sckorpioEngineWeb/renderer/webgl/shader](sckorpioEngineWeb/renderer/webgl/shader).

### `Shader` class

The shader class handles:

- loading shader text files
- splitting shader source into vertex and fragment sections
- compiling shader code
- linking the shader program
- validating the program
- binding/unbinding the program
- setting uniforms

The shader loader expects files in this format:

- `#shader vertex`
- `#shader fragment`

This is a simple custom parser rather than a modern build-step shader compiler.

### `ShaderBook`

The shader book is a singleton manager for default shaders.

It loads these built-in shaders:

- `basic`
- `basic3D`
- `colorVertex3D`
- `textureVertex3D`
- `uvVertex3D`

This is the engine’s first “resource book” pattern.

---

## 11. Material system

Materials are defined in [sckorpioEngineWeb/renderer/webgl/material](sckorpioEngineWeb/renderer/webgl/material).

### `Material`

A material contains:

- a shader reference
- an optional texture reference
- a color value

### `MaterialBook`

The material book is another singleton resource manager.

It pre-creates standard materials such as:

- `basicRed`
- `basicGreen`
- `basicBlue`
- `basicWhite`
- `basicGrey`
- `colorVertex`
- `colorFace`
- `uvVertex3D`
- `wood`
- `brick`

This centralization makes it easy for meshs and scenes to ask for a material by name.

---

## 12. Texture system

The texture system is in [sckorpioEngineWeb/renderer/webgl/texture](sckorpioEngineWeb/renderer/webgl/texture).

### `Texture`

The texture class:

- creates a WebGL texture object
- loads an image asynchronously
- sets wrap parameters
- generates mipmaps
- binds/unbinds the texture

### `TextureBook`

The texture book manages built-in and project-specific textures.

It looks for assets under the engine resource folder by default and under the project resources folder when needed.

This gives the engine a clean separation between:

- engine defaults
- scene/project content

---

## 13. Canvas and overlay system

The canvas utilities are in [sckorpioEngineWeb/canvas/utils.js](sckorpioEngineWeb/canvas/utils.js).

These utility functions provide access to:

- the main WebGL canvas
- the title canvas
- the logger canvas
- width/height/aspect ratio helpers
- WebGL context access

### Overlay roles

- **Title overlay**: draws branding / display text
- **Logger overlay**: shows FPS, draw call count, and triangle count

The title and logger logic is intentionally separate from the WebGL scene so the engine can show debug information without interfering with the main render pass.

---

## 14. Data flow from scene to GPU

A good way to understand the architecture is to trace one object.

### Example: a cube object

1. A scene creates a `Cube` entity.
2. `Cube` inherits from `Mesh`.
3. `Mesh` adds:
   - a transform component
   - a mesh component
4. The cube’s mesh component is filled with:
   - positions
   - normals/colors/UVs
   - indices
5. The mesh component attaches a `RenderComponent`.
6. `loadGPUData()` uploads the geometry to the GPU.
7. During the render loop, the renderer:
   - binds the shader
   - sets uniforms
   - issues the draw call

This flow is the heart of the engine.

---

## 15. Why the engine is organized this way

The architecture is designed to keep responsibilities separate:

- **Scene** decides what exists
- **Entity** represents an object in the world
- **Component** stores data about that object
- **Renderer** converts data into visible output
- **Books** centralize resource reuse
- **Canvas utilities** handle browser integration and debug overlays

This separation makes the engine easier to understand and extend, even if it is still fairly low-level.

---

## 16. Strengths of the architecture

### Clear layering

You can follow the full path from a scene class to a GPU draw call.

### Reusable resource management

Shaders, materials, and textures are loaded once and reused.

### Good fit for demo scenes

The design is good for small interactive WebGL examples and visual experiments.

### Easy to inspect

Compared to larger engines, the code is readable and explicit.

---

## 17. Limitations / caveats

The engine is a legacy-style prototype rather than a fully polished production engine.

A few architectural caveats are worth noting:

- some parts rely on manual global state
- resource management is centralized but still fairly simple
- the renderer does not yet look like a fully modern ECS system with separate update and render phases
- the codebase mixes scene logic, rendering logic, and resource management in places
- the implementation is more “educational / experimental” than “production-grade” architecture

These are not flaws in the concept; they are just signs that the engine is a focused, learning-oriented rendering framework.

---

## 18. Mental model for understanding the engine

If you want one sentence to remember the architecture, it is this:

> A scene creates entities, entities carry transform/mesh/camera data, the renderer reads that data, binds resources, and sends commands to WebGL.

That is the essence of how the engine works.

---

## 19. Suggested reading order

If you are trying to understand the engine quickly, read in this order:

1. [main.js](main.js)
2. [index.html](index.html)
3. [sckorpioEngineWeb/core/scene/sckorpioScene.js](sckorpioEngineWeb/core/scene/sckorpioScene.js)
4. [sckorpioEngineWeb/renderer/webgl/webglRenderer.js](sckorpioEngineWeb/renderer/webgl/webglRenderer.js)
5. [sckorpioEngineWeb/core/ecs/entity/entities/mesh/primitives/mesh.js](sckorpioEngineWeb/core/ecs/entity/entities/mesh/primitives/mesh.js)
6. [sckorpioEngineWeb/core/ecs/component/components/meshComponent.js](sckorpioEngineWeb/core/ecs/component/components/meshComponent.js)
7. [sckorpioEngineWeb/core/ecs/component/components/renderComponent.js](sckorpioEngineWeb/core/ecs/component/components/renderComponent.js)
8. [sckorpioEngineWeb/renderer/webgl/shader/shader.js](sckorpioEngineWeb/renderer/webgl/shader/shader.js)
9. [sckorpioEngineWeb/renderer/webgl/material/materialBook.js](sckorpioEngineWeb/renderer/webgl/material/materialBook.js)
10. [sckorpioEngineWeb/renderer/webgl/texture/textureBook.js](sckorpioEngineWeb/renderer/webgl/texture/textureBook.js)

---

## 20. Summary

SckorpioWebEngine is a lightweight WebGL-based engine that combines:

- scene orchestration
- entity/component-driven object modeling
- explicit GPU buffer handling
- resource books for shaders/materials/textures
- a simple frame loop for 3D rendering

It is a great example of a small custom engine where the core architecture is visible and understandable from the source code itself.
