import { Node } from "../../sckorpioEngineWeb/core/ecs/entity/entities/node/node.js";
import { Cube } from "../../sckorpioEngineWeb/core/ecs/entity/entities/mesh/primitives/cube.js";
import { Cyclinder } from "../../sckorpioEngineWeb/core/ecs/entity/entities/mesh/primitives/cyclinder.js";
import { Sphere } from "../../sckorpioEngineWeb/core/ecs/entity/entities/mesh/primitives/sphere.js";
import { Plane } from "../../sckorpioEngineWeb/core/ecs/entity/entities/mesh/primitives/plane.js";
import { SckorpioScene } from "../../sckorpioEngineWeb/core/scene/sckorpioScene.js";
import { AnimationClip } from "../../sckorpioEngineWeb/core/ecs/system/animation/animationClip.js";
import { AnimationTrack } from "../../sckorpioEngineWeb/core/ecs/system/animation/animationTrack.js";

class Scene extends SckorpioScene {
    constructor(projectName) {
        super();
        this.projectName = projectName;
    }

    // =========================================================
    // ANIMATION HELPERS
    // =========================================================

    createClip(name, tracks) {
        const clip = new AnimationClip(name);
        for(const track of tracks) {
            clip.addTrack(track);
        }
        return clip;
    }

    animate(entity, clip) {
        entity.addAnimationComponent();
        entity.animationComponent.setClip(clip);
        entity.animationComponent.play();
    }

    // =========================================================
    // RESOURCES
    // =========================================================

    async initResources() {
        this.customTextureList = ["indiaFlag"];

        await this.textureBook.generateCustomTextures(
            this.projectName,
            this.customTextureList
        );
    }

    // =========================================================
    // SCENE
    // =========================================================

    async createScene() {
        //this.createGround();
        this.createTank();
        this.createHelicopter();
    }

    // =========================================================
    // GROUND
    // =========================================================

    createGround() {
        const ground = new Cube({mode:"basic"});
        ground.setPosition(0.0,-1.0,0.0);
        ground.setScale(22.0,0.10,16.0);
        ground.setColor(0.045,0.060,0.035);
        this.entitiesList.push(ground);
    }

    // =========================================================
    // TANK
    // =========================================================

    createTank() {
        const tank = new Node();

        // Tank instances
        tank.addInstance([-20,3,0],[0,0,0],[1,1,1]);
        tank.addInstance([0,3,0],[0,0,0],[1,1,1]);
        tank.addInstance([20,3,0],[0,45,0],[1,1,1]);

        tank.setPosition(0.0,1.0,0.0);
        this.entitiesList.push(tank);

        // -----------------------------------------------------
        // Tank movement
        // -----------------------------------------------------

        const movement = new AnimationTrack("position","vec3",[
            {time:0.0,value:[0.0,0.0,0.0]},
            {time:20.0,value:[40.0,0.0,0.0]},
            {time:40.0,value:[0.0,0.0,0.0]}
        ]);

        this.animate(
            tank,
            this.createClip("TankMovement",[movement])
        );

        // -----------------------------------------------------
        // Hull group
        // -----------------------------------------------------

        const hullGroup = new Node();

        tank.addChild(hullGroup);
        this.entitiesList.push(hullGroup);

        this.createLowerHull(hullGroup);
        this.createUpperHull(hullGroup);
        this.createFrontArmor(hullGroup);
        this.createRearArmor(hullGroup);
        this.createEngineDeck(hullGroup);
        this.createSideArmor(hullGroup,1.52);
        this.createSideArmor(hullGroup,-1.52);
        this.createTrack(tank,1.62);
        this.createTurret(tank);
    }

    // =========================================================
    // LOWER HULL
    // =========================================================

    createLowerHull(parent) {
        const hull = new Cube({mode:"basic"});

        hull.setPosition(0.0,0.0,0.0);
        hull.setScale(4.65,0.8,3.0);
        hull.setColor(0.23,0.34,0.12);

        parent.addChild(hull);
        this.entitiesList.push(hull);
    }

    // =========================================================
    // UPPER HULL
    // =========================================================

