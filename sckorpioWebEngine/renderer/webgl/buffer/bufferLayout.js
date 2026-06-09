import { gl } from "../../../core/canvas/utils.js";

class BufferElement {
    constructor(type, count, normalized, attribLocation) {  
      this.type = type;
      this.count = count;
      this.normalized = normalized;
      this.attribLocation = attribLocation;
    }
  
    static getSizeOfType(type) {
      switch (type) {
        case gl.FLOAT:
          return 4;
        case gl.UNSIGNED_INT:
          return 4;
        case gl.UNSIGNED_BYTE:
          return 1;
        default:
          console.error("Unsupported type:", type);
          return 0;
      }
    }
  }
  
  class BufferLayout {
    constructor() {
      this.m_Stride = 0; // Stride
      this.m_Elements = []; // vertex buffer elements
    }
  
    // get the elements of the layout
    getElements() {
      return this.m_Elements;
    }
  
    // get the stride 
    getStride() {
      return this.m_Stride;
    }
  
    // push elements(float) in layout
    pushFloat(count,attribLocation) {
        this.m_Elements.push(new BufferElement(gl.FLOAT, count, gl.FALSE, attribLocation));
        this.m_Stride += BufferElement.getSizeOfType(gl.FLOAT) * count;
    }

    // push elements(int) in layout
    pushUnsignedInt(count,attribLocation) {
        this.m_Elements.push(new BufferElement(gl.UNSIGNED_INT, count, gl.FALSE, attribLocation));
        this.m_Stride += BufferElement.getSizeOfType(gl.UNSIGNED_INT) * count;
    }

    // push elements(byte) in layout
    pushUnsignedByte(count,attribLocation) {
        this.m_Elements.push(new BufferElement(gl.UNSIGNED_BYTE, count, gl.TRUE, attribLocation));
        this.m_Stride += BufferElement.getSizeOfType(gl.UNSIGNED_BYTE) * count;
    }
  }

  export{
    BufferElement,
    BufferLayout
  }
