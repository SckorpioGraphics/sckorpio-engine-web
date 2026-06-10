import { verifyWebGLSupport } from "./sckorpioWebEngine/canvas/utils.js";
import { title } from "./sckorpioWebEngine/canvas/title.js";
import { Scene } from "./projects/sckorpioTesting/scene.js";

var initSckorpioWebEngine = async function () {
    //Verify WebGL Support
    verifyWebGLSupport();

    // Initialize the scene
    var scene = new Scene("sckorpioTesting"); 
    await scene.init(); 
    await scene.initResources();
    await scene.createScene();
    scene.load();
    scene.play();
}

initSckorpioWebEngine();