import { Component } from "../component/component.js";
import { getWebGLCanvas, getWebGLCanvasHeight, getWebGLCanvasRatio, getWebGLCanvasWidth, gl } from "../../../canvas/utils.js";

class CameraComponent extends Component{
  constructor(type = "perspective") {
    super();
    //type
    this.type = type;

    //camera vectors
    this.cameraPos;
    this.cameraFront;
    this.cameraUp;

    //orientation
    this.yaw;
    this.pitch;
    this.roll;

    //matrix
    this.identityMatrix = mat4.create();
    this.viewMatrix = mat4.create();
    this.projectionMatrix = mat4.create();

    //user click info
    this.firstMouse;
    this.lastX;
    this.lastY;
    this.isDragging;

    //init & set event listeners
    this.initCamera();
    this.setEventlisteners();
  }

  initCamera(){
    //camera vectors
    this.cameraPos = vec3.fromValues(12.0, 6.0, 12.0);
    this.cameraFront = vec3.fromValues(-1.0, 0.0, -1.0);
    this.cameraUp = vec3.fromValues(0.0, 1.0, 0.0);

    //orientation
    this.yaw = -135.0;
    this.pitch = -30.0;
    this.roll = 0.0;

    let direction = vec3.create();
    direction[0] = Math.cos(this.yaw * Math.PI / 180.0) * Math.cos(this.pitch * Math.PI / 180.0);
    direction[1] = Math.sin(this.pitch * Math.PI / 180.0);
    direction[2] = Math.sin(this.yaw * Math.PI / 180.0) * Math.cos(this.pitch * Math.PI / 180.0);
    vec3.normalize(this.cameraFront, direction);

    //identity matrix
    this.identityMatrix = mat4.create();
    //view matrix
    this.updateViewMatrix();
    //projection matrix
    this.updateProjectionMatrix(); 

    //user click info
    this.firstMouse = true;
    this.isDragging = false;
    this.lastX = getWebGLCanvasWidth() / 2.0;
    this.lastY = getWebGLCanvasHeight() / 2.0;
  }

  setPosition(position){
    this.cameraPos = position;
  }

  //to set view matrix
  updateViewMatrix(){
  this.viewMatrix = mat4.lookAt(
    this.identityMatrix, 
    this.cameraPos, 
    vec3.add(vec3.create(), this.cameraPos, this.cameraFront),
    this.cameraUp);
  }

  //to set projection matrix
  updateProjectionMatrix(){
    if (this.type == "perspective") {
      this.projectionMatrix = mat4.perspective(
        this.projectionMatrix, 
        glMatrix.toRadian(45.0), 
        getWebGLCanvasRatio(), 
        0.1, 
        10000.0);
    } else {
      //TODO: Orthographic projection
    }
  }

  //to set projection matrix as orthographic
  setOrthographic() {
    this.type = "orthographic";
    this.updateProjectionMatrix();
  }

  //to set projection matrix as perspective
  setPerspective() {
    this.type = "perspective";
    this.updateProjectionMatrix();
  }

  getProjectionMatrix() {
    return this.projectionMatrix;
  }

  getViewMatrix() {
    return this.viewMatrix;
  }

  //for keyboard camera control
  keyInput(event) {
    let cameraSpeed = 0.5;
    if (event.key === "ArrowUp") {
      vec3.scaleAndAdd(this.cameraPos, this.cameraPos, this.cameraFront, cameraSpeed);
    }
    if (event.key === "ArrowDown") {
      vec3.scaleAndAdd(this.cameraPos, this.cameraPos, this.cameraFront, -cameraSpeed);
    }
    if (event.key === "ArrowLeft") {
      const right = vec3.create();
      vec3.cross(right, this.cameraFront, this.cameraUp);
      vec3.normalize(right, right);
      vec3.scaleAndAdd(this.cameraPos, this.cameraPos, right, -cameraSpeed);
    }
    if (event.key === "ArrowRight") {
      const right = vec3.create();
      vec3.cross(right, this.cameraFront, this.cameraUp);
      vec3.normalize(right, right);
      vec3.scaleAndAdd(this.cameraPos, this.cameraPos, right, cameraSpeed);
    }
  }

