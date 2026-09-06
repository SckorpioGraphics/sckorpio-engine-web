import { Component } from "../component.js";

class TransformComponent extends Component{
    constructor(){
        super();
        // PARENT TRANSFORM COMPONENT----------------------
        this.parentTransformComponent = null;

        // SOURCE------------------------------------------
        // Local Transform (Static)
        this.localPosition = vec3.fromValues(0.0, 0.0, 0.0);
        this.localScale = vec3.fromValues(1.0, 1.0, 1.0);
        this.localRotation = vec3.fromValues(0.0, 0.0, 0.0);
        this.localTransform = mat4.create();
        // Current Transform (Dynamic/Animation Affected)
        this.currentPosition = vec3.fromValues(0.0, 0.0, 0.0);
        this.currentScale = vec3.fromValues(1.0, 1.0, 1.0);
        this.currentRotation = vec3.fromValues(0.0, 0.0, 0.0);
        this.currentTransform = mat4.create();
        // World Transform
        this.worldTransform = mat4.create();

        // INSTANCES----------------------------------------
        this.instanced = false;
        this.localInstancesCount = 0;
        this.currentInstancesCount = 0;
        this.worldInstancesCount = 0;
        // Local Instances Transform (Static)
        this.localInstancesPositions = [];
        this.localInstancesRotations = [];
        this.localInstancesScales = [];
        this.localInstancesTransforms = [];
        // Current Instances Transform (Dynamic/Animation Affected)
        this.currentInstancesPositions = [];
        this.currentInstancesRotations = [];
        this.currentInstancesScales = [];
        this.currentInstancesTransforms = [];
        // World Instances Transform
        this.worldInstancesTransforms = [];

        // INITIALIZATION------------------------------------
        this.setLocalTransform();
        this.setCurrentTransform();
        this.setWorldTransform();
        this.setWorldInstancesTransforms();
    }

    setParent(parentTransformComponent){
        this.parentTransformComponent = parentTransformComponent;
    }

    getLocalTransform(){
        return this.localTransform;
    }

    getCurrentTransform(){
        return this.currentTransform;
    }

    getWorldTransform(){
        return this.worldTransform;
    }

    getModelMatrix(){
        return this.worldTransform;
    }

    //======================================================
    // Transforms Manipulations
    //======================================================

    setPosition(tx,ty,tz){
        this.localPosition = vec3.fromValues(tx,ty,tz);
        this.setLocalTransform();
        this.currentPosition = vec3.clone(this.localPosition);
        this.setCurrentTransform();
    }

    setRotation(rx,ry,rz){
        this.localRotation = vec3.fromValues(rx,ry,rz);
        this.setLocalTransform();
        this.currentRotation = vec3.clone(this.localRotation);
        this.setCurrentTransform();
    }

    setScale(sx,sy,sz){
        this.localScale = vec3.fromValues(sx,sy,sz);
        this.setLocalTransform();
        this.currentScale = vec3.clone(this.localScale);
        this.setCurrentTransform();
    }

    createTRSMatrix(position,rotation,scale) {
        // Start with an identity matrix
        let trsMatrix = mat4.create();  
        
        // Apply translation
        mat4.translate(trsMatrix, trsMatrix, position);
        
        // Create rotation matrix
        let rotationMatrix = mat4.create();
        mat4.rotateX(rotationMatrix, rotationMatrix, glMatrix.toRadian(rotation[0])); // Rotation around X axis
        mat4.rotateY(rotationMatrix, rotationMatrix, glMatrix.toRadian(rotation[1])); // Rotation around Y axis
        mat4.rotateZ(rotationMatrix, rotationMatrix, glMatrix.toRadian(rotation[2])); // Rotation around Z axis

        // Apply rotation
        mat4.multiply(trsMatrix, trsMatrix, rotationMatrix);

        // Apply scaling
        mat4.scale(trsMatrix, trsMatrix, scale);

        // return result
        return trsMatrix;
    }

    // Set Local Transform (Static)
    setLocalTransform(){
        this.localTransform = this.createTRSMatrix(
            this.localPosition,
            this.localRotation,
            this.localScale
        );
    }

    // Set Current Local Transform (Dynamic)
    setCurrentTransform(){
        this.currentTransform = this.createTRSMatrix(
            this.currentPosition,
            this.currentRotation,
            this.currentScale
        );
    }

