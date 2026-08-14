# SckorpioWebEngine Code Details

## 1. Entry point and runtime startup

### [main.js](main.js)

The engine starts here.

```js
import { verifyWebGLSupport } from "./sckorpioEngineWeb/canvas/utils.js";
import { title } from "./sckorpioEngineWeb/canvas/title.js";
import { Scene } from "./projects/sckorpioFIFA26/scene.js";

var initSckorpioWebEngine = async function () {
    verifyWebGLSupport();

    var scene = new Scene("sckorpioFIFA26"); 
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

## 3. Canvas utilities and WebGL context

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

## 4. Title overlay implementation

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

## 5. Logger overlay implementation

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

## 6. Scene orchestration code

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

## 7. Default helper entities in the scene

### `createDefaultEntities()`

```js
createDefaultEntities(){
    this.grid = new Grid(100,1.0);
    this.grid.setMaterial("basicGrey");

    this.xAxis = new Cube();
    this.xAxis.setPosition(50.0, 0.0, 0.0);
    this.xAxis.setScale(100.0, 0.02, 0.02);
    this.xAxis.setMaterial("basicRed");

    this.yAxis = new Cube();
    this.yAxis.setPosition(0.0, 50.0, 0.0);
    this.yAxis.setScale(0.02, 100.0, 0.02);
    this.yAxis.setMaterial("basicGreen");

    this.zAxis = new Cube();
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

## 8. Input handling in the scene

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

## 9. Entity base classes

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

## 10. Mesh hierarchy and transform logic

### [sckorpioEngineWeb/core/ecs/entity/entities/mesh/primitives/mesh.js](sckorpioEngineWeb/core/ecs/entity/entities/mesh/primitives/mesh.js)

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

## 11. Transform component details

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

## 12. Node class and scene graph hierarchy

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

### Example usage from sckorpioTestingSceneGraph

```js
// Create a sphere and cylinder
let sphere = new Sphere({ mode: 'basic' , radius: 0.5});
let cyclinder = new Cyclinder({ mode: 'basic' , radius:0.5, height:1.0});

// Position the cylinder
cyclinder.setPosition(-5.0, 5.0, -5.0);

// Make sphere a child of cylinder
// Now sphere's world position = cylinder's world position + sphere's local position
sphere.setParent(cyclinder);
sphere.setPosition(0, -2, 0);  // Position relative to cylinder
```

### Key benefits

- **Simplicity**: Parent-child relationships are maintained automatically
- **Realism**: Objects inherit parent transformations naturally
- **Optimization**: Shared transforms reduce redundant calculations
- **Flexibility**: Works seamlessly with instancing

---

## 14. Mesh component details

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

## 15. Render component details

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

## 16. Shader implementation details

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

## 17. Shader uniform helpers

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

## 18. Buffer layout implementation details

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

## 19. Vertex array behavior

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

## 20. Camera implementation details

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

## 21. Material and texture book details

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

## 22. Cube mesh data details

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

## 23. Renderer loop details

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

## 24. Internal resource IDs

### [sckorpioEngineWeb/canvas/utils.js](sckorpioEngineWeb/canvas/utils.js)

```js
var resourceID = 0;
export function getWebGLResourceID() {
  return resourceID++;
}
```

This is used to generate unique IDs for WebGL resources.

---

## 25. Summary of implementation flow

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

## 26. Quick reference map

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
