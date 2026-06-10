import { ShaderBook } from "../shader/shaderBook.js";
import { TextureBook } from "../texture/textureBook.js";
import { Material } from "./material.js";

class MaterialBook {
    constructor() {
        if (MaterialBook._instance) {
            return MaterialBook._instance;
        }

        this.defaultMaterials = new Map();
        this.customMaterials = new Map();

        MaterialBook._instance = this;
    }

    static getInstance() {
        if (!MaterialBook._instance) {
            MaterialBook._instance = new MaterialBook();
        }
        return MaterialBook._instance;
    }

    generateDefaultMaterials() {
        //Get Shader Book
        let shaderBook = ShaderBook.getInstance();
        let textureBook = TextureBook.getInstance();

        //Fixed Color Materials
        let basicRedMaterial = new Material("basicRed");
        basicRedMaterial.setShader(shaderBook.getShader("basic3D"));
        basicRedMaterial.setColor(1.0,0.0,0.0);
        this.defaultMaterials.set("basicRed",basicRedMaterial);

        let basicGreenMaterial = new Material("basicGreen");
        basicGreenMaterial.setShader(shaderBook.getShader("basic3D"));
        basicGreenMaterial.setColor(0.0,1.0,0.0);
        this.defaultMaterials.set("basicGreen",basicGreenMaterial);

        let basicBlueMaterial = new Material("basicBlue");
        basicBlueMaterial.setShader(shaderBook.getShader("basic3D"));
        basicBlueMaterial.setColor(0.0,0.0,1.0);
        this.defaultMaterials.set("basicBlue",basicBlueMaterial);

        let basicYellowMaterial = new Material("basicYellow");
        basicYellowMaterial.setShader(shaderBook.getShader("basic3D"));
        basicYellowMaterial.setColor(1.0,1.0,0.0);
        this.defaultMaterials.set("basicYellow",basicYellowMaterial);

        let basicMagentaMaterial = new Material("basicMagenta");
        basicMagentaMaterial.setShader(shaderBook.getShader("basic3D"));
        basicMagentaMaterial.setColor(1.0,0.0,1.0);
        this.defaultMaterials.set("basicMagenta",basicMagentaMaterial);

        let basicCyanMaterial = new Material("basicCyan");
        basicCyanMaterial.setShader(shaderBook.getShader("basic3D"));
        basicCyanMaterial.setColor(0.0,1.0,1.0);
        this.defaultMaterials.set("basicCyan",basicCyanMaterial);

        let basicWhiteMaterial = new Material("basicWhite");
        basicWhiteMaterial.setShader(shaderBook.getShader("basic3D"));
        basicWhiteMaterial.setColor(1.0,1.0,1.0);
        this.defaultMaterials.set("basicWhite",basicWhiteMaterial);

        let basicGreyMaterial = new Material("basicGrey");
        basicGreyMaterial.setShader(shaderBook.getShader("basic3D"));
        basicGreyMaterial.setColor(0.5, 0.8, 0.8);
        this.defaultMaterials.set("basicGrey",basicGreyMaterial);

        //Multi-Color Materials
        let colorVertexMaterial = new Material("colorVertex");
        colorVertexMaterial.setShader(shaderBook.getShader("colorVertex3D"));
        this.defaultMaterials.set("colorVertex",colorVertexMaterial);

        let colorFaceMaterial = new Material("colorFace");
        colorFaceMaterial.setShader(shaderBook.getShader("colorVertex3D"));
        this.defaultMaterials.set("colorFace",colorFaceMaterial);

        let uvVertexMaterial = new Material("uvVertex3D");
        uvVertexMaterial.setShader(shaderBook.getShader("uvVertex3D"));
        this.defaultMaterials.set("uvVertex3D",uvVertexMaterial);

        //Textured materials
        let woodTextureMaterial = new Material("woodTexture");
        woodTextureMaterial.setShader(shaderBook.getShader("textureVertex3D"));
        woodTextureMaterial.setTexture(textureBook.getTexture("wood"));
        this.defaultMaterials.set("wood",woodTextureMaterial);

        let brickTextureMaterial = new Material("brickTexture");
        brickTextureMaterial.setShader(shaderBook.getShader("textureVertex3D"));
        brickTextureMaterial.setTexture(textureBook.getTexture("brick"));
        this.defaultMaterials.set("brick",brickTextureMaterial);

    }

    createBasicMaterial(){
        //Diffuse Material
        let diffuseMaterial = new Material("diffuseMaterial");
        diffuseMaterial.setShader(ShaderBook.getInstance().getShader("basic3D"));
        diffuseMaterial.setColor(1.0,1.0,1.0);
        this.customMaterials.set("diffuseMaterial",diffuseMaterial);
        return diffuseMaterial;
    }

    createTextureMaterial(){
        //Texture Material
        let textureMaterial = new Material("textureMaterial");
        textureMaterial.setShader(ShaderBook.getInstance().getShader("textureVertex3D"));
        textureMaterial.setColor(1.0,1.0,1.0);
        textureMaterial.setTexture(TextureBook.getInstance().getTexture("sckorpioDefaultTexture"));
        this.customMaterials.set("textureMaterial",textureMaterial);
        return textureMaterial;
    }

    getMaterial(materialName) {
        return this.defaultMaterials.get(materialName) || null;
    }
}

export { MaterialBook };