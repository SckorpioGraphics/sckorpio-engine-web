import { Cube } from "../../sckorpioEngineWeb/core/ecs/entity/entities/mesh/primitives/cube.js";
import { SckorpioScene } from "../../sckorpioEngineWeb/core/scene/sckorpioScene.js";
import { AnimationClip } from "../../sckorpioEngineWeb/core/ecs/system/animation/animationClip.js";
import { AnimationTrack } from "../../sckorpioEngineWeb/core/ecs/system/animation/animationTrack.js";

class Scene extends SckorpioScene {

    constructor(projectName) {

        super();

        this.projectName = projectName;
    }


    async initResources() {

        // No custom resources required
    }


    // =========================================================
    // Create 3x3 instance group
    // =========================================================

    createInstanceGroup(cube, position, spacing = 2.0) {

        const offsets = [-spacing, 0.0, spacing];

        for(let x = 0; x < 3; x++) {

            for(let z = 0; z < 3; z++) {

                cube.addInstance(
                    [
                        position[0] + offsets[x],
                        position[1] + 0.0,
                        position[2] + offsets[z]
                    ],
                    [0.0, 0.0, 0.0],
                    [1.0, 1.0, 1.0]
                );
            }
        }
    }


    // =========================================================
    // Create Position Track
    // =========================================================

    createPositionTrack(height = 3.0) {

        const track =
            new AnimationTrack(
                "position",
                "vec3"
            );

        track.addKeyFrame(
            0.0,
            [0.0, 0.0, 0.0]
        );

        track.addKeyFrame(
            2.0,
            [0.0, height, 0.0]
        );

        track.addKeyFrame(
            4.0,
            [0.0, 0.0, 0.0]
        );

        return track;
    }


    // =========================================================
    // Create Rotation Track
    // =========================================================

    createRotationTrack() {

        const track =
            new AnimationTrack(
                "rotation",
                "vec3"
            );

        track.addKeyFrame(
            0.0,
            [0.0, 0.0, 0.0]
        );

        track.addKeyFrame(
            2.0,
            [0.0, 0.0, 180.0]
        );

        track.addKeyFrame(
            4.0,
            [0.0, 0.0, 360.0]
        );

        return track;
    }


    // =========================================================
    // Create Scale Track
    // =========================================================

    createScaleTrack() {

        const track =
            new AnimationTrack(
                "scale",
                "vec3"
            );

        track.addKeyFrame(
            0.0,
            [1.0, 1.0, 1.0]
        );

        track.addKeyFrame(
            2.0,
            [2.0, 2.0, 2.0]
        );

        track.addKeyFrame(
            4.0,
            [1.0, 1.0, 1.0]
        );

        return track;
    }


    // =========================================================
    // Create Animated Instance Group
    // =========================================================

    createAnimatedGroup(
        position,
        color,
        animationType
    ) {

        const cube =
            new Cube({
                mode: "basic"
            });


        // Source/group position
        cube.setPosition(
            position[0],
            position[1],
            position[2]
        );


        cube.setColor(
            color[0],
            color[1],
            color[2]
        );


        // Create 3x3 instances
        this.createInstanceGroup(
            cube,
            position,
            1.5
        );


        // Animation Component
        cube.addAnimationComponent();


        // Animation Clip
        const clip =
            new AnimationClip(
                animationType
            );


        // -----------------------------------------------------
        // Position
        // -----------------------------------------------------

        if(
            animationType === "Position" ||
            animationType === "PositionRotation" ||
            animationType === "PositionScale" ||
            animationType === "PositionRotationScale"
        ) {

            clip.addTrack(
                this.createPositionTrack()
            );
        }


        // -----------------------------------------------------
        // Rotation
        // -----------------------------------------------------

        if(
            animationType === "Rotation" ||
            animationType === "PositionRotation" ||
            animationType === "RotationScale" ||
            animationType === "PositionRotationScale"
        ) {

            clip.addTrack(
                this.createRotationTrack()
            );
        }


        // -----------------------------------------------------
        // Scale
        // -----------------------------------------------------

        if(
            animationType === "Scale" ||
            animationType === "PositionScale" ||
            animationType === "RotationScale" ||
            animationType === "PositionRotationScale"
        ) {

            clip.addTrack(
                this.createScaleTrack()
            );
        }


        // Assign animation
        cube.animationComponent.setClip(
            clip
        );


        // Play
        cube.animationComponent.play();


        // Add source mesh to scene
        this.entitiesList.push(
            cube
        );


        return cube;
    }


    async createScene() {

        // =====================================================
        // GROUP LAYOUT
        // =====================================================

        /*
        
                 GROUP 1        GROUP 2        GROUP 3        GROUP 4

                POSITION        ROTATION        SCALE       POS + ROT


                 GROUP 5        GROUP 6        GROUP 7

                POS + SCALE     ROT + SCALE        ALL

        */


        // =====================================================
        // GROUP 1
        // POSITION
        // =====================================================

        this.createAnimatedGroup(
            [-10.0, 0.0, -5.0],
            [1.0, 0.0, 0.0],
            "Position"
        );


        // =====================================================
        // GROUP 2
        // ROTATION
        // =====================================================

        this.createAnimatedGroup(
            [0.0, 0.0, -5.0],
            [0.0, 1.0, 0.0],
            "Rotation"
        );


        // =====================================================
        // GROUP 3
        // SCALE
        // =====================================================

        this.createAnimatedGroup(
            [10.0, 0.0, -5.0],
            [0.0, 0.0, 1.0],
            "Scale"
        );


        // =====================================================
        // GROUP 4
        // POSITION + ROTATION
        // =====================================================

        this.createAnimatedGroup(
            [-10.0, 0.0, 5.0],
            [1.0, 1.0, 0.0],
            "PositionRotation"
        );


        // =====================================================
        // GROUP 5
        // POSITION + SCALE
        // =====================================================

        this.createAnimatedGroup(
            [0.0, 0.0, 5.0],
            [1.0, 0.0, 1.0],
            "PositionScale"
        );


        // =====================================================
        // GROUP 6
        // ROTATION + SCALE
        // =====================================================

        this.createAnimatedGroup(
            [10.0, 0.0, 5.0],
            [0.0, 1.0, 1.0],
            "RotationScale"
        );


        // =====================================================
        // GROUP 7
        // POSITION + ROTATION + SCALE
        // =====================================================

        this.createAnimatedGroup(
            [0.0, 0.0, 15.0],
            [1.0, 1.0, 1.0],
            "PositionRotationScale"
        );
        
    }
}


export {
    Scene
};