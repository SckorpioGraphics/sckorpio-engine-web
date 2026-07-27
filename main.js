import { verifyWebGLSupport } from "./sckorpioEngineWeb/canvas/utils.js";
import { title } from "./sckorpioEngineWeb/canvas/title.js";
import { Scene } from "./projects/sckorpioFIFA26/scene.js";

var initSckorpioWebEngine = async function () {
    //Verify WebGL Support
    verifyWebGLSupport();

    // Initialize the scene
    var scene = new Scene("sckorpioFIFA26"); 
    await scene.init(); 
    await scene.initResources();
    await scene.createScene();
    scene.load();
    scene.play();
}

initSckorpioWebEngine();