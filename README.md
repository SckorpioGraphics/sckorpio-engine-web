# SckorpioWebEngine(Legacy)

<img width="1390" height="852" alt="Screenshot 2026-05-22 at 6 08 25 PM" src="https://github.com/user-attachments/assets/5553ada2-9d4e-4fe5-84e2-bed3a6869793" />
<img width="1240" height="671" alt="Screenshot 2026-05-22 at 6 06 46 PM" src="https://github.com/user-attachments/assets/b7f42d31-36b0-472c-b7f3-814cff66c59c" />
<img width="1508" height="660" alt="Screenshot 2026-05-22 at 6 12 57 PM" src="https://github.com/user-attachments/assets/5ad482c2-53fc-4ac5-baad-1207d571831f" />



## Overview

**SckorpioWebEngine** is a WebGL 2.0-based 3D graphics library built with JavaScript. It provides a modern, component-based architecture for creating 3D scenes and rendering graphics in the browser. The library uses an Entity Component System (ECS) pattern, making it modular, extensible, and easy to use.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Systems](#core-systems)
3. [Entity Component System (ECS)](#entity-component-system-ecs)
4. [WebGL Infrastructure](#webgl-infrastructure)
5. [Resource Management](#resource-management)
6. [Scene Management](#scene-management)
7. [Project Structure](#project-structure)
8. [Usage Guide](#usage-guide)
9. [Features](#features)
10. [Keyboard Controls](#keyboard-controls)

---

## Architecture Overview

SckorpioWebEngine follows a layered architecture:

```
┌─────────────────────────────────────┐
│      Application Layer (Projects)     │
│    (User-defined scenes/projects)   │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         Scene Management            │
│    (Scene, SckorpioWebScene classes)  │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      Entity Component System        │
│  (Entities, Components, Systems)    │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      WebGL Infrastructure           │
│  (Buffers, Shaders, Materials, etc) │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      Canvas & Utilities             │
│  (WebGL Context, Logger, Title)    │
└─────────────────────────────────────┘
```

---

## Core Systems

### 1. Canvas Management (`sckorpioWebEngine/canvas/`)

The canvas system manages multiple rendering surfaces:

#### **utils.js**
- **WebGL Context Management**: Provides access to the WebGL 2.0 rendering context
- **Canvas Utilities**: Functions to get canvas dimensions, aspect ratio, and WebGL context
- **Resource ID Generation**: Unique ID generation for WebGL resources
- **Multi-Canvas Support**: Manages three canvas elements:
  - `sckorpioWebEngine-webgl-surface`: Main WebGL rendering canvas
  - `sckorpioWebEngine-2d-title-surface`: 2D canvas for title display
  - `sckorpioWebEngine-2d-logger-surface`: 2D canvas for FPS/performance logging

#### **title.js**
- **Title Display System**: Renders the "SckorpioWebEngine" title on a 2D overlay canvas
- **Multiple Styles**: Supports different title rendering styles (text-only, icon-based)
- **Visual Effects**: Includes shadow effects and color gradients

#### **logger.js**
- **Performance Monitoring**: Tracks and displays FPS (Frames Per Second)
- **Frame Time Tracking**: Measures frame rendering time
- **Toggle Display**: Press 'L' key to show/hide the logger overlay
- **Real-time Updates**: Updates performance metrics every second

---

## Entity Component System (ECS)

SckorpioWebEngine uses an ECS architecture where:
- **Entities**: Game objects (Camera, Box, Sphere, Grid, etc.)
- **Components**: Data containers (Transform, Mesh, Render, Camera)
- **Systems**: Logic processors (Renderer)

### Entity (`ecs/entity/entity.js`)

Base class for all game objects. Contains:
- `uid`: Unique identifier
- `components[]`: Array of attached components

### Components

#### **TransformComponent** (`ecs/componentList/transformComponent.js`)
Manages spatial transformation:
- **Position**: 3D position (vec3)
- **Scale**: 3D scale (vec3)
- **Rotation**: 3D rotation in degrees (vec3)
- **Model Matrix**: Calculated 4x4 transformation matrix
- Uses `gl-matrix` library for matrix operations

#### **MeshComponent** (`ecs/componentList/meshComponent.js`)
Contains geometry data:
- **Vertices Data**: Array of vertex positions/attributes
- **Index Data**: Array of indices for indexed rendering
- **Layout**: Describes vertex attribute layout
- **Material**: Reference to material/shader
- **Visibility**: Controls whether mesh is rendered
- **Texture UV**: UV coordinate range for texture mapping

#### **RenderComponent** (`ecs/componentList/renderComponent.js`)
Handles GPU-side rendering:
- **Vertex Array Object (VAO)**: WebGL vertex array
- **Vertex Buffer**: GPU buffer for vertex data
- **Index Buffer**: GPU buffer for index data
- **Layout**: Vertex buffer layout specification
- **Material Binding**: Binds shaders, textures, uniforms
- **Draw Calls**: Executes `gl.drawElements()` or `gl.drawArrays()`
- **MVP Matrices**: Sets Model-View-Projection matrices

#### **CameraComponent** (`ecs/componentList/cameraComponent.js`)
Camera functionality:
- **Camera Position**: 3D position vector
- **Camera Front/Up**: Direction vectors
- **Yaw/Pitch/Roll**: Orientation angles
- **View Matrix**: Camera view transformation
- **Projection Matrix**: Perspective/orthographic projection
- **Input Handling**: Keyboard, mouse, and scroll controls
- **Resize Handling**: Updates projection on window resize

### Systems

#### **Renderer** (`ecs/system/renderer.js`)
Main rendering system:
- **Entity List**: Maintains list of entities to render
- **Camera Reference**: Holds reference to camera entity
- **Clear Color**: Background color configuration
- **Render Loop**: Iterates through entities and renders them
- **Depth Testing**: Enables WebGL depth testing
- **MVP Calculation**: Computes and sets MVP matrices for each entity

---

## WebGL Infrastructure

### Buffers (`webgl/buffer/`)

#### **VertexBuffer** (`vertexBuffer.js`)
- Creates and manages WebGL vertex buffers
- Stores vertex data (positions, colors, UVs, etc.)
- Uses `gl.ARRAY_BUFFER` target

#### **IndexBuffer** (`indexBuffer.js`)
- Creates and manages WebGL index buffers
- Stores indices for indexed rendering
- Uses `gl.ELEMENT_ARRAY_BUFFER` target
- Uses `Uint16Array` for index data

#### **VertexArray** (`vertexArray.js`)
- Creates and manages Vertex Array Objects (VAO)
- Binds vertex buffers and their layouts
- Configures vertex attribute pointers
- Enables vertex attribute arrays

#### **BufferLayout** (`BufferLayout.js`)
- Defines vertex attribute layout
- Supports float, unsigned int, and unsigned byte types
- Calculates stride automatically
- Maps attributes to shader locations

### Shaders (`webgl/shader/`)

#### **Shader** (`shader.js`)
- **Shader Compilation**: Compiles vertex and fragment shaders
- **Program Linking**: Links shaders into a program
- **Uniform Management**: Sets uniform variables (matrices, colors, textures)
- **Attribute Location**: Gets attribute locations from shaders
- **File Parsing**: Parses shader files with `#shader vertex` and `#shader fragment` markers

#### **ShaderBook** (`shaderBook.js`)
- **Singleton Pattern**: Single instance manages all shaders
- **Default Shaders**: Pre-loads common shaders:
  - `basic`: Basic 2D shader
  - `basic3D`: Basic 3D shader with uniform color
  - `colorVertex3D`: Vertex color shader
  - `textureVertex3D`: Texture mapping shader
  - `uvVertex3D`: UV coordinate shader
- **Shader Storage**: Map-based storage for shader lookup

### Materials (`webgl/material/`)

#### **Material** (`material.js`)
- **Shader Reference**: Links to a shader program
- **Color**: RGB color value (for solid color materials)
- **Texture**: Optional texture reference
- **Texture Wrap**: Configures texture wrapping modes

#### **MaterialBook** (`materialBook.js`)
- **Singleton Pattern**: Single instance manages all materials
- **Default Materials**: Pre-creates common materials:
  - `basicRed`, `basicGreen`, `basicBlue`, `basicWhite`, `basicGrey`
  - `colorVertex`, `colorFace`
  - `uvVertex3D`
  - `wood`, `brick` (textured materials)
- **Material Factory**: Methods to create custom materials

### Textures (`webgl/texture/`)

#### **Texture** (`texture.js`)
- **Image Loading**: Asynchronously loads texture images
- **WebGL Texture Creation**: Creates and configures WebGL textures
- **Mipmap Generation**: Automatically generates mipmaps
- **Wrap Modes**: Supports REPEAT, CLAMP_TO_EDGE, MIRRORED_REPEAT
- **Pixel Textures**: Can create procedural pixel textures

#### **TextureBook** (`textureBook.js`)
- **Singleton Pattern**: Single instance manages all textures
- **Default Textures**: Pre-loads common textures:
  - `sckorpioWebTexture`, `grass`, `woodCarton`, `brick`
- **Custom Textures**: Supports project-specific textures
- **Path Management**: Handles default and custom texture paths

---

## Resource Management

SckorpioWebEngine uses a **Book Pattern** for resource management:

1. **ShaderBook**: Centralized shader management
2. **MaterialBook**: Centralized material management
3. **TextureBook**: Centralized texture management

All books use the **Singleton Pattern** to ensure only one instance exists, providing:
- **Efficient Memory Usage**: Resources loaded once and reused
- **Easy Access**: Global access via `getInstance()`
- **Consistent State**: Single source of truth for resources

---

## Scene Management

### Scene (`scene/scene.js`)

Base scene class that provides:
- **Renderer Initialization**: Creates and configures the renderer
- **Camera Setup**: Creates and positions the camera
- **Resource Loading**: Initializes shaders, textures, and materials
- **Default Entities**: Creates grid and axis helpers
- **Entity Management**: Maintains lists of default and custom entities
- **Render Loop**: Implements the main rendering loop using `requestAnimationFrame`
- **Event Listeners**: Keyboard shortcuts for grid/axis visibility

### SckorpioWebScene (`scene/sckorpioWebScene.js`)

Extended scene class with additional features (similar to Scene but with different method names for material setting).

### Project Scenes (`projects/*/scene.js`)

User-defined scenes that extend `SckorpioWebScene`:
- **Custom Resource Loading**: Loads project-specific textures
- **Scene Creation**: Defines custom entities and their arrangements
- **Project Organization**: Each project has its own directory with resources

---

## Project Structure

```
sckorpioWebEngine/
├── index.html                 # Main HTML entry point
├── main.js                    # Application entry point
├── sckorpioWebEngine/                  # Core library code
│   ├── canvas/               # Canvas and utility systems
│   ├── ecs/                  # Entity Component System
│   │   ├── component/        # Base component class
│   │   ├── componentList/    # Specific components
│   │   ├── entity/           # Base entity class
│   │   ├── entityList/       # Specific entities (Camera, Shapes)
│   │   └── system/           # Systems (Renderer)
│   ├── scene/                # Scene management
│   ├── webgl/                # WebGL infrastructure
│   │   ├── buffer/           # Buffer management
│   │   ├── material/         # Material system
│   │   ├── shader/           # Shader system
│   │   └── texture/          # Texture system
│   └── resources/            # Default resources
│       ├── shaders/          # Shader source files
│       └── textures/         # Default texture images
└── projects/                 # User projects
    └── [projectName]/
        ├── scene.js          # Project scene definition
        └── resources/
            └── textures/     # Project-specific textures
```

---

## Usage Guide

### Basic Setup

1. **HTML Setup**: Include the WebGL canvas in your HTML:
```html
<canvas id="sckorpioWebEngine-webgl-surface"></canvas>
```

2. **Initialize SckorpioWebEngine**:
```javascript
import { Scene } from "./projects/myProject/scene.js";

var initSckorpioWebEngine = async function () {
    var scene = new Scene("myProject"); 
    await scene.init(); 
    await scene.initResources();
    await scene.createScene();
    scene.load();
    scene.play();
}

initSckorpioWebEngine();
```

### Creating Entities

#### Box
```javascript
import { Box } from "../../sckorpioWebEngine/ecs/entityList/shape/box.js";

// Basic box
let box = new Box({ mode: 'basic' });
box.setPosition(vec3.fromValues(0.0, 0.5, 0.0));
box.setColor(1, 0, 1); // Magenta

// Colored box (vertex colors)
let colorBox = new Box({ mode: 'colorVertex' });
colorBox.setPosition(vec3.fromValues(2.0, 0.5, 0.0));

// Textured box
let texturedBox = new Box({ mode: 'textureFace', uvRange: [0, 0, 2, 2] });
texturedBox.setPosition(vec3.fromValues(4.0, 0.5, 0.0));
texturedBox.setTexture("woodCarton");
```

#### Sphere
```javascript
import { Sphere } from "../../sckorpioWebEngine/ecs/entityList/shape/sphere.js";

let sphere = new Sphere(0.5, 36, 36); // radius, latitudeBands, longitudeBands
sphere.setPosition(vec3.fromValues(-2.0, 0.5, 0.0));
sphere.setColor(0, 1, 1); // Cyan
```

#### Grid
```javascript
import { Grid } from "../../sckorpioWebEngine/ecs/entityList/shape/grid.js";

let grid = new Grid(100, 1.0); // gridCount, gridGap
grid.setMaterial("basicGrey");
```

### Transformations

```javascript
// Position
entity.setPosition(vec3.fromValues(x, y, z));

// Scale
entity.setScale(vec3.fromValues(sx, sy, sz));

// Rotation (in degrees)
entity.setRotation(vec3.fromValues(rx, ry, rz));
```

### Materials and Textures

```javascript
// Use default material
entity.setDefaultMaterial("basicRed");

// Set color (for basic3D shader)
entity.setColor(r, g, b);

// Set texture
entity.setTexture("grass");

// Set texture repeat
entity.setTextureRepeat(repeatX, repeatY);
```

### Camera Controls

The camera supports multiple input methods:

- **Arrow Keys**: Move camera forward/backward/left/right
- **Mouse Drag**: Rotate camera (click and drag)
- **Mouse Scroll**: Zoom in/out and pan based on mouse position
- **Window Resize**: Automatically adjusts projection

---

## Features

### Rendering Modes

1. **Basic Mode**: Simple solid color rendering
2. **Color Face Mode**: Each face has a different color
3. **Color Vertex Mode**: Vertex-based color interpolation
4. **Texture Face Mode**: Texture mapping with UV coordinates

### Built-in Shapes

- **Box**: Configurable cube with multiple rendering modes
- **Sphere**: Parametric sphere with configurable resolution
- **Grid**: Reference grid for scene visualization
- **Axis Helpers**: X (red), Y (green), Z (blue) axis lines

### Shader System

- **Modular Shaders**: Shaders stored in separate `.txt` files
- **Shader Parsing**: Automatic parsing of vertex/fragment shader sections
- **Uniform Management**: Easy uniform variable setting
- **Multiple Shader Types**: Basic, colored, textured shaders

### Resource Management

- **Singleton Pattern**: Efficient resource sharing
- **Lazy Loading**: Resources loaded on demand
- **Project Resources**: Support for project-specific textures
- **Default Resources**: Pre-loaded common resources

### Performance Features

- **FPS Logger**: Real-time performance monitoring
- **Indexed Rendering**: Efficient geometry rendering
- **VAO Support**: Optimized vertex attribute management
- **Depth Testing**: Proper 3D depth sorting

---

## Keyboard Controls

| Key | Action |
|-----|--------|
| `G` / `g` | Toggle grid visibility |
| `Y` / `y` | Toggle axis visibility |
| `L` / `l` | Toggle FPS logger display |
| `↑` | Move camera forward |
| `↓` | Move camera backward |
| `←` | Move camera left |
| `→` | Move camera right |

### Mouse Controls

- **Click + Drag**: Rotate camera (yaw/pitch)
- **Scroll Wheel**: Zoom in/out and pan camera

---

## Technical Details

### WebGL 2.0 Features Used

- **Vertex Array Objects (VAO)**: For efficient vertex attribute management
- **Multiple Render Targets**: Support for multiple canvases
- **Texture 2D**: 2D texture mapping
- **Depth Testing**: Z-buffer for proper 3D rendering
- **Matrix Operations**: Full 4x4 matrix transformations

### Dependencies

- **gl-matrix**: Matrix and vector math operations
- **WebGL 2.0**: Modern WebGL API

### Browser Compatibility

Requires a browser with WebGL 2.0 support:
- Chrome 56+
- Firefox 51+
- Safari 15+
- Edge 79+

---

## Architecture Benefits

1. **Modularity**: Clear separation of concerns
2. **Extensibility**: Easy to add new shapes, shaders, materials
3. **Performance**: Efficient resource management and rendering
4. **Usability**: Simple API for common operations
5. **Maintainability**: Well-organized code structure

---

## Future Enhancements

Potential areas for expansion:
- Lighting system (directional, point, spot lights)
- Shadow mapping
- Post-processing effects
- Animation system
- Physics integration
- Model loading (OBJ, GLTF)
- More primitive shapes (cylinder, plane, etc.)
- Advanced materials (PBR, normal mapping)
- Particle systems

---

## License

[Add your license information here]

---

## Author

SckorpioWebEngine Graphics Library

---

*Last Updated: [Current Date]*

