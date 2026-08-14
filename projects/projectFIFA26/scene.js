import { Cube } from "../../sckorpioEngineWeb/core/ecs/entity/entities/mesh/primitives/cube.js";
import { Cone } from "../../sckorpioEngineWeb/core/ecs/entity/entities/mesh/primitives/cone.js";
import { Cyclinder } from "../../sckorpioEngineWeb/core/ecs/entity/entities/mesh/primitives/cyclinder.js";
import { Sphere } from "../../sckorpioEngineWeb/core/ecs/entity/entities/mesh/primitives/sphere.js";
import { Plane } from "../../sckorpioEngineWeb/core/ecs/entity/entities/mesh/primitives/plane.js";
import { SckorpioScene } from "../../sckorpioEngineWeb/core/scene/sckorpioScene.js";

class Scene extends SckorpioScene {
    constructor(projectName) {
        super();
        this.projectName = projectName;
        
        // Structural instancing references
        this.standRow = null;
        this.seatBottom = null;
        this.seatRest = null;
    }

    async initResources() {
        this.customTextureList = [
            "football", 
            "adidas_trionda", 
            "pitch_grass", 
            "pitch_markings", 
            "goal_post_net", 
            "concrete2", 
            "concrete4",
            "brick_wall",
            "flood_light_led", 
            "seat_bottom", 
            "seat_rest",
            "stadium_title",
            "stadium_screen",
            "ad_boards",
            "roof_material",
            "player_sckorpio",
            "player_sckorpio1",
            "player_sckorpio2",
            "player_sckorpio3",
            "player_sckorpio4",
            "player_sckorpio5",
            "player_messi",
            "player_ronaldo",
            "player_mbappe",
            "player_neymar",
            "player_rodri",
            "player_shakira",
            "fifa_trophy",
            "trophy_box1",
            "trophy_box2"
            
        ];

        await this.textureBook.generateCustomTextures(this.projectName, this.customTextureList);
    }

    async createScene() {
        this.buildPitch();
        this.buildBalls();
        this.buildGoalPosts();
        this.buildExteriorWalls();
        this.buildStandsAndSeats();
        this.buildFloodlights();
        this.buildStadiumScreen();            
        this.buildAdvertisementBoards();
        this.buildGrandstandRoof();     
        this.buildStadiumGateBoards(); 
        //this.buildFIFAPlayers();
        this.buildFIFACeremony();
        //this.buildFIFAPlayersFinal();
        // this.buildEnginePrimitiveShowcase();
    }

    buildPitch() {
        let site = new Plane({ mode: 'basic', uvRange: [0, 0, 4, 4] });
        site.setPosition(0.0, -0.05, 0.0);
        site.setRotation(90, 0, 0);
        site.setColor(0.3,0.3,0.3);
        site.setScale(200.0, 150.0, 1.0);
        this.entitiesList.push(site);

        let ground = new Plane({ mode: 'texture', uvRange: [0, 0, 40, 20] });
        ground.setPosition(0.0, 0.0, 0.0);
        ground.setRotation(90, 0, 0);
        ground.setScale(110.0, 80.0, 1.0);
        ground.setTexture("pitch_grass");
        this.entitiesList.push(ground);

        let markings = new Plane({ mode: 'texture', uvRange: [0, 0, 1, 1] });
        markings.setPosition(0.0, 0.1, 0.0);
        markings.setRotation(90, 0, 0);
        markings.setScale(100.0, 80.0, 1.0);
        markings.setTexture("pitch_markings");
        this.entitiesList.push(markings);
    }

    buildBalls() {
        let football = new Sphere({ mode:'texture', radius: 0.2 });
        football.setPosition(-36.0, 0.3, 0.0);
        football.setColor(0, 1, 1);
        football.setTexture('adidas_trionda');

        football.addInstance([-36.0, 0.3, 0.0], [0, 0, 0], [1,1,1]);
        football.addInstance([-30.0, 0.3, 7.0], [0, 0, 0], [1,1,1]);
        football.addInstance([5.0, 0.3, 1.0], [0, 0, 0], [1,1,1]);
   
        
        this.entitiesList.push(football);

        let football2 = new Sphere({ mode: 'texture', radius: 0.2 });
        football2.setPosition(-30.0, 0.3, 0.0);
        football2.setColor(0, 1, 1);
        football2.setTexture('football');
        //this.entitiesList.push(football2);  
    }

