import { Sckorpio } from "../../sckorpioEngine/sckorpioEngine.js";
class Scene extends Sckorpio.Scene{
    constructor(projectName) {
        super();
        this.projectName = projectName;
    }

    async initResources(){
        //generate custom textures
        this.customTextureList = [
            "sckorpioLogoTransparent",
            "football",
            "fifa26football"
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
        let ground = new Sckorpio.Cube({mode: 'texture', uvRange: [0, 0, 50, 50]});
        ground.setPosition(0.0,-0.1,0.0);
        ground.setScale(100.0,0.02,100.0);
        ground.setTexture("grass");
        this.entitiesList.push(ground);
        */

        // Texture Sphere FIF26
        let sphere3 = new Sckorpio.Sphere({ mode: 'texture' , radius: 0.5});
        sphere3.setPosition(-10.0,0.5,0.0);
        sphere3.setColor(0,1,1);
        sphere3.setTexture('fifa26football');
        this.entitiesList.push(sphere3);

        // Texture Sphere
        let sphere2 = new Sckorpio.Sphere({ mode: 'texture' , radius: 0.5});
        sphere2.setPosition(-8.0,0.5,0.0);
        sphere2.setColor(0,1,1);
        sphere2.setTexture('football');
        this.entitiesList.push(sphere2);

        //#####################################################

        // Sphere
        let sphere = new Sckorpio.Sphere({ mode: 'basic' , radius: 0.5});
        sphere.setPosition(0.0,2.0,0.0);
        sphere.setColor(0,1,1);
        sphere.addInstance([-2.0,0.0,-2.0],[0,-45,0],[2.0,1.0,1.0]);
        sphere.addInstance([2.0,0.0,-2.0],[0,45,0],[2.0,1.0,1.0]);
        sphere.addInstance([0.0,0.0,2.0],[0,0,0],[1.0,1.0,2.0]);
        this.entitiesList.push(sphere);

        // Cylinder
        let cylinder = new Sckorpio.Cylinder({ mode: 'basic' , radius:0.5, height:1.0});
        cylinder.setPosition(-5.0,5.0,-5.0);
        cylinder.setScale(1.0,1.0,1.0);
        cylinder.setRotation(90,0,0);
        cylinder.setColor(1,0,0);

        cylinder.addInstance([-5.0,5.0,-5.0],[0,0,0],[1.0,1.0,1.0]);
        cylinder.addInstance([-5.0,5.0,5.0],[90,0,0],[1.0,1.0,1.0]);
        this.entitiesList.push(cylinder);

        //cylinder.addChild(sphere);
        sphere.setParent(cylinder);

        //#####################################################

        // Cone
        let cone = new Sckorpio.Cone({ mode: 'basic' , radius:0.5, height:1.0});
        cone.setPosition(-4.0,0.0,0.0);
        cone.setRotation(90.0,0.0,0.0);
        cone.setScale(1.0,4.0,1.0);
        cone.setColor(0,1,0);
        this.entitiesList.push(cone);

        // Basic cube
        let basicBox = new Sckorpio.Cube({ mode: 'basic' });
        basicBox.setPosition(8.0,0.5,-5.0);
        basicBox.setScale(1.0,2.0,1.0);
        basicBox.setRotation(0.0,-45,0.0);
        basicBox.setColor(1,0,1);
        this.entitiesList.push(basicBox);

        cone.setParent(basicBox);

        //#######################################################

        let boxNode = new Sckorpio.Node();
        boxNode.setPosition(15.0,0.0,-5.0);
        boxNode.addInstance([20.0,0.0,-5.0],[0,45,0],[1.0,1.0,1.0]);
        boxNode.addInstance([20.0,0.0,5.0],[45,0,0],[1.0,2.0,1.0]);

        // Cube with face colors
        let colorFaceBox = new Sckorpio.Cube({ mode: 'colorFace' });
        colorFaceBox.setPosition(2.0,0.5,0.0);
        this.entitiesList.push(colorFaceBox);

        // Cube with vertex colors
        let colorVertexBox = new Sckorpio.Cube({ mode: 'colorVertex' });
        colorVertexBox.setPosition(-2.0,0.5,0.0);
        this.entitiesList.push(colorVertexBox);

        // Cube with UVs
        let uvFaceBox = new Sckorpio.Cube({mode: 'texture'});
        uvFaceBox.setPosition(0.0,0.5,-2.0);
        uvFaceBox.setMaterial('uvVertex3D');
        this.entitiesList.push(uvFaceBox);

        // texture Cube
        let box1 = new Sckorpio.Cube({mode: 'texture'});
        box1.setPosition(0.0,0.5,2.0);
        box1.setScale(1.0,1.0,1.0);
        this.entitiesList.push(box1);

        // wood Cube
        let box2 = new Sckorpio.Cube({mode: 'texture', uvRange: [0, 0, 1, 1]});
        box2.setPosition(0.0,2.5,0.0);
        box2.setTexture("woodCarton");
        this.entitiesList.push(box2);

        boxNode.addChild(colorFaceBox);
        boxNode.addChild(colorVertexBox);
        boxNode.addChild(uvFaceBox);
        boxNode.addChild(box1);
        boxNode.addChild(box2);
        this.entitiesList.push(boxNode);
        



        //########################################################
        // Plane Mesh Basic
        let plane1 = new Sckorpio.Plane({mode: 'basic'});
        plane1.setPosition(5.0, 0.5, 5.0);
        plane1.setScale(2.0,2.0,1.0);
        plane1.setRotation(0.0,45.0,0.0);
        this.entitiesList.push(plane1);

        // Plane Mesh ColorVertex
        let plane2 = new Sckorpio.Plane({mode: 'colorVertex'});
        plane2.setPosition(1.0, 0.0, 1.0);
        plane2.addInstance([1.0,-1.0,1.0],[0,0,0],[1.0,1.0,1.0]);
        plane2.addInstance([1.0,1.0,1.0],[0,0,0],[1.0,1.0,1.0]);

        this.entitiesList.push(plane2);
        

        // Plane Mesh Texture
        let plane3 = new Sckorpio.Plane({mode: 'texture'});
        plane3.setPosition(1.0, 0.0, 1.0);
        this.entitiesList.push(plane3);
        

        // Plane Mesh Texture Transparent
        let plane4 = new Sckorpio.Plane({mode: 'texture'});
        plane4.setPosition(1.0, 0.0, 1.0);
        plane4.setTexture('sckorpioLogoTransparent');
        this.entitiesList.push(plane4);

        plane4.setParent(plane3);
        plane3.setParent(plane2);
        plane2.setParent(plane1);
        
        
        
    }
}

export{
    Scene
}