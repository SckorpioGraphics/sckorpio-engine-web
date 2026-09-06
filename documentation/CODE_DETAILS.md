# SckorpioWebEngine Code Details

## 1. Entry point and runtime startup

### [main.js](main.js)

The engine starts here.

```js
import { verifyWebGLSupport } from "./sckorpioEngineWeb/canvas/utils.js";
import { title } from "./sckorpioEngineWeb/canvas/title.js";
import { Scene } from "./projects/projectFIFA26/scene.js";

var initSckorpioWebEngine = async function () {
    verifyWebGLSupport();

    var scene = new Scene("projectFIFA26"); 
    await scene.init(); 
    await scene.initResources();
    await scene.createScene();
    scene.load();
    scene.play();
}

initSckorpioWebEngine();
```

### What this does

- imports the WebGL utility checker
- imports the title overlay helper
- imports the selected project scene
- creates a scene instance
- runs setup methods in order
- starts the render loop

### Important detail

The startup is asynchronous because shader and texture loading happen before the scene can be fully rendered.

---

## 2. HTML bootstrap and canvas setup

### [index.html](index.html)

The page defines three canvases:

1. `sckorpioEngineWeb-webgl-surface`
   - main rendering surface
2. `sckorpioEngineWeb-2d-title-surface`
   - title overlay surface
3. `sckorpioEngineWeb-2d-logger-surface`
   - debug/performance overlay surface

It also loads:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gl-matrix/2.4.0/gl-matrix.js"></script>
<script type="module" src="main.js"></script>
```

### Why this matters

The engine relies on `gl-matrix` being available globally for matrix math and on the DOM elements being present before the scripts begin querying them.

---

## 3. Folder structure and organization

The engine was recently reorganized for better clarity and consistency. This section explains the new structure.

### ECS Folder Layout

**Component System** - [sckorpioEngineWeb/core/ecs/component/](sckorpioEngineWeb/core/ecs/component/)

```
component/
├── component.js           // Base Component class
└── components/            // Concrete component implementations
    ├── transformComponent.js
    ├── meshComponent.js
    ├── renderComponent.js
    └── cameraComponent.js
```

**Entity System** - [sckorpioEngineWeb/core/ecs/entity/](sckorpioEngineWeb/core/ecs/entity/)

```
entity/
├── entity.js              // Base Entity class
└── entities/              // Concrete entity implementations
    ├── camera/
    │   └── camera.js
    ├── mesh/
    │   ├── mesh.js
    │   └── primitives/
    │       ├── cube.js
    │       ├── sphere.js
    │       ├── cone.js
    │       ├── cylinder.js
    │       ├── plane.js
    │       ├── grid.js
    │       └── star.js
    └── node/
        └── node.js        // Scene graph support
```

**System Architecture** - [sckorpioEngineWeb/core/ecs/system/](sckorpioEngineWeb/core/ecs/system/)

```
system/
└── animation/             // Reserved for animation system
```

### Naming Convention Changes

The reorganization improved naming consistency:

- **`componentList/` → `components/`** - Clearer and more direct naming
- **`entityList/` → `entities/`** - Clearer and more direct naming
- **`system/` folder added** - For future game systems (animation, physics, etc.)

### Project Naming Convention

Projects now follow a consistent naming pattern:

**Production/Demo Projects:**
- `projectCastle/` - Castle scene demo
- `projectChristmas/` - Christmas-themed scene
- `projectFIFA26/` - FIFA 26 football demo

**Testing Projects:**
- `testing1Basic/` - Basic rendering tests (vertices, colors, basic shapes)
- `testing2Instances/` - GPU instancing feature tests
- `testing3SceneGraph/` - Scene graph hierarchy and parent-child relationships

**Template:**
- `templateProject/` - Template for creating new scenes

### Renderer Structure

**WebGL Renderer** - [sckorpioEngineWeb/renderer/webgl/](sckorpioEngineWeb/renderer/webgl/)

```
webgl/
├── webglRenderer.js       // Main rendering pipeline
├── buffer/                // GPU buffer management
│   ├── vertexBuffer.js
│   ├── indexBuffer.js
│   ├── vertexArray.js
│   ├── instanceBuffer.js
│   └── bufferLayout.js
├── shader/                // Shader compilation and binding
│   ├── shader.js
│   └── shaderBook.js
├── material/              // Material definitions
│   ├── material.js
│   └── materialBook.js
├── texture/               // Texture management
│   ├── texture.js
│   └── textureBook.js
└── resources/
    ├── shaders/           // GLSL shader source files
    └── textures/          // Built-in texture assets
```

---

## 4. Canvas utilities and WebGL context

### [sckorpioEngineWeb/canvas/utils.js](sckorpioEngineWeb/canvas/utils.js)

This file is the engine’s browser-side bridge to the canvas system.

#### Key functions

```js
export function verifyWebGLSupport() {
  var gl = getWebGLContext();
  if (!gl) {
    console.log("WebGL not supported, falling back on experimential webgl");
    gl = canvas.getContext("experimental-webgl");
  }

  if (!gl) {
    alert("Your browser does not support webGL");
  } else {
    if (gl instanceof WebGL2RenderingContext) {
      console.log("✅ Sckorpio Engine Status: Running on PURE WebGL 2.0!");
    } else {
      console.warn("⚠️ Warning: Engine falling back to WebGL 1.0.");
    }
  }
}
```

```js
export function getWebGLContext() {
  var canvas = document.getElementById("sckorpioEngineWeb-webgl-surface");
  var gl = canvas.getContext("webgl2");
  return gl;
}
```

```js
export let gl = getWebGLContext();
```

### Internal logic

- the file fetches the canvas by id
- it asks for WebGL 2 context
- it keeps the context in a shared module variable
- it provides helpers for canvas sizing and overlay access

### Practical meaning

Most of the engine uses `gl` imported from this file instead of manually requesting a context each time.

---

## 5. Title overlay implementation

### [sckorpioEngineWeb/canvas/title.js](sckorpioEngineWeb/canvas/title.js)

This class handles the 2D title overlay.

```js
class Title {
    constructor() {
        this.setEventlisteners();
    }

