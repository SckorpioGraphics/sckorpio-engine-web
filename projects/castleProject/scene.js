import { Box } from "../../sckorpioWebEngine/core/ecs/entityList/shape/box.js";
import { Sphere } from "../../sckorpioWebEngine/core/ecs/entityList/shape/sphere.js";
import { SckorpioWebScene } from "../../sckorpioWebEngine/core/scene/sckorpioWebScene.js";

class Scene extends SckorpioWebScene{
    constructor(projectName) {
        super();
        this.projectName = projectName;
    }

    async initResources(){
        //generate custom textures
        this.customTextureList = [
            "tile1",
            "tile2"
        ];

        await this.textureBook.generateCustomTextures(
            this.projectName,
            this.customTextureList
        );
    }

    async createScene(){
        /*
        MESHES
        */
        
        // Ground
        let ground = new Box({mode: 'texture', uvRange: [0, 0, 50, 50]});
        ground.setPosition(vec3.fromValues(0.0,-0.1,0.0));
        ground.setScale(vec3.fromValues(100.0,0.02,100.0));
        ground.setTexture("grass");
        this.entitiesList.push(ground);

    
        // wall
        let wall1 = new Box({mode: 'texture', uvRange: [0, 0, 5, 1]});
        wall1.setPosition(vec3.fromValues(0.0,2.5,0.0));
        wall1.setScale(vec3.fromValues(20.0,5.0,20));
        wall1.setTexture("brick");
        this.entitiesList.push(wall1);

        // wood Box
        let box2 = new Box({mode: 'texture', uvRange: [0, 0, 2, 2]});
        box2.setPosition(vec3.fromValues(11.0,1.0,0.0));
        box2.setScale(vec3.fromValues(2.0,2.0,2.0));
        box2.setTexture("woodCarton");
        this.entitiesList.push(box2);
        
    }
}

export{
    Scene
}