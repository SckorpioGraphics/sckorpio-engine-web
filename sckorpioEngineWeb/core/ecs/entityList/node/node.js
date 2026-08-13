import { Entity } from "../../entity/entity.js";
import { TransformComponent } from "../../componentList/transformComponent.js";

class Node extends Entity{
    constructor(){
        super();
        this.transformComponent = null;
        this.addTransformComponent();
        this.instanced = false;
    }

    addTransformComponent(){
        this.transformComponent = new TransformComponent();
        this.components.push(this.transformComponent);
    }

    setPosition(x,y,z){
        this.transformComponent.setPosition(x,y,z);
    }

    setScale(sx,sy,sz){
        this.transformComponent.setScale(sx,sy,sz);
    }

    setRotation(rx,ry,rz){
        this.transformComponent.setRotation(rx,ry,rz);
    }

    setInstanced(flag) {
        if(this.intanced === flag) return; // Already Set
        this.instanced = flag;
        this.transformComponent.setInstanced(flag);
    }

    addInstance(position = [0,0,0], rotation = [0,0,0], scale = [1,1,1]) {
        this.setInstanced(true);
        this.transformComponent.createInstance(position, rotation, scale);
    }
}

export{
    Node
}