    createUpperHull(parent) {
        const upper = new Cube({mode:"basic"});

        upper.setPosition(0.0,0.62,0.0);
        upper.setScale(2.75,0.4,2.8);
        upper.setRotation(0.0,0.0,-2.0);
        upper.setColor(0.27,0.39,0.14);

        parent.addChild(upper);
        this.entitiesList.push(upper);

        const top = new Cube({mode:"basic"});

        top.setPosition(-0.20,0.90,0.0);
        top.setScale(2.35,0.10,2.15);
        top.setColor(0.20,0.30,0.10);

        parent.addChild(top);
        this.entitiesList.push(top);
    }

    // =========================================================
    // FRONT ARMOR
    // =========================================================

    createFrontArmor(parent) {
        const glacis = new Cube({mode:"basic"});

        glacis.setPosition(2.55,0.20,0.0);
        glacis.setScale(0.72,0.10,2.80);
        glacis.setRotation(0.0,0.0,-27.0);
        glacis.setColor(0.29,0.42,0.15);

        parent.addChild(glacis);
        this.entitiesList.push(glacis);

        const lowerFront = new Cube({mode:"basic"});

        lowerFront.setPosition(2.5,-0.15,0.0);
        lowerFront.setScale(0.7,0.50,2.8);
        lowerFront.setRotation(0.0,0.0,-8.0);
        lowerFront.setColor(0.20,0.30,0.10);

        parent.addChild(lowerFront);
        this.entitiesList.push(lowerFront);

        const bumper = new Cube({mode:"basic"});

        bumper.setPosition(2.85,-0.15,0.0);
        bumper.setScale(0.18,0.16,2.48);
        bumper.setColor(0.035,0.045,0.020);

        parent.addChild(bumper);
        this.entitiesList.push(bumper);

        const hook = new Cyclinder({
            mode:"basic",
            radius:0.15,
            height:0.25
        });

        hook.addInstance([2.82,-0.42,-0.95],[90,0,0],[1,1,1]);
        hook.addInstance([2.82,-0.42,0.95],[-90,0,0],[1,1,1]);
        hook.setColor(0.035,0.045,0.020);

        parent.addChild(hook);
        this.entitiesList.push(hook);
    }

    // =========================================================
    // REAR ARMOR
    // =========================================================

    createRearArmor(parent) {
        const rear = new Cube({mode:"basic"});

        rear.setPosition(-2.40,0.0,0.0);
        rear.setScale(0.60,0.68,2.38);
        rear.setRotation(0.0,0.0,25.0);
        rear.setColor(0.18,0.27,0.09);

        parent.addChild(rear);
        this.entitiesList.push(rear);

        const exhaust = new Cube({mode:"basic"});

        exhaust.setColor(0.035,0.045,0.020);
        exhaust.addInstance([-2.55,0.32,-0.72],[0,0,0],[0.18,0.28,0.38]);
        exhaust.addInstance([-2.55,0.32,0.72],[0,0,0],[0.18,0.28,0.38]);

        parent.addChild(exhaust);
        this.entitiesList.push(exhaust);
    }

    // =========================================================
    // ENGINE DECK
    // =========================================================

    createEngineDeck(parent) {
        const deck = new Cube({mode:"basic"});

        deck.setPosition(-1.55,0.72,0.0);
        deck.setScale(1.0,0.42,1.58);
        deck.setColor(0.15,0.23,0.07);

        parent.addChild(deck);
        this.entitiesList.push(deck);

        const grille = new Cube({mode:"basic"});

        grille.setScale(0.045,0.035,0.82);
        grille.setColor(0.020,0.025,0.010);

        for(let i = 0; i < 7; i++) {
            grille.addInstance(
                [-0.40+i*0.08,0.55,0.0],
                [0,0,0],
                [0.045,0.035,0.82]
            );
        }

        deck.addChild(grille);
        this.entitiesList.push(grille);
    }

    // =========================================================
    // SIDE ARMOR
    // =========================================================

    createSideArmor(parent,z) {
        const armor = new Cube({mode:"basic"});

        armor.setPosition(0.0,-0.08,z);
        armor.setScale(3.05,0.42,0.12);
        armor.setColor(0.19,0.29,0.095);

        parent.addChild(armor);
        this.entitiesList.push(armor);

        const panel = new Cube({mode:"basic"});

        panel.setScale(0.38,0.28,0.08);
        panel.setColor(0.12,0.19,0.055);

        for(let i = 0; i < 5; i++) {
            panel.addInstance(
                [-2.20+i*1.05,-0.10,z+(z > 0 ? 0.14 : -0.14)],
                [0,0,0],
                [0.38,0.28,0.08]
            );
        }

        parent.addChild(panel);
        this.entitiesList.push(panel);
    }

