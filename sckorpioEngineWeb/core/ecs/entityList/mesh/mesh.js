import { Node } from "../node/node.js";
import { TransformComponent } from "../../componentList/transformComponent.js";
import { MeshComponent } from "../../componentList/meshComponent.js";
import { MaterialBook } from "../../../../renderer/webgl/material/materialBook.js";
import { TextureBook } from "../../../../renderer/webgl/texture/textureBook.js";

class Mesh extends Node{
    constructor(){
        super();
        this.meshComponent = null;
        this.addMeshComponent();
        this.instanced = false;
    }

    addMeshComponent() {
        this.meshComponent = new MeshComponent();
        this.components.push(this.meshComponent);
    }

    setVisible(visible){
        this.meshComponent.setVisible(visible);
    }

    setMaterial(materialName){
        this.meshComponent.setMaterial(MaterialBook.getInstance().getMaterial(materialName));
    }

    setBasicMaterial(){
        this.meshComponent.setMaterial(MaterialBook.getInstance().createBasicMaterial());
    }

    setTextureMaterial(){
        this.meshComponent.setMaterial(MaterialBook.getInstance().createTextureMaterial());
    }

    setColor(r,g,b){
        this.meshComponent.material.setColor(r,g,b);
    }

    setTexture(textureName){
        this.meshComponent.material.setTexture(TextureBook.getInstance().getTexture(textureName));
    }

    setTextureRepeat(repeatX,repeatY){
        this.meshComponent.setTextureRepeat(repeatX,repeatY);
    }

    loadGPUData(){
        this.meshComponent.loadGPUData(this.transformComponent);
    }

    unloadGPUData(){
        this.meshComponent.unloadGPUData();
    }

    setInstanced(flag) {
        const wasInstanced = this.instanced;
        super.setInstanced(flag);
        if(wasInstanced === flag) return; // Already Set
        {
            this.meshComponent.setInstanced(flag);
        }
    }
}

export{
    Mesh
}