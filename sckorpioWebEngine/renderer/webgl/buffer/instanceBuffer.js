import { gl, getWebGLResourceID } from "../../../core/canvas/utils.js";


class InstanceBuffer {
    constructor() {
        this.uniqueID = getWebGLResourceID();
        this.instanceBuffer;
        this.instanceCount = 0;
    }

    // Generates instance buffer
    generate(instanceData, totalInstances) {
        // instances count
        this.instanceCount = totalInstances;
        // Create a new buffer
        this.instanceBuffer = gl.createBuffer();
        // Bind the buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer);
        // Provide the data to the buffer
        gl.bufferData(gl.ARRAY_BUFFER, new Uint16Array(instanceData), gl.STATIC_DRAW);
        // Unbind
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    // Binds
    bind() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uniqueID);
    }

    // unbinds
    unbind() {
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
}

export {
    InstanceBuffer
}