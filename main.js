import { verifyWebGLSupport } from "./sckorpioEngineWeb/canvas/utils.js";
import { title } from "./sckorpioEngineWeb/canvas/title.js";
import { Scene } from "./projects/sckorpioTestingSceneGraph/scene.js";

var initSckorpioWebEngine = async function () {
    //Verify WebGL Support
    verifyWebGLSupport();

    // Initialize the scene
    var scene = new Scene("sckorpioTestingSceneGraph"); 
    await scene.init(); 
    await scene.initResources();
    await scene.createScene();
    scene.load();
    scene.play();
}

initSckorpioWebEngine();