    // =========================================================
    // TRACK
    // =========================================================

    createTrack(parent,z) {
        const trackGroup = new Node();

        trackGroup.addInstance([0.0,-0.62,z],[0,0,0],[1,1,1]);
        trackGroup.addInstance([0.0,-0.62,-z],[0,180,0],[1,1,1]);

        parent.addChild(trackGroup);
        this.entitiesList.push(trackGroup);

        const trackBody = new Cube({mode:"basic"});

        trackBody.setPosition(0.0,0.0,0.0);
        trackBody.setScale(3.45,0.82,0.32);
        trackBody.setColor(0.025,0.030,0.015);

        trackGroup.addChild(trackBody);
        this.entitiesList.push(trackBody);

        const fender = new Cube({mode:"basic"});

        fender.setPosition(0.0,0.72,0.0);
        fender.setScale(5.18,0.12,0.42);
        fender.setColor(0.12,0.18,0.06);

        trackGroup.addChild(fender);
        this.entitiesList.push(fender);

        const wheels = new Cyclinder({
            mode:"basic",
            radius:0.50,
            height:0.36
        });

        wheels.setRotation(90.0,0.0,0.0);
        wheels.setColor(0.010,0.014,0.008);

        const wheelPositions = [-2.55,-1.70,-0.85,0.0,0.85,1.70,2.55];

        for(const x of wheelPositions) {
            wheels.addInstance(
                [x,0.0,0.0],
                [90.0,0.0,0.0],
                [1.0,1.0,1.0]
            );
        }

        trackGroup.addChild(wheels);
        this.entitiesList.push(wheels);

        const hubs = new Cyclinder({
            mode:"basic",
            radius:0.23,
            height:0.40
        });

        hubs.setRotation(90.0,0.0,0.0);
        hubs.setColor(0.16,0.18,0.08);

        for(const x of wheelPositions) {
            hubs.addInstance(
                [x,0.0,0.0],
                [90.0,0.0,0.0],
                [1.0,1.0,1.0]
            );
        }

        trackGroup.addChild(hubs);
        this.entitiesList.push(hubs);

        const rollers = new Cyclinder({
            mode:"basic",
            radius:0.20,
            height:0.38
        });

        rollers.setRotation(90.0,0.0,0.0);
        rollers.setColor(0.045,0.055,0.022);

        const rollerPositions = [-1.85,-0.60,0.65,1.90];

        for(const x of rollerPositions) {
            rollers.addInstance(
                [x,0.62,0.0],
                [90.0,0.0,0.0],
                [1.0,1.0,1.0]
            );
        }

        trackGroup.addChild(rollers);
        this.entitiesList.push(rollers);

        const wheelRotation = new AnimationTrack("rotation","vec3",[
            {time:0.0,value:[0.0,0.0,0.0]},
            {time:2.0,value:[0.0,360.0,0.0]},
            {time:4.0,value:[0.0,720.0,0.0]}
        ]);

        this.animate(
            wheels,
            this.createClip("WheelRotation",[wheelRotation])
        );
    }

    // =========================================================
    // TURRET
    // =========================================================

