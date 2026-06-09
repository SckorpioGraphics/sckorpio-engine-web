import { Component } from "../component/component.js";
import { RenderComponent } from "./renderComponent.js";

class MeshComponent extends Component{
    constructor() {
        super();
        this.visible = true;
        this.layout;
        this.vertexData = [];
        this.indexData = [];
        this.textureUV = [0.0, 0.0, 1.0, 1.0];
        this.material;
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

    setLayout(layout){
        this.layout = layout;
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

    loadGPUData(){
        this.renderComponent.setData(this.layout,this.vertexData,this.indexData);
    }
}

export {
    MeshComponent
}