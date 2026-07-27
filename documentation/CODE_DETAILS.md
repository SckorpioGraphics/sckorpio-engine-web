# SckorpioWebEngine Code Details

## 1. Entry point and runtime startup

### [main.js](main.js)

The engine starts here.

```js
import { verifyWebGLSupport } from "./sckorpioWebEngine/canvas/utils.js";
import { title } from "./sckorpioWebEngine/canvas/title.js";
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

1. `sckorpioWebEngine-webgl-surface`
   - main rendering surface
2. `sckorpioWebEngine-2d-title-surface`
   - title overlay surface
3. `sckorpioWebEngine-2d-logger-surface`
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

### [sckorpioWebEngine/canvas/utils.js](sckorpioWebEngine/canvas/utils.js)

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
  var canvas = document.getElementById("sckorpioWebEngine-webgl-surface");
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

### [sckorpioWebEngine/canvas/title.js](sckorpioWebEngine/canvas/title.js)

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
        img.src = "sckorpioWebEngine/canvas/resources/textures/sckorpioEngineLogo.png";

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

### [sckorpioWebEngine/canvas/logger.js](sckorpioWebEngine/canvas/logger.js)

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

### [sckorpioWebEngine/core/scene/sckorpioScene.js](sckorpioWebEngine/core/scene/sckorpioScene.js)

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

### [sckorpioWebEngine/core/ecs/entity/entity.js](sckorpioWebEngine/core/ecs/entity/entity.js)

```js
class Entity{
    constructor(){
        this.uid = 0;
        this.components = [];
    }
}
```

### [sckorpioWebEngine/core/ecs/component/component.js](sckorpioWebEngine/core/ecs/component/component.js)

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

## 10. Shape hierarchy and transform logic

### [sckorpioWebEngine/core/ecs/entityList/shape/shape.js](sckorpioWebEngine/core/ecs/entityList/shape/shape.js)

```js
class Shape extends Entity{
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

### [sckorpioWebEngine/core/ecs/componentList/transformComponent.js](sckorpioWebEngine/core/ecs/componentList/transformComponent.js)

```js
class TransformComponent extends Component{
    constructor(){
        super();
        this.position = vec3.fromValues(0.0, 0.0, 0.0);
        this.scale = vec3.fromValues(1.0, 1.0, 1.0);
        this.rotation = vec3.fromValues(0.0, 0.0, 0.0);
        this.modelMatrix = mat4.create();
        this.setModelMatrix();
    }

    setPosition(x,y,z){
        this.position = vec3.fromValues(x,y,z);
        this.setModelMatrix();
    }

    setScale(sx,sy,sz){
        this.scale = vec3.fromValues(sx,sy,sz);
        this.setModelMatrix();
    }

    setRotation(rx,ry,rz){
        this.rotation = vec3.fromValues(rx,ry,rz);
        this.setModelMatrix();
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

## 12. Mesh component details

### [sckorpioWebEngine/core/ecs/componentList/meshComponent.js](sckorpioWebEngine/core/ecs/componentList/meshComponent.js)

This component is the bridge from CPU-side mesh data to GPU-ready render data.

#### Key properties

```js
this.visible = true;
this.vertexLayout;
this.vertexData = [];
this.indexData = [];
this.instanceLayout;
this.instanceData = [];
this.instancesCount = 0;
this.textureUV = [0.0, 0.0, 1.0, 1.0];
this.renderComponent = new RenderComponent();
```

#### `loadGPUData()`

```js
loadGPUData(){
    this.renderComponent.setMaterial(this.material);
    this.renderComponent.setData(this.layout,this.vertexData,this.indexData);

    if(this.isInstanced){
        if(this.instanceData.length > 0){
            this.renderComponent.setInstancedData(this.instanceLayout, this.instanceData, this.instancesCount);
        }
    }
}
```

### Practical interpretation

This method is the point where mesh data becomes GPU data.

---

## 13. Render component details

### [sckorpioWebEngine/core/ecs/componentList/renderComponent.js](sckorpioWebEngine/core/ecs/componentList/renderComponent.js)

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

## 14. Shader implementation details

### [sckorpioWebEngine/renderer/webgl/shader/shader.js](sckorpioWebEngine/renderer/webgl/shader/shader.js)

This class is responsible for shader compilation and linking.

#### `generate()`

```js
async generate(shaderName) {
    this.shaderProgram = null;
    this.shaderName = shaderName;
    this.shaderFilePath = "sckorpioWebEngine/renderer/webgl/resources/shaders/" + shaderName + ".txt";

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

## 15. Shader uniform helpers

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

## 16. Buffer layout implementation details

### [sckorpioWebEngine/renderer/webgl/buffer/bufferLayout.js](sckorpioWebEngine/renderer/webgl/buffer/bufferLayout.js)

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

## 17. Vertex array behavior

### [sckorpioWebEngine/renderer/webgl/buffer/vertexArray.js](sckorpioWebEngine/renderer/webgl/buffer/vertexArray.js)

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

## 18. Camera implementation details

### [sckorpioWebEngine/core/ecs/componentList/cameraComponent.js](sckorpioWebEngine/core/ecs/componentList/cameraComponent.js)

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

## 19. Material and texture book details

### [sckorpioWebEngine/renderer/webgl/material/materialBook.js](sckorpioWebEngine/renderer/webgl/material/materialBook.js)

This file creates default materials using the shader book and texture book.

Example:

```js
let basicRedMaterial = new Material("basicRed");
basicRedMaterial.setShader(shaderBook.getShader("basic3D"));
basicRedMaterial.setColor(1.0,0.0,0.0);
this.defaultMaterials.set("basicRed",basicRedMaterial);
```

### [sckorpioWebEngine/renderer/webgl/texture/textureBook.js](sckorpioWebEngine/renderer/webgl/texture/textureBook.js)

The texture book loads default assets with:

```js
await texture.generate(this.defaultTexturesPath + textureName + ".png");
```

It stores them in a `Map` so lookup is fast and consistent.

---

## 20. Cube mesh data details

### [sckorpioWebEngine/core/ecs/entityList/shape/cube.js](sckorpioWebEngine/core/ecs/entityList/shape/cube.js)

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

It shows exactly how a shape defines geometry, layout, and material expectations for the renderer.

---

## 21. Renderer loop details

### [sckorpioWebEngine/renderer/webgl/webglRenderer.js](sckorpioWebEngine/renderer/webgl/webglRenderer.js)

The actual frame loop logic is here.

```js
render() {
    this.init();
    logger.resetFrameCounters();

    this.entityList.forEach(async (entity) => {
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

## 22. Internal resource IDs

### [sckorpioWebEngine/canvas/utils.js](sckorpioWebEngine/canvas/utils.js)

```js
var resourceID = 0;
export function getWebGLResourceID() {
  return resourceID++;
}
```

This is used to generate unique IDs for WebGL resources.

---

## 23. Summary of implementation flow

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

## 24. Quick reference map

| Area | Main file |
|---|---|
| App startup | [main.js](main.js) |
| HTML + canvas setup | [index.html](index.html) |
| Canvas utilities | [sckorpioWebEngine/canvas/utils.js](sckorpioWebEngine/canvas/utils.js) |
| Logger overlay | [sckorpioWebEngine/canvas/logger.js](sckorpioWebEngine/canvas/logger.js) |
| Title overlay | [sckorpioWebEngine/canvas/title.js](sckorpioWebEngine/canvas/title.js) |
| Scene manager | [sckorpioWebEngine/core/scene/sckorpioScene.js](sckorpioWebEngine/core/scene/sckorpioScene.js) |
| Renderer | [sckorpioWebEngine/renderer/webgl/webglRenderer.js](sckorpioWebEngine/renderer/webgl/webglRenderer.js) |
| Shader system | [sckorpioWebEngine/renderer/webgl/shader/shader.js](sckorpioWebEngine/renderer/webgl/shader/shader.js) |
| Material system | [sckorpioWebEngine/renderer/webgl/material/material.js](sckorpioWebEngine/renderer/webgl/material/material.js) |
| Texture system | [sckorpioWebEngine/renderer/webgl/texture/texture.js](sckorpioWebEngine/renderer/webgl/texture/texture.js) |
| Buffer system | [sckorpioWebEngine/renderer/webgl/buffer](sckorpioWebEngine/renderer/webgl/buffer) |
| Camera logic | [sckorpioWebEngine/core/ecs/componentList/cameraComponent.js](sckorpioWebEngine/core/ecs/componentList/cameraComponent.js) |
| Transform logic | [sckorpioWebEngine/core/ecs/componentList/transformComponent.js](sckorpioWebEngine/core/ecs/componentList/transformComponent.js) |
| Mesh logic | [sckorpioWebEngine/core/ecs/componentList/meshComponent.js](sckorpioWebEngine/core/ecs/componentList/meshComponent.js) |
| Render logic | [sckorpioWebEngine/core/ecs/componentList/renderComponent.js](sckorpioWebEngine/core/ecs/componentList/renderComponent.js) |