    createTurret(parent) {
        const turretPivot = new Node();

        turretPivot.setPosition(0.0,1.0,0.0);

        parent.addChild(turretPivot);
        this.entitiesList.push(turretPivot);

        const turretRotation = new AnimationTrack("rotation","vec3",[
            {time:0.0,value:[0.0,-38.0,0.0]},
            {time:4.0,value:[0.0,38.0,0.0]},
            {time:8.0,value:[0.0,-38.0,0.0]}
        ]);

        this.animate(
            turretPivot,
            this.createClip("TurretScan",[turretRotation])
        );

        const turretBase = new Cyclinder({
            mode:"basic",
            radius:1.4,
            height:0.40
        });

        turretBase.setPosition(0.0,-0.08,0.0);
        turretBase.setColor(0.17,0.26,0.08);

        turretPivot.addChild(turretBase);
        this.entitiesList.push(turretBase);

        const turret = new Cube({mode:"basic"});

        turret.setPosition(-0.05,0.25,0.0);
        turret.setScale(1.60,0.62,1.12);
        turret.setRotation(0.0,0.0,-3.0);
        turret.setColor(0.27,0.40,0.13);

        turretPivot.addChild(turret);
        this.entitiesList.push(turret);

        const turretFront = new Cube({mode:"basic"});

        turretFront.setPosition(1.20,0.20,0.0);
        turretFront.setScale(0.38,0.48,1.00);
        turretFront.setRotation(0.0,0.0,-10.0);
        turretFront.setColor(0.30,0.43,0.15);

        turretPivot.addChild(turretFront);
        this.entitiesList.push(turretFront);

        const bustle = new Cube({mode:"basic"});

        bustle.setPosition(-1.05,0.12,0.0);
        bustle.setScale(0.62,0.42,0.92);
        bustle.setColor(0.21,0.32,0.10);

        turretPivot.addChild(bustle);
        this.entitiesList.push(bustle);

        const roof = new Cube({mode:"basic"});

        roof.setPosition(-0.05,0.58,0.0);
        roof.setScale(1.45,0.10,1.00);
        roof.setColor(0.19,0.29,0.08);

        turretPivot.addChild(roof);
        this.entitiesList.push(roof);

        const cupola = new Cyclinder({
            mode:"basic",
            radius:0.42,
            height:0.30
        });

        cupola.setPosition(-0.45,0.65,0.00);
        cupola.setColor(0.11,0.17,0.05);

        turretPivot.addChild(cupola);
        this.entitiesList.push(cupola);

        const hatch = new Cyclinder({
            mode:"basic",
            radius:0.30,
            height:0.07
        });

        hatch.setPosition(0.0,0.18,0.0);
        hatch.setColor(0.025,0.032,0.012);

        cupola.addChild(hatch);
        this.entitiesList.push(hatch);

        const periscopes = new Cube({mode:"basic"});

        periscopes.setPosition(0.18,-0.3,0.0);
        periscopes.setScale(0.08,0.12,0.08);
        periscopes.setColor(0.025,0.035,0.012);

        periscopes.addInstance([0.18,-0.3,-0.22],[0,0,0],[0.08,0.12,0.08]);
        periscopes.addInstance([0.18,-0.3,0.22],[0,0,0],[0.08,0.12,0.08]);

        cupola.addChild(periscopes);
        this.entitiesList.push(periscopes);

        const gunPivot = new Node();

        gunPivot.setPosition(0.8,0.2,0.0);

        turretPivot.addChild(gunPivot);
        this.entitiesList.push(gunPivot);

        const gunRotation = new AnimationTrack("rotation","vec3",[
            {time:0.0,value:[0.0,0.0,-4.0]},
            {time:2.0,value:[0.0,0.0,5.0]},
            {time:4.0,value:[0.0,0.0,-4.0]}
        ]);

        this.animate(
            gunPivot,
            this.createClip("GunElevation",[gunRotation])
        );

        const mantlet = new Cube({mode:"basic"});

        mantlet.setPosition(0.0,0.0,0.0);
        mantlet.setScale(0.98,0.42,0.72);
        mantlet.setColor(0.12,0.18,0.055);

        gunPivot.addChild(mantlet);
        this.entitiesList.push(mantlet);

        const barrel = new Cube({mode:"basic"});

        barrel.setPosition(1.60,0.0,0.0);
        barrel.setScale(2.65,0.13,0.13);
        barrel.setColor(0.030,0.038,0.015);

        gunPivot.addChild(barrel);
        this.entitiesList.push(barrel);

        const collar = new Cyclinder({
            mode:"basic",
            radius:0.30,
            height:0.34
        });

        collar.setPosition(0.62,-0.2,0.0);
        collar.setRotation(0.0,90.0,0.0);
        collar.setColor(0.055,0.068,0.025);

        gunPivot.addChild(collar);
        this.entitiesList.push(collar);

        const muzzle = new Cube({mode:"basic"});

        muzzle.setPosition(3.0,0.0,0.0);
        muzzle.setScale(0.25,0.21,0.21);
        muzzle.setColor(0.020,0.025,0.010);

        gunPivot.addChild(muzzle);
        this.entitiesList.push(muzzle);

        const coax = new Cube({mode:"basic"});

        coax.setPosition(1.15,-0.23,0.58);
        coax.setScale(1.0,0.055,0.055);
        coax.setColor(0.025,0.030,0.012);

        gunPivot.addChild(coax);
        this.entitiesList.push(coax);

        this.createSmokeLauncher(turretPivot);
        this.createAntenna(turretPivot);
    }

