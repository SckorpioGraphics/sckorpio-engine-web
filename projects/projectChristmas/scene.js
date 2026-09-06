import { Sckorpio } from "../../sckorpioEngine.js";
class Scene extends Sckorpio.Scene {
    constructor(projectName) {
        super();
        this.projectName = projectName;
    }

    async initResources() {
        this.customTextureList = [
            "christmasTree",
            "christmasTree2",
            "christmasLeaf",
            "gift1",
            "gift2",
            "gift3",
            "gift4",
            "gift5",
            "sky",
            "sky2",
            "snowGround",
            "snowGround2"
        ];

        await this.textureBook.generateCustomTextures(
            this.projectName,
            this.customTextureList
        );
    }

    makeChristmasTree({
        scene,
        n = 6,
        basePos = vec3.fromValues(0, 0, 0),
        baseRadius = 5,
        totalHeight = 12,
        texture = "christmasTree",
        enableOrnaments = true
    }) {

        let currentY = basePos[1];

        

        for (let i = 0; i < n; i++) {

            const t = i / (n - 1);

            let radius = baseRadius * (1 - t * t);
            let height = (totalHeight / n) * (2.2 - t * 1.6);

            radius *= (0.95 + Math.random() * 0.1);
            height *= (0.9 + Math.random() * 0.2);

            let cone = new Sckorpio.Cone({ mode: "texture" });

            cone.setPosition(
                basePos[0],
                currentY,
                basePos[2]
            );

            cone.setScale(
                radius,
                height,
                radius
            );

            if (texture)
                cone.setTexture(texture);

            scene.entitiesList.push(cone);

    /*
    --------------------------------------------------
    ORNAMENTS ON THIS CONE
    --------------------------------------------------
    */

        const ornamentCount = Math.max(8, Math.floor(radius * 2.5));

        for (let j = 0; j < ornamentCount; j++) {

            const angle = (j / ornamentCount) * Math.PI * 2;

            const ringRadius = radius * 0.9;
            const ornamentY = currentY + height * 0.25;

            const x = basePos[0] + Math.cos(angle) * ringRadius;
            const z = basePos[2] + Math.sin(angle) * ringRadius;

            // randomly choose what ornament to place
            const typeRand = Math.random();

            // ----------------------------------
            // ⭐ STAR ORNAMENT
            // ----------------------------------
            if (typeRand < 0.25) {

                let star = new Sckorpio.Star({ mode: "basic" });

                star.setPosition(x, ornamentY, z);

                // small star
                const s = 0.4;
                star.setScale(s, s, s);

                // rotate so star faces outward
                // (rotating around Y using angle)
                star.setRotation(-90, (angle * 180 / Math.PI), 0);

                // golden-ish variations
                const glow = 0.8 + Math.random() * 0.2;
                star.setColor(glow, glow, 0.2);

                scene.entitiesList.push(star);
            }

            // ----------------------------------
            // 🔴 SPHERE ORNAMENT
            // ----------------------------------
            else if (typeRand < 0.7) {

                let orb = new Sckorpio.Sphere();
                const orbScale = 0.15 + Math.random() * 0.05;

                orb.setScale(orbScale, orbScale, orbScale);
                orb.setPosition(x, ornamentY, z);

                const c = j % 4;
                if (c === 0) orb.setColor(1, 0, 0);
                else if (c === 1) orb.setColor(1, 0.8, 0);
                else if (c === 2) orb.setColor(0.2, 0.7, 1);
                else orb.setColor(0.5, 1, 0.5);

                scene.entitiesList.push(orb);
            }

            // ----------------------------------
            // 🎁 TINY GIFT ORNAMENT
            // ----------------------------------
            else {

                let smallGift = new Sckorpio.Cube({ mode: "texture" });
                smallGift.setPosition(
                    x * 0.97,
                    ornamentY - 0.15,
                    z * 0.97
                );

                smallGift.setScale(0.35, 0.35, 0.35);
                smallGift.setTexture("gift" + (1 + Math.floor(Math.random() * 5)));

                scene.entitiesList.push(smallGift);
            }
        }

        // strong overlap → cones blend
        currentY += height * 0.35;
        }
    }


