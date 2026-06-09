import { gl, getWebGLResourceID } from "../../../core/canvas/utils.js";
import { BufferElement } from "./BufferLayout.js";
class VertexArray {
    constructor() {
        this.uniqueID = getWebGLResourceID();
        this.vertexArray;
    }

    // Generates vertex array 
    generate() {
        // Create a new vertex array object
        this.vertexArray = gl.createVertexArray();
        // Bind the vertex array 
        gl.bindVertexArray(this.vertexArray);
    }

    // Adds a vertex buffer and its layout to the vertex array
    addBuffer(buffer, layout) {
        // bind this Vertex Array
        this.bind();
        // Bind the vertex buffer
        buffer.bind();

        // Get the layout elements
        const elements = layout.getElements();

        // offset
        let offset = 0;

        elements.forEach((element) => {
            gl.vertexAttribPointer(
                element.attribLocation,  // attrib location
                element.count,          // count of elements
                element.type,           // type of element
                element.normalized,     // normalise?
                layout.getStride(),     // stride
                offset                  // offset
            );

            // enable
            gl.enableVertexAttribArray(element.attribLocation);

            // divisor for instances (element.divisor = 0: per vertex | 1: per instance)
            gl.vertexAttribDivisor(element.attribLocation, element.divisor);

            // Update the offset for the next attribute
            offset += element.count * BufferElement.getSizeOfType(element.type);
        });
    }

    // Binds
    bind() {
        gl.bindVertexArray(this.vertexArray);
    }

    // unbinds
    unbind() {
        gl.bindVertexArray(null);
    }
}

export {
    VertexArray
}

