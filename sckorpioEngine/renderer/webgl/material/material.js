import { getWebGLResourceID } from "../../../canvas/utils.js";
import { Shader } from "../shader/shader.js";
import { Texture } from "../texture/texture.js";

class Material{
    constructor(name = "basic3D") {
        this.uniqueID = getWebGLResourceID();
        this.name = name;
        this.shader;
        this.texture;
        this.color;
    }

    setShader(shader){
        //Set Shader
        this.shader = shader;
    }

    setColor(r,g,b){
        //Set Color
        this.color = vec3.fromValues(r, g, b);
    }

    setTexture(texture){
        //Set Texture
        this.texture = texture;
    }

    setTextureWrap(wrapX,wrapY){
        this.texture.setTextureWrapX(wrapX);
        this.texture.setTextureWrapY(wrapY);
    }

}

export{
    Material
}