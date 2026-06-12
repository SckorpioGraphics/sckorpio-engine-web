import { Component } from "../component/component.js";

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

    setModelMatrix() {
        this.modelMatrix = this.calculateModelMatrix();
    }

    getModelMatrix() {
        return this.modelMatrix;
    }

    calculateModelMatrix() {
        // Create translation, rotation, and scaling matrices
        // Start with an identity matrix
        let modelMatrix = mat4.create();  
        
        // Apply translation
        mat4.translate(modelMatrix, modelMatrix, this.position);
        
        // Create rotation matrix
        let rotationMatrix = mat4.create();
        mat4.rotateX(rotationMatrix, rotationMatrix, glMatrix.toRadian(this.rotation[0])); // Rotation around X axis
        mat4.rotateY(rotationMatrix, rotationMatrix, glMatrix.toRadian(this.rotation[1])); // Rotation around Y axis
        mat4.rotateZ(rotationMatrix, rotationMatrix, glMatrix.toRadian(this.rotation[2])); // Rotation around Z axis

        // Applt rotation
        mat4.multiply(modelMatrix, modelMatrix, rotationMatrix);

        // Apply scaling
        mat4.scale(modelMatrix, modelMatrix, this.scale);
        
        return modelMatrix;
    }
}

export {
    TransformComponent
}