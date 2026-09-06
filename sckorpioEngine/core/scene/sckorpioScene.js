import { Cube } from "../ecs/entity/entities/mesh/primitives/cube.js";
import { Camera } from "../ecs/entity/entities/camera/camera.js";
import { Grid } from "../ecs/entity/entities/mesh/primitives/grid.js";
import { WebGLRenderer } from "../../renderer/webgl/webglRenderer.js";
import { ShaderBook } from "../../renderer/webgl/shader/shaderBook.js";
import { MaterialBook } from "../../renderer/webgl/material/materialBook.js";
import { TextureBook } from "../../renderer/webgl/texture/textureBook.js";
import { AnimationSystem } from "../ecs/system/animation/animationSystem.js";
import { verifyWebGLSupport } from "../../canvas/utils.js";
import { logger } from "../../canvas/logger.js";
import { title } from "../../canvas/title.js";

class SckorpioScene {
    constructor(){
        // PROJECT
        //----------------------------------
        this.uid = 0;
        this.projectName;

        // SYSTEMS
        //----------------------------------
        //renderer
        this.renderer;
        //annimation
        this.animationSystem;

        // RESOURCES
        //----------------------------------
        this.customTextureList = [];

        this.materialBook;
        this.shaderBook;
        this.textureBook;

        // ENTITY
        //----------------------------------
        //camera 
        this.camera;
        //meshes
        this.grid;
        this.xAxis;
        this.yAxis;
        this.zAxis;
        this.defaultEntitiesList = [];
        this.entitiesList = [];
        
        // SCENE SETTINGS
        //----------------------------------
        //visibility
        this.isGridVisible = true;
        this.isAxisVisible = true;

        //mode
        this.mode = 1;
        
        //color modes
        this.lightModeClearColor = vec3.fromValues(0.32, 0.63, 0.67);
        this.lightModeGridColor = vec3.fromValues(0.5, 0.8, 0.8);
        this.darkModeClearColor = vec3.fromValues(0.14, 0.11, 0.26);
        this.darkModeGridColor = vec3.fromValues(0.45, 0.40, 0.65);

        // TIME
        //----------------------------------
        // time
        this.previousTime = 0.0;

        // CANVAS
        //----------------------------------
        // title 
        this.title;
        // logger
        this.logger;
    }

    async init(){
        // Verify WebGL Support
        verifyWebGLSupport();
        // Init Canvas
        this.initCanvas();
        // Init Engine (Systems/Books/Events)
        await this.initEngine();
        // Init Default Resources
        await this.initDefaultResources();
        // Init Resources (textures/images etc)
        await this.initResources();
        // Create Default Scene
        await this.createDefaultScene();
        // Create User Scene
        await this.createScene();
        // Load
        this.load();
        // Play
        this.play();
    }

    initCanvas(){
        // title icon
        this.title = title;
        // logger
        this.logger = logger;
    }

    async initEngine(){
        //Renderer
        this.renderer = new WebGLRenderer();
        //Animation
        this.animationSystem = new AnimationSystem();
        //Shader Book
        this.shaderBook = ShaderBook.getInstance();
        //Texture Book
        this.textureBook = TextureBook.getInstance();
        //Material Book
        this.materialBook = MaterialBook.getInstance();
        //Events Listener
        this.setEventlisteners();
    }

    async initDefaultResources(){
        //generate default shaders
        await this.shaderBook.generateDefaultShaders();
        //generate default textures
        await this.textureBook.generateDefaultTextures();
        //generate default materials
        this.materialBook.generateDefaultMaterials();
    }

    async initResources(){
        //generate custom textures
        await this.textureBook.generateCustomTextures(
            this.projectName,
            this.customTextureList
        );
    }

    createDefaultScene(){
        // Set Renderer Clear Color
        this.renderer.setClearColor(this.lightModeClearColor);

        // Main Camera
        this.camera = new Camera();
        this.renderer.setCamera(this.camera);

        //Grid
        this.grid = new Grid(100,1.0);
        this.grid.setMaterial("basicGrey");

        //x-Axis
        this.xAxis = new Cube();
        this.xAxis.setPosition(50.0, 0.0, 0.0);
        this.xAxis.setScale(100.0, 0.02, 0.02);
        this.xAxis.setMaterial("basicRed");

        //y-Axis
        this.yAxis = new Cube();
        this.yAxis.setPosition(0.0, 50.0, 0.0);
        this.yAxis.setScale(0.02, 100.0, 0.02);
        this.yAxis.setMaterial("basicGreen");

        //z-Axis
        this.zAxis = new Cube();
        this.zAxis.setPosition(0.0, 0.0, 50.0);
        this.zAxis.setScale(0.02, 0.02, 100.0);
        this.zAxis.setMaterial("basicBlue");

        //add meshes to default list
        this.defaultEntitiesList.push(this.grid);
        this.defaultEntitiesList.push(this.xAxis);
        this.defaultEntitiesList.push(this.yAxis);
        this.defaultEntitiesList.push(this.zAxis);
    }

