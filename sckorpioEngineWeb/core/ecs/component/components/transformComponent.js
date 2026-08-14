import { Component } from "../component.js";

class TransformComponent extends Component{
    constructor(){
        super();
        // Parent Transform
        this.parentTransformComponent = null;

        // Local Transform 
        this.position = vec3.fromValues(0.0, 0.0, 0.0);
        this.scale = vec3.fromValues(1.0, 1.0, 1.0);
        this.rotation = vec3.fromValues(0.0, 0.0, 0.0);
        this.localTransform = mat4.create();
        this.worldTransform = mat4.create();
        this.setLocalTransform();
        this.setWorldTransform();

        // Instances Transform
        this.instanced = false;
        this.localInstancesCount = 0;
        this.localInstancesTransforms = [];
        this.worldInstancesCount = 0;
        this.worldInstancesTransforms = [];
        this.setWorldInstancesTransforms();
    }

    setParent(parentTransformComponent){
        this.parentTransformComponent = parentTransformComponent;
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

    getLocalTransform(){
        return this.localTransform;
    }

    getWorldTransform(){
        return this.worldTransform;
    }

    getModelMatrix(){
        return this.worldTransform;
    }

    setLocalTransform(){
        // Create translation, rotation, and scaling matrices
        // Start with an identity matrix
        let localTransform = mat4.create();  
        
        // Apply translation
        mat4.translate(localTransform, localTransform, this.position);
        
        // Create rotation matrix
        let rotationMatrix = mat4.create();
        mat4.rotateX(rotationMatrix, rotationMatrix, glMatrix.toRadian(this.rotation[0])); // Rotation around X axis
        mat4.rotateY(rotationMatrix, rotationMatrix, glMatrix.toRadian(this.rotation[1])); // Rotation around Y axis
        mat4.rotateZ(rotationMatrix, rotationMatrix, glMatrix.toRadian(this.rotation[2])); // Rotation around Z axis

        // Applt rotation
        mat4.multiply(localTransform, localTransform, rotationMatrix);

        // Apply scaling
        mat4.scale(localTransform, localTransform, this.scale);

        this.localTransform = localTransform;
    }

    setWorldTransform(){
        // Start with an identity matrix
        let worldTransform = mat4.create(); 
        
        if(this.parentTransformComponent){
            // Apply parent Transform
            mat4.multiply(worldTransform, worldTransform, this.parentTransformComponent.getWorldTransform());
        }

        // Apply local Transform
        mat4.multiply(worldTransform, worldTransform, this.localTransform);

        this.worldTransform = worldTransform;
    }

    setInstanced(flag){
        this.instanced = flag;
    }

    createInstance(
        position = [0,0,0],
        rotation = [0,0,0],
        scale = [1,1,1]
    ){
        if(!this.instanced){
            this.setInstanced(true);
        }

        // cretae Identity matrix
        let localInstanceTransform = mat4.create();
        // Apply translation
        mat4.translate(localInstanceTransform, localInstanceTransform, position);
        
        // Create rotation matrix
        let rotationMatrix = mat4.create();
        mat4.rotateX(rotationMatrix, rotationMatrix, glMatrix.toRadian(rotation[0])); // Rotation around X axis
        mat4.rotateY(rotationMatrix, rotationMatrix, glMatrix.toRadian(rotation[1])); // Rotation around Y axis
        mat4.rotateZ(rotationMatrix, rotationMatrix, glMatrix.toRadian(rotation[2])); // Rotation around Z axis

        // Apply rotation
        mat4.multiply(localInstanceTransform, localInstanceTransform, rotationMatrix);

        // Apply scaling
        mat4.scale(localInstanceTransform, localInstanceTransform, scale);

        this.localInstancesTransforms.push(localInstanceTransform);
        
        // Push the 16 raw matrix floats directly into our loose CPU array
        // for (let i = 0; i < 16; i++) {
        //     this.localInstancesTransforms.push(localInstanceTransform[i]);
        // }
        this.localInstancesCount++;
    }

    setWorldInstancesTransforms(){
        let worldInstanceTransform = mat4.create(); 
        this.worldInstancesCount = 0;
        this.worldInstancesTransforms = [];

        // If No Parent Node
        if(!this.parentTransformComponent){
            this.worldInstancesTransforms = this.localInstancesTransforms;
            this.worldInstancesCount = this.localInstancesCount;
            return
        }

        // If Parent is there..
        let parentInstanced = false;
        if(this.parentTransformComponent){
            parentInstanced = this.parentTransformComponent.instanced;
        }
        // Case 1
        if(!parentInstanced && !this.instanced){
            this.setWorldTransform();
        }
        // Case 2
        else if(!parentInstanced && this.instanced){
            let parentWorldTransform = this.parentTransformComponent.getWorldTransform();
            for(let i=0; i < this.localInstancesCount; i++){
                worldInstanceTransform = mat4.create(); 
                mat4.multiply(worldInstanceTransform, worldInstanceTransform, parentWorldTransform);
                mat4.multiply(worldInstanceTransform, worldInstanceTransform, this.localInstancesTransforms[i]);
                this.worldInstancesTransforms.push(worldInstanceTransform);
                this.worldInstancesCount++;
            }
        }
        // Case 3
        else if(parentInstanced && !this.instanced){
            for(let i=0; i < this.parentTransformComponent.worldInstancesCount; i++){
                let parentWorldInstanceTransform = this.parentTransformComponent.worldInstancesTransforms[i];
                worldInstanceTransform = mat4.create(); 
                mat4.multiply(worldInstanceTransform, worldInstanceTransform, parentWorldInstanceTransform);
                mat4.multiply(worldInstanceTransform, worldInstanceTransform, this.localTransform);
                this.worldInstancesTransforms.push(worldInstanceTransform);
                this.worldInstancesCount++;
            }
            this.instanced = true;
        }
        // Case 4
        else if(parentInstanced && this.instanced){
            for(let i=0; i < this.parentTransformComponent.worldInstancesCount; i++){
                let parentWorldInstanceTransform = this.parentTransformComponent.worldInstancesTransforms[i];
                for(let j=0; j < this.localInstancesCount; j++){
                    let localInstanceTransform = this.localInstancesTransforms[j];
                    worldInstanceTransform = mat4.create(); 
                    mat4.multiply(worldInstanceTransform, worldInstanceTransform, parentWorldInstanceTransform);
                    mat4.multiply(worldInstanceTransform, worldInstanceTransform, localInstanceTransform);
                    this.worldInstancesTransforms.push(worldInstanceTransform);
                    this.worldInstancesCount++;
                }
            }
        }
    }

    getFlattenedWorldInstancesTransforms() {
        const totalFloats = this.worldInstancesCount * 16;
        let flattenedBuffer = new Float32Array(totalFloats);

        for (let i = 0; i < this.worldInstancesCount; i++) {
            flattenedBuffer.set(this.worldInstancesTransforms[i], i * 16);
        }

        return flattenedBuffer;
    }
}

export {
    TransformComponent
}