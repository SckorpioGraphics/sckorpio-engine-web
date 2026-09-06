//######## PROJECT ####################
const project = "./projects/testing1Basic";
//#####################################
// Default: project = "./sckorpioProject";

const { Scene } = await import(project + "/scene.js");

var setProject = async function () {
    // Initialize the scene
    var scene = new Scene(project); 
    await scene.init();
}

setProject();