    buildGoalPosts() {
        let postPole = new Cyclinder({ mode: 'basic', radius: 0.5, height: 1.0 });
        postPole.setPosition(-45.0, 0.0, 0.0);
        postPole.setColor(0.8, 0.8, 0.8);
        
        postPole.addInstance([-45.0, 0.0, -7.0], [0, 0, 0], [0.5, 4.0, 0.5]);
        postPole.addInstance([-45.0, 0.0,  7.0], [0, 0, 0], [0.5, 4.0, 0.5]);
        postPole.addInstance([-45.0, 4.0, -7.0], [90, 0, 0], [0.5, 14.0, 0.5]);
        postPole.addInstance([ 45.0, 0.0, -7.0], [0, 0, 0], [0.5, 4.0, 0.5]);
        postPole.addInstance([ 45.0, 0.0,  7.0], [0, 0, 0], [0.5, 4.0, 0.5]);
        postPole.addInstance([ 45.0, 4.0, -7.0], [90, 0, 0], [0.5, 14.0, 0.5]);
        this.entitiesList.push(postPole);

        let postNet = new Plane({ mode: 'texture', uvRange: [0, 0, 4, 1.3] });
        postNet.setTexture("goal_post_net");
        postNet.addInstance([-49.0, 2.0, 0.0], [0, 90, 0], [14, 4.0, 1.0]);
        postNet.addInstance([-47.0, 4.0, 0.0], [90, 0, 90], [14, 4.0, 1.0]);
        postNet.addInstance([ 49.0, 2.0, 0.0], [0, 90, 0], [14, 4.0, 1.0]);
        postNet.addInstance([ 47.0, 4.0, 0.0], [90, 0, 90], [14, 4.0, 1.0]);
        this.entitiesList.push(postNet);

        let postNetSide = new Plane({ mode: 'texture', uvRange: [0, 0, 1, 1] });
        postNetSide.setTexture("goal_post_net");
        postNetSide.addInstance([-47.0, 2.0, -7.0], [0, 0, 0], [4.0, 4.0, 1.0]);
        postNetSide.addInstance([-47.0, 2.0,  7.0], [0, 0, 0], [4.0, 4.0, 1.0]);
        postNetSide.addInstance([ 47.0, 2.0, -7.0], [0, 0, 0], [4.0, 4.0, 1.0]);
        postNetSide.addInstance([ 47.0, 2.0,  7.0], [0, 0, 0], [4.0, 4.0, 1.0]);
        this.entitiesList.push(postNetSide);
    }

    buildStadiumScreen() {
        // Shifting coordinates safely past the exterior wing grandstand layer (from X=-55 out to X=-82)
        let screenSupport = new Cyclinder({ mode: 'basic', radius: 0.6, height: 25.0 });
        screenSupport.setColor(0.4, 0.4, 0.4);
        screenSupport.addInstance([-82.0, 0.0, 0.0], [0, 90, 0], [1.0, 1.0, 1.0]); 
        this.entitiesList.push(screenSupport);

        // Scoreboard Housing Sits atop the tall support post outside the seating rim bounds
        let screenHousing = new Cube({ mode: 'basic' });
        screenHousing.setColor(0.15, 0.15, 0.15);
        screenHousing.addInstance([-82.0, 20.0, 0.0], [0, 90, 0], [25.0, 12.0, 1.5]);
        this.entitiesList.push(screenHousing);

        // Display Face oriented cleanly over the structural rim to capture maximum visibility
        let screenDisplay = new Plane({ mode: 'texture' });
        screenDisplay.setTexture("stadium_screen");
        screenDisplay.addInstance([-81.0, 20.0, 0.0], [0, 90, 0], [24.5, 11.5, 1.0]);
        this.entitiesList.push(screenDisplay);
    }

