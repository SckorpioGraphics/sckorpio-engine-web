import { Component } from "../component.js";
import { getWebGLCanvas, getWebGLCanvasHeight, getWebGLCanvasRatio, getWebGLCanvasWidth, gl } from "../../../../canvas/utils.js";

class CameraComponent extends Component {
  constructor(type = "perspective") {
    super();
    this.type = type;

    // Camera vectors
    this.cameraPos;
    this.cameraFront;
    this.cameraUp;

    // Orientation
    this.yaw;
    this.pitch;
    this.roll;

    // Matrices
    this.identityMatrix = mat4.create();
    this.viewMatrix = mat4.create();
    this.projectionMatrix = mat4.create();

    // User click info
    this.firstMouse;
    this.lastX;
    this.lastY;
    this.isDragging;

    // --- SELF-CONTAINED LOOP TIMESTAMP TRACKERS ---
    this.pressedKeys = {};
    this.lastTime = performance.now();

    this.initCamera();
    this.setEventlisteners();
    
    // --- START AUTOMATED INTERNAL TICK PASS ---
    this.startInternalUpdateLoop();
  }

  initCamera() {
    this.cameraPos = vec3.fromValues(12.0, 6.0, 12.0);
    this.cameraFront = vec3.fromValues(-1.0, 0.0, -1.0);
    this.cameraUp = vec3.fromValues(0.0, 1.0, 0.0);

    this.yaw = -135.0;
    this.pitch = -30.0;
    this.roll = 0.0;

    let direction = vec3.create();
    direction[0] = Math.cos(this.yaw * Math.PI / 180.0) * Math.cos(this.pitch * Math.PI / 180.0);
    direction[1] = Math.sin(this.pitch * Math.PI / 180.0);
    direction[2] = Math.sin(this.yaw * Math.PI / 180.0) * Math.cos(this.pitch * Math.PI / 180.0);
    vec3.normalize(this.cameraFront, direction);

    this.identityMatrix = mat4.create();
    this.updateViewMatrix();
    this.updateProjectionMatrix(); 

    this.firstMouse = true;
    this.isDragging = false;
    this.lastX = getWebGLCanvasWidth() / 2.0;
    this.lastY = getWebGLCanvasHeight() / 2.0;
  }

  setPosition(x,y,z) {
    this.cameraPos = vec3.fromValues(x,y,z);
    this.updateViewMatrix();
  }

  updateViewMatrix() {
    this.viewMatrix = mat4.lookAt(
      this.identityMatrix, 
      this.cameraPos, 
      vec3.add(vec3.create(), this.cameraPos, this.cameraFront),
      this.cameraUp
    );
  }

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

  setOrthographic() { this.type = "orthographic"; this.updateProjectionMatrix(); }
  setPerspective() { this.type = "perspective"; this.updateProjectionMatrix(); }
  getProjectionMatrix() { return this.projectionMatrix; }
  getViewMatrix() { return this.viewMatrix; }

