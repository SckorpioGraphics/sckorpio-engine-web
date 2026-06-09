import { gl } from "../../../core/canvas/utils.js";

class BufferElement {
    constructor(type, count, normalized, attribLocation, divisor = 0) {  
      this.type = type;
      this.count = count;
      this.normalized = normalized;
      this.attribLocation = attribLocation;
      this.divisor = divisor;
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
    constructor(layoutType = 'vertex') {
      this.layoutType = layoutType; // Buffer Type (vertex/instance)
      this.stride = 0;              // Buffer Stride
      this.elements = [];           // Buffer elements
      this.divisor = 0;               // Buffer divisor(vertex: 0 | instance: 1)

      if(layoutType === 'instance'){
        this.divisor = 1;
      }
    }
  
    // get the elements of the layout
    getElements() {
      return this.elements;
    }
  
    // get the stride 
    getStride() {
      return this.stride;
    }
  
    // push elements(float) in layout
    pushFloat(count,attribLocation) {
        this.elements.push(new BufferElement(gl.FLOAT, count, gl.FALSE, attribLocation, this.divisor));
        this.stride += BufferElement.getSizeOfType(gl.FLOAT) * count;
    }

    // push elements(int) in layout
    pushUnsignedInt(count,attribLocation) {
        this.elements.push(new BufferElement(gl.UNSIGNED_INT, count, gl.FALSE, attribLocation, this.divisor));
        this.stride += BufferElement.getSizeOfType(gl.UNSIGNED_INT) * count;
    }

    // push elements(byte) in layout
    pushUnsignedByte(count,attribLocation) {
        this.elements.push(new BufferElement(gl.UNSIGNED_BYTE, count, gl.TRUE, attribLocation, this.divisor));
        this.stride += BufferElement.getSizeOfType(gl.UNSIGNED_BYTE) * count;
    }

    // push elements(4x4 matrix) in layout
    pushMatix4Float(baseAttribLocation) {
      if(baseAttribLocation == -1)
        return;

      for(let i = 0; i < 4; i++) {
        const currentSlotLocation = baseAttribLocation + i;
        this.elements.push(new BufferElement(gl.FLOAT, 4, gl.FALSE, currentSlotLocation, this.divisor));
        this.stride += BufferElement.getSizeOfType(gl.FLOAT) * 4;
      }
    }
  }

  export{
    BufferElement,
    BufferLayout
  }
