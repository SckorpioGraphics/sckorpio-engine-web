import { CameraComponent } from "../../../component/components/cameraComponent.js";
import { Entity } from "../../entity.js";

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