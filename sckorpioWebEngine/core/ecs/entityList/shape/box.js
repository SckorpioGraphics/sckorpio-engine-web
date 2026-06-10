import { Shape } from "./shape.js";

const defaultBoxOptions = {
    mode: 'basic',
    uvRange: [0, 0, 1, 1]
};

class Box extends Shape {
    constructor(options) {
        super();
        options = Object.assign({}, defaultBoxOptions, options);

        this.mode = options.mode;
        this.uvRange = options.uvRange;
        
        this.setMeshComponentData();
    }

    setMode(mode){
        this.mode = mode;
        this.setMeshComponentData();
        this.meshComponent.unloadGPUData();
        this.meshComponent.loadGPUData();
    }

    setMeshComponentData(){
        switch (this.mode) {
            case 'basic': this.setBasicMeshComponentData(); break;
            case 'colorFace': this.setColorFaceMeshComponentData(); break;
            case 'colorVertex': this.setColorVertexMeshComponentData(); break;
            case 'textureFace': this.setTextureFaceMeshComponentData(this.uvRange); break;
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
            -0.5, -0.5, 0.5,
            0.5, -0.5, 0.5,
            0.5, 0.5, 0.5,
            -0.5, 0.5, 0.5,

            -0.5, -0.5, -0.5,
            0.5, -0.5, -0.5,
            0.5, 0.5, -0.5,
            -0.5, 0.5, -0.5
        ];

        this.meshComponent.indexData = this.getDefaultBoxIndices();
    }

    setColorFaceMeshComponentData(){
        //colorFace Material
        this.setMaterial("colorVertex");

        //buffer data
        this.meshComponent.layout = [
            { type: "float", count: 3, name: "a_vertPosition" },
            { type: "float", count: 3, name: "a_vertColor" }
        ];

        this.meshComponent.vertexData = 
        [
            -0.5, -0.5, -0.5,   1.0, 0.0, 0.0,
            0.5, -0.5, -0.5,    1.0, 0.0, 0.0,
            0.5,  0.5, -0.5,    1.0, 0.0, 0.0,
            0.5,  0.5, -0.5,    1.0, 0.0, 0.0,
            -0.5,  0.5, -0.5,   1.0, 0.0, 0.0,
            -0.5, -0.5, -0.5,   1.0, 0.0, 0.0,
    
            -0.5, -0.5,  0.5,   0.0, 1.0, 0.0,
            0.5, -0.5,  0.5,    0.0, 1.0, 0.0,
            0.5,  0.5,  0.5,    0.0, 1.0, 0.0,
            0.5,  0.5,  0.5,    0.0, 1.0, 0.0,
            -0.5,  0.5,  0.5,   0.0, 1.0, 0.0,
            -0.5, -0.5,  0.5,   0.0, 1.0, 0.0,
    
            -0.5,  0.5,  0.5,   0.0, 0.0, 1.0,
            -0.5,  0.5, -0.5,   0.0, 0.0, 1.0,
            -0.5, -0.5, -0.5,   0.0, 0.0, 1.0,
            -0.5, -0.5, -0.5,   0.0, 0.0, 1.0,
            -0.5, -0.5,  0.5,   0.0, 0.0, 1.0,
            -0.5,  0.5,  0.5,   0.0, 0.0, 1.0,
    
            0.5,  0.5,  0.5,    1.0, 1.0, 0.0,
            0.5,  0.5, -0.5,    1.0, 1.0, 0.0,
            0.5, -0.5, -0.5,    1.0, 1.0, 0.0,
            0.5, -0.5, -0.5,    1.0, 1.0, 0.0,
            0.5, -0.5,  0.5,    1.0, 1.0, 0.0,
            0.5,  0.5,  0.5,    1.0, 1.0, 0.0,
    
            -0.5, -0.5, -0.5,   1.0, 0.0, 1.0,
            0.5, -0.5, -0.5,    1.0, 0.0, 1.0,
            0.5, -0.5,  0.5,    1.0, 0.0, 1.0,
            0.5, -0.5,  0.5,    1.0, 0.0, 1.0,
            -0.5, -0.5,  0.5,   1.0, 0.0, 1.0,
            -0.5, -0.5, -0.5,   1.0, 0.0, 1.0,
    
            -0.5,  0.5, -0.5,   0.0, 1.0, 1.0,
            0.5,  0.5, -0.5,    0.0, 1.0, 1.0,
            0.5,  0.5,  0.5,    0.0, 1.0, 1.0,
            0.5,  0.5,  0.5,    0.0, 1.0, 1.0,
            -0.5,  0.5,  0.5,   0.0, 1.0, 1.0,
            -0.5,  0.5, -0.5,   0.0, 1.0, 1.0
        ];
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
            -0.5, -0.5, 0.5, 1.0, 0.0, 0.0,
            0.5, -0.5, 0.5, 0.0, 1.0, 0.0,
            0.5, 0.5, 0.5, 0.0, 0.0, 1.0,
            -0.5, 0.5, 0.5, 1.0, 1.0, 0.0,

            -0.5, -0.5, -0.5, 1.0, 0.0, 1.0,
            0.5, -0.5, -0.5, 0.0, 1.0, 1.0,
            0.5, 0.5, -0.5, 1.0, 0.5, 1.0,
            -0.5, 0.5, -0.5, 1.0, 1.0, 1.0
        ];