  // Runs continuously to pull key changes directly on frame refreshes
  startInternalUpdateLoop() {
    const loop = () => {
      const currentTime = performance.now();
      const deltaTime = (currentTime - this.lastTime) / 1000.0;
      this.lastTime = currentTime;

      this.processMovementTick(deltaTime);

      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  processMovementTick(deltaTime) {
    let baselineSpeed = 25.0; // Slightly faster default speed for expansive stadium sweeping view angles
    let cameraSpeed = baselineSpeed * deltaTime;
    let transformed = false;

    if (this.pressedKeys["ArrowUp"]) {
      vec3.scaleAndAdd(this.cameraPos, this.cameraPos, this.cameraFront, cameraSpeed);
      transformed = true;
    }
    if (this.pressedKeys["ArrowDown"]) {
      vec3.scaleAndAdd(this.cameraPos, this.cameraPos, this.cameraFront, -cameraSpeed);
      transformed = true;
    }
    if (this.pressedKeys["ArrowLeft"]) {
      const right = vec3.create();
      vec3.cross(right, this.cameraFront, this.cameraUp);
      vec3.normalize(right, right);
      vec3.scaleAndAdd(this.cameraPos, this.cameraPos, right, -cameraSpeed);
      transformed = true;
    }
    if (this.pressedKeys["ArrowRight"]) {
      const right = vec3.create();
      vec3.cross(right, this.cameraFront, this.cameraUp);
      vec3.normalize(right, right);
      vec3.scaleAndAdd(this.cameraPos, this.cameraPos, right, cameraSpeed);
      transformed = true;
    }

    if (transformed) {
      this.updateViewMatrix();
    }
  }

  mouseInput(event) {
    const xoffset = event.xOffSet;
    const yoffset = event.yOffSet;

    const sensitivity = 0.1; 
    this.yaw += xoffset * sensitivity;
    this.pitch += yoffset * sensitivity;

    if (this.pitch > 89.0) this.pitch = 89.0;
    if (this.pitch < -89.0) this.pitch = -89.0;

    let direction = vec3.create();
    direction[0] = Math.cos(this.yaw * Math.PI / 180.0) * Math.cos(this.pitch * Math.PI / 180.0);
    direction[1] = Math.sin(this.pitch * Math.PI / 180.0);
    direction[2] = Math.sin(this.yaw * Math.PI / 180.0) * Math.cos(this.pitch * Math.PI / 180.0);
    vec3.normalize(this.cameraFront, direction);
  }

  mouseScroll(event) {
    let mouseX = event.clientX / window.innerWidth * 2 - 1;  
    let mouseY = -(event.clientY / window.innerHeight * 2 - 1);  

    let cameraSpeed = 0.5;  
    
    if (event.deltaY < 0) {
      vec3.scaleAndAdd(this.cameraPos, this.cameraPos, this.cameraFront, cameraSpeed);
    } else {
      vec3.scaleAndAdd(this.cameraPos, this.cameraPos, this.cameraFront, -cameraSpeed);
    }

    const right = vec3.create();
    vec3.cross(right, this.cameraFront, this.cameraUp);
    vec3.normalize(right, right);

    const up = vec3.create();
    vec3.cross(up, right, this.cameraFront);
    vec3.normalize(up, up);

    if (mouseX < 0) {
      vec3.scaleAndAdd(this.cameraPos, this.cameraPos, right, -cameraSpeed * Math.abs(mouseX));
    } else if (mouseX > 0) {
      vec3.scaleAndAdd(this.cameraPos, this.cameraPos, right, cameraSpeed * mouseX);
    }

    if (mouseY < 0) {
      vec3.scaleAndAdd(this.cameraPos, this.cameraPos, up, -cameraSpeed * Math.abs(mouseY));
    } else if (mouseY > 0) {
      vec3.scaleAndAdd(this.cameraPos, this.cameraPos, up, cameraSpeed * mouseY);
    }
  }

  resize() {
    const canvas = getWebGLCanvas();
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    this.updateProjectionMatrix();
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
  }

  setEventlisteners() {
    window.addEventListener('mousedown', (event) => {
      this.isDragging = true;
      this.lastX = event.clientX;
      this.lastY = event.clientY;
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    window.addEventListener('mousemove', (event) => {
      if (this.isDragging) {
        let xoffset = event.clientX - this.lastX;
        let yoffset = this.lastY - event.clientY;

        this.lastX = event.clientX;
        this.lastY = event.clientY;

        let eventNew = { xOffSet: xoffset, yOffSet: yoffset };
        this.mouseInput(eventNew);
        this.updateViewMatrix();
      }
    });

    // Capture state maps seamlessly inside global listeners
    window.addEventListener('keydown', (event) => {
      this.pressedKeys[event.key] = true;
    });

    window.addEventListener('keyup', (event) => {
      this.pressedKeys[event.key] = false;
    });
    
    window.addEventListener('wheel', (event) => {
      this.mouseScroll(event); 
      this.updateViewMatrix();
    });

    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
  }
}

export { CameraComponent };