    // =========================================================
    // SMOKE LAUNCHER
    // =========================================================

    createSmokeLauncher(parent) {
        const launcher = new Cyclinder({
            mode:"basic",
            radius:0.12,
            height:0.36
        });

        launcher.addInstance([0.45,0.45,0.62],[90,0,0],[1,1,1]);
        launcher.addInstance([0.45,0.45,-0.62],[-90,0,0],[1,1,1]);
        launcher.setColor(0.035,0.045,0.018);

        parent.addChild(launcher);
        this.entitiesList.push(launcher);
    }

    // =========================================================
    // ANTENNA + FLAG
    // =========================================================

    createAntenna(parent) {
        const antenna = new Cyclinder({
            mode:"basic",
            radius:0.025,
            height:1.80
        });

        antenna.setPosition(-0.85,0.3,-0.65);
        antenna.setRotation(0.0,0.0,-7.0);
        antenna.setColor(0.025,0.032,0.012);

        parent.addChild(antenna);
        this.entitiesList.push(antenna);

        const flagNode = new Node();

        flagNode.setPosition(0.0,1.5,0.0);
        flagNode.setRotation(0.0,180.0,0.0);

        antenna.addChild(flagNode);
        this.entitiesList.push(flagNode);

        const flagTexture = new Plane({mode:"texture"});

        flagTexture.setTexture("sckorpioLogoTransparent");
        flagTexture.addInstance([0.5,0,0],[0,0,0],[0.9,0.6,1]);

        flagNode.addChild(flagTexture);
        this.entitiesList.push(flagTexture);
    }

    //#########################################################
    // HELICOPTER
    //#########################################################

    // =========================================================
    // HELICOPTER
    // =========================================================

    createHelicopter() {
        const helicopter = new Node();
        helicopter.setPosition(0.0,5.0,0.0);
        this.entitiesList.push(helicopter);

        // Helicopter instances
        helicopter.addInstance([-20,10,0],[0,180,0],[1,1,1]);
        helicopter.addInstance([0,10,0],[0,0,0],[1,1,1]);
        helicopter.addInstance([20,10,0],[0,45,0],[1,1,1]);

        // =====================================================
        // FLIGHT ANIMATION
        // =====================================================

        const flightPosition = new AnimationTrack("position","vec3",[
            {time:0.0,value:[0.0,0.0,0.0]},
            {time:4.0,value:[20.0,0.0,0.0]},
            {time:8.0,value:[20.0,0.0,20.0]},
            {time:12.0,value:[0.0,0.0,20.0]},
            {time:16.0,value:[0.0,0.0,0.0]}
        ]);

        const flightRotation = new AnimationTrack("rotation","vec3",[
            {time:0.0,value:[0.0,0.0,0.0]},
            {time:4.0,value:[-10.0,-90.0,0.0]},
            {time:8.0,value:[0.0,-180.0,0.0]},
            {time:12.0,value:[-10.0,-270.0,0.0]},
            {time:16.0,value:[0.0,-360.0,0.0]}
        ]);

        this.animate(
            helicopter,
            this.createClip("Flight",[flightPosition,flightRotation])
        );

        // =====================================================
        // FUSELAGE
        // =====================================================

        const fuselage = new Node();
        helicopter.addChild(fuselage);
        this.entitiesList.push(fuselage);

        this.createFuselage(fuselage);
        this.createCockpit(fuselage);
        this.createEngine(fuselage);
        this.createLandingGear(fuselage);

        // =====================================================
        // TAIL
        // =====================================================

        this.createTail(helicopter);

        // =====================================================
        // MAIN ROTOR
        // =====================================================

        this.createMainRotor(helicopter);

        // =====================================================
        // TAIL ROTOR
        // =====================================================

        this.createTailRotor(helicopter);
    }

    // =========================================================
    // FUSELAGE
    // =========================================================