    buildAdvertisementBoards() {
        let adBoard = new Plane({ mode: 'texture', uvRange: [0, 0, 1, 1] });
        adBoard.setTexture("ad_boards");

        // West
        adBoard.addInstance([-48.0, 0.5, -25.0], [0, 90, 0], [20.0, 1.0, 1.0]);
        adBoard.addInstance([-48.0, 0.5,  25.0], [0, 90, 0], [20.0, 1.0, 1.0]);
        
        // East
        adBoard.addInstance([ 48.0, 0.5, -25.0], [0, 270, 0], [20.0, 1.0, 1.0]);
        adBoard.addInstance([ 48.0, 0.5,  25.0], [0, 270, 0], [20.0, 1.0, 1.0]);

        // North
        adBoard.addInstance([ -38.0, 0.5, -35.0], [0, 0, 0], [20.0, 1.0, 1.0]);
        adBoard.addInstance([ -18.0, 0.5, -35.0], [0, 0, 0], [20.0, 1.0, 1.0]);
        adBoard.addInstance([ 18.0, 0.5, -35.0], [0, 0, 0], [20.0, 1.0, 1.0]);
        adBoard.addInstance([ 38.0, 0.5,  -35.0], [0, 0, 0], [20.0, 1.0, 1.0]);

        // South
        adBoard.addInstance([ -38.0, 0.5, 35.0], [0, 180, 0], [20.0, 1.0, 1.0]);
        adBoard.addInstance([ -18.0, 0.5, 35.0], [0, 180, 0], [20.0, 1.0, 1.0]);
        adBoard.addInstance([ 18.0, 0.5, 35.0], [0, 180, 0], [20.0, 1.0, 1.0]);
        adBoard.addInstance([ 38.0, 0.5, 35.0], [0, 180, 0], [20.0, 1.0, 1.0]);
        
        this.entitiesList.push(adBoard);
    }

    buildGrandstandRoof() {
        let roofPillar = new Cyclinder({ mode: 'basic', radius: 0.4, height: 18.0 }); 
        roofPillar.setColor(0.4, 0.4, 0.4);
        roofPillar.addInstance([-60.0, 0.0, 60.0], [0, 0, 0], [1, 1, 1]); 
        roofPillar.addInstance([  -7.0, 0.0, 60.0], [0, 0, 0], [1, 1, 1]);
        roofPillar.addInstance([  7.0, 0.0, 60.0], [0, 0, 0], [1, 1, 1]);
        roofPillar.addInstance([ 60.0, 0.0, 60.0], [0, 0, 0], [1, 1, 1]);
        roofPillar.addInstance([  -7.0, 0.0, -60.0], [0, 0, 0], [1, 1, 1]);
        roofPillar.addInstance([  7.0, 0.0, -60.0], [0, 0, 0], [1, 1, 1]);

        this.entitiesList.push(roofPillar);

        let roofSlab = new Cube({ mode: 'texture', uvRange: [0, 0, 10, 2] });
        roofSlab.setTexture("roof_material");
        roofSlab.addInstance([0.0, 12.0, 52.0], [-5, 0, 0], [130.0, 0.8, 22.0]); 
        this.entitiesList.push(roofSlab);
    }

    buildStadiumGateBoards() {
        // Main board
        let mainBoard = new Cube({ mode: 'basic' });
        mainBoard.setColor(0.15, 0.15, 0.15);

        // Main Title
        let screenDisplay = new Plane({ mode: 'texture' });
        screenDisplay.setTexture("stadium_title");
        
        // Board 1
        mainBoard.addInstance([0.0, 14.0, -60.0], [0, 0, 0], [30.0, 6.0, 1.0]);
        screenDisplay.addInstance([0.0, 14.0, -59.3], [0, 0, 0], [29.5, 5.5, 1.0]);
        screenDisplay.addInstance([0.0, 14.0, -60.7], [0, 180, 0], [29.5, 5.5, 1.0]);

        // board 2
        mainBoard.addInstance([0.0, 18.0, 60.0], [0, 0, 0], [30.0, 6.0, 1.0]);
        screenDisplay.addInstance([0.0, 18.0, 59.3], [0, 180, 0], [29.5, 5.5, 1.0]);
        screenDisplay.addInstance([0.0, 18.0, 60.7], [0, 0, 0], [29.5, 5.5, 1.0]);
        
        this.entitiesList.push(mainBoard);
        this.entitiesList.push(screenDisplay);
    }

