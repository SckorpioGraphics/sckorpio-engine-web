import { gl, getWebGLResourceID } from "../../../canvas/utils.js";

class Texture {
  constructor(textureName) {
    this.uniqueID = getWebGLResourceID();
    this.textureName = textureName;
    this.textureFilePath = '';
    this.textureWrapX = "REPEAT";
    this.textureWrapY = "REPEAT";
    this.texture;
  }

  // Generate a Texture
  async generate(texturePath){
    this.textureFilePath = texturePath;
    this.texture = gl.createTexture();

    // bind and set a 1x1 pixel placeholder immediately
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0,
      gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 0, 255, 255]) // magenta placeholder
    );

    // set wrap/filter defaults while texture is bound
    this.setTextureWrap(); // make sure setTextureWrap binds the texture (as in fix above)

    // now actually load image
    const image = new Image();
    image.src = this.textureFilePath;
    await new Promise((resolve, reject) => {
      image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
        resolve();
      };
      image.onerror = reject;
    });
  }

  generatePixelTexture(){
    //bind texture
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    //1x1 pixel as image for texture
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,              // mip level
        gl.RGBA,        // internal format
        2,              // width
        2,              // height
        0,              // border (must be 0)
        gl.RGBA,        // format
        gl.UNSIGNED_BYTE, // type
        new Uint8Array([
            255, 0, 0, 255,     // red
            0, 255, 0, 255,     // green
            0, 0, 255, 255,     // blue
            255, 255, 0, 255    // yellow
        ])
    );

    //Set Texture Wrap
    this.setTextureWrap();
    
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  }

  setTextureWrapX(wrapValueX = "REPEAT"){
    this.textureWrapX = wrapValueX;
  }

  setTextureWrapY(wrapValueY = "REPEAT"){
    this.textureWrapY = wrapValueY;
  }

  setTextureWrap(){
    switch(this.textureWrapX){
        case "REPEAT": gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); break;
        case "CLAMP_TO_EDGE": gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); break;
        case "MIRRORED_REPEAT": gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT); break;
    }
    switch(this.textureWrapY){
        case "REPEAT": gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT); break;
        case "CLAMP_TO_EDGE": gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); break;
        case "MIRRORED_REPEAT": gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT); break;
    }
  }

  //bind texture
  bind(){
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
  }

  //bind texture
  unbind(){
    //console.log("UnBind() Shader =",this.uniqueID);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }
}

export {
  Texture
}