    createFuselage(parent) {
        // Main body
        const body = new Cube({mode:"basic"});
        body.setPosition(-0.5,0.1,0.0);
        body.setScale(2.7,1.2,1.4);
        body.setColor(0.18,0.25,0.10);
        parent.addChild(body);
        this.entitiesList.push(body);

        // Upper fuselage
        const upper = new Cube({mode:"basic"});
        upper.setPosition(-0.55,0.72,0.0);
        upper.setScale(2.8,0.35,0.88);
        upper.setColor(0.23,0.31,0.13);
        parent.addChild(upper);
        this.entitiesList.push(upper);

        // Belly
        const belly = new Cube({mode:"basic"});
        belly.setPosition(-0.30,-0.47,0.0);
        belly.setScale(3.0,0.10,0.85);
        belly.setColor(0.08,0.12,0.045);
        parent.addChild(belly);
        this.entitiesList.push(belly);

        // Rear body
        const rear = new Cube({mode:"basic"});
        rear.setPosition(-1.90,0.4,0.0);
        rear.setScale(2.0,0.82,0.85);
        rear.setColor(0.14,0.21,0.08);
        parent.addChild(rear);
        this.entitiesList.push(rear);

        // Side panels
        const sidePanel = new Cube({mode:"basic"});
        sidePanel.setColor(0.12,0.18,0.065);
        sidePanel.addInstance([-0.5,0.05,-0.7],[0.0,0.0,0.0],[1.85,0.92,0.15]);
        sidePanel.addInstance([-0.5,0.05,0.7],[0.0,0.0,0.0],[1.85,0.92,0.15]);
        parent.addChild(sidePanel);
        this.entitiesList.push(sidePanel);

        // Side doors
        const sideDoor = new Cube({mode:"basic"});
        sideDoor.setColor(0.16,0.23,0.085);
        sideDoor.addInstance([-0.5,0.05,-0.9],[0.0,0.0,0.0],[0.80,0.65,0.035]);
        sideDoor.addInstance([-0.5,0.05,0.9],[0.0,0.0,0.0],[0.80,0.65,0.035]);
        parent.addChild(sideDoor);
        this.entitiesList.push(sideDoor);
    }

    // =========================================================
    // COCKPIT
    // =========================================================

    createCockpit(parent) {
        const cockpit = new Node();
        cockpit.setPosition(1.0,0.15,0.0);
        parent.addChild(cockpit);
        this.entitiesList.push(cockpit);

        // Nose
        const nose = new Sphere({mode:"basic",radius:1.0});
        nose.setPosition(0.15,-0.2,0.0);
        nose.setScale(1.5,0.52,0.95);
        nose.setColor(0.18,0.25,0.10);
        cockpit.addChild(nose);
        this.entitiesList.push(nose);

        // Windshield
        const windshield = new Sphere({mode:"basic",radius:1.0});
        windshield.setPosition(0.0,0.3,0.0);
        windshield.setScale(1.0,0.7,0.9);
        windshield.setColor(0.06,0.16,0.18);
        cockpit.addChild(windshield);
        this.entitiesList.push(windshield);

        // Central windshield frame
        const frame = new Cube({mode:"basic"});
        frame.setPosition(0.96,0.25,0.0);
        frame.setScale(0.06,0.55,0.07);
        frame.setColor(0.025,0.035,0.015);
        cockpit.addChild(frame);
        this.entitiesList.push(frame);

        // Side window frames
        const sideFrame = new Cube({mode:"basic"});
        sideFrame.setColor(0.06,0.09,0.03);
        sideFrame.addInstance([0.35,0.38,-0.80],[0.0,0.0,0.0],[0.88,0.055,0.055]);
        sideFrame.addInstance([0.35,0.38,0.80],[0.0,0.0,0.0],[0.88,0.055,0.055]);
        cockpit.addChild(sideFrame);
        this.entitiesList.push(sideFrame);

        // Nose lights
        const light = new Sphere({mode:"basic",radius:0.12});
        light.setColor(0.9,0.75,0.25);
        light.addInstance([1.4,-0.25,-0.45],[0.0,0.0,0.0],[1.0,1.0,1.0]);
        light.addInstance([1.4,-0.25,0.45],[0.0,0.0,0.0],[1.0,1.0,1.0]);
        cockpit.addChild(light);
        this.entitiesList.push(light);
    }

    // =========================================================
    // ENGINE
    // =========================================================