    // Set Instanced
    setInstanced(flag){
        this.instanced = flag;
    }

    // Create Instance
    createInstance(
        position = [0,0,0],
        rotation = [0,0,0],
        scale    = [1,1,1]
    ){
        if(!this.instanced){
            this.setInstanced(true);
        }

        // Instance TRS values in vec3
        const localPosition = vec3.fromValues(position[0],position[1],position[2]);
        const localRotation = vec3.fromValues(rotation[0],rotation[1],rotation[2]);
        const localScale = vec3.fromValues(scale[0],scale[1],scale[2]);
        
        // Instance Local TRS Data
        this.localInstancesPositions.push(localPosition);
        this.localInstancesRotations.push(localRotation);
        this.localInstancesScales.push(localScale);

        // Instance Current TRS Data
        this.currentInstancesPositions.push(vec3.clone(localPosition));
        this.currentInstancesRotations.push(vec3.clone(localRotation));
        this.currentInstancesScales.push(vec3.clone(localScale));

        // Instance Local Transform
        const localInstanceTransform = this.createTRSMatrix(localPosition,localRotation,localScale);
        this.localInstancesTransforms.push(localInstanceTransform);

        // Instance Current Transform
        this.currentInstancesTransforms.push(mat4.clone(localInstanceTransform));

        // Instance count increment
        this.localInstancesCount++;
        this.currentInstancesCount++;
    }

    //======================================================
    // Apply Animations
    //======================================================
    applyAnimation(animationResult){
        this.applyAnimationToSource(animationResult);
        this.applyAnimationToInstances(animationResult);
    }

    // Apply Animation to Source
    applyAnimationToSource(animationResult) {
        // Position------------------
        if(animationResult.position) {
            this.currentPosition = vec3.fromValues(
                this.localPosition[0] + animationResult.position[0],
                this.localPosition[1] + animationResult.position[1],
                this.localPosition[2] + animationResult.position[2]
            );
        }

        // Rotation------------------
        if(animationResult.rotation) {
            this.currentRotation = vec3.fromValues(
                this.localRotation[0] + animationResult.rotation[0],
                this.localRotation[1] + animationResult.rotation[1],
                this.localRotation[2] + animationResult.rotation[2]
            );
        }

        // Scale------------------
        if(animationResult.scale) {
            this.currentScale = vec3.fromValues(
                this.localScale[0] * animationResult.scale[0],
                this.localScale[1] * animationResult.scale[1],
                this.localScale[2] * animationResult.scale[2]
            );
        }

        // Reset current Transform
        this.setCurrentTransform();
    }

    // Apply Animation to Instances
    applyAnimationToInstances(animationResult) {
        for(let i = 0; i < this.localInstancesCount; i++){

            //Position------------------
            const position = vec3.clone(this.localInstancesPositions[i]);
            if(animationResult.position) {
                const animationPosition = animationResult.position;
                // Animation translation is in orientation of instnace local rotation
                const rotationMatrix = mat4.create();
                mat4.rotateX(rotationMatrix,rotationMatrix,glMatrix.toRadian(this.localInstancesRotations[i][0]));
                mat4.rotateY(rotationMatrix,rotationMatrix,glMatrix.toRadian(this.localInstancesRotations[i][1]));
                mat4.rotateZ(rotationMatrix,rotationMatrix,glMatrix.toRadian(this.localInstancesRotations[i][2]));
                // position in that oriention
                const rotatedAnimationPosition = vec3.create();
                vec3.transformMat4(rotatedAnimationPosition, animationPosition, rotationMatrix);
                // Add that in position
                vec3.add(position, position, rotatedAnimationPosition);
            }

            // Rotation------------------
            const rotation = vec3.clone(this.localInstancesRotations[i]);
            if(animationResult.rotation) {
                rotation[0] += animationResult.rotation[0];
                rotation[1] += animationResult.rotation[1];
                rotation[2] += animationResult.rotation[2];
            }

            // Scale---------------------
            const scale = vec3.clone(this.localInstancesScales[i]);
            if(animationResult.scale) {
                scale[0] *= animationResult.scale[0];
                scale[1] *= animationResult.scale[1];
                scale[2] *= animationResult.scale[2];
            }

            // Save the current TRS values
            this.currentInstancesPositions[i] = position;
            this.currentInstancesRotations[i] = rotation;
            this.currentInstancesScales[i] = scale;

            // Reset Current Instance Transform
            this.currentInstancesTransforms[i] = this.createTRSMatrix(position,rotation,scale);
        }
    }