        this.meshComponent.indexData = this.getDefaultBoxIndices();
    }

    setTextureFaceMeshComponentData(uvRange){
        //texture material
        this.setTextureMaterial();

        //buffer data
        this.meshComponent.layout = [
            { type: "float", count: 3, name: "a_vertPosition" },
            { type: "float", count: 2, name: "a_vertUV" }
        ];

        let [uMin, vMin, uMax, vMax] = uvRange;

        this.meshComponent.vertexData = [
            // back
            -0.5, -0.5, -0.5, uMax, vMin,
            0.5, -0.5, -0.5, uMin, vMin,
            0.5, 0.5, -0.5, uMin, vMax,
            0.5, 0.5, -0.5, uMin, vMax,
            -0.5, 0.5, -0.5, uMax, vMax,
            -0.5, -0.5, -0.5, uMax, vMin,

            // front
            -0.5, -0.5, 0.5, uMin, vMin,
            0.5, -0.5, 0.5, uMax, vMin,
            0.5, 0.5, 0.5, uMax, vMax,
            0.5, 0.5, 0.5, uMax, vMax,
            -0.5, 0.5, 0.5, uMin, vMax,
            -0.5, -0.5, 0.5, uMin, vMin,

            // left
            -0.5, -0.5, -0.5, uMin, vMin,
            -0.5, -0.5, 0.5, uMax, vMin,
            -0.5, 0.5, 0.5, uMax, vMax,
            -0.5, 0.5, 0.5, uMax, vMax,
            -0.5, 0.5, -0.5, uMin, vMax,
            -0.5, -0.5, -0.5, uMin, vMin,

            // right
            0.5, -0.5, -0.5, uMax, vMin,
            0.5, -0.5, 0.5, uMin, vMin,
            0.5, 0.5, 0.5, uMin, vMax,
            0.5, 0.5, 0.5, uMin, vMax,
            0.5, 0.5, -0.5, uMax, vMax,
            0.5, -0.5, -0.5, uMax, vMin,

            // bottom
            -0.5, -0.5, -0.5, uMin, vMin,
            0.5, -0.5, -0.5, uMax, vMin,
            0.5, -0.5, 0.5, uMax, vMax,
            0.5, -0.5, 0.5, uMax, vMax,
            -0.5, -0.5, 0.5, uMin, vMax,
            -0.5, -0.5, -0.5, uMin, vMin,

            // top
            -0.5, 0.5, -0.5, uMin, vMax,
            0.5, 0.5, -0.5, uMax, vMax,
            0.5, 0.5, 0.5, uMax, vMin,
            0.5, 0.5, 0.5, uMax, vMin,
            -0.5, 0.5, 0.5, uMin, vMin,
            -0.5, 0.5, -0.5, uMin, vMax
        ];
    }

    getDefaultBoxIndices(){
        return [
            // Front face
            0, 1, 2,
            0, 2, 3,

            // Back face
            4, 5, 6,
            4, 6, 7,

            // Left face
            4, 0, 3,
            4, 3, 7,

            // Right face
            1, 5, 6,
            1, 6, 2,

            // Top face
            3, 2, 6,
            3, 6, 7,

            // Bottom face
            4, 5, 1,
            4, 1, 0
        ];
    }
}

export { Box };
