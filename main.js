import { verifyWebGLSupport } from "./sckorpioEngine/canvas/utils.js";
import { title } from "./sckorpioEngine/canvas/title.js";
import { Scene } from "./projects/projectFIFA26/scene.js";

var initSckorpioWebEngine = async function () {
    //Verify WebGL Support
    verifyWebGLSupport();

    // Initialize the scene
    var scene = new Scene("projectFIFA26"); 
    await scene.init(); 
    await scene.initResources();
    await scene.createScene();
    scene.load();
    scene.play();
}

initSckorpioWebEngine();