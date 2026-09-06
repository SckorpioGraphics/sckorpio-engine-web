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
            "tile2",
            "sckorpioLogoTransparent"
        ];

        await this.textureBook.generateCustomTextures(
            this.projectName,
            this.customTextureList
        );
    }

    //------------------

    async sceneTestingInstanced(){

        // Cylinder
        let cylinder = new Sckorpio.Cylinder({ mode: 'basic' , radius:0.5, height:1.0});
        cylinder.setPosition(vec3.fromValues(-6.0,0.0,0.0));
        cylinder.setScale(vec3.fromValues(1.0,1.0,1.0));
        cylinder.setColor(1,0,0);
        cylinder.addInstance([-6,0,3],[30,0,0],[1.0,1.0,1.0]);
        cylinder.addInstance([-6,0,5],[60,0,0],[1,0.3,1]);
        cylinder.addInstance([-6,0,7],[90,0,0],[0.3,2.0,0.3]);
        this.entitiesList.push(cylinder);

        // Cone
        let cone = new Sckorpio.Cone({ mode: 'basic' , radius:0.5, height:1.0});
        cone.setPosition(vec3.fromValues(-4.0,0.0,0.0));
        cone.setColor(0,1,0);
        cone.addInstance([-4,0,3],[30,0,0],[1,1,1]);
        cone.addInstance([-4,0,5],[60,0,0],[1,0.6,1]);
        cone.addInstance([-4,0,7],[90,0,0],[1,2,1]);
        this.entitiesList.push(cone);

        // Sphere
        let sphere = new Sckorpio.Sphere({ mode: 'basic' , radius: 0.5});
        sphere.setPosition(vec3.fromValues(-2.0,0.5,0.0));
        sphere.setColor(0,1,1);
        sphere.addInstance([-2,0,3],[0,0,0],[0.5,0.5,0.5]);
        sphere.addInstance([-2,0,5],[0,0,0],[1.5,0.2,1.5]);
        sphere.addInstance([-2,0,7],[0,0,0],[0.7,0.7,2.0]);
        this.entitiesList.push(sphere);
        

        // Basic cube
        let basicBox = new Sckorpio.Cube({ mode: 'basic' });
        basicBox.setPosition(vec3.fromValues(0.0,0.5,0.0));
        basicBox.setColor(1,0,1);
        basicBox.addInstance([0,0,3],[0,60,0],[0.5,0.7,2]);
        basicBox.addInstance([0,0,5],[0,-30,0],[1,1,1]);
        basicBox.addInstance([0,0,7],[0,35,0],[2,0.5,0.3]);
        this.entitiesList.push(basicBox);

        // Cube with face colors
        let colorFaceBox = new Sckorpio.Cube({ mode: 'colorFace' });
        colorFaceBox.setPosition(vec3.fromValues(2.0,0.5,0.0));
        colorFaceBox.addInstance([2,0,3],[0,30,0],[1,0.5,1.5]);
        colorFaceBox.addInstance([2,0,5],[0,60,0],[1,0.5,1]);
        colorFaceBox.addInstance([2,0,7],[0,45,0],[0.5,1.0,0.3]);
        this.entitiesList.push(colorFaceBox);

        // Cube with vertex colors
        let colorVertexBox = new Sckorpio.Cube({ mode: 'colorVertex' });
        colorVertexBox.setPosition(vec3.fromValues(4.0,0.5,0.0));
        colorVertexBox.addInstance([4,0,3],[0,45,0],[0.5,1.0,0.3]);
        colorVertexBox.addInstance([4,0,5],[0,120,0],[1,0.5,1]);
        colorVertexBox.addInstance([4,0,7],[0,60,0],[1,0.5,1.5]);
        this.entitiesList.push(colorVertexBox);

        // Cube with UVs
        let uvFaceBox = new Sckorpio.Cube({mode: 'texture'});
        uvFaceBox.setPosition(vec3.fromValues(6.0,0.5,0.0));
        uvFaceBox.setMaterial('uvVertex3D');
        uvFaceBox.addInstance([6,0,3],[0,30,0],[1,0.5,1.5]);
        uvFaceBox.addInstance([6,0,5],[0,60,0],[1,0.5,1]);
        uvFaceBox.addInstance([6,0,7],[0,45,0],[0.5,1.0,0.3]);
        this.entitiesList.push(uvFaceBox);

        // texture Cube
        let box1 = new Sckorpio.Cube({mode: 'texture'});
        box1.setPosition(vec3.fromValues(8.0,0.5,0.0));
        box1.setScale(vec3.fromValues(1.0,1.0,1.0));
        box1.addInstance([8,0,3],[30,0,0],[1,1,1]);
        box1.addInstance([8,0,5],[60,0,0],[1,1,1]);
        box1.addInstance([8,0,7],[90,0,0],[1,1,1]);
        this.entitiesList.push(box1);

        // wood Cube
        let box2 = new Sckorpio.Cube({mode: 'texture', uvRange: [0, 0, 1, 1]});
        box2.setPosition(vec3.fromValues(10.0,0.5,0.0));
        box2.setTexture("woodCarton");
        box2.addInstance([10,0,3],[0,30,0],[1,0.5,1.5]);
        box2.addInstance([10,0,5],[0,60,0],[1,0.5,1]);
        box2.addInstance([10,0,7],[0,45,0],[0.5,1.0,0.3]);
        this.entitiesList.push(box2);

        // Plane Mesh Basic
        let plane1 = new Sckorpio.Plane({mode: 'basic'});
        plane1.setPosition(vec3.fromValues(12.0, 0.0, 0.0));
        plane1.addInstance([12,0,3],[0,30,0],[1,0.5,1.5]);
        plane1.addInstance([12,0,5],[0,60,0],[1,0.5,1]);
        plane1.addInstance([12,0,7],[0,45,0],[0.5,1.0,0.3]);
        this.entitiesList.push(plane1);


        // Plane Mesh ColorVertex
        let plane2 = new Sckorpio.Plane({mode: 'colorVertex'});
        plane2.setPosition(vec3.fromValues(14.0, 0.0, 0.0));
        plane2.addInstance([14,0,3],[0,30,0],[1,0.5,1.5]);
        plane2.addInstance([14,0,5],[0,60,0],[1,0.5,1]);
        plane2.addInstance([14,0,7],[0,45,0],[0.5,1.0,0.3]);
        this.entitiesList.push(plane2);

        // Plane Mesh Texture
        let plane3 = new Sckorpio.Plane({mode: 'texture'});
        plane3.setPosition(vec3.fromValues(16.0, 0.0, 0.0));
        plane3.addInstance([16,0,3],[0,30,0],[1,0.5,1.5]);
        plane3.addInstance([16,0,5],[0,60,0],[1,0.5,1]);
        plane3.addInstance([16,0,7],[0,45,0],[0.5,1.0,0.3]);
        this.entitiesList.push(plane3);

        // Plane Mesh Texture
        let plane4 = new Sckorpio.Plane({mode: 'texture'});
        plane4.setTexture("sckorpioLogoTransparent");
        plane4.setPosition(vec3.fromValues(18.0, 0.0, 0.0));
        plane4.addInstance([18,0,3],[0,30,0],[1,0.5,1.5]);
        plane4.addInstance([18,0,5],[0,60,0],[1,0.5,1]);
        plane4.addInstance([18,0,7],[0,45,0],[0.5,1.0,0.3]);
        this.entitiesList.push(plane4);
        
    }

    async sceneTestingOriginal() {
        
        // Base Sphere
        let sphere = new Sckorpio.Sphere({ mode: 'basic', radius: 0.5 });
        sphere.setPosition(vec3.fromValues(-2.0, 0.5, 0.0));
        sphere.setColor(0, 1, 1);
        this.entitiesList.push(sphere);

        // Base Cube
        let basicBox = new Sckorpio.Cube({ mode: 'basic' });
        basicBox.setPosition(vec3.fromValues(0.0, 0.5, 0.0));
        basicBox.setColor(1, 0, 1);
        this.entitiesList.push(basicBox);

        // Cube with face colors
        let colorFaceBox = new Sckorpio.Cube({ mode: 'colorFace' });
        colorFaceBox.setPosition(vec3.fromValues(2.0, 0.5, 0.0));
        this.entitiesList.push(colorFaceBox);

        // Cube with vertex colors
        let colorVertexBox = new Sckorpio.Cube({ mode: 'colorVertex' });
        colorVertexBox.setPosition(vec3.fromValues(4.0, 0.5, 0.0));
        this.entitiesList.push(colorVertexBox);

        // Cube with UVs
        let uvFaceBox = new Sckorpio.Cube({ mode: 'texture' });
        uvFaceBox.setPosition(vec3.fromValues(6.0, 0.5, 0.0));
        uvFaceBox.setMaterial('uvVertex3D');
        this.entitiesList.push(uvFaceBox);

        // Texture Cube
        let box1 = new Sckorpio.Cube({ mode: 'texture' });
        box1.setPosition(vec3.fromValues(8.0, 0.5, 0.0));
        box1.setScale(vec3.fromValues(1.0, 1.0, 1.0));
        this.entitiesList.push(box1);

        // Wood Cube
        let box2 = new Sckorpio.Cube({ mode: 'texture', uvRange: [0, 0, 1, 1] });
        box2.setPosition(vec3.fromValues(10.0, 0.5, 0.0));
        box2.setTexture("woodCarton");
        this.entitiesList.push(box2);

        // Base Cone
        let cone = new Sckorpio.Cone({ mode: 'basic', radius: 0.5, height: 1.0 });
        cone.setPosition(vec3.fromValues(-4.0, 0.0, 0.0));
        cone.setColor(0, 1, 0);
        this.entitiesList.push(cone);

        // Base Cylinder
        let cylinder = new Sckorpio.Cylinder({ mode: 'basic', radius: 0.5, height: 1.0 });
        cylinder.setPosition(vec3.fromValues(-6.0, 0.0, 0.0));
        cylinder.setScale(vec3.fromValues(1.0, 1.0, 1.0));
        cylinder.setColor(1, 0, 0);
        this.entitiesList.push(cylinder);


        // --- SPHERE "INSTANCES" AS NEW ENTITIES ---
        let sphereInst1 = new Sckorpio.Sphere({ mode: 'basic', radius: 0.5 });
        sphereInst1.setPosition(vec3.fromValues(-2, 0, 3));
        sphereInst1.setRotation(vec3.fromValues(0, 0, 0));
        sphereInst1.setScale(vec3.fromValues(0.5, 0.5, 0.5));
        sphereInst1.setColor(0, 1, 1);
        this.entitiesList.push(sphereInst1);

        let sphereInst2 = new Sckorpio.Sphere({ mode: 'basic', radius: 0.5 });
        sphereInst2.setPosition(vec3.fromValues(-2, 0, 5));
        sphereInst2.setRotation(vec3.fromValues(0, 0, 0));
        sphereInst2.setScale(vec3.fromValues(1.0, 1.0, 1.0));
        sphereInst2.setColor(0, 1, 1);
        this.entitiesList.push(sphereInst2);

        let sphereInst3 = new Sckorpio.Sphere({ mode: 'basic', radius: 0.5 });
        sphereInst3.setPosition(vec3.fromValues(-2, 0, 7));
        sphereInst3.setRotation(vec3.fromValues(0, 0, 0));
        sphereInst3.setScale(vec3.fromValues(1.3, 1.3, 2.0));
        sphereInst3.setColor(0, 1, 1);
        this.entitiesList.push(sphereInst3);


        // --- BASIC BOX "INSTANCES" AS NEW ENTITIES ---
        let basicBoxInst1 = new Sckorpio.Cube({ mode: 'basic' });
        basicBoxInst1.setPosition(vec3.fromValues(0, 0, 3));
        basicBoxInst1.setRotation(vec3.fromValues(0, 60, 0));
        basicBoxInst1.setScale(vec3.fromValues(0.5, 0.7, 2));
        basicBoxInst1.setColor(1, 0, 1);
        this.entitiesList.push(basicBoxInst1);

        let basicBoxInst2 = new Sckorpio.Cube({ mode: 'basic' });
        basicBoxInst2.setPosition(vec3.fromValues(0, 0, 5));
        basicBoxInst2.setRotation(vec3.fromValues(0, -30, 0));
        basicBoxInst2.setScale(vec3.fromValues(1, 1, 1));
        basicBoxInst2.setColor(1, 0, 1);
        this.entitiesList.push(basicBoxInst2);

        let basicBoxInst3 = new Sckorpio.Cube({ mode: 'basic' });
        basicBoxInst3.setPosition(vec3.fromValues(0, 0, 7));
        basicBoxInst3.setRotation(vec3.fromValues(0, 35, 0));
        basicBoxInst3.setScale(vec3.fromValues(2, 0.5, 0.3));
        basicBoxInst3.setColor(1, 0, 1);
        this.entitiesList.push(basicBoxInst3);


        // --- CONE "INSTANCES" AS NEW ENTITIES ---
        let coneInst1 = new Sckorpio.Cone({ mode: 'basic', radius: 0.5, height: 1.0 });
        coneInst1.setPosition(vec3.fromValues(-4, 0, 3));
        coneInst1.setRotation(vec3.fromValues(30, 0, 0));
        coneInst1.setScale(vec3.fromValues(1, 1, 1));
        coneInst1.setColor(0, 1, 0);
        this.entitiesList.push(coneInst1);

        let coneInst2 = new Sckorpio.Cone({ mode: 'basic', radius: 0.5, height: 1.0 });
        coneInst2.setPosition(vec3.fromValues(-4, 0, 5));
        coneInst2.setRotation(vec3.fromValues(60, 0, 0));
        coneInst2.setScale(vec3.fromValues(1, 1, 1));
        coneInst2.setColor(0, 1, 0);
        this.entitiesList.push(coneInst2);

        let coneInst3 = new Sckorpio.Cone({ mode: 'basic', radius: 0.5, height: 1.0 });
        coneInst3.setPosition(vec3.fromValues(-4, 0, 7));
        coneInst3.setRotation(vec3.fromValues(90, 0, 0));
        coneInst3.setScale(vec3.fromValues(1, 1, 1));
        coneInst3.setColor(0, 1, 0);
        this.entitiesList.push(coneInst3);


        // --- CYLINDER "INSTANCES" AS NEW ENTITIES ---
        let cylinderInst1 = new Sckorpio.Cylinder({ mode: 'basic', radius: 0.5, height: 1.0 });
        cylinderInst1.setPosition(vec3.fromValues(-6, 0, 3));
        cylinderInst1.setRotation(vec3.fromValues(30, 0, 0));
        cylinderInst1.setScale(vec3.fromValues(1, 1, 1));
        cylinderInst1.setColor(1, 0, 0);
        this.entitiesList.push(cylinderInst1);

        let cylinderInst2 = new Sckorpio.Cylinder({ mode: 'basic', radius: 0.5, height: 1.0 });
        cylinderInst2.setPosition(vec3.fromValues(-6, 0, 5));
        cylinderInst2.setRotation(vec3.fromValues(60, 0, 0));
        cylinderInst2.setScale(vec3.fromValues(1, 1, 1));
        cylinderInst2.setColor(1, 0, 0);
        this.entitiesList.push(cylinderInst2);

        let cylinderInst3 = new Sckorpio.Cylinder({ mode: 'basic', radius: 0.5, height: 1.0 });
        cylinderInst3.setPosition(vec3.fromValues(-6, 0, 7));
        cylinderInst3.setRotation(vec3.fromValues(90, 0, 0));
        cylinderInst3.setScale(vec3.fromValues(1, 1, 1));
        cylinderInst3.setColor(1, 0, 0);
        this.entitiesList.push(cylinderInst3);
    }

    //-------------------

    async createMassiveStandardScene(count = 10000) {
    // We can use a seed or predictable random to keep positions consistent between tests
    for (let i = 0; i < count; i++) {
        let cube = new Sckorpio.Cube({ mode: 'basic' });

        // Generate variable positions, rotations, and scales
        const posX = (Math.random() - 0.5) * 100.0;
        const posY = Math.random() * 20.0;
        const posZ = (Math.random() - 0.5) * 100.0;

        const rotX = Math.random() * 360.0;
        const rotY = Math.random() * 360.0;
        const rotZ = Math.random() * 360.0;

        const scaleX = 0.2 + Math.random() * 0.8;
        const scaleY = 0.2 + Math.random() * 0.8;
        const scaleZ = 0.2 + Math.random() * 0.8;

        cube.setPosition(vec3.fromValues(posX, posY, posZ));
        cube.setRotation(vec3.fromValues(rotX, rotY, rotZ));
        cube.setScale(vec3.fromValues(scaleX, scaleY, scaleZ));
        
        // Give them a uniform color pass or randomize it
        cube.setColor(1.0, 0.0, i / count); 

        this.entitiesList.push(cube);
    }
}

    async createMassiveInstancedScene(count = 10000) {
        // 1. Instantiate just ONE single base mesh asset framework container
        let baseInstancedBox = new Sckorpio.Cube({ mode: 'basic' });
        baseInstancedBox.setPosition(vec3.fromValues(0, 0, 0));
        baseInstancedBox.setColor(1.0, 0.0, 1.0);

        // 2. Stream all variable coordinates directly into this single asset layout data cache
        for (let i = 0; i < count; i++) {
            const posX = (Math.random() - 0.5) * 100.0;
            const posY = Math.random() * 20.0;
            const posZ = (Math.random() - 0.5) * 100.0;

            const rotX = Math.random() * 360.0;
            const rotY = Math.random() * 360.0;
            const rotZ = Math.random() * 360.0;

            const scaleX = 0.2 + Math.random() * 0.8;
            const scaleY = 0.2 + Math.random() * 0.8;
            const scaleZ = 0.2 + Math.random() * 0.8;

            // Pack arrays smoothly matching your engine API layout: addInstance(pos, rot, scale)
            baseInstancedBox.addInstance(
                [posX, posY, posZ],
                [rotX, rotY, rotZ],
                [scaleX, scaleY, scaleZ]
            );
        }

        // 3. Push the single base object wrapper to the active execution list
        this.entitiesList.push(baseInstancedBox);
    }



    async createScene() {

        // Original
        //await this.sceneTestingOriginal();
        // Instanced
        await this.sceneTestingInstanced();

        //-----------
        // Original
        //await this.createMassiveStandardScene();

        // Instanced
        //await this.createMassiveInstancedScene();



    }
}

export{
    Scene
}