    setIconTitle() {
        const canvas = getTitleCanvas();
        const context = getTitleContext();

        const img = new Image();
        img.src = "sckorpioEngineWeb/canvas/resources/textures/sckorpioEngineLogo.png";

        img.onload = function () {
            context.drawImage(img, 0, 0, 200, 200);
        }
    }

    setEventlisteners() {
        document.addEventListener('DOMContentLoaded',()=>{
            this.setIconTitle();
        });
    }
}

export const title = new Title();
```

### Code details

- the constructor registers a DOMContentLoaded listener
- once the DOM is ready, the logo is drawn on the title canvas
- the actual drawing is done with the 2D context

---

## 6. Logger overlay implementation

### [sckorpioEngineWeb/canvas/logger.js](sckorpioEngineWeb/canvas/logger.js)

The logger is a debug overlay that tracks render stats.

#### Important fields

```js
this.drawCalls = 0;
this.totalTriangles = 0;
this.fps = 0;
this.frameTime = 0;
this.elapsedTime = 0;
```

#### Core behavior

```js
resetFrameCounters() {
  this.drawCalls = 0;
  this.totalTriangles = 0;
  this.frameTime = 0;
}
```

```js
show() {
  const canvas = getLoggerCanvas();
  const context = getLoggerContext();

  if (!canvas || !context) {
    return;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = this.themeMode === 'dark' ? '#1a1a1a' : '#f4f4f4';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = this.themeMode === 'dark' ? '#ffffff' : '#000000';
  context.fillText(`FPS: ${this.fps}`, 10, 20);
  context.fillText(`Draw Calls: ${this.drawCalls}`, 10, 45);
  context.fillText(`Triangles: ${this.totalTriangles}`, 10, 70);
}
```

### Event handling

The logger also listens for the `L` key to toggle visibility:

```js
window.addEventListener('keydown', (event) => {
  if (event.key === 'L' || event.key === 'l') {
    const loggerCanvas = getLoggerCanvas();
    if (loggerCanvas.style.display === "none") {
      loggerCanvas.style.display = "block";
    } else {
      loggerCanvas.style.display = "none";
    }
  }
});
```

---

## 7. Scene orchestration code

### [sckorpioEngineWeb/core/scene/sckorpioScene.js](sckorpioEngineWeb/core/scene/sckorpioScene.js)

This is the most important orchestration class.

#### Constructor setup

```js
constructor(){
    this.uid = 0;

    this.grid;
    this.xAxis;
    this.yAxis;
    this.zAxis;
    this.defaultEntitiesList = [];
    this.entitiesList = [];
    this.camera;
    this.renderer;
    this.materialBook;
    this.shaderBook;
    this.textureBook;

    this.isGridVisible = true;
    this.isAxisVisible = true;
    this.mode = 1;

    this.lightModeClearColor = vec3.fromValues(80.0/255.0, 160.0/255.0, 170.0/255.0);
    this.lightModeGridColor = vec3.fromValues(0.5, 0.8, 0.8);

    this.darkModeClearColor = vec3.fromValues(0.14, 0.11, 0.26);
    this.darkModeGridColor = vec3.fromValues(0.45, 0.40, 0.65);

    this.logger = logger;
}
```

### `init()` method

```js
async init(){
    this.renderer = new WebGLRenderer();

    this.camera = new Camera();
    this.renderer.setCamera(this.camera);
    this.renderer.setClearColor(this.lightModeClearColor);

    this.shaderBook = ShaderBook.getInstance();
    await this.shaderBook.generateDefaultShaders();

    this.textureBook = TextureBook.getInstance();
    await this.textureBook.generateDefaultTextures();

    this.materialBook = MaterialBook.getInstance();
    this.materialBook.generateDefaultMaterials();

    this.createDefaultEntities();
    this.setEventlisteners();
}
```

### Code meaning

This method does the following in exact order:

1. create renderer
2. create camera and tie it to renderer
3. load shaders
4. load textures
5. create materials
6. build default scene objects
7. configure user input listeners

---

## 8. Default helper entities in the scene

### `createDefaultEntities()`

```js
createDefaultEntities(){
    this.grid = new Grid(100,1.0);
    this.grid.setMaterial("basicGrey");

    this.xAxis = new Sckorpio.Cube();
    this.xAxis.setPosition(50.0, 0.0, 0.0);
    this.xAxis.setScale(100.0, 0.02, 0.02);
    this.xAxis.setMaterial("basicRed");

    this.yAxis = new Sckorpio.Cube();
    this.yAxis.setPosition(0.0, 50.0, 0.0);
    this.yAxis.setScale(0.02, 100.0, 0.02);
    this.yAxis.setMaterial("basicGreen");

    this.zAxis = new Sckorpio.Cube();
    this.zAxis.setPosition(0.0, 0.0, 50.0);
    this.zAxis.setScale(0.02, 0.02, 100.0);
    this.zAxis.setMaterial("basicBlue");

    this.defaultEntitiesList.push(this.grid);
    this.defaultEntitiesList.push(this.xAxis);
    this.defaultEntitiesList.push(this.yAxis);
    this.defaultEntitiesList.push(this.zAxis);
}
```

### What these do

- `grid` draws a ground plane helper
- `xAxis`, `yAxis`, `zAxis` create colored world axes
- the scene always has these by default so the user can visualize orientation

---

## 9. Input handling in the scene

### Keyboard toggles

```js
setEventlisteners() {
    window.addEventListener('keydown', (event) => {
      if (event.key === "G" || event.key === "g") {
        this.isGridVisible = !this.isGridVisible;
        this.setGridVisibility(this.isGridVisible);
      } else if (event.key === "Y" || event.key === "y") {
        this.isAxisVisible = !this.isAxisVisible;
        this.setAxisVisibility(this.isAxisVisible);
      } else if(event.key === "M" || event.key === "m") {
        this.toggleMode();
      }
    });
}
```

### Mode switching

```js
toggleMode() {
    if(this.mode == 1){
        this.mode = 0;
        this.renderer.setClearColor(this.darkModeClearColor);
        this.grid.setColor(this.darkModeGridColor[0], this.darkModeGridColor[1], this.darkModeGridColor[2]);
        this.logger.setThemeMode("dark");
    } else {
        this.mode = 1;
        this.renderer.setClearColor(this.lightModeClearColor);
        this.grid.setColor(this.lightModeGridColor[0], this.lightModeGridColor[1], this.lightModeGridColor[2]);
        this.logger.setThemeMode("light");
    }
}
```

---

## 10. Entity base classes

### [sckorpioEngineWeb/core/ecs/entity/entity.js](sckorpioEngineWeb/core/ecs/entity/entity.js)

```js
class Entity{
    constructor(){
        this.uid = 0;
        this.components = [];
    }
}
```

### [sckorpioEngineWeb/core/ecs/component/component.js](sckorpioEngineWeb/core/ecs/component/component.js)

```js
class Component{
    constructor(){
        this.uid = 0;
    }
}
```

### Practical reading note

These two files are deliberately minimal and are used as shared base types for all specialized engine objects.

---

## 11. Mesh hierarchy and transform logic

### [sckorpioEngineWeb/core/ecs/entity/entities/mesh/mesh.js](sckorpioEngineWeb/core/ecs/entity/entities/mesh/mesh.js)

```js
class Mesh extends Entity{
    constructor(){
        super();
        this.uid = 0;
        this.components = [];
        this.transformComponent = null;
        this.meshComponent = null;
        this.addTransformComponent();
        this.addMeshComponent();
    }

    addTransformComponent(){
        this.transformComponent = new TransformComponent();
        this.components.push(this.transformComponent);
    }

    addMeshComponent() {
        this.meshComponent = new MeshComponent();
        this.components.push(this.meshComponent);
    }
}
```

### Why this is important

Every mesh-like object in the engine is built from:

- transform data
- mesh data

This keeps object creation consistent.

---

## 12. Transform component details

### [sckorpioEngineWeb/core/ecs/component/components/transformComponent.js](sckorpioEngineWeb/core/ecs/component/components/transformComponent.js)

```js
class TransformComponent extends Component{
    constructor(){
        super();
        this.position = vec3.fromValues(0.0, 0.0, 0.0);
        this.scale = vec3.fromValues(1.0, 1.0, 1.0);
        this.rotation = vec3.fromValues(0.0, 0.0, 0.0);
        this.modelMatrix = mat4.create();
        this.setLocalTransform();
    }

    setPosition(x,y,z){
        this.position = vec3.fromValues(x,y,z);
        this.setLocalTransform();
    }

    setScale(sx,sy,sz){
        this.scale = vec3.fromValues(sx,sy,sz);
        this.setLocalTransform();
    }

    setRotation(rx,ry,rz){
        this.rotation = vec3.fromValues(rx,ry,rz);
        this.setLocalTransform();
    }

    calculateModelMatrix() {
        let modelMatrix = mat4.create();  
        mat4.translate(modelMatrix, modelMatrix, this.position);

        let rotationMatrix = mat4.create();
        mat4.rotateX(rotationMatrix, rotationMatrix, glMatrix.toRadian(this.rotation[0]));
        mat4.rotateY(rotationMatrix, rotationMatrix, glMatrix.toRadian(this.rotation[1]));
        mat4.rotateZ(rotationMatrix, rotationMatrix, glMatrix.toRadian(this.rotation[2]));

        mat4.multiply(modelMatrix, modelMatrix, rotationMatrix);
        mat4.scale(modelMatrix, modelMatrix, this.scale);

        return modelMatrix;
    }
}
```

### Code detail

The engine does not use a separate math utility library for transformation; it directly composes matrices using `gl-matrix` each time transforms change.

---

## 13. Node class and scene graph hierarchy

### [sckorpioEngineWeb/core/ecs/entity/entities/node/node.js](sckorpioEngineWeb/core/ecs/entity/entities/node/node.js)

The `Node` class extends the base `Entity` to support hierarchical scene graphs.

#### Constructor and hierarchy data

```js
class Node extends Entity{
    constructor(){
        super();
        this.transformComponent = null;
        this.addTransformComponent();

        // instancing
        this.instanced = false;

        // Scene Graph
        this.parentNode = null;
        this.childNodes = [];
        this.depth = 0;
    }
}
```

#### Setting up parent-child relationships

```js
setParent(parentNode){
    // If parent is already there
    if (this.parentNode === parentNode) return;

    // set Parent
    this.parentNode = parentNode;

    if(parentNode instanceof Node) {
        // add this as child to parent
        parentNode.addChild(this);
        // link parent transform component
        this.transformComponent.setParent(parentNode.transformComponent);
        // update depth
        this.updateDepth(this.parentNode.depth + 1);
    }
}

addChild(childNode){
    // If child is already there
    if (!this.childNodes.includes(childNode)) {
        this.childNodes.push(childNode);
        childNode.setParent(this);
    }
}
```

#### Depth propagation

```js
updateDepth(newDepth){
    this.depth = newDepth;
    this.childNodes.forEach((childNode)=>{
        childNode.updateDepth(this.depth+1);
    });
}
```

This method recursively updates the depth for all descendants.

### How the hierarchy affects transforms

When you set a parent-child relationship:

1. The child's `transformComponent` gets a reference to the parent's `transformComponent`
2. When the renderer computes world transforms, it multiplies the parent's world transform with the child's local transform
3. This means moving or rotating the parent automatically moves/rotates all children
4. The hierarchy depth is tracked automatically for rendering order

### Example usage from testing3SceneGraph

```js
// Create a sphere and cylinder
let sphere = new Sckorpio.Sphere({ mode: 'basic' , radius: 0.5});
let cylinder = new Sckorpio.Cylinder({ mode: 'basic' , radius:0.5, height:1.0});

// Position the cylinder
cylinder.setPosition(-5.0, 5.0, -5.0);

// Make sphere a child of cylinder
// Now sphere's world position = cylinder's world position + sphere's local position
sphere.setParent(cylinder);
sphere.setPosition(0, -2, 0);  // Position relative to cylinder
```

### Key benefits

- **Simplicity**: Parent-child relationships are maintained automatically
- **Realism**: Objects inherit parent transformations naturally
- **Optimization**: Shared transforms reduce redundant calculations
- **Flexibility**: Works seamlessly with instancing

---

## 14. Game systems architecture

### [sckorpioEngineWeb/core/ecs/system/](sckorpioEngineWeb/core/ecs/system/)

The system folder is reserved for implementing game systems that operate on entities and components. This follows a true ECS (Entity-Component-System) pattern where systems are independent logic processors.

**Current status:**

- **[animation/](sckorpioEngineWeb/core/ecs/system/animation/)** - Reserved for animation system
  - Intended for keyframe animations, skeletal animations, and transform tweens
  - Currently empty, available for future implementation

**Future systems:**

Potential systems that could be added:
- Physics system - Collision detection and rigid body dynamics
- Audio system - Sound effects and music management
- Particle system - Particle emission and effects
- AI system - Behavioral logic and pathfinding
- Input system - Centralized input handling

**System pattern:**

A typical system would:
1. Iterate through entities
2. Filter for entities with specific components
3. Apply logic/transformations to those components
4. Update renderer or other systems as needed

Example structure:
```js
class AnimationSystem {
    update(entities, deltaTime) {
        entities.forEach(entity => {
            if (entity.hasComponent('animationComponent')) {
                // Update animation state
                // Modify transform component
            }
        });
    }
}
```

---

## 15. Animation system implementation

The Animation System is a complete keyframe-based animation framework integrated into the ECS. It enables smooth property animations on entities through tracks and clips.

### Architecture Overview

The animation system consists of these key components:

```
AnimationClip (multiple properties animated over time)
├── AnimationTrack (animates one property)
│   ├── KeyFrames (time-value pairs)
│   ├── Interpolators (lerp calculations)
│   └── evaluate(time) → interpolated value
└── evaluate(time) → all property values

AnimationComponent (attached to entities)
├── animationClip
├── currentTime
├── playing
├── loop
└── speed

AnimationSystem (updates all animations)
├── entities[]
├── update(deltaTime)
└── applies animation results to transform components
```

### 15.1 KeyFrame Class

**[sckorpioEngineWeb/core/ecs/system/animation/keyFrame.js](sckorpioEngineWeb/core/ecs/system/animation/keyFrame.js)**

```js
class KeyFrame {
    constructor(time, value) {
        this.time = time;      // Time in seconds
        this.value = value;    // Value at this time
    }
}
```

**Purpose:**
- Simple data holder that stores a point in time and its corresponding value
- Values can be scalars (float), or vectors (vec2, vec3, vec4)
- Examples: `[0.0, 0.0, 0.0]` for position, `180.0` for rotation angle

### 15.2 Interpolators Module

**[sckorpioEngineWeb/core/ecs/system/animation/interpolators.js](sckorpioEngineWeb/core/ecs/system/animation/interpolators.js)**

Provides Linear Interpolation (Lerp) functions for different data types:

```js
// Scalar interpolation: a + (b - a) * alpha
scalarLerp(a, b, alpha)

// Vector interpolation using gl-matrix
vec2Lerp(a, b, alpha)
vec3Lerp(a, b, alpha)
vec4Lerp(a, b, alpha)
```

**Key concept:**
- `alpha` ranges from 0 to 1
- `alpha = 0` → returns value `a` (start keyframe)
- `alpha = 1` → returns value `b` (end keyframe)
- `0 < alpha < 1` → smooth interpolation between keyframes

### 15.3 AnimationTrack Class

**[sckorpioEngineWeb/core/ecs/system/animation/animationTrack.js](sckorpioEngineWeb/core/ecs/system/animation/animationTrack.js)**

Manages animation of a single property (e.g., position, rotation, scale):

```js
class AnimationTrack {
    constructor(property, valueType) {
        this.property = property;      // "position", "rotation", "scale"
        this.valueType = valueType;    // "float", "vec2", "vec3", "vec4"
        this.keyFrames = [];           // Sorted by time
    }

    addKeyFrame(time, value) {
        const keyFrame = new KeyFrame(time, value);
        this.keyFrames.push(keyFrame);
        this.keyFrames.sort((a, b) => a.time - b.time);  // Auto-sort
    }

    getDuration() {
        if (this.keyFrames.length === 0) return 0;
        return this.keyFrames[this.keyFrames.length - 1].time;
    }

    evaluate(time) {
        // If time is before first keyframe → return first value
        if (time <= firstKeyFrame.time) return firstKeyFrame.value;
        
        // If time is after last keyframe → return last value
        if (time >= lastKeyFrame.time) return lastKeyFrame.value;
        
        // Find surrounding keyframes
        const alpha = (time - prev.time) / (next.time - prev.time);
        return this.interpolateValue(valueType, prev, next, alpha);
    }
}
```

**Features:**
- Automatically sorts keyframes by time when added
- Handles edge cases (before first, after last)
- Performs linear interpolation between keyframes
- Supports different value types (scalars and vectors)

### 15.4 AnimationClip Class

**[sckorpioEngineWeb/core/ecs/system/animation/animationClip.js](sckorpioEngineWeb/core/ecs/system/animation/animationClip.js)**

Combines multiple animation tracks into a complete animation:

```js
class AnimationClip {
    constructor(name) {
        this.name = name;
        this.tracks = [];      // Multiple AnimationTrack objects
        this.duration = 0.0;
    }

    addTrack(track) {
        this.tracks.push(track);
        const trackDuration = track.getDuration();
        if (trackDuration > this.duration) {
            this.duration = trackDuration;
        }
    }

    evaluate(time) {
        const result = {};
        for (const track of this.tracks) {
            result[track.property] = track.evaluate(time);
        }
        return result;  // { position: [...], rotation: [...], scale: [...] }
    }
}
```

**Purpose:**
- Groups related property animations together
- Duration is the longest track duration
- `evaluate()` returns all property values at a given time

**Example usage:**
```js
// Create a clip with position and rotation animations
const positionTrack = new Sckorpio.AnimationTrack("position", "vec3");
positionTrack.addKeyFrame(0.0, [0, 0, 0]);
positionTrack.addKeyFrame(2.0, [5, 0, 0]);

const rotationTrack = new Sckorpio.AnimationTrack("rotation", "vec3");
rotationTrack.addKeyFrame(0.0, [0, 0, 0]);
rotationTrack.addKeyFrame(2.0, [0, 360, 0]);

const clip = new Sckorpio.AnimationClip("MyAnimation");
clip.addTrack(positionTrack);
clip.addTrack(rotationTrack);
```

### 15.5 AnimationComponent Class

**[sckorpioEngineWeb/core/ecs/component/components/animationComponent.js](sckorpioEngineWeb/core/ecs/component/components/animationComponent.js)**

Component that holds animation state and playback controls:

```js
class AnimationComponent extends Component {
    constructor() {
        super();
        this.animationClip = null;    // The animation to play
        this.currentTime = 0.0;       // Current playback time
        this.playing = false;         // Is currently playing?
        this.loop = true;             // Loop when reaching end?
        this.speed = 1.0;             // Playback speed multiplier
    }

    setClip(clip) {
        this.animationClip = clip;
        this.currentTime = 0.0;
    }

    play() {
        if (this.animationClip) {
            this.playing = true;
        }
    }

    pause() {
        this.playing = false;
    }

    stop() {
        this.playing = false;
        this.currentTime = 0.0;
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    isPlaying() {
        return this.playing;
    }
}
```

**Attached to entities via:**
```js
entity.addAnimationComponent();  // Adds component to entity.components[]
```

### 15.6 AnimationSystem Class

**[sckorpioEngineWeb/core/ecs/system/animation/animationSystem.js](sckorpioEngineWeb/core/ecs/system/animation/animationSystem.js)**

The main update system that processes all animations each frame:

```js
class AnimationSystem {
    constructor() {
        this.entities = [];
    }

    addEntity(entity) {
        this.entities.push(entity);
    }

    addEntities(entityList) {
        for (const entity of entityList) {
            this.addEntity(entity);
        }
    }

    update(deltaTime) {
        for (const entity of this.entities) {
            const animationComponent = entity.animationComponent;
            const animationClip = animationComponent.animationClip;

            // Update time if playing
            if (animationComponent.playing) {
                animationComponent.currentTime += deltaTime * animationComponent.speed;

                // Handle loop/end
                if (animationComponent.currentTime >= animationClip.duration) {
                    if (animationComponent.loop) {
                        animationComponent.currentTime %= animationClip.duration;
                    } else {
                        animationComponent.currentTime = animationClip.duration;
                        animationComponent.playing = false;
                    }
                }
            }

            // Evaluate animation and apply to transform
            const animationResult = animationClip.evaluate(animationComponent.currentTime);
            entity.transformComponent.applyAnimation(animationResult);
        }
    }
}
```

**Workflow:**
1. Iterate through all animated entities
2. Update `currentTime` based on delta time and speed
3. Handle looping and end conditions
4. Evaluate the animation clip at current time
5. Apply results to the entity's transform component

### 15.7 Transform Component Animation Support

**[sckorpioEngineWeb/core/ecs/component/components/transformComponent.js](sckorpioEngineWeb/core/ecs/component/components/transformComponent.js)**

The transform component applies animation results to both the source entity and instances:

```js
applyAnimation(animationResult) {
    this.applyAnimationToSource(animationResult);
    this.applyAnimationToInstances(animationResult);
}

// Apply to main entity
applyAnimationToSource(animationResult) {
    if (animationResult.position) {
        this.currentPosition = vec3.add(this.localPosition, animationResult.position);
    }
    if (animationResult.rotation) {
        this.currentRotation = vec3.add(this.localRotation, animationResult.rotation);
    }
    if (animationResult.scale) {
        this.currentScale = vec3.mul(this.localScale, animationResult.scale);
    }
    this.setCurrentTransform();
}

// Apply to all instances
applyAnimationToInstances(animationResult) {
    for (let i = 0; i < this.localInstancesCount; i++) {
        // Position: apply with respect to instance's local rotation
        if (animationResult.position) {
            // Rotate animation position by instance rotation
            // Then add to instance position
        }
        
        // Rotation: add to current rotation
        if (animationResult.rotation) {
            rotation[0] += animationResult.rotation[0];
            rotation[1] += animationResult.rotation[1];
            rotation[2] += animationResult.rotation[2];
        }
        
        // Scale: multiply with current scale
        if (animationResult.scale) {
            scale[0] *= animationResult.scale[0];
            scale[1] *= animationResult.scale[1];
            scale[2] *= animationResult.scale[2];
        }
        
        this.currentInstancesTransforms[i] = this.createTRSMatrix(...);
    }
}
```

### 15.8 Scene Integration

In [sckorpioEngineWeb/core/scene/sckorpioScene.js](sckorpioEngineWeb/core/scene/sckorpioScene.js):

```js
class SckorpioScene {
    async init() {
        this.animationSystem = new AnimationSystem();  // Create system
        // ... other initialization
    }

    load() {
        this.addEntitiesToAnimationSystem();    // Register entities
        this.addEntitiesToRendererSystem();
    }

    addEntitiesToAnimationSystem() {
        this.animationSystem.addEntities(this.entitiesList);
    }

    update(timestamp) {
        const deltaTime = (timestamp - this.previousTime) / 1000.0;
        this.previousTime = timestamp;

        this.animationSystem.update(deltaTime);  // Update animations
        this.renderer.render();
        requestAnimationFrame(this.play.bind(this));
    }
}
```

### 15.9 Typical Animation Workflow

```js
// 1. Create animation tracks
const positionTrack = new Sckorpio.AnimationTrack("position", "vec3");
positionTrack.addKeyFrame(0.0, [0.0, 0.0, 0.0]);
positionTrack.addKeyFrame(2.0, [5.0, 0.0, 0.0]);

// 2. Create animation clip
const clip = new Sckorpio.AnimationClip("Move");
clip.addTrack(positionTrack);

// 3. Add component to entity
entity.addAnimationComponent();

// 4. Set clip and play
entity.animationComponent.setClip(clip);
entity.animationComponent.play();

// 5. System automatically updates every frame
```

### 15.10 Advanced Features

**Speed Control:**
```js
entity.animationComponent.setSpeed(0.5);  // Half speed
entity.animationComponent.setSpeed(2.0);  // Double speed
```

**Looping:**
```js
entity.animationComponent.loop = true;   // Default: loops
entity.animationComponent.loop = false;  // Play once, then stop
```

**Multiple Tracks:**
```js
const clip = new Sckorpio.AnimationClip("Complex");
clip.addTrack(positionTrack);
clip.addTrack(rotationTrack);
clip.addTrack(scaleTrack);
// All tracks evaluate simultaneously
```

**Instanced Animation:**
- Works seamlessly with GPU instancing
- Each instance applies animations respecting its local rotation
- Position animations are rotated to align with instance orientation

### 15.11 Testing Projects

Three new testing projects demonstrate animation features:

- **testing4Animations/** - Individual property animations (position, rotation, scale)
- **testing5AnimationsInstances/** - Animation applied to GPU instances
- **testing6AnimationsCombo/** - Complex scene graph with animated parent/child relationships

---

## 17. Mesh component details

### [sckorpioEngineWeb/core/ecs/component/components/meshComponent.js](sckorpioEngineWeb/core/ecs/component/components/meshComponent.js)

This component is the bridge from CPU-side mesh data to GPU-ready render data.

#### Key properties

```js
this.visible = true;
this.vertexLayout;
this.vertexData = [];
this.indexData = [];
this.instanced = false;
this.instanceLayout;
this.textureUV = [0.0, 0.0, 1.0, 1.0];
this.renderComponent = new RenderComponent();
```

#### `loadGPUData(transformComponent)`

```js
loadGPUData(transformComponent){
    this.renderComponent.setMaterial(this.material);
    this.renderComponent.setData(this.layout,this.vertexData,this.indexData);

    if(this.instanced){
        const instancesCount = transformComponent.instancesCount;
        if(instancesCount > 0){
            this.renderComponent.setInstancedData(this.instanceLayout, transformComponent.instancesModelMatrices, instancesCount);
        }
    }
}
```

### Practical interpretation

This method is the point where mesh data becomes GPU data. It now accepts the `transformComponent` as a parameter to access instance data (matrices and count) that are stored in the transform component rather than the mesh component.

---

## 18. Render component details

### [sckorpioEngineWeb/core/ecs/component/components/renderComponent.js](sckorpioEngineWeb/core/ecs/component/components/renderComponent.js)

This is the main low-level renderer integration class.

#### Constructor state

```js
this.vertexArray;
this.vertexBuffer;
this.vertexBufferLayout;
this.indexBuffer;
this.useElements = false;
this.indexType = gl.UNSIGNED_SHORT;
this.topology = gl.TRIANGLES;
this.offset = 0;
this.count;
this.material;
this.isInstanced = false;
this.instanceCount = 0;
this.instanceBuffer = null;
this.instanceBufferLayout;
```

#### `setData()`

This method creates:

- a VAO
- a vertex buffer
- a buffer layout
- an index buffer when needed

```js
this.vertexArray = new VertexArray();
this.vertexArray.generate();

this.vertexBuffer = new VertexBuffer();
this.vertexBuffer.generate(vertexData);
```

Then it uses the shader’s attribute locations to configure the layout.

#### `bind()`

```js
this.vertexArray.bind();
this.vertexBuffer.bind();
if(this.useElements){
    this.indexBuffer.bind();
}

this.material.shader.bind();

if(this.material.texture){
    this.material.texture.bind();
}
```

### Why this sequence matters

The order is strict because WebGL state must be set correctly before draw calls happen.

---

## 19. Shader implementation details

### [sckorpioEngineWeb/renderer/webgl/shader/shader.js](sckorpioEngineWeb/renderer/webgl/shader/shader.js)

This class is responsible for shader compilation and linking.

#### `generate()`

```js
async generate(shaderName) {
    this.shaderProgram = null;
    this.shaderName = shaderName;
    this.shaderFilePath = "sckorpioEngineWeb/renderer/webgl/resources/shaders/" + shaderName + ".txt";

    const source = await this.parseShader(this.shaderFilePath);

    const vertexShaderID = this.compileShader(source.vertexSource, 'vertex');
    const fragmentShaderID = this.compileShader(source.fragmentSource, 'fragment');

    this.shaderProgram = this.linkProgram(vertexShaderID, fragmentShaderID);
    this.bind();
}
```

#### `parseShader()`

```js
async parseShader(shaderFilePath) {
    const response = await fetch(shaderFilePath);
    const shaderCode = await response.text();

    const shaderSource = { vertexSource: '', fragmentSource: '' };
    let type = 'none';

    const lines = shaderCode.split('\n');
    lines.forEach(line => {
      if (line.includes('#shader')) {
        if (line.includes('vertex')) {
          type = 'vertex';
        } else if (line.includes('fragment')) {
          type = 'fragment';
        }
      } else {
        if (type === 'vertex') {
          shaderSource.vertexSource += line + '\n';
        } else if (type === 'fragment') {
          shaderSource.fragmentSource += line + '\n';
        }
      }
    });

    return shaderSource;
}
```

### Important note

The parser looks for `#shader vertex` and `#shader fragment` markers, which is a very simple custom format.

---

## 20. Shader uniform helpers

The shader class includes helpers such as:

```js
setUniform1i(name, value)
setUniform1f(name, value)
setUniform3fv(name, vec)
setUniformMat4f(name, matrix)
```

Examples:

```js
this.material.shader.setUniformMat4f("u_model", model);
this.material.shader.setUniformMat4f("u_view", view);
this.material.shader.setUniformMat4f("u_projection", projection);
```

These are used by the renderer to pass the current camera and model transforms into the GPU.

---

## 21. Buffer layout implementation details

### [sckorpioEngineWeb/renderer/webgl/buffer/bufferLayout.js](sckorpioEngineWeb/renderer/webgl/buffer/bufferLayout.js)

This file defines how attributes are laid out in memory.

#### BufferElement

```js
class BufferElement {
    constructor(type, count, normalized, attribLocation, divisor = 0) {
      this.type = type;
      this.count = count;
      this.normalized = normalized;
      this.attribLocation = attribLocation;
      this.divisor = divisor;
    }
}
```

#### Size calculation

```js
static getSizeOfType(type) {
  switch (type) {
    case gl.FLOAT:
      return 4;
    case gl.UNSIGNED_INT:
      return 4;
    case gl.UNSIGNED_BYTE:
      return 1;
  }
}
```

#### Matrix support

```js
pushMat4f(baseAttribLocation) {
  for(let i = 0; i < 4; i++) {
    const currentSlotLocation = baseAttribLocation + i;
    this.elements.push(new BufferElement(gl.FLOAT, 4, gl.FALSE, currentSlotLocation, this.divisor));
    this.stride += BufferElement.getSizeOfType(gl.FLOAT) * 4;
  }
}
```

This is what allows an instanced model matrix to be uploaded correctly.

---

## 22. Vertex array behavior

### [sckorpioEngineWeb/renderer/webgl/buffer/vertexArray.js](sckorpioEngineWeb/renderer/webgl/buffer/vertexArray.js)

The vertex array is configured using:

```js
gl.vertexAttribPointer(
    element.attribLocation,
    element.count,
    element.type,
    element.normalized,
    layout.getStride(),
    offset
);

gl.enableVertexAttribArray(element.attribLocation);
gl.vertexAttribDivisor(element.attribLocation, element.divisor);
```

### Important point

This is where the engine links CPU layout data to actual GPU attribute slots.

---

## 23. Camera implementation details

### [sckorpioEngineWeb/core/ecs/component/components/cameraComponent.js](sckorpioEngineWeb/core/ecs/component/components/cameraComponent.js)

The camera component initializes with:

```js
this.cameraPos = vec3.fromValues(12.0, 6.0, 12.0);
this.cameraFront = vec3.fromValues(-1.0, 0.0, -1.0);
this.cameraUp = vec3.fromValues(0.0, 1.0, 0.0);

this.yaw = -135.0;
this.pitch = -30.0;
```

#### View matrix update

```js
updateViewMatrix() {
  this.viewMatrix = mat4.lookAt(
      this.identityMatrix,
      this.cameraPos,
      vec3.add(vec3.create(), this.cameraPos, this.cameraFront),
      this.cameraUp
  );
}
```

#### Projection matrix update

```js
updateProjectionMatrix() {
  if (this.type == "perspective") {
    this.projectionMatrix = mat4.perspective(
      this.projectionMatrix,
      glMatrix.toRadian(45.0),
      getWebGLCanvasRatio(),
      0.1,
      10000.0
    );
  }
}
```

### Input control details

- Arrow keys move the camera forward/backward/sideways
- mouse drag changes yaw/pitch
- mouse wheel adjusts position based on direction
- window resize updates the projection matrix

---

## 24. Material and texture book details

### [sckorpioEngineWeb/renderer/webgl/material/materialBook.js](sckorpioEngineWeb/renderer/webgl/material/materialBook.js)

This file creates default materials using the shader book and texture book.

Example:

```js
let basicRedMaterial = new Material("basicRed");
basicRedMaterial.setShader(shaderBook.getShader("basic3D"));
basicRedMaterial.setColor(1.0,0.0,0.0);
this.defaultMaterials.set("basicRed",basicRedMaterial);
```

### [sckorpioEngineWeb/renderer/webgl/texture/textureBook.js](sckorpioEngineWeb/renderer/webgl/texture/textureBook.js)

The texture book loads default assets with:

```js
await texture.generate(this.defaultTexturesPath + textureName + ".png");
```

It stores them in a `Map` so lookup is fast and consistent.

---

## 25. Cube mesh data details

### [sckorpioEngineWeb/core/ecs/entity/entities/mesh/primitives/cube.js](sckorpioEngineWeb/core/ecs/entity/entities/mesh/primitives/cube.js)

This file defines the 3D cube geometry and several material modes.

#### Example vertex layout (basic)

```js
this.meshComponent.layout = [
    { type: "float", count: 3, name: "a_vertPosition" }
];
```

#### Example vertex data

```js
this.meshComponent.vertexData = [
    -0.5, -0.5, 0.5,
     0.5, -0.5, 0.5,
     0.5,  0.5, 0.5,
    -0.5,  0.5, 0.5,
];
```

### Why this file matters

It shows exactly how a mesh defines geometry, layout, and material expectations for the renderer.

---

## 26. Renderer loop details

### [sckorpioEngineWeb/renderer/webgl/webglRenderer.js](sckorpioEngineWeb/renderer/webgl/webglRenderer.js)

The actual frame loop logic is here.

```js
render() {
    this.init();
    logger.resetFrameCounters();

    this.entities.forEach(async (entity) => {
        if(entity.meshComponent.isVisible()){
            const renderComponent = entity.meshComponent.renderComponent;
            renderComponent.bind();

            if(renderComponent.isInstanced) {
                renderComponent.setIsInstanced();
                renderComponent.setViewProjection(
                    this.cameraEntity.cameraComponent.getViewMatrix(),
                    this.cameraEntity.cameraComponent.getProjectionMatrix()
                );
                renderComponent.setColor();

                if(renderComponent.useElements){
                    gl.drawElementsInstanced(...);
                } else {
                    gl.drawArraysInstanced(...);
                }
            } else {
                renderComponent.setIsInstanced();
                renderComponent.setMVP(
                    entity.transformComponent.getModelMatrix(),
                    this.cameraEntity.cameraComponent.getViewMatrix(),
                    this.cameraEntity.cameraComponent.getProjectionMatrix()
                );
                renderComponent.setColor();

                if(renderComponent.useElements){
                    gl.drawElements(...);
                } else {
                    gl.drawArrays(...);
                }
            }

            renderComponent.vertexArray.unbind();
            gl.bindVertexArray(null);
        }
    });

    logger.show();
}
```

### One subtle issue

The loop uses `forEach(async ...)` rather than awaiting each draw call. That means the code is not fully sequential in the way a strict frame pipeline would be.

---

## 27. Internal resource IDs

### [sckorpioEngineWeb/canvas/utils.js](sckorpioEngineWeb/canvas/utils.js)

```js
var resourceID = 0;
export function getWebGLResourceID() {
  return resourceID++;
}
```

This is used to generate unique IDs for WebGL resources.

---

## 28. Summary of implementation flow

A practical sequence looks like this:

1. `main.js` starts the app.
2. `verifyWebGLSupport()` ensures the browser has WebGL.
3. a scene is created.
4. `scene.init()` creates the renderer and camera.
5. shader, texture, and material books are initialized.
6. default helper entities are created.
7. `scene.load()` pushes all entities to the renderer.
8. `renderer.loadEntityDataToGPU()` uploads geometry.
9. `scene.play()` starts `requestAnimationFrame()` loop.
10. every frame the renderer binds resources and emits draw calls.

---

## 29. Quick reference map

| Area | Main file |
|---|---|
| App startup | [main.js](main.js) |
| HTML + canvas setup | [index.html](index.html) |
| Canvas utilities | [sckorpioEngineWeb/canvas/utils.js](sckorpioEngineWeb/canvas/utils.js) |
| Logger overlay | [sckorpioEngineWeb/canvas/logger.js](sckorpioEngineWeb/canvas/logger.js) |
| Title overlay | [sckorpioEngineWeb/canvas/title.js](sckorpioEngineWeb/canvas/title.js) |
| Scene manager | [sckorpioEngineWeb/core/scene/sckorpioScene.js](sckorpioEngineWeb/core/scene/sckorpioScene.js) |
| Renderer | [sckorpioEngineWeb/renderer/webgl/webglRenderer.js](sckorpioEngineWeb/renderer/webgl/webglRenderer.js) |
| Shader system | [sckorpioEngineWeb/renderer/webgl/shader/shader.js](sckorpioEngineWeb/renderer/webgl/shader/shader.js) |
| Material system | [sckorpioEngineWeb/renderer/webgl/material/material.js](sckorpioEngineWeb/renderer/webgl/material/material.js) |
| Texture system | [sckorpioEngineWeb/renderer/webgl/texture/texture.js](sckorpioEngineWeb/renderer/webgl/texture/texture.js) |
| Buffer system | [sckorpioEngineWeb/renderer/webgl/buffer](sckorpioEngineWeb/renderer/webgl/buffer) |
| Camera logic | [sckorpioEngineWeb/core/ecs/component/components/cameraComponent.js](sckorpioEngineWeb/core/ecs/component/components/cameraComponent.js) |
| Transform logic | [sckorpioEngineWeb/core/ecs/component/components/transformComponent.js](sckorpioEngineWeb/core/ecs/component/components/transformComponent.js) |
| Mesh logic | [sckorpioEngineWeb/core/ecs/component/components/meshComponent.js](sckorpioEngineWeb/core/ecs/component/components/meshComponent.js) |
| Render logic | [sckorpioEngineWeb/core/ecs/component/components/renderComponent.js](sckorpioEngineWeb/core/ecs/component/components/renderComponent.js) |
