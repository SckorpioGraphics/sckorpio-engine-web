import { Shader } from "./shader.js";

class ShaderBook {
    constructor() {
        if (ShaderBook._instance) {
            return ShaderBook._instance;
        }

        this.defaultShaders = new Map();
        this.defaultShadersName = [
            "basic",
            "basic3D",
            "colorVertex3D",
            "textureVertex3D",
            "uvVertex3D"
        ];

        ShaderBook._instance = this;
    }

    static getInstance() {
        if (!ShaderBook._instance) {
            ShaderBook._instance = new ShaderBook();
        }
        return ShaderBook._instance;
    }

    async generateDefaultShaders() {
        for (const shaderName of this.defaultShadersName) {
            const shader = new Shader();
            await shader.generate(shaderName);
            this.defaultShaders.set(shaderName, shader);
        }
    }

    getShader(shaderName) {
        return this.defaultShaders.get(shaderName) || null;
    }
}

export { ShaderBook };