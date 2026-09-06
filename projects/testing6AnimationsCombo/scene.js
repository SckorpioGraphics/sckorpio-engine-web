import { Sckorpio } from "../../sckorpioEngine.js";

class Scene extends Sckorpio.Scene {

    constructor(projectName) {
        super();

        this.projectName = projectName;
    }


    async initResources() {

        // No custom resources required
    }


    // =========================================================
    // Helper: Create Animation Clip
    // =========================================================

    createClip(property, values) {

        const track =
            new Sckorpio.AnimationTrack(
                property,
                "vec3"
            );


        track.addKeyFrame(
            0.0,
            values[0]
        );

        track.addKeyFrame(
            2.0,
            values[1]
        );

        track.addKeyFrame(
            4.0,
            values[2]
        );


        const clip =
            new Sckorpio.AnimationClip(
                property
            );

        clip.addTrack(track);

        return clip;
    }


    async createScene() {

        // =====================================================
        // RED
        // Translating Parent
        // =====================================================

        const red =
            new Sckorpio.Cube({
                mode: "basic"
            });


        red.setColor(
            1.0,
            0.0,
            0.0
        );


        // Original/local transform of RED
        red.setPosition(
            -6.0,
            0.5,
            0.0
        );


        // -----------------------------------------------------
        // RED Animation
        // Position
        // -----------------------------------------------------

        red.addAnimationComponent();


        const redClip =
            this.createClip(
                "position",
                [
                    [0.0, 0.0, 0.0],
                    [0.0, 3.0, 0.0],
                    [0.0, 0.0, 0.0]
                ]
            );


        red.animationComponent.setClip(
            redClip
        );

        red.animationComponent.play();


        // -----------------------------------------------------
        // RED INSTANCES
        // -----------------------------------------------------

        // Red instance 1
        red.addInstance(
            [6.0, 0.0, 0.0],
            [0.0, 0.0, 0.0],
            [1.0, 1.0, 1.0]
        );


        // Red instance 2
        red.addInstance(
            [0.0, 0.0, 8.0],
            [0.0, 45.0, 0.0],
            [1.0, 1.0, 1.0]
        );


        // =====================================================
        // GREEN
        // Rotating Child of RED
        // =====================================================

        const green =
            new Sckorpio.Cube({
                mode: "basic"
            });


        green.setColor(
            0.0,
            1.0,
            0.0
        );


        // Green is positioned relative to RED
        green.setPosition(
            0.0,
            2.0,
            0.0
        );


        // -----------------------------------------------------
        // GREEN Animation
        // Rotation
        // -----------------------------------------------------

        green.addAnimationComponent();


        const greenClip =
            this.createClip(
                "rotation",
                [
                    [0.0, 0.0, 0.0],
                    [0.0, 0.0, 180.0],
                    [0.0, 0.0, 360.0]
                ]
            );


        green.animationComponent.setClip(
            greenClip
        );

        green.animationComponent.play();


        // -----------------------------------------------------
        // GREEN INSTANCES
        // -----------------------------------------------------

        /*
            These are LOCAL instances of GREEN.

            Because RED itself has 2 instances:

                RED instances = 2
                GREEN local instances = 4

            Final GREEN instances:

                2 × 4 = 8
        */

        green.addInstance(
            [-2.0, 0.0, -2.0],
            [0.0, 0.0, 0.0],
            [0.7, 0.7, 0.7]
        );


        green.addInstance(
            [2.0, 0.0, -2.0],
            [0.0, 0.0, 0.0],
            [0.7, 0.7, 0.7]
        );


        green.addInstance(
            [-2.0, 0.0, 2.0],
            [0.0, 0.0, 0.0],
            [0.7, 0.7, 0.7]
        );


        green.addInstance(
            [2.0, 0.0, 2.0],
            [0.0, 0.0, 0.0],
            [0.7, 0.7, 0.7]
        );


        // =====================================================
        // BLUE
        // Scaling Child of GREEN
        // =====================================================

        const blue =
            new Sckorpio.Cube({
                mode: "basic"
            });


        blue.setColor(
            0.0,
            0.3,
            1.0
        );


        // Blue is relative to GREEN
        blue.setPosition(
            0.0,
            2.0,
            0.0
        );


        // -----------------------------------------------------
        // BLUE Animation
        // Scale
        // -----------------------------------------------------

        blue.addAnimationComponent();


        const blueClip =
            this.createClip(
                "scale",
                [
                    [1.0, 1.0, 1.0],
                    [2.0, 2.0, 2.0],
                    [1.0, 1.0, 1.0]
                ]
            );


        blue.animationComponent.setClip(
            blueClip
        );

        blue.animationComponent.play();


        // =====================================================
        // YELLOW
        // Child of BLUE
        // =====================================================

        const yellow =
            new Sckorpio.Cube({
                mode: "basic"
            });


        yellow.setColor(
            1.0,
            1.0,
            0.0
        );


        // Yellow is relative to BLUE
        yellow.setPosition(
            0.0,
            2.0,
            0.0
        );


        // Give Yellow a small local scale
        yellow.setScale(
            0.5,
            0.5,
            0.5
        );


        // =====================================================
        // SCENE GRAPH
        // =====================================================

        /*
        
            RED
             │
             └── GREEN
                   │
                   └── BLUE
                         │
                         └── YELLOW

        */

        red.addChild(
            green
        );

        green.addChild(
            blue
        );

        blue.addChild(
            yellow
        );


        // =====================================================
        // ADD ENTITIES
        // =====================================================

        this.entitiesList.push(
            red
        );

        this.entitiesList.push(
            green
        );

        this.entitiesList.push(
            blue
        );

        this.entitiesList.push(
            yellow
        );
    }
}


export {
    Scene
};