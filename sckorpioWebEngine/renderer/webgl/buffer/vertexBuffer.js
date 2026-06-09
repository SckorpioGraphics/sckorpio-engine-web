import { gl, getWebGLResourceID } from "../../../core/canvas/utils.js";

class VertexBuffer {
    constructor() {
        this.uniqueID = getWebGLResourceID();
        this.vertexBuffer;
    }

    // Generates vertex buffer
    generate(vertexData) {
        // Create a new buffer
        this.vertexBuffer = gl.createBuffer();
        // Bind the buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        // Provide the data to the buffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
        // Unbind
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    // Binds 
    bind() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    }

    // unbinds
    unbind() {
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
}

export {
    VertexBuffer
}