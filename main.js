//######## PROJECT ####################
const project = "./sckorpioProject";
//#####################################
// Default: project = "./sckorpioProject";

import { verifyWebGLSupport } from "./sckorpioEngine/canvas/utils.js";
import { title } from "./sckorpioEngine/canvas/title.js";
const { Scene } = await import(project + "/scene.js");

var initSckorpioEngine = async function () {
    //Verify WebGL Support
    verifyWebGLSupport();

    // Initialize the scene
    var scene = new Scene(project); 
    await scene.init(); 
    await scene.initResources();
    await scene.createScene();
    scene.load();
    scene.play();
}

initSckorpioEngine();