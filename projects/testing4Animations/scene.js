import { Sckorpio } from "../../sckorpioEngine/sckorpioEngine.js";
class Scene extends Sckorpio.Scene {

    constructor(projectName) {

        super();

        this.projectName = projectName;
    }


    async initResources() {

        // No custom resources required
    }


    async createScene() {

        // =====================================================
        // ANIMATION TEST SETTINGS
        // =====================================================

        const duration = 4.0;


        // =====================================================
        // 1. POSITION
        // =====================================================

        const positionCube =
            new Sckorpio.Cube({
                mode: "basic"
            });

        positionCube.setPosition(
            -5.0,
            0.5,
            -3.0
        );

        positionCube.setColor(
            1.0,
            0.0,
            0.0
        );

        positionCube.addAnimationComponent();


        const positionTrack =
            new Sckorpio.AnimationTrack(
                "position",
                "vec3"
            );

        positionTrack.addKeyFrame(
            0.0,
            [0.0, 0.0, 0.0]
        );

        positionTrack.addKeyFrame(
            2.0,
            [0.0, 3.0, 0.0]
        );

        positionTrack.addKeyFrame(
            4.0,
            [0.0, 0.0, 0.0]
        );


        const positionClip =
            new Sckorpio.AnimationClip(
                "Position"
            );

        positionClip.addTrack(
            positionTrack
        );

        positionCube.animationComponent.setClip(
            positionClip
        );

        positionCube.animationComponent.play();


        this.entitiesList.push(
            positionCube
        );


        // =====================================================
        // 2. ROTATION
        // =====================================================

        const rotationCube =
            new Sckorpio.Cube({
                mode: "basic"
            });

        rotationCube.setPosition(
            0.0,
            0.5,
            -3.0
        );

        rotationCube.setColor(
            0.0,
            1.0,
            0.0
        );

        rotationCube.addAnimationComponent();


        const rotationTrack =
            new Sckorpio.AnimationTrack(
                "rotation",
                "vec3"
            );

        rotationTrack.addKeyFrame(
            0.0,
            [0.0, 0.0, 0.0]
        );

        rotationTrack.addKeyFrame(
            2.0,
            [0.0, 0.0, 180.0]
        );

        rotationTrack.addKeyFrame(
            4.0,
            [0.0, 0.0, 0.0]
        );


        const rotationClip =
            new Sckorpio.AnimationClip(
                "Rotation"
            );

        rotationClip.addTrack(
            rotationTrack
        );

        rotationCube.animationComponent.setClip(
            rotationClip
        );

        rotationCube.animationComponent.play();


        this.entitiesList.push(
            rotationCube
        );


        // =====================================================
        // 3. SCALE
        // =====================================================

        const scaleCube =
            new Sckorpio.Cube({
                mode: "basic"
            });

        scaleCube.setPosition(
            5.0,
            0.5,
            -3.0
        );

        scaleCube.setColor(
            0.0,
            0.0,
            1.0
        );

        scaleCube.addAnimationComponent();


        const scaleTrack =
            new Sckorpio.AnimationTrack(
                "scale",
                "vec3"
            );

        scaleTrack.addKeyFrame(
            0.0,
            [1.0, 1.0, 1.0]
        );

        scaleTrack.addKeyFrame(
            2.0,
            [2.0, 2.0, 2.0]
        );

        scaleTrack.addKeyFrame(
            4.0,
            [1.0, 1.0, 1.0]
        );


        const scaleClip =
            new Sckorpio.AnimationClip(
                "Scale"
            );

        scaleClip.addTrack(
            scaleTrack
        );

        scaleCube.animationComponent.setClip(
            scaleClip
        );

        scaleCube.animationComponent.play();


        this.entitiesList.push(
            scaleCube
        );


        // =====================================================
        // 4. POSITION + ROTATION
        // =====================================================

        const positionRotationCube =
            new Sckorpio.Cube({
                mode: "basic"
            });

        positionRotationCube.setPosition(
            -5.0,
            0.5,
            3.0
        );

        positionRotationCube.setColor(
            1.0,
            1.0,
            0.0
        );

        positionRotationCube.addAnimationComponent();


        const positionRotationPositionTrack =
            new Sckorpio.AnimationTrack(
                "position",
                "vec3"
            );

        positionRotationPositionTrack.addKeyFrame(
            0.0,
            [0.0, 0.0, 0.0]
        );

        positionRotationPositionTrack.addKeyFrame(
            2.0,
            [0.0, 2.0, 0.0]
        );

        positionRotationPositionTrack.addKeyFrame(
            4.0,
            [0.0, 0.0, 0.0]
        );


        const positionRotationRotationTrack =
            new Sckorpio.AnimationTrack(
                "rotation",
                "vec3"
            );

        positionRotationRotationTrack.addKeyFrame(
            0.0,
            [0.0, 0.0, 0.0]
        );

        positionRotationRotationTrack.addKeyFrame(
            2.0,
            [0.0, 0.0, 180.0]
        );

        positionRotationRotationTrack.addKeyFrame(
            4.0,
            [0.0, 0.0, 0.0]
        );


        const positionRotationClip =
            new Sckorpio.AnimationClip(
                "PositionRotation"
            );

        positionRotationClip.addTrack(
            positionRotationPositionTrack
        );

        positionRotationClip.addTrack(
            positionRotationRotationTrack
        );


        positionRotationCube.animationComponent.setClip(
            positionRotationClip
        );

        positionRotationCube.animationComponent.play();


        this.entitiesList.push(
            positionRotationCube
        );


        // =====================================================
        // 5. POSITION + SCALE
        // =====================================================

        const positionScaleCube =
            new Sckorpio.Cube({
                mode: "basic"
            });

        positionScaleCube.setPosition(
            0.0,
            0.5,
            3.0
        );

        positionScaleCube.setColor(
            1.0,
            0.0,
            1.0
        );

        positionScaleCube.addAnimationComponent();


        const positionScalePositionTrack =
            new Sckorpio.AnimationTrack(
                "position",
                "vec3"
            );

        positionScalePositionTrack.addKeyFrame(
            0.0,
            [0.0, 0.0, 0.0]
        );

        positionScalePositionTrack.addKeyFrame(
            2.0,
            [0.0, 2.0, 0.0]
        );

        positionScalePositionTrack.addKeyFrame(
            4.0,
            [0.0, 0.0, 0.0]
        );


        const positionScaleScaleTrack =
            new Sckorpio.AnimationTrack(
                "scale",
                "vec3"
            );

        positionScaleScaleTrack.addKeyFrame(
            0.0,
            [1.0, 1.0, 1.0]
        );

        positionScaleScaleTrack.addKeyFrame(
            2.0,
            [1.8, 1.8, 1.8]
        );

        positionScaleScaleTrack.addKeyFrame(
            4.0,
            [1.0, 1.0, 1.0]
        );


        const positionScaleClip =
            new Sckorpio.AnimationClip(
                "PositionScale"
            );

        positionScaleClip.addTrack(
            positionScalePositionTrack
        );

        positionScaleClip.addTrack(
            positionScaleScaleTrack
        );


        positionScaleCube.animationComponent.setClip(
            positionScaleClip
        );

        positionScaleCube.animationComponent.play();


        this.entitiesList.push(
            positionScaleCube
        );


        // =====================================================
        // 6. ROTATION + SCALE
        // =====================================================

        const rotationScaleCube =
            new Sckorpio.Cube({
                mode: "basic"
            });

        rotationScaleCube.setPosition(
            5.0,
            0.5,
            3.0
        );

        rotationScaleCube.setColor(
            0.0,
            1.0,
            1.0
        );

        rotationScaleCube.addAnimationComponent();


        const rotationScaleRotationTrack =
            new Sckorpio.AnimationTrack(
                "rotation",
                "vec3"
            );

        rotationScaleRotationTrack.addKeyFrame(
            0.0,
            [0.0, 0.0, 0.0]
        );

        rotationScaleRotationTrack.addKeyFrame(
            2.0,
            [0.0, 0.0, 180.0]
        );

        rotationScaleRotationTrack.addKeyFrame(
            4.0,
            [0.0, 0.0, 0.0]
        );


        const rotationScaleScaleTrack =
            new Sckorpio.AnimationTrack(
                "scale",
                "vec3"
            );

        rotationScaleScaleTrack.addKeyFrame(
            0.0,
            [1.0, 1.0, 1.0]
        );

        rotationScaleScaleTrack.addKeyFrame(
            2.0,
            [2.0, 2.0, 2.0]
        );

        rotationScaleScaleTrack.addKeyFrame(
            4.0,
            [1.0, 1.0, 1.0]
        );


        const rotationScaleClip =
            new Sckorpio.AnimationClip(
                "RotationScale"
            );

        rotationScaleClip.addTrack(
            rotationScaleRotationTrack
        );

        rotationScaleClip.addTrack(
            rotationScaleScaleTrack
        );


        rotationScaleCube.animationComponent.setClip(
            rotationScaleClip
        );

        rotationScaleCube.animationComponent.play();


        this.entitiesList.push(
            rotationScaleCube
        );


        // =====================================================
        // 7. POSITION + ROTATION + SCALE
        // =====================================================

        const allCube =
            new Sckorpio.Cube({
                mode: "basic"
            });

        allCube.setPosition(
            0.0,
            0.5,
            8.0
        );

        allCube.setColor(
            1.0,
            1.0,
            1.0
        );

        allCube.addAnimationComponent();


        // -----------------------------------------------------
        // Position
        // -----------------------------------------------------

        const allPositionTrack =
            new Sckorpio.AnimationTrack(
                "position",
                "vec3"
            );

        allPositionTrack.addKeyFrame(
            0.0,
            [0.0, 0.0, 0.0]
        );

        allPositionTrack.addKeyFrame(
            2.0,
            [0.0, 3.0, 0.0]
        );

        allPositionTrack.addKeyFrame(
            4.0,
            [0.0, 0.0, 0.0]
        );


        // -----------------------------------------------------
        // Rotation
        // -----------------------------------------------------

        const allRotationTrack =
            new Sckorpio.AnimationTrack(
                "rotation",
                "vec3"
            );

        allRotationTrack.addKeyFrame(
            0.0,
            [0.0, 0.0, 0.0]
        );

        allRotationTrack.addKeyFrame(
            2.0,
            [0.0, 0.0, 180.0]
        );

        allRotationTrack.addKeyFrame(
            4.0,
            [0.0, 0.0, 0.0]
        );


        // -----------------------------------------------------
        // Scale
        // -----------------------------------------------------

        const allScaleTrack =
            new Sckorpio.AnimationTrack(
                "scale",
                "vec3"
            );

        allScaleTrack.addKeyFrame(
            0.0,
            [1.0, 1.0, 1.0]
        );

        allScaleTrack.addKeyFrame(
            2.0,
            [2.0, 2.0, 2.0]
        );

        allScaleTrack.addKeyFrame(
            4.0,
            [1.0, 1.0, 1.0]
        );


        // -----------------------------------------------------
        // Clip
        // -----------------------------------------------------

        const allClip =
            new Sckorpio.AnimationClip(
                "PositionRotationScale"
            );

        allClip.addTrack(
            allPositionTrack
        );

        allClip.addTrack(
            allRotationTrack
        );

        allClip.addTrack(
            allScaleTrack
        );


        allCube.animationComponent.setClip(
            allClip
        );

        allCube.animationComponent.play();


        this.entitiesList.push(
            allCube
        );
    }
}


export {
    Scene
};