    async createScene() {

        /*
        ------------------------------------------------------
        SKY
        ------------------------------------------------------
        */
        let sky = new Sckorpio.Cube({ mode: 'texture', uvRange: [0, 0, 1, 1] });
        sky.setPosition(0.0, 40.0, 0.0);
        sky.setScale(200.0, 100.0, 200.0);
        sky.setTexture("sky");
        this.entitiesList.push(sky);
        /*
        ------------------------------------------------------
        BASE GROUND
        ------------------------------------------------------
        */

        let ground = new Sckorpio.Cube({ mode: 'texture', uvRange: [0, 0, 1, 1] });
        ground.setPosition(0.0, -0.1, 0.0);
        ground.setScale(200.0, 0.02, 200.0);
        ground.setTexture("snowGround2");
        this.entitiesList.push(ground);

        /*
        ------------------------------------------------------
        CHRISTMAS TREE (cones stacked + wood trunk)
        ------------------------------------------------------
        */

        this.makeChristmasTree({
            scene: this,
            n: 10,
            basePos: vec3.fromValues(0, 2, 0),
            baseRadius: 4,
            totalHeight: 30,
            texture: "christmasTree",
            enableOrnaments: false
        });


        // trunk
        let trunk = new Sckorpio.Cylinder({ mode: 'basic' });
        trunk.setPosition(0.0, -2.0, 0.0);
        trunk.setScale(1.0, 8.0, 1.0);
        trunk.setColor(0.4, 0.2, 0.05);
        this.entitiesList.push(trunk);


        // ⭐ STAR TOPPER
        let star = new Sckorpio.Star({ mode: 'basic' });
        star.setPosition(0.0, 18.0, 0.0);
        star.setScale(1.6, 1.6, 1.6);
        star.setRotation(-90.0, 0.0, 0.0);
        star.setColor(1.0, 0.9, 0.0);
        this.entitiesList.push(star);

        /*
        ------------------------------------------------------
        GIFTS AROUND TREE
        ------------------------------------------------------
        */

        let gifts = [
            { pos: [2.5, 0.6, 1.2], tex: "gift1", scale: [1.2, 1.2, 1.2] },
            { pos: [-2.8, 0.6, -1.5], tex: "gift2", scale: [1.0, 1.0, 1.0] },
            { pos: [1.5, 0.6, -2.2], tex: "gift3", scale: [1.4, 1.4, 1.4] },
            { pos: [-1.2, 0.6, 2.4], tex: "gift4", scale: [0.9, 0.9, 0.9] },
            { pos: [3.2, 0.6, -0.8], tex: "gift5", scale: [1.1, 1.1, 1.1] }
        ];

        gifts.forEach(g => {
            let cube = new Sckorpio.Cube({ mode: 'texture' });
            cube.setPosition(...g.pos);
            cube.setScale(...g.scale);
            cube.setTexture(g.tex);
            this.entitiesList.push(cube);
        });

        /*
        ------------------------------------------------------
        SNOWMAN (3 spheres + carrot nose)
        ------------------------------------------------------
        */

        // let snowBottom = new Sckorpio.Sphere(1.2);
        // snowBottom.setPosition(-6.0, 1.2, 3.0);
        // snowBottom.setColor(1, 1, 1);
        // this.entitiesList.push(snowBottom);

        // let snowMid = new Sckorpio.Sphere(0.9);
        // snowMid.setPosition(-6.0, 2.6, 3.0);
        // snowMid.setColor(1, 1, 1);
        // this.entitiesList.push(snowMid);

        // let snowHead = new Sckorpio.Sphere(0.6);
        // snowHead.setPosition(-6.0, 3.6, 3.0);
        // snowHead.setColor(1, 1, 1);
        // this.entitiesList.push(snowHead);

        // // carrot (tiny cone)
        // let nose = new Sckorpio.Cone({ mode: 'basic' });
        // nose.setPosition(-6.0, 3.6, 3.6);
        // nose.setScale(0.2, 0.6, 0.2);
        // nose.setColor(1, 0.4, 0);
        // this.entitiesList.push(nose);


    }
}

export { Scene }
