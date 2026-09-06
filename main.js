import { verifyWebGLSupport } from "./sckorpioEngineWeb/canvas/utils.js";
import { title } from "./sckorpioEngineWeb/canvas/title.js";
import { Scene } from "./projects/testing1Basic/scene.js";

var initSckorpioWebEngine = async function () {
    //Verify WebGL Support
    verifyWebGLSupport();

    // Initialize the scene
    var scene = new Scene("testing1Basic"); 
    await scene.init(); 
    await scene.initResources();
    await scene.createScene();
    scene.load();
    scene.play();
}

initSckorpioWebEngine();