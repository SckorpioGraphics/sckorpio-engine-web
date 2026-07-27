import { CameraComponent } from "../../componentList/cameraComponent.js";
import { Entity } from "../../entity/entity.js";

class Camera extends Entity{
    constructor(){
        //constructor of Mesh Component
        super();

        this.cameraComponent = new CameraComponent();
    }
}

export{
    Camera
}