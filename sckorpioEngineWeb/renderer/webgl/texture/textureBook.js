import { Texture } from "./texture.js";

class TextureBook {
    constructor() {
        if (TextureBook._instance) {
            return TextureBook._instance;
        }

        //default textures
        this.defaultTexturesPath = "sckorpioEngineWeb/renderer/webgl/resources/textures/";
        this.defaultTextureNames = [
            "sckorpioDefaultTexture",
            "grass",
            "woodCarton",
            "brick"
        ];
        this.defaultTextures = new Map();

        //custom user textures
        this.customTexturesPath;
        this.customTextureNames = [];
        this.customTextures = new Map();
        
        TextureBook._instance = this;
    }

    static getInstance() {
        if (!TextureBook._instance) {
            TextureBook._instance = new TextureBook();
        }
        return TextureBook._instance;
    }

    async generateDefaultTextures() {
        for (const textureName of this.defaultTextureNames) {
            //Using Texture class
            let texture = new Texture(textureName);
            await texture.generate(this.defaultTexturesPath+textureName+".png");
            this.defaultTextures.set(textureName,texture);
        }
    }

    async generateCustomTextures(projectName,customTextureNames) {
        this.customTextureNames = customTextureNames;
        this.customTexturesPath = "projects/"+projectName+"/resources/textures/";
        for (const textureName of this.customTextureNames) {
            //Using Texture class
            let texture = new Texture(textureName);
            await texture.generate(this.customTexturesPath+textureName+".png");
            this.defaultTextures.set(textureName,texture);
        }
    }

    getTexture(textureName) {
        if(this.defaultTextures.has(textureName)){
            return this.defaultTextures.get(textureName);
        } else if(this.customTextures.has(textureName)){
            return this.customTextures.get(textureName);
        }
        return null;
    }
}

export { TextureBook };