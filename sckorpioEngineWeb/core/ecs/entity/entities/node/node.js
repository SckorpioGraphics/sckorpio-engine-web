import { Entity } from "../../entity.js";
import { TransformComponent } from "../../../component/components/transformComponent.js";

class Node extends Entity{
    constructor(){
        super();
        this.transformComponent = null;
        this.addTransformComponent();

        // instancing
        this.instanced = false;

        // Scene Graph
        this.parentNode = null;
        this.childNodes = [];
        this.depth = 0;
    }

    addTransformComponent(){
        this.transformComponent = new TransformComponent();
        this.components.push(this.transformComponent);
    }

    setParent(parentNode){
        // If parent is already there
        if (this.parentNode === parentNode) return;

        // set Parent
        this.parentNode = parentNode;

        if(parentNode instanceof Node) {
            // add this as child to parent
            parentNode.addChild(this);
            // add parentTransformComponent
            this.transformComponent.setParent(parentNode.transformComponent);
            // update depth
            this.updateDepth(this.parentNode.depth + 1);
        }
    }

    addChild(childNode){
        // If child is already there
        if (!this.childNodes.includes(childNode)) {
            this.childNodes.push(childNode);
            childNode.setParent(this);
        }
    }

    updateDepth(newDepth){
        this.depth = newDepth;
        this.childNodes.forEach((childNode)=>{
            childNode.updateDepth(this.depth+1);
        });
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