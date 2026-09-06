import { gl, getWebGLResourceID } from "../../../canvas/utils.js";

class Shader {
  constructor() {
    this.uniqueID = getWebGLResourceID();
    this.shaderName = '';
    this.shaderFilePath = '';
    this.vertexShaderSource = '';
    this.fragmentShaderSource = '';
    this.shaderProgram = null;
  }

  // Destructor for cleanup
  dispose() {
    if (this.shaderProgram) {
      gl.deleteProgram(this.shaderProgram);
    }
  }

  // Generate Shader Program
  async generate(shaderName) {
    this.shaderProgram = null;
    this.shaderName = shaderName;
    this.shaderFilePath = "SckorpioEngine/renderer/webgl/resources/shaders/" + shaderName + ".txt";

    const source = await this.parseShader(this.shaderFilePath);

    const vertexShaderID = this.compileShader(source.vertexSource, 'vertex');
    const fragmentShaderID = this.compileShader(source.fragmentSource, 'fragment');

    this.shaderProgram = this.linkProgram(vertexShaderID, fragmentShaderID);
    this.bind();
  }

  // parsing shader text files
  async parseShader(shaderFilePath) {
    const response = await fetch(shaderFilePath);
    const shaderCode = await response.text();

    const shaderSource = { vertexSource: '', fragmentSource: '' };
    let type = 'none';

    const lines = shaderCode.split('\n');

    lines.forEach(line => {
      if (line.includes('#shader')) {
        if (line.includes('vertex')) {
          type = 'vertex';
        } else if (line.includes('fragment')) {
          type = 'fragment';
        }
      } else {
        if (type === 'vertex') {
          shaderSource.vertexSource += line + '\n';
        } else if (type === 'fragment') {
          shaderSource.fragmentSource += line + '\n';
        }
      }
    });

    return shaderSource;
  }

  // compile shader
  compileShader(shaderSource, type) {
    const shaderType = type === 'vertex' ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER;

    const shaderID = gl.createShader(shaderType);
    if (!shaderID) {
      console.error(`Failed to create ${type} shader.`);
      return 0;
    }

    gl.shaderSource(shaderID, shaderSource);
    gl.compileShader(shaderID);

    if (!gl.getShaderParameter(shaderID, gl.COMPILE_STATUS)) {
      const errorMessage = gl.getShaderInfoLog(shaderID);
      console.error(`Error compiling ${type} shader:`, errorMessage);
      gl.deleteShader(shaderID);
      return 0;
    }

    return shaderID;
  }

  linkProgram(vertexShaderID, fragmentShaderID) {
    const programID = gl.createProgram();

    if (!programID) {
      console.error('Failed to create shader program.');
      return null;
    }

    // Ensure shaders are valid
    if (!vertexShaderID || !fragmentShaderID) {
      console.error('Shaders are not valid or compiled.');
      return null;
    }

    // Attach shaders
    gl.attachShader(programID, vertexShaderID);
    gl.attachShader(programID, fragmentShaderID);

    // Link program
    gl.linkProgram(programID);
    if (!gl.getProgramParameter(programID, gl.LINK_STATUS)) {
      console.error('ERROR linking program!', gl.getProgramInfoLog(programID));
      return null;
    }

    // Validate program
    gl.validateProgram(programID);
    if (!gl.getProgramParameter(programID, gl.VALIDATE_STATUS)) {
      console.error('ERROR validating program!', gl.getProgramInfoLog(programID));
      return null;
    }

    return programID;
  }

  // Bind
  bind() {
    //console.log("Bind() Shader =",this.uniqueID);
    if (this.shaderProgram) {
      gl.useProgram(this.shaderProgram);
    }
  }

  // unbind
  unbind() {
    //console.log("UnBind() Shader =",this.uniqueID);
    gl.useProgram(null);
  }

  //get AttribLocation from shader
  getAttribLocation(name) {
    return gl.getAttribLocation(this.shaderProgram, name);
  }

  // Setters for uniform variables
  setUniform1i(name, value) {
    const location = this.getUniformLocation(name);
    gl.uniform1i(location, value);
  }

  setUniform1iv(name, count, value) {
    const location = this.getUniformLocation(name);
    gl.uniform1iv(location, value);
  }

  setUniform1f(name, value) {
    const location = this.getUniformLocation(name);
    gl.uniform1f(location, value);
  }

  setUniform3f(name, v0, v1, v2) {
    const location = this.getUniformLocation(name);
    gl.uniform3f(location, v0, v1, v2);
  }

  setUniform4f(name, v0, v1, v2, v3) {
    const location = this.getUniformLocation(name);
    gl.uniform4f(location, v0, v1, v2, v3);
  }

  setUniform3fv(name, vec) {
    const location = this.getUniformLocation(name);
    gl.uniform3fv(location, vec);
  }

  setUniformMat4f(name, matrix) {
    const location = this.getUniformLocation(name);
    gl.uniformMatrix4fv(location, false, matrix);
  }

  getUniformLocation(name) {
    const location = gl.getUniformLocation(this.shaderProgram, name);
    if (location === null) {
      console.error(`${name} - not exist : found as ${location}`);
    }
    return location;
  }
}

export {
  Shader
}
