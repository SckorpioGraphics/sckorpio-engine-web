import { Sckorpio } from "../../sckorpioEngine/sckorpioEngine.js";
class Scene extends Sckorpio.Scene{
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
        let ground = new Sckorpio.Cube({mode: 'texture', uvRange: [0, 0, 50, 50]});
        ground.setPosition(0.0,-0.1,0.0);
        ground.setScale(100.0,0.02,100.0);
        ground.setTexture("grass");
        this.entitiesList.push(ground);

    
        // wall
        let wall1 = new Sckorpio.Cube({mode: 'texture', uvRange: [0, 0, 5, 1]});
        wall1.setPosition(0.0,2.5,0.0);
        wall1.setScale(20.0,5.0,20);
        wall1.setTexture("brick");
        this.entitiesList.push(wall1);

        // wood Cube
        let box2 = new Sckorpio.Cube({mode: 'texture', uvRange: [0, 0, 2, 2]});
        box2.setPosition(11.0,1.0,0.0);
        box2.setScale(2.0,2.0,2.0);
        box2.setTexture("woodCarton");
        this.entitiesList.push(box2);
        
    }
}

export{
    Scene
}