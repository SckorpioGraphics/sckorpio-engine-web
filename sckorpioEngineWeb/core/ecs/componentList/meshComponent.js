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
        this.instanced = false;
        this.instanceLayout;

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

    setInstanced(flag){
        if(flag)
        {
            this.instanced = true;
            const defaultInstanceLayout = [
                { name: "a_instanceMatrix0", type: "mat4f" }
            ];
            this.setInstanceLayout(defaultInstanceLayout);
        } else{
            this.instanced = false;
        }
    }

    setInstanceLayout(layout){
        this.instanced = true;
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

    loadGPUData(transformComponent){
        // set material
        this.renderComponent.setMaterial(this.material);
        // set Source Mesh Data
        this.renderComponent.setData(this.layout,this.vertexData,this.indexData);
        // set Instances Data
        if(this.instanced){
            const instancesCount = transformComponent.worldInstancesCount;
            if(instancesCount > 0){
                this.renderComponent.setInstancedData(this.instanceLayout, transformComponent.getFlattenedWorldInstancesTransforms(), instancesCount);
            }
        }
    }
}

export {
    MeshComponent
}