    buildStandsAndSeats() {
        this.seatBottom = new Plane({ mode: 'texture' });
        this.seatBottom.setTexture('seat_bottom');

        this.seatRest = new Plane({ mode: 'texture' });
        this.seatRest.setTexture('seat_rest');

        this.standRow = new Cube({ mode: 'texture', uvRange: [0, 0, 1, 1] });
        this.standRow.setTexture('concrete2');

        for (let r = 0; r < 9; r++) {
            let stepDepthScale = 24 - (r * 2);

            // NORTH GRANDSTANDS
            this.proceduralRowInstance([-35, r, 50 + r], [0, 0, 0], [60, 1, stepDepthScale], 180.0);
            this.proceduralRowInstance([ 35, r, 50 + r], [0, 0, 0], [60, 1, stepDepthScale], 180.0);

            // SOUTH GRANDSTANDS
            this.proceduralRowInstance([-35, r, -50 - r], [0, 0, 0], [60, 1, stepDepthScale], 0.0);
            this.proceduralRowInstance([ 35, r, -50 - r], [0, 0, 0], [60, 1, stepDepthScale], 0.0);

            // EAST WING GRANDSTAND
            this.proceduralRowInstance([-67 - r, r, 0], [0, 90, 0], [90, 1, stepDepthScale], 90.0);

            // WEST WING GRANDSTAND
            this.proceduralRowInstance([ 67 + r, r, 0], [0, 90, 0], [90, 1, stepDepthScale], 270.0);
        }

        this.entitiesList.push(this.standRow);
        this.entitiesList.push(this.seatBottom);
        this.entitiesList.push(this.seatRest);
    }

    buildExteriorWalls() {
        let outerWall = new Cube({ mode: 'texture', uvRange: [0, 0, 6, 2] });
        outerWall.setTexture("brick_wall"); 

        // --- NORTH GRANDSTAND BACK WALLS (Aligned precisely with your 2 North seat blocks) ---
        // Block 1 (Left North Side)
        outerWall.addInstance([-35.0, 4.5, 62.0], [0, 0, 0], [60.0, 10.0, 1.0]);
        // Block 2 (Right North Side)
        outerWall.addInstance([ 35.0, 4.5, 62.0], [0, 0, 0], [60.0, 10.0, 1.0]);

        // --- SOUTH GRANDSTAND BACK WALLS (Aligned precisely with your 2 South seat blocks) ---
        // Block 3 (Left South Side)
        outerWall.addInstance([-35.0, 4.5, -62.0], [0, 0, 0], [60.0, 10.0, 1.0]);
        // Block 4 (Right South Side)
        outerWall.addInstance([ 35.0, 4.5, -62.0], [0, 0, 0], [60.0, 10.0, 1.0]);

        // --- WING GRANDSTAND BACK WALLS (Aligned right behind your East/West procedural arrays) ---
        // Block 5 (East Wing Side - X coordinate matches the deep back edge of your step loop)
        outerWall.addInstance([-80, 4.5, 0.0], [0, 90, 0], [90.0, 10.0, 1.0]);
        
        // Block 6 (West Wing Side - X coordinate matches the deep back edge of your step loop)
        outerWall.addInstance([ 80, 4.5, 0.0], [0, 90, 0], [90.0, 10.0, 1.0]);

        this.entitiesList.push(outerWall);
    }