    //======================================================
    // Compute World Transforms
    //======================================================

    // Set World Transform for Source
    setWorldTransform(){
        // Start with an identity matrix
        let worldTransform = mat4.create(); 
        
        // Check is there is parent Transform component
        if(this.parentTransformComponent){
            // Apply parent Transform
            mat4.multiply(worldTransform, worldTransform, this.parentTransformComponent.getWorldTransform());
        }

        // Apply "current" local Transform (NOTE: Dynamic one)
        mat4.multiply(worldTransform, worldTransform, this.currentTransform);

        this.worldTransform = worldTransform;
    }

    // Set Instances World Transforms
    setWorldInstancesTransforms(){
        let worldInstanceTransform = mat4.create(); 
        this.worldInstancesCount = 0;
        this.worldInstancesTransforms = [];

        const parentWorldInstancesCount = this.parentTransformComponent
            ? this.parentTransformComponent.worldInstancesCount
            : 0;
        const hasParentWorldInstances = parentWorldInstancesCount > 0;
        const hasLocalInstances = this.localInstancesCount > 0;

        // If No Parent Node
        if(!this.parentTransformComponent){
            if(hasLocalInstances){
                this.worldInstancesTransforms = this.currentInstancesTransforms;
                this.worldInstancesCount = this.currentInstancesCount;
                this.instanced = this.worldInstancesCount > 0;
            } else {
                this.setWorldTransform();
                this.instanced = false;
            }
            return;
        }

        // Case 1: parent has no world instances, this node has no local instances
        if(!hasParentWorldInstances && !hasLocalInstances){
            this.setWorldTransform();
            this.instanced = false;
            return;
        }

        // Case 2: parent has no world instances, this node has local instances
        if(!hasParentWorldInstances && hasLocalInstances){
            let parentWorldTransform = this.parentTransformComponent.getWorldTransform();
            for(let i=0; i < this.localInstancesCount; i++){
                worldInstanceTransform = mat4.create(); 
                mat4.multiply(worldInstanceTransform, worldInstanceTransform, parentWorldTransform);
                mat4.multiply(worldInstanceTransform, worldInstanceTransform, this.currentInstancesTransforms[i]);
                this.worldInstancesTransforms.push(worldInstanceTransform);
                this.worldInstancesCount++;
            }
            this.instanced = true;
            return;
        }

        // Case 3: parent has world instances, this node has no local instances
        if(hasParentWorldInstances && !hasLocalInstances){
            for(let i=0; i < this.parentTransformComponent.worldInstancesCount; i++){
                let parentWorldInstanceTransform = this.parentTransformComponent.worldInstancesTransforms[i];
                worldInstanceTransform = mat4.create(); 
                mat4.multiply(worldInstanceTransform, worldInstanceTransform, parentWorldInstanceTransform);
                mat4.multiply(worldInstanceTransform, worldInstanceTransform, this.currentTransform);
                this.worldInstancesTransforms.push(worldInstanceTransform);
                this.worldInstancesCount++;
            }
            this.instanced = true;
            return;
        }

        // Case 4: parent has world instances and this node has local instances
        if(hasParentWorldInstances && hasLocalInstances){
            for(let i=0; i < this.parentTransformComponent.worldInstancesCount; i++){
                let parentWorldInstanceTransform = this.parentTransformComponent.worldInstancesTransforms[i];
                for(let j=0; j < this.localInstancesCount; j++){
                    let currentInstanceTransform = this.currentInstancesTransforms[j];
                    worldInstanceTransform = mat4.create(); 
                    mat4.multiply(worldInstanceTransform, worldInstanceTransform, parentWorldInstanceTransform);
                    mat4.multiply(worldInstanceTransform, worldInstanceTransform, currentInstanceTransform);
                    this.worldInstancesTransforms.push(worldInstanceTransform);
                    this.worldInstancesCount++;
                }
            }
            this.instanced = true;
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