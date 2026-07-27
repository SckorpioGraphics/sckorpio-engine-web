import { gl, getWebGLResourceID } from "../../../canvas/utils.js";


class IndexBuffer {
    constructor() {
        this.uniqueID = getWebGLResourceID();
        this.indexBuffer;
        this.indexCount = 0;
    }

    // Generates index buffer
    generate(indexData) {
        // index count
        this.indexCount = indexData.length;
        // Create a new buffer
        this.indexBuffer = gl.createBuffer();
        // Bind the buffer
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        // Provide the data to the buffer
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
    }

    // Binds
    bind() {
        //console.log("Bind() IB =",this.uniqueID);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    }

    // unbinds
    unbind() {
        //console.log("UnBind() IB =",this.uniqueID);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
}

export {
    IndexBuffer
}