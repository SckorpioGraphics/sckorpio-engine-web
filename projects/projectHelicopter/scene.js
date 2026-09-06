import { Sckorpio } from "../../sckorpioEngine/sckorpioEngine.js";
class Scene extends Sckorpio.Scene {
    constructor(projectName) {
        super();
        this.projectName = projectName;
    }

    // =========================================================
    // ANIMATION HELPERS
    // =========================================================

    createClip(name, tracks) {
        const clip = new Sckorpio.AnimationClip(name);
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
    }

    // =========================================================
    // SCENE
    // =========================================================

    async createScene() {
        // this.createGround();
        this.createHelicopter();
    }

    // =========================================================
    // GROUND
    // =========================================================

    createGround() {
        const ground = new Sckorpio.Cube({mode: "basic"});
        ground.setPosition(0.0,-2.35,0.0);
        ground.setScale(25.0,0.10,18.0);
        ground.setColor(0.045,0.055,0.035);
        this.entitiesList.push(ground);
    }

    // =========================================================
    // HELICOPTER
    // =========================================================

    createHelicopter() {
        const helicopter = new Sckorpio.Node();
        helicopter.setPosition(0.0,5.0,0.0);
        this.entitiesList.push(helicopter);

        // Helicopter instances
        helicopter.addInstance([-20,3,0],[0,180,0],[1,1,1]);
        helicopter.addInstance([0,3,0],[0,0,0],[1,1,1]);
        helicopter.addInstance([20,3,0],[0,45,0],[1,1,1]);

        // =====================================================
        // FLIGHT ANIMATION
        // =====================================================

        const flightPosition = new Sckorpio.AnimationTrack("position","vec3",[
            {time:0.0,value:[0.0,0.0,0.0]},
            {time:4.0,value:[20.0,0.0,0.0]},
            {time:8.0,value:[20.0,0.0,20.0]},
            {time:12.0,value:[0.0,0.0,20.0]},
            {time:16.0,value:[0.0,0.0,0.0]}
        ]);

        const flightRotation = new Sckorpio.AnimationTrack("rotation","vec3",[
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

        const fuselage = new Sckorpio.Node();
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
        const body = new Sckorpio.Cube({mode:"basic"});
        body.setPosition(-0.5,0.1,0.0);
        body.setScale(2.7,1.2,1.4);
        body.setColor(0.18,0.25,0.10);
        parent.addChild(body);
        this.entitiesList.push(body);

        // Upper fuselage
        const upper = new Sckorpio.Cube({mode:"basic"});
        upper.setPosition(-0.55,0.72,0.0);
        upper.setScale(2.8,0.35,0.88);
        upper.setColor(0.23,0.31,0.13);
        parent.addChild(upper);
        this.entitiesList.push(upper);

        // Belly
        const belly = new Sckorpio.Cube({mode:"basic"});
        belly.setPosition(-0.30,-0.47,0.0);
        belly.setScale(3.0,0.10,0.85);
        belly.setColor(0.08,0.12,0.045);
        parent.addChild(belly);
        this.entitiesList.push(belly);

        // Rear body
        const rear = new Sckorpio.Cube({mode:"basic"});
        rear.setPosition(-1.90,0.4,0.0);
        rear.setScale(2.0,0.82,0.85);
        rear.setColor(0.14,0.21,0.08);
        parent.addChild(rear);
        this.entitiesList.push(rear);

        // Side panels
        const sidePanel = new Sckorpio.Cube({mode:"basic"});
        sidePanel.setColor(0.12,0.18,0.065);
        sidePanel.addInstance([-0.5,0.05,-0.7],[0.0,0.0,0.0],[1.85,0.92,0.15]);
        sidePanel.addInstance([-0.5,0.05,0.7],[0.0,0.0,0.0],[1.85,0.92,0.15]);
        parent.addChild(sidePanel);
        this.entitiesList.push(sidePanel);

        // Side doors
        const sideDoor = new Sckorpio.Cube({mode:"basic"});
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
        const cockpit = new Sckorpio.Node();
        cockpit.setPosition(1.0,0.15,0.0);
        parent.addChild(cockpit);
        this.entitiesList.push(cockpit);

        // Nose
        const nose = new Sckorpio.Sphere({mode:"basic",radius:1.0});
        nose.setPosition(0.15,-0.2,0.0);
        nose.setScale(1.5,0.52,0.95);
        nose.setColor(0.18,0.25,0.10);
        cockpit.addChild(nose);
        this.entitiesList.push(nose);

        // Windshield
        const windshield = new Sckorpio.Sphere({mode:"basic",radius:1.0});
        windshield.setPosition(0.0,0.3,0.0);
        windshield.setScale(1.0,0.7,0.9);
        windshield.setColor(0.06,0.16,0.18);
        cockpit.addChild(windshield);
        this.entitiesList.push(windshield);

        // Central windshield frame
        const frame = new Sckorpio.Cube({mode:"basic"});
        frame.setPosition(0.96,0.25,0.0);
        frame.setScale(0.06,0.55,0.07);
        frame.setColor(0.025,0.035,0.015);
        cockpit.addChild(frame);
        this.entitiesList.push(frame);

        // Side window frames
        const sideFrame = new Sckorpio.Cube({mode:"basic"});
        sideFrame.setColor(0.06,0.09,0.03);
        sideFrame.addInstance([0.35,0.38,-0.80],[0.0,0.0,0.0],[0.88,0.055,0.055]);
        sideFrame.addInstance([0.35,0.38,0.80],[0.0,0.0,0.0],[0.88,0.055,0.055]);
        cockpit.addChild(sideFrame);
        this.entitiesList.push(sideFrame);

        // Nose lights
        const light = new Sckorpio.Sphere({mode:"basic",radius:0.12});
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
        const engine = new Sckorpio.Cube({mode:"basic"});
        engine.setPosition(-0.35,1.05,0.0);
        engine.setScale(2.5,0.4,0.8);
        engine.setColor(0.12,0.18,0.065);
        parent.addChild(engine);
        this.entitiesList.push(engine);

        const cover = new Sckorpio.Cube({mode:"basic"});
        cover.setPosition(0.0,0.52,0.0);
        cover.setScale(0.95,0.30,0.70);
        cover.setColor(0.07,0.10,0.04);
        engine.addChild(cover);
        this.entitiesList.push(cover);

        const intake = new Sckorpio.Cube({mode:"basic"});
        intake.setPosition(0.42,0.5,0.0);
        intake.setScale(0.28,0.48,0.62);
        intake.setColor(0.025,0.035,0.015);
        engine.addChild(intake);
        this.entitiesList.push(intake);

        const exhaust = new Sckorpio.Cylinder({
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

        const mast = new Sckorpio.Cylinder({
            mode:"basic",
            radius:0.17,
            height:0.75
        });

        mast.setPosition(-0.15,1.0,0.0);
        mast.setColor(0.055,0.075,0.025);
        parent.addChild(mast);
        this.entitiesList.push(mast);

        const collar = new Sckorpio.Cylinder({
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
        const skidGroup = new Sckorpio.Node();

        skidGroup.addInstance([0.0,-1.2,-0.75],[0.0,0.0,0.0],[1.0,1.0,1.0]);
        skidGroup.addInstance([0.0,-1.2,0.75],[0.0,0.0,0.0],[1.0,1.0,1.0]);

        parent.addChild(skidGroup);
        this.entitiesList.push(skidGroup);

        const rail = new Sckorpio.Cube({mode:"basic"});
        rail.setPosition(-0.10,0.15,0.0);
        rail.setScale(2.5,0.09,0.09);
        rail.setColor(0.015,0.025,0.055);
        skidGroup.addChild(rail);
        this.entitiesList.push(rail);

        const frontStrut = new Sckorpio.Cube({mode:"basic"});
        frontStrut.setPosition(0.95,0.48,0.0);
        frontStrut.setScale(0.09,0.75,0.09);
        frontStrut.setRotation(0.0,0.0,15.0);
        frontStrut.setColor(0.015,0.025,0.055);
        skidGroup.addChild(frontStrut);
        this.entitiesList.push(frontStrut);

        const rearStrut = new Sckorpio.Cube({mode:"basic"});
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
        const tail = new Sckorpio.Node();
        tail.setPosition(-1.90,0.15,0.0);
        parent.addChild(tail);
        this.entitiesList.push(tail);

        const boom = new Sckorpio.Cube({mode:"basic"});
        boom.setPosition(-2.00,0.0,0.0);
        boom.setScale(4.20,0.28,0.32);
        boom.setRotation(0.0,0.0,-2.0);
        boom.setColor(0.14,0.21,0.08);
        tail.addChild(boom);
        this.entitiesList.push(boom);

        const rearBoom = new Sckorpio.Cube({mode:"basic"});
        rearBoom.setPosition(-4.05,1.0,0.0);
        rearBoom.setScale(0.65,1.8,0.08);
        rearBoom.setRotation(0.0,0.0,15.0);
        rearBoom.setColor(0.10,0.15,0.055);
        tail.addChild(rearBoom);
        this.entitiesList.push(rearBoom);

        const fin = new Sckorpio.Cube({mode:"basic"});
        fin.setPosition(-4.15,0.72,0.0);
        fin.setScale(0.55,0.95,0.10);
        fin.setRotation(0.0,0.0,-12.0);
        fin.setColor(0.12,0.18,0.065);
        tail.addChild(fin);
        this.entitiesList.push(fin);

        const stabilizer = new Sckorpio.Cube({mode:"basic"});
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
        const rotorPivot = new Sckorpio.Node();
        rotorPivot.setPosition(-0.15,1.5,0.0);
        parent.addChild(rotorPivot);
        this.entitiesList.push(rotorPivot);

        const rotation = new Sckorpio.AnimationTrack("rotation","vec3",[
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

        const hub = new Sckorpio.Cylinder({
            mode:"basic",
            radius:0.30,
            height:0.22
        });

        hub.setColor(0.035,0.045,0.015);
        rotorPivot.addChild(hub);
        this.entitiesList.push(hub);

        const blade = new Sckorpio.Cube({mode:"basic"});
        blade.setColor(0.022,0.030,0.010);

        blade.addInstance([2.0,0.0,0.0],[0.0,0.0,0.0],[4.0,0.055,0.14]);
        blade.addInstance([0.0,0.0,2.0],[0.0,90.0,0.0],[4.0,0.055,0.14]);
        blade.addInstance([-2.0,0.0,0.0],[0.0,180.0,0.0],[4.0,0.055,0.14]);
        blade.addInstance([0.0,0.0,-2.0],[0.0,270.0,0.0],[4.0,0.055,0.14]);

        rotorPivot.addChild(blade);
        this.entitiesList.push(blade);

        const cap = new Sckorpio.Cylinder({
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
        const rotorPivot = new Sckorpio.Node();

        rotorPivot.setPosition(-6.05,1.8,0.2);
        rotorPivot.setRotation(-90.0,0.0,0.0);

        parent.addChild(rotorPivot);
        this.entitiesList.push(rotorPivot);

        const rotation = new Sckorpio.AnimationTrack("rotation","vec3",[
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

        const hub = new Sckorpio.Cylinder({
            mode:"basic",
            radius:0.20,
            height:0.20
        });

        hub.setColor(0.025,0.035,0.015);
        rotorPivot.addChild(hub);
        this.entitiesList.push(hub);

        const blade = new Sckorpio.Cube({mode:"basic"});
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