    proceduralRowInstance(boxPos, boxRot, boxScale, seatFacingAngle) {
        this.standRow.addInstance(boxPos, boxRot, boxScale);

        const bias = 0.01; 
        const seatSpacing = 1.6; 
        const [bX, bY, bZ] = boxPos;
        const [sW, sH, sD] = boxScale;
        const surfaceY = bY + (sH * 0.5); 

        const isRotated = (boxRot[1] === 90);

        if (!isRotated) {
            const zSign = bZ > 0 ? -1 : 1;
            const targetZ = bZ + (zSign * (sD * 0.5) + (zSign * 0.5));
            const startX = bX - (sW * 0.5) + 1.5;
            const endX = bX + (sW * 0.5) - 1.5;

            for (let curX = startX; curX <= endX; curX += seatSpacing) {
                this.seatBottom.addInstance([curX, surfaceY + bias, targetZ + (zSign * 0.5)], [90.0, 0.0, seatFacingAngle], [1, 1, 1]);
                this.seatRest.addInstance([curX, surfaceY + 0.5, targetZ], [0.0, seatFacingAngle + 180.0, 0.0], [1, 1, 1]);
            }
        } else {
            const xSign = bX > 0 ? -1 : 1;
            const targetX = bX + (xSign * (sD * 0.5) + (xSign * 0.5));
            const startZ = bZ - (sW * 0.5) + 1.5;
            const endZ = bZ + (sW * 0.5) - 1.5;

            for (let curZ = startZ; curZ <= endZ; curZ += seatSpacing) {
                this.seatBottom.addInstance([targetX + (xSign * 0.5), surfaceY + bias, curZ], [90.0, 0.0, seatFacingAngle], [1, 1, 1]);
                this.seatRest.addInstance([targetX, surfaceY + 0.5, curZ], [0.0, seatFacingAngle + 180.0, 0.0], [1, 1, 1]);
            }
        }
    }

    buildFloodlights() {
        let floodLightPole = new Cyclinder({ mode: 'basic', radius: 1.0, height: 30.0, radialSegments: 5 });
        floodLightPole.setColor(0.5, 0.5, 0.5);
        floodLightPole.addInstance([-75, 0,  55], [0, 0, 0], [1, 1, 1]);
        floodLightPole.addInstance([ 75, 0,  55], [0, 0, 0], [1, 1, 1]);
        floodLightPole.addInstance([-75, 0, -55], [0, 0, 0], [1, 1, 1]);
        floodLightPole.addInstance([ 75, 0, -55], [0, 0, 0], [1, 1, 1]);
        this.entitiesList.push(floodLightPole);

        let floodLightPanel = new Cube({ mode: 'basic' });
        floodLightPanel.setColor(0.5, 0.5, 0.5);
        floodLightPanel.addInstance([-75, 30,  55], [0, -45, 0], [10, 8, 2]);
        floodLightPanel.addInstance([ 75, 30,  55], [0,  45, 0], [10, 8, 2]);
        floodLightPanel.addInstance([-75, 30, -55], [0,  45, 0], [10, 8, 2]);
        floodLightPanel.addInstance([ 75, 30, -55], [0, -45, 0], [10, 8, 2]);
        this.entitiesList.push(floodLightPanel);

        let floodLightLED = new Plane({ mode: 'texture' });
        floodLightLED.setTexture('flood_light_led');
        floodLightLED.addInstance([-74, 30,  54], [0, -45, 0], [10, 8, 2]);
        floodLightLED.addInstance([ 74, 30,  54], [0,  45, 0], [10, 8, 2]);
        floodLightLED.addInstance([-74, 30, -54], [0,  45, 0], [10, 8, 2]);
        floodLightLED.addInstance([ 74, 30, -54], [0, -45, 0], [10, 8, 2]);
        this.entitiesList.push(floodLightLED);
    }

