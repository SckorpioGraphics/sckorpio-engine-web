import { SckorpioScene } from "./sckorpioEngineWeb/core/scene/sckorpioScene.js";
import { Cube } from "./sckorpioEngineWeb/core/ecs/entity/entities/mesh/primitives/cube.js";
import { Sphere } from "./sckorpioEngineWeb/core/ecs/entity/entities/mesh/primitives/sphere.js";
import { Cone } from "./sckorpioEngineWeb/core/ecs/entity/entities/mesh/primitives/cone.js";
import { Cyclinder } from "./sckorpioEngineWeb/core/ecs/entity/entities/mesh/primitives/cyclinder.js";
import { Star } from "./sckorpioEngineWeb/core/ecs/entity/entities/mesh/primitives/star.js";
import { Plane } from "./sckorpioEngineWeb/core/ecs/entity/entities/mesh/primitives/plane.js";
import { Node } from "./sckorpioEngineWeb/core/ecs/entity/entities/node/node.js";
import { AnimationClip } from "./sckorpioEngineWeb/core/ecs/system/animation/animationClip.js";
import { AnimationTrack } from "./sckorpioEngineWeb/core/ecs/system/animation/animationTrack.js";

const Sckorpio = {
    Scene: SckorpioScene,
    Node,
    Cube,
    Sphere,
    Cone,
    Cyclinder,
    Star,
    Plane,
    AnimationClip,
    AnimationTrack
};

export {
    Sckorpio
};