    setEventlisteners() {
        // Add event listeners for keyboard
        window.addEventListener('keydown', (event) => {
          if (event.key === "G" || event.key === "g") {
            this.isGridVisible = !this.isGridVisible;
            this.setGridVisibility(this.isGridVisible);
          } else if (event.key === "Y" || event.key === "y") {
            this.isAxisVisible = !this.isAxisVisible;
            this.setAxisVisibility(this.isAxisVisible);
          } else if(event.key === "M" || event.key === "m") {
            this.toggleMode();
          }
        });
    }

    toggleMode() {
        if(this.mode == 1){
            this.mode = 0;
            this.renderer.setClearColor(this.darkModeClearColor);
            this.grid.setColor(this.darkModeGridColor[0], this.darkModeGridColor[1], this.darkModeGridColor[2]);
            this.logger.setThemeMode("dark");
        } else {
            this.mode = 1;
            this.renderer.setClearColor(this.lightModeClearColor);
            this.grid.setColor(this.lightModeGridColor[0], this.lightModeGridColor[1], this.lightModeGridColor[2]);
            this.logger.setThemeMode("light");
        }

    }

    setGridVisibility(isVisible){
        this.grid.setVisible(isVisible);
    }

    setAxisVisibility(isVisible){
        this.xAxis.setVisible(isVisible);
        this.yAxis.setVisible(isVisible);
        this.zAxis.setVisible(isVisible);
    }

    load(){
        // update Scene Graph
        this.updateSceneGraph();
        // load systems with entities according to components
        this.addEntitiesToAnimationSystem();    // Renderer System
        this.addEntitiesToRendererSystem();     // Animation System

        console.log("DefaultEntities:",this.defaultEntitiesList);
        console.log("customEntities:",this.entitiesList);
    }

    addEntitiesToRendererSystem(){
        // Add default Entities to Renderer System
        this.renderer.addEntities(this.defaultEntitiesList);
        // Add custom Entities to Renderer System
        this.renderer.addEntities(this.entitiesList);
        // load Data of entities from CPU to GPU
        this.renderer.loadEntityDataToGPU();
    }

    addEntitiesToAnimationSystem(){
        // Add custom Meshes to Animation System
        this.animationSystem.addEntities(this.entitiesList);
    }

    updateSceneGraph(){
        this.defaultEntitiesList.sort((a,b)=> a.depth - b.depth);
        for(const entity of this.defaultEntitiesList){
            entity.transformComponent.setWorldTransform();
            entity.transformComponent.setWorldInstancesTransforms();
            if(entity.transformComponent.worldInstancesCount>0){
                entity.setInstanced(true);
            }
        }

        this.entitiesList.sort((a,b)=> a.depth - b.depth);
        for(const entity of this.entitiesList){
            entity.transformComponent.setWorldTransform();
            entity.transformComponent.setWorldInstancesTransforms();
            if(entity.transformComponent.worldInstancesCount>0){
                entity.setInstanced(true);
            }
        }
    }

    update(timestamp) {
    
        // Calculate Delta Time
        if(this.previousTime === 0.0){
            this.previousTime = timestamp;
        }

        // Delta Time
        const deltaTime = (timestamp - this.previousTime) / 1000.0;
        this.previousTime = timestamp;

        // Animation
        this.animationSystem.update(deltaTime);

        // Scene Graph
        this.updateSceneGraph();

        // load Data of entities from CPU to GPU
        this.renderer.loadEntityDataToGPU();

        // Renderer
        this.renderer.render();

        // Loop
        requestAnimationFrame(
            this.play.bind(this)
        );
    }

    play() {
        // Start the render loop
        requestAnimationFrame(
            this.update.bind(this)
        );
    }
}

export{
    SckorpioScene
}