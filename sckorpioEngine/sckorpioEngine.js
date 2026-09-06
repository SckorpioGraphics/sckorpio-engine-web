import { SckorpioScene } from "./core/scene/sckorpioScene.js";
import { Cube } from "./core/ecs/entity/entities/mesh/primitives/cube.js";
import { Sphere } from "./core/ecs/entity/entities/mesh/primitives/sphere.js";
import { Cone } from "./core/ecs/entity/entities/mesh/primitives/cone.js";
import { Cylinder } from "./core/ecs/entity/entities/mesh/primitives/cylinder.js";
import { Star } from "./core/ecs/entity/entities/mesh/primitives/star.js";
import { Plane } from "./core/ecs/entity/entities/mesh/primitives/plane.js";
import { Node } from "./core/ecs/entity/entities/node/node.js";
import { AnimationClip } from "./core/ecs/system/animation/animationClip.js";
import { AnimationTrack } from "./core/ecs/system/animation/animationTrack.js";

const Sckorpio = {
    Scene: SckorpioScene,
    Node,
    Cube,
    Sphere,
    Cone,
    Cylinder,
    Star,
    Plane,
    AnimationClip,
    AnimationTrack
};

export {
    Sckorpio
};