    buildFIFAPlayersFinal(){
        let player1 = new Plane({ mode: 'texture' });
        player1.setTexture('player_messi');
        player1.setPosition(-38.0, 1.5, 2.0);
        player1.setScale(2.0, 2.5, 1.0);
        player1.setRotation(0.0, 90.0, 0.0);
        this.entitiesList.push(player1);

        let player2 = new Plane({ mode: 'texture' });
        player2.setTexture('player_rodri');
        player2.setPosition(-38.0, 1.5, -2.0);
        player2.setScale(2.0, 2.5, 1.0);
        player2.setRotation(0.0, 90.0, 0.0);
        this.entitiesList.push(player2);
    }

    buildFIFAPlayers() {
        
        let player1 = new Plane({ mode: 'texture' });
        player1.setTexture('player_messi');
        player1.setPosition(-30.0, 1.0, 8.0);
        player1.setScale(2.0, 2.5, 1.0);
        player1.setRotation(0.0, 90.0, 0.0);
        this.entitiesList.push(player1);

        let player_sckorpio1 = new Plane({ mode: 'texture' });
        player_sckorpio1.setTexture('player_sckorpio1');
        player_sckorpio1.setPosition(-30.0, 1.0, 6.0);
        player_sckorpio1.setScale(2.0, 2.0, 1.0);
        player_sckorpio1.setRotation(0.0, 90.0, 0.0);
        this.entitiesList.push(player_sckorpio1);

        let player2 = new Plane({ mode: 'texture' });
        player2.setTexture('player_ronaldo');
        player2.setPosition(-25.0, 1.3, -8.0);
        player2.setScale(2.0, 2.7, 1.0);
        player2.setRotation(0.0, 90.0, 0.0);
        this.entitiesList.push(player2);

        let player_sckorpio2 = new Plane({ mode: 'texture' });
        player_sckorpio2.setTexture('player_sckorpio2');
        player_sckorpio2.setPosition(-25.0, 1.0, -6.0);
        player_sckorpio2.setScale(2.0, 2.0, 1.0);
        player_sckorpio2.setRotation(0.0, 90.0, 0.0);
        this.entitiesList.push(player_sckorpio2);

        let player3 = new Plane({ mode: 'texture' });
        player3.setTexture('player_mbappe');
        player3.setPosition(-15.0, 1.0, -5.0);
        player3.setScale(2.0, 2.0, 1.0);
        player3.setRotation(0.0, 90.0, 0.0);
        this.entitiesList.push(player3);

        let player_sckorpio3 = new Plane({ mode: 'texture' });
        player_sckorpio3.setTexture('player_sckorpio3');
        player_sckorpio3.setPosition(-15.0, 1.0, -3.0);
        player_sckorpio3.setScale(2.0, 2.0, 1.0);
        player_sckorpio3.setRotation(0.0, 90.0, 0.0);
        this.entitiesList.push(player_sckorpio3);

        let player4 = new Plane({ mode: 'texture' });
        player4.setTexture('player_neymar');
        player4.setPosition(-10.0, 1.0, 5.0);
        player4.setScale(2.0, 2.0, 1.0);
        player4.setRotation(0.0, 270.0, 0.0);
        this.entitiesList.push(player4);

        let player_sckorpio4 = new Plane({ mode: 'texture' });
        player_sckorpio4.setTexture('player_sckorpio4');
        player_sckorpio4.setPosition(-10.0, 1.0, 3.0);
        player_sckorpio4.setScale(2.0, 2.0, 1.0);
        player_sckorpio4.setRotation(0.0, 90.0, 0.0);
        this.entitiesList.push(player_sckorpio4);

        let player_sckorpio5 = new Plane({ mode: 'texture' });
        player_sckorpio5.setTexture('player_sckorpio5');
        player_sckorpio5.setPosition(-43.0, 1.0, 0.0);
        player_sckorpio5.setScale(3.0, 3.0, 1.0);
        player_sckorpio5.setRotation(0.0, 90.0, 0.0);
        this.entitiesList.push(player_sckorpio5);


        
    }