  //for mouse camera control
  mouseInput(event) {
    const xoffset = event.xOffSet;
    const yoffset = event.yOffSet;

    const sensitivity = 0.01;
    let xoffsetScaled = xoffset * sensitivity;
    let yoffsetScaled = yoffset * sensitivity;

    this.yaw += xoffsetScaled;
    this.pitch += yoffsetScaled;

    if (this.pitch > 89.0) this.pitch = 89.0;
    if (this.pitch < -89.0) this.pitch = -89.0;

    let direction = vec3.create();
    direction[0] = Math.cos(this.yaw * Math.PI / 180.0) * Math.cos(this.pitch * Math.PI / 180.0);
    direction[1] = Math.sin(this.pitch * Math.PI / 180.0);
    direction[2] = Math.sin(this.yaw * Math.PI / 180.0) * Math.cos(this.pitch * Math.PI / 180.0);
    vec3.normalize(this.cameraFront, direction);
  }

  //for mouse scroll camera control
  mouseScroll(event) {
    let mouseX = event.clientX / window.innerWidth * 2 - 1;  // Normalize X [-1, 1]
    let mouseY = -(event.clientY / window.innerHeight * 2 - 1);  // Normalize Y [-1, 1]

    let cameraSpeed = 0.5;  
    
    if (event.deltaY < 0) {
      // Scroll down: move forward in the camera's view direction
      vec3.scaleAndAdd(this.cameraPos, this.cameraPos, this.cameraFront, cameraSpeed);
    } else {
      // Scroll up: move backward in the camera's view direction
      vec3.scaleAndAdd(this.cameraPos, this.cameraPos, this.cameraFront, -cameraSpeed);
    }

    // Move the camera in the X or Y direction based on the mouse's position
    // Moving in the X-axis (left/right of the screen)
    const right = vec3.create();
    vec3.cross(right, this.cameraFront, this.cameraUp);
    vec3.normalize(right, right);

    // Moving in the Y-axis (up/down of the screen)
    const up = vec3.create();
    vec3.cross(up, right, this.cameraFront);
    vec3.normalize(up, up);

    // If the mouse is towards the left, move the camera to the left (negative X)
    if (mouseX < 0) {
      vec3.scaleAndAdd(this.cameraPos, this.cameraPos, right, -cameraSpeed * Math.abs(mouseX));
    }
    // If the mouse is towards the right, move the camera to the right (positive X)
    else if (mouseX > 0) {
      vec3.scaleAndAdd(this.cameraPos, this.cameraPos, right, cameraSpeed * mouseX);
    }

    // If the mouse is towards the top, move the camera up (positive Y)
    if (mouseY < 0) {
      vec3.scaleAndAdd(this.cameraPos, this.cameraPos, up, -cameraSpeed * Math.abs(mouseY));
    }
    // If the mouse is towards the bottom, move the camera down (negative Y)
    else if (mouseY > 0) {
      vec3.scaleAndAdd(this.cameraPos, this.cameraPos, up, cameraSpeed * mouseY);
    }
  }

  // Resize handler that updates the projection matrix and WebGL canvas size
  resize() {
    // Update WebGL canvas size
    const canvas = getWebGLCanvas();
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Update the projection matrix
    this.updateProjectionMatrix();

    // Update WebGL viewport
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
  }

  setEventlisteners() {
    // Add event listeners for mouse down
    window.addEventListener('mousedown', (event) => {
      this.isDragging = true;
      this.lastX = event.clientX;
      this.lastY = event.clientY;
    });

    // Add event listeners for mouse up
    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Add event listeners for mouse move
    window.addEventListener('mousemove', (event) => {
      if (this.isDragging) {
        let xoffset = event.clientX - this.lastX;
        let yoffset = this.lastY - event.clientY;

        let eventNew = { xOffSet: xoffset, yOffSet: yoffset };

        //updates camera properties
        this.mouseInput(eventNew);
        //update view matrix
        this.updateViewMatrix();
      }
    });

    // Add event listeners for keyboard
    window.addEventListener('keydown', (event) => {
      //updates camera properties
      this.keyInput(event)
      //update view matrix
      this.updateViewMatrix();
    });
    
    // Add event listener for mouse scroll
    window.addEventListener('wheel', (event) => {
      //updates camera properties
      this.mouseScroll(event); 
      //update view matrix
      this.updateViewMatrix();
    });

    // Window resize handler
    window.addEventListener('resize', this.resize.bind(this));

    this.resize();
  }

}

export {
  CameraComponent
}