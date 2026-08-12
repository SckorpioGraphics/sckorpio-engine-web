import { Shape } from "./shape.js";

const defaultPlaneOptions = {
    mode: 'basic',
    uvRange: [0, 0, 1, 1]
};

class Plane extends Shape {
    constructor(options) {
        super();
        options = Object.assign({}, defaultPlaneOptions, options);

        this.mode = options.mode;
        this.uvRange = options.uvRange;
        
        this.setMeshComponentData();
    }

    setMode(mode){
        this.mode = mode;
        this.setMeshComponentData();
        this.unloadGPUData();
        this.loadGPUData();
    }

    setMeshComponentData(){
        switch (this.mode) {
            case 'basic': this.setBasicMeshComponentData(); break;
            case 'colorVertex': this.setColorVertexMeshComponentData(); break;
            case 'texture': this.setTextureMeshComponentData(this.uvRange); break;
        }
    }

    setBasicMeshComponentData(){
        //basic material
        this.setBasicMaterial();

        //buffer data
        this.meshComponent.layout = [
            { type: "float", count: 3, name: "a_vertPosition" }
        ];

        this.meshComponent.vertexData = [
            -0.5, -0.5, 0.0,
            0.5, -0.5, 0.0,
            0.5, 0.5, 0.0,
            -0.5, 0.5, 0.0
        ];

        this.meshComponent.indexData = this.getDefaultPlaneIndices();
    }

    setColorVertexMeshComponentData(){
        //colorFace Material
        this.setMaterial("colorVertex");

        //buffer data
        this.meshComponent.layout = [
            { type: "float", count: 3, name: "a_vertPosition" },
            { type: "float", count: 3, name: "a_vertColor" }
        ];

        this.meshComponent.vertexData = [
            -0.5, -0.5, 0.0, 1.0, 0.0, 0.0,
            0.5, -0.5, 0.0, 0.0, 1.0, 0.0,
            0.5, 0.5, 0.0, 0.0, 0.0, 1.0,
            -0.5, 0.5, 0.0, 1.0, 1.0, 0.0,
        ];

        this.meshComponent.indexData = this.getDefaultPlaneIndices();
    }

    setTextureMeshComponentData(uvRange){
        //texture material
        this.setTextureMaterial();

        //buffer data
        this.meshComponent.layout = [
            { type: "float", count: 3, name: "a_vertPosition" },
            { type: "float", count: 2, name: "a_vertUV" }
        ];

        let [uMin, vMin, uMax, vMax] = uvRange;

        this.meshComponent.vertexData = [
            -0.5, -0.5, 0.0, uMin, vMin,
             0.5, -0.5, 0.0, uMax, vMin,
             0.5,  0.5, 0.0, uMax, vMax,
            -0.5,  0.5, 0.0, uMin, vMax
        ];

        this.meshComponent.indexData = this.getDefaultPlaneIndices();
    }

    getDefaultPlaneIndices(){
        return [
            // Front face
            0, 1, 2,
            0, 2, 3,
        ];
    }
}

export { Plane };