    buildFIFACeremony() {
        let player_sckorpio = new Plane({ mode: 'texture' });
        player_sckorpio.setTexture('player_sckorpio');
        player_sckorpio.setPosition(4.0, 1.0, 2.0);
        player_sckorpio.setScale(2.0, 2.0, 1.0);
        player_sckorpio.setRotation(0.0, 270.0, 0.0);
        this.entitiesList.push(player_sckorpio);

        let player_shakira = new Plane({ mode: 'texture' });
        player_shakira.setTexture('player_shakira');
        player_shakira.setPosition(4.0, 1.5, -2.0);
        player_shakira.setScale(1.5, 3.0, 1.0);
        player_shakira.setRotation(0.0, 90.0, 0.0);
        this.entitiesList.push(player_shakira);

        let trophyBox = new Cube({mode : 'texture'});
        //trophyBox.setColor(100/255.0,85/255.0,150/255.0);
        trophyBox.setTexture('trophy_box2');
        trophyBox.setPosition(4.0, 0.6, 0.0);
        trophyBox.setScale(0.6, 1.3, 0.6);
        this.entitiesList.push(trophyBox);

        let fifaTrophy = new Plane({ mode : 'texture'});
        fifaTrophy.setTexture('fifa_trophy');
        fifaTrophy.setPosition(4.0, 1.7, 0.0);
        fifaTrophy.setScale(0.5, 1.0, 0.5);
        fifaTrophy.setRotation(0.0, 90.0, 0.0);
        this.entitiesList.push(fifaTrophy);

    }

    buildEnginePrimitiveShowcase() {
        let sphere = new Sphere({ mode: 'basic', radius: 0.5 });
        sphere.setPosition(-6.0, 0.5, 0.0);
        sphere.setColor(0, 1, 1);
        this.entitiesList.push(sphere);

        let cyclinder = new Cyclinder({ mode: 'basic', radius: 0.5, height: 1.0 });
        cyclinder.setPosition(-4.0, 0.0, 0.0);
        cyclinder.setColor(1, 0, 0);
        this.entitiesList.push(cyclinder);

        let cone = new Cone({ mode: 'basic', radius: 0.5, height: 1.0 });
        cone.setPosition(-2.0, 0.0, 0.0);
        cone.setColor(0, 1, 0);
        this.entitiesList.push(cone);

        let basicBox = new Cube({ mode: 'basic' });
        basicBox.setPosition(0.0, 0.5, 0.0);
        basicBox.setColor(1, 0, 1);
        this.entitiesList.push(basicBox);

        let colorFaceBox = new Cube({ mode: 'colorFace' });
        colorFaceBox.setPosition(2.0, 0.5, 0.0);
        this.entitiesList.push(colorFaceBox);

        let colorVertexBox = new Cube({ mode: 'colorVertex' });
        colorVertexBox.setPosition(4.0, 0.5, 0.0);
        this.entitiesList.push(colorVertexBox);

        let uvFaceBox = new Cube({ mode: 'texture' });
        uvFaceBox.setPosition(6.0, 0.5, 0.0);
        uvFaceBox.setMaterial('uvVertex3D');
        this.entitiesList.push(uvFaceBox);

        let box1 = new Cube({ mode: 'texture' });
        box1.setPosition(8.0, 0.5, 0.0);
        box1.setScale(1.0, 1.0, 1.0);
        this.entitiesList.push(box1);

        let box2 = new Cube({ mode: 'texture', uvRange: [0, 0, 1, 1] });
        box2.setPosition(10.0, 0.5, 0.0);
        box2.setTexture("woodCarton");
        this.entitiesList.push(box2);

        let plane1 = new Plane({ mode: 'basic' });
        plane1.setPosition(12.0, 0.5, 0.0);
        this.entitiesList.push(plane1);

        let plane2 = new Plane({ mode: 'colorVertex' });
        plane2.setPosition(14.0, 0.5, 0.0);
        this.entitiesList.push(plane2);

        let plane3 = new Plane({ mode: 'texture' });
        plane3.setPosition(16.0, 0.5, 0.0);
        this.entitiesList.push(plane3);
    }
}

export { Scene };