    createEngine(parent) {
        const engine = new Cube({mode:"basic"});
        engine.setPosition(-0.35,1.05,0.0);
        engine.setScale(2.5,0.4,0.8);
        engine.setColor(0.12,0.18,0.065);
        parent.addChild(engine);
        this.entitiesList.push(engine);

        const cover = new Cube({mode:"basic"});
        cover.setPosition(0.0,0.52,0.0);
        cover.setScale(0.95,0.30,0.70);
        cover.setColor(0.07,0.10,0.04);
        engine.addChild(cover);
        this.entitiesList.push(cover);

        const intake = new Cube({mode:"basic"});
        intake.setPosition(0.42,0.5,0.0);
        intake.setScale(0.28,0.48,0.62);
        intake.setColor(0.025,0.035,0.015);
        engine.addChild(intake);
        this.entitiesList.push(intake);

        const exhaust = new Cyclinder({
            mode:"basic",
            radius:0.22,
            height:0.88
        });

        exhaust.setRotation(0.0,0.0,90.0);
        exhaust.setColor(0.025,0.035,0.015);
        exhaust.addInstance([-1.10,0.75,-0.58],[0.0,0.0,90.0],[1.0,1.0,1.0]);
        exhaust.addInstance([-1.10,0.75,0.58],[0.0,0.0,90.0],[1.0,1.0,1.0]);
        parent.addChild(exhaust);
        this.entitiesList.push(exhaust);

        const mast = new Cyclinder({
            mode:"basic",
            radius:0.17,
            height:0.75
        });

        mast.setPosition(-0.15,1.0,0.0);
        mast.setColor(0.055,0.075,0.025);
        parent.addChild(mast);
        this.entitiesList.push(mast);

        const collar = new Cyclinder({
            mode:"basic",
            radius:0.30,
            height:0.18
        });

        collar.setPosition(-0.15,1.25,0.0);
        collar.setColor(0.10,0.15,0.05);
        parent.addChild(collar);
        this.entitiesList.push(collar);
    }

    // =========================================================
    // LANDING GEAR
    // =========================================================

    createLandingGear(parent) {
        const skidGroup = new Node();

        skidGroup.addInstance([0.0,-1.2,-0.75],[0.0,0.0,0.0],[1.0,1.0,1.0]);
        skidGroup.addInstance([0.0,-1.2,0.75],[0.0,0.0,0.0],[1.0,1.0,1.0]);

        parent.addChild(skidGroup);
        this.entitiesList.push(skidGroup);

        const rail = new Cube({mode:"basic"});
        rail.setPosition(-0.10,0.15,0.0);
        rail.setScale(2.5,0.09,0.09);
        rail.setColor(0.015,0.025,0.055);
        skidGroup.addChild(rail);
        this.entitiesList.push(rail);

        const frontStrut = new Cube({mode:"basic"});
        frontStrut.setPosition(0.95,0.48,0.0);
        frontStrut.setScale(0.09,0.75,0.09);
        frontStrut.setRotation(0.0,0.0,15.0);
        frontStrut.setColor(0.015,0.025,0.055);
        skidGroup.addChild(frontStrut);
        this.entitiesList.push(frontStrut);

        const rearStrut = new Cube({mode:"basic"});
        rearStrut.setPosition(-0.95,0.48,0.0);
        rearStrut.setScale(0.09,0.75,0.09);
        rearStrut.setRotation(0.0,0.0,-15.0);
        rearStrut.setColor(0.015,0.025,0.055);
        skidGroup.addChild(rearStrut);
        this.entitiesList.push(rearStrut);
    }

    // =========================================================
    // TAIL
    // =========================================================

    createTail(parent) {
        const tail = new Node();
        tail.setPosition(-1.90,0.15,0.0);
        parent.addChild(tail);
        this.entitiesList.push(tail);

        const boom = new Cube({mode:"basic"});
        boom.setPosition(-2.00,0.0,0.0);
        boom.setScale(4.20,0.28,0.32);
        boom.setRotation(0.0,0.0,-2.0);
        boom.setColor(0.14,0.21,0.08);
        tail.addChild(boom);
        this.entitiesList.push(boom);

        const rearBoom = new Cube({mode:"basic"});
        rearBoom.setPosition(-4.05,1.0,0.0);
        rearBoom.setScale(0.65,1.8,0.08);
        rearBoom.setRotation(0.0,0.0,15.0);
        rearBoom.setColor(0.10,0.15,0.055);
        tail.addChild(rearBoom);
        this.entitiesList.push(rearBoom);

        const fin = new Cube({mode:"basic"});
        fin.setPosition(-4.15,0.72,0.0);
        fin.setScale(0.55,0.95,0.10);
        fin.setRotation(0.0,0.0,-12.0);
        fin.setColor(0.12,0.18,0.065);
        tail.addChild(fin);
        this.entitiesList.push(fin);

        const stabilizer = new Cube({mode:"basic"});
        stabilizer.setPosition(-3.70,0.0,0.0);
        stabilizer.setScale(0.65,0.07,1.65);
        stabilizer.setColor(0.12,0.18,0.065);
        tail.addChild(stabilizer);
        this.entitiesList.push(stabilizer);
    }

