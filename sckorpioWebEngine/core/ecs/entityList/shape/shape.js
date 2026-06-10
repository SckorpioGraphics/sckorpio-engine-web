import { Entity } from "../../entity/entity.js";
import { TransformComponent } from "../../componentList/transformComponent.js";
import { MeshComponent } from "../../componentList/meshComponent.js";
import { MaterialBook } from "../../../../renderer/webgl/material/materialBook.js";
import { TextureBook } from "../../../../renderer/webgl/texture/textureBook.js";

class Shape extends Entity{
    constructor(){
        super();
        this.uid = 0;
        this.components = [];
        this.transformComponent = null;
        this.meshComponent = null;
        this.addTransformComponent();
        this.addMeshComponent();
    }

    addTransformComponent(){
        this.transformComponent = new TransformComponent();
        this.components.push(this.transformComponent);
    }

    setPosition(position){
        this.transformComponent.setPosition(position);
    }

    setScale(scale){
        this.transformComponent.setScale(scale);
    }

    setRotation(rotation){
        this.transformComponent.setRotation(rotation);
    }

    setInstanced(enabled = true) {
        this.meshComponent.setInstanced(enabled);
    }

    addInstance(position = [0,0,0], rotation = [0,0,0], scale = [1,1,1]) {
        this.meshComponent.createInstance(position, rotation, scale);
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
}

export{
    Shape
}