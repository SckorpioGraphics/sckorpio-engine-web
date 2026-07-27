import { Component } from "../component/component.js";
import { RenderComponent } from "./renderComponent.js";

class MeshComponent extends Component{
    constructor() {
        super();

        //source mesh data
        this.visible = true;
        this.vertexLayout;
        this.vertexData = [];
        this.indexData = [];

        //instances data
        this.isInstanced = false;
        this.instanceLayout;
        this.instanceData = [];
        this.instancesCount = 0;

        //material data
        this.textureUV = [0.0, 0.0, 1.0, 1.0];
        this.material;

        //render component(gpu)
        this.renderComponent = new RenderComponent();
    }

    setVisible(visible = true){
        this.visible = visible;
    }

    isVisible(){
        return this.visible;
    }

    setVertexData(vertexData){
        this.vertexData = vertexData;
    }

    setIndexData(indexData){
        this.indexData = indexData;
    }

    setVertexLayout(layout){
        this.vertexLayout = layout;
    }

    setInstanced(){
        this.isInstanced = true;
        const defaultInstanceLayout = [
            { name: "a_instanceMatrix0", type: "mat4f" }
        ];
        this.setInstanceLayout(defaultInstanceLayout);
    }

    setInstanceLayout(layout){
        this.isInstanced = true;
        this.instanceLayout = layout;
    }

    setTextureRepeat(repeatX,repeatY){
        this.textureUV = [0.0,0.0,repeatX,repeatY];
    }

    setMaterial(material){
        this.material = material;
        this.renderComponent.setMaterial(this.material);
    }

    getMaterial(){
        return this.material;
    }

    getTextureUV(){
        return this.textureUV;
    }
    
    unloadGPUData(){
        this.renderComponent.unbind();
    }

    createInstance(
        position = [0,0,0],
        rotation = [0,0,0],
        scale = [1,1,1]
    ){
        if(!this.isInstanced){
            this.setInstanced();
        }

        // cretae Identity matrix
        let instanceModelMatrix = mat4.create();
        // Apply translation
        mat4.translate(instanceModelMatrix, instanceModelMatrix, position);
        
        // Create rotation matrix
        let rotationMatrix = mat4.create();
        mat4.rotateX(rotationMatrix, rotationMatrix, glMatrix.toRadian(rotation[0])); // Rotation around X axis
        mat4.rotateY(rotationMatrix, rotationMatrix, glMatrix.toRadian(rotation[1])); // Rotation around Y axis
        mat4.rotateZ(rotationMatrix, rotationMatrix, glMatrix.toRadian(rotation[2])); // Rotation around Z axis

        // Apply rotation
        mat4.multiply(instanceModelMatrix, instanceModelMatrix, rotationMatrix);

        // Apply scaling
        mat4.scale(instanceModelMatrix, instanceModelMatrix, scale);
        
        // Push the 16 raw matrix floats directly into our loose CPU array
        for (let i = 0; i < 16; i++) {
            this.instanceData.push(instanceModelMatrix[i]);
        }
        this.instancesCount++;

    }

    loadGPUData(){
        // set material
        this.renderComponent.setMaterial(this.material);
        // set Source Mesh Data
        this.renderComponent.setData(this.layout,this.vertexData,this.indexData);
        // set Instances Data
        if(this.isInstanced){
            if(this.instanceData.length > 0){
                this.renderComponent.setInstancedData(this.instanceLayout, this.instanceData, this.instancesCount);
            }
        }
    }
}

export {
    MeshComponent
}