    // =========================================================
    // MAIN ROTOR
    // =========================================================

    createMainRotor(parent) {
        const rotorPivot = new Node();
        rotorPivot.setPosition(-0.15,1.5,0.0);
        parent.addChild(rotorPivot);
        this.entitiesList.push(rotorPivot);

        const rotation = new AnimationTrack("rotation","vec3",[
            {time:0.0,value:[0.0,0.0,0.0]},
            {time:1.0,value:[0.0,360.0,0.0]},
            {time:2.0,value:[0.0,720.0,0.0]},
            {time:3.0,value:[0.0,1080.0,0.0]}
        ]);

        this.animate(
            rotorPivot,
            this.createClip("MainRotor",[rotation])
        );

        rotorPivot.animationComponent.setSpeed(2.0);

        const hub = new Cyclinder({
            mode:"basic",
            radius:0.30,
            height:0.22
        });

        hub.setColor(0.035,0.045,0.015);
        rotorPivot.addChild(hub);
        this.entitiesList.push(hub);

        const blade = new Cube({mode:"basic"});
        blade.setColor(0.022,0.030,0.010);

        blade.addInstance([2.0,0.0,0.0],[0.0,0.0,0.0],[4.0,0.055,0.14]);
        blade.addInstance([0.0,0.0,2.0],[0.0,90.0,0.0],[4.0,0.055,0.14]);
        blade.addInstance([-2.0,0.0,0.0],[0.0,180.0,0.0],[4.0,0.055,0.14]);
        blade.addInstance([0.0,0.0,-2.0],[0.0,270.0,0.0],[4.0,0.055,0.14]);

        rotorPivot.addChild(blade);
        this.entitiesList.push(blade);

        const cap = new Cyclinder({
            mode:"basic",
            radius:0.16,
            height:0.03
        });

        cap.setPosition(0.0,0.15,0.0);
        cap.setColor(0.12,0.16,0.05);
        rotorPivot.addChild(cap);
        this.entitiesList.push(cap);
    }

    // =========================================================
    // TAIL ROTOR
    // =========================================================

    createTailRotor(parent) {
        const rotorPivot = new Node();

        rotorPivot.setPosition(-6.05,1.8,0.2);
        rotorPivot.setRotation(-90.0,0.0,0.0);

        parent.addChild(rotorPivot);
        this.entitiesList.push(rotorPivot);

        const rotation = new AnimationTrack("rotation","vec3",[
            {time:0.0,value:[0.0,0.0,0.0]},
            {time:1.0,value:[0.0,360.0,0.0]},
            {time:2.0,value:[0.0,720.0,0.0]},
            {time:3.0,value:[0.0,1080.0,0.0]}
        ]);

        this.animate(
            rotorPivot,
            this.createClip("TailRotor",[rotation])
        );

        rotorPivot.animationComponent.setSpeed(2.0);

        const hub = new Cyclinder({
            mode:"basic",
            radius:0.20,
            height:0.20
        });

        hub.setColor(0.025,0.035,0.015);
        rotorPivot.addChild(hub);
        this.entitiesList.push(hub);

        const blade = new Cube({mode:"basic"});
        blade.setColor(0.025,0.035,0.015);

        blade.addInstance([0.475,0.0,0.0],[0.0,0.0,0.0],[0.95,0.045,0.09]);
        blade.addInstance([0.0,0.0,0.475],[0.0,90.0,0.0],[0.95,0.045,0.09]);
        blade.addInstance([-0.475,0.0,0.0],[0.0,180.0,0.0],[0.95,0.045,0.09]);
        blade.addInstance([0.0,0.0,-0.475],[0.0,270.0,0.0],[0.95,0.045,0.09]);

        rotorPivot.addChild(blade);
        this.entitiesList.push(blade);
    }
}

export {
    Scene
};