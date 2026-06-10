import { Box } from "../../sckorpioWebEngine/core/ecs/entityList/shape/box.js";
import { Cone } from "../../sckorpioWebEngine/core/ecs/entityList/shape/cone.js";
import { Cyclinder } from "../../sckorpioWebEngine/core/ecs/entityList/shape/cyclinder.js";
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
        /*
        let ground = new Box({mode: 'textureFace', uvRange: [0, 0, 50, 50]});
        ground.setPosition(vec3.fromValues(0.0,-0.1,0.0));
        ground.setScale(vec3.fromValues(100.0,0.02,100.0));
        ground.setTexture("grass");
        this.entitiesList.push(ground);
        */

        // Sphere
        let sphere = new Sphere({ mode: 'basic' , radius: 0.5});
        sphere.setPosition(vec3.fromValues(-2.0,0.5,0.0));
        sphere.setColor(0,1,1);
        this.entitiesList.push(sphere);

        // Basic box
        let basicBox = new Box({ mode: 'basic' });
        basicBox.setPosition(vec3.fromValues(0.0,0.5,0.0));
        basicBox.setColor(1,0,1);
        this.entitiesList.push(basicBox);

        // Box with face colors
        let colorFaceBox = new Box({ mode: 'colorFace' });
        colorFaceBox.setPosition(vec3.fromValues(2.0,0.5,0.0));
        this.entitiesList.push(colorFaceBox);

        // Box with vertex colors
        let colorVertexBox = new Box({ mode: 'colorVertex' });
        colorVertexBox.setPosition(vec3.fromValues(4.0,0.5,0.0));
        this.entitiesList.push(colorVertexBox);

        // Box with UVs
        let uvFaceBox = new Box({mode: 'textureFace'});
        uvFaceBox.setPosition(vec3.fromValues(6.0,0.5,0.0));
        uvFaceBox.setMaterial('uvVertex3D');
        this.entitiesList.push(uvFaceBox);

        // texture Box
        let box1 = new Box({mode: 'textureFace'});
        box1.setPosition(vec3.fromValues(8.0,0.5,0.0));
        box1.setScale(vec3.fromValues(1.0,1.0,1.0));
        this.entitiesList.push(box1);

        // wood Box
        let box2 = new Box({mode: 'textureFace', uvRange: [0, 0, 1, 1]});
        box2.setPosition(vec3.fromValues(10.0,0.5,0.0));
        box2.setTexture("woodCarton");
        this.entitiesList.push(box2);

        // Cone
        let cone = new Cone({ mode: 'basic' , radius:0.5, height:1.0});
        cone.setPosition(vec3.fromValues(-4.0,0.0,0.0));
        cone.setColor(0,1,0);
        this.entitiesList.push(cone);

        // Cyclinder
        let cyclinder = new Cyclinder({ mode: 'basic' , radius:0.5, height:1.0});
        cyclinder.setPosition(vec3.fromValues(-6.0,0.0,0.0));
        cyclinder.setScale(vec3.fromValues(1.0,1.0,1.0));
        cyclinder.setColor(1,0,0);
        this.entitiesList.push(cyclinder);
        
    }
}

export{
    Scene
}