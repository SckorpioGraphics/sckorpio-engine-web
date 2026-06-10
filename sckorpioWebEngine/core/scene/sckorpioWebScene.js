import { Box } from "../ecs/entityList/shape/box.js";
import { Camera } from "../ecs/entityList/camera/camera.js";
import { Grid } from "../ecs/entityList/shape/grid.js";
import { WebGLRenderer } from "../../renderer/webgl/webglRenderer.js";
import { ShaderBook } from "../../renderer/webgl/shader/shaderBook.js";
import { MaterialBook } from "../../renderer/webgl/material/materialBook.js";
import { TextureBook } from "../../renderer/webgl/texture/textureBook.js";

class SckorpioWebScene {
    constructor(){
        this.uid = 0;

        //ENTITIES
        //meshes
        this.grid;
        this.xAxis;
        this.yAxis;
        this.zAxis;
        this.defaultEntitiesList = [];
        this.entitiesList = [];
        //camera 
        this.camera;

        //SYSTEM
        //renderer
        this.renderer;

        //RESOURCES
        this.materialBook;
        this.shaderBook;
        this.textureBook;

        //visibility
        this.isGridVisible = true;
        this.isAxisVisible = true;

        //mode
        this.mode = 1;
        // moon1: (58.0/255.0, 168.0/255.0, 193.0/255.0)
        // electriczblue: (125.0/255.0, 249.0/255.0, 255.0/255.0)
        // robin egg: (0.0/255.0, 204.0/255.0, 204.0/255.0)
        

        // Light
        // (90.0/255.0, 170.0/255.0, 180.0/255.0);
        // GRID: (0.5, 0.8, 0.8);

        // Dark
        // (80.0/255.0, 160.0/255.0, 170.0/255.0);
        // GRID: (0.5, 0.8, 0.8);

        this.lightModeClearColor = vec3.fromValues(80.0/255.0, 160.0/255.0, 170.0/255.0);
        this.lightModeGridColor = vec3.fromValues(0.5, 0.8, 0.8);

        this.darkModeClearColor = vec3.fromValues(0.14, 0.11, 0.26);
        this.darkModeGridColor = vec3.fromValues(0.45, 0.40, 0.65);
    }

    async init(){
        /*
        RENDERER
        */
        this.renderer = new WebGLRenderer();

        /*
        CAMERA
        */
        this.camera = new Camera();
        this.renderer.setCamera(this.camera);
        this.renderer.setClearColor(this.lightModeClearColor);

        /*
        SHADER_BOOK
        */
        this.shaderBook = ShaderBook.getInstance();
        await this.shaderBook.generateDefaultShaders();

        /*
        TEXTURE_BOOK
        */
        this.textureBook = TextureBook.getInstance();
        await this.textureBook.generateDefaultTextures();

        /*
        MATERIAL_BOOK
        */
        this.materialBook = MaterialBook.getInstance();
        this.materialBook.generateDefaultMaterials();
    
        /*
        ENTITIES
        */
        this.createDefaultEntities();

        /*
        EVENT_LISTENERS
        */
        this.setEventlisteners();
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
        } else {
            this.mode = 1;
            this.renderer.setClearColor(this.lightModeClearColor);
            this.grid.setColor(this.lightModeGridColor[0], this.lightModeGridColor[1], this.lightModeGridColor[2]);
        }

    }

    createDefaultEntities(){
        //Grid
        this.grid = new Grid(100,1.0);
        this.grid.setMaterial("basicGrey");

        //x-Axis
        this.xAxis = new Box();
        this.xAxis.setPosition(vec3.fromValues(50.0, 0.0, 0.0));
        this.xAxis.setScale(vec3.fromValues(100.0, 0.02, 0.02));
        this.xAxis.setMaterial("basicRed");

        //y-Axis
        this.yAxis = new Box();
        this.yAxis.setPosition(vec3.fromValues(0.0, 50.0, 0.0));
        this.yAxis.setScale(vec3.fromValues(0.02, 100.0, 0.02));
        this.yAxis.setMaterial("basicGreen");

        //z-Axis
        this.zAxis = new Box();
        this.zAxis.setPosition(vec3.fromValues(0.0, 0.0, 50.0));
        this.zAxis.setScale(vec3.fromValues(0.02, 0.02, 100.0));
        this.zAxis.setMaterial("basicBlue");

        //add meshes to default list
        this.defaultEntitiesList.push(this.grid);
        this.defaultEntitiesList.push(this.xAxis);
        this.defaultEntitiesList.push(this.yAxis);
        this.defaultEntitiesList.push(this.zAxis);
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
        // load systems with entities according to components
        this.addEntitiesToRenderer();

        console.log("DefaultEntities:",this.defaultEntitiesList);
        console.log("customEntities:",this.entitiesList);
    }

    addEntitiesToRenderer(){
        //Add Meshes to list'
        this.renderer.addEntityList(this.defaultEntitiesList);
        this.renderer.addEntityList(this.entitiesList);
        // load Data of entities from CPU to GPU
        this.renderer.loadEntityDataToGPU();
    }

    play(){
        /*
        RENDERER render()
        */
        this.renderer.render();

        //loop
        requestAnimationFrame(this.play.bind(this));
    }
}

export{
    SckorpioWebScene
}