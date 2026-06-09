import { Shape } from "./shape.js";

const defaultStarOptions = {
    mode: 'basic',
    uvRange: [0, 0, 1, 1]
};

class Star extends Shape{
    constructor(options) {
        super();
        options = Object.assign({}, defaultStarOptions, options);

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
            case 'basic': this.setBasicStarMeshComponentData(); break;
            // Future modes can be added here
        }
        console.log(this.meshComponent);
    }

    setBasicStarMeshComponentData(){
        //basic material
        this.setBasicMaterial();
        
        //layout
        this.meshComponent.layout = [
            {type:"float",count:3,name:"a_vertPosition"}
        ];

        // Vertex Data
        this.meshComponent.vertexData = [
            0.0, 0.0, 0.5,      // 0 outer
            0.19, 0.0, 0.16,    // 1 inner
            0.47, 0.0, 0.15,    // 2 outer
            0.23, 0.0, -0.05,   // 3 inner
            0.29, 0.0, -0.45,   // 4 outer
            0.0, 0.0, -0.18,    // 5 inner
            -0.29, 0.0, -0.45,  // 6 outer
            -0.23, 0.0, -0.05,  // 7 inner
            -0.47, 0.0, 0.15,   // 8 outer
            -0.19, 0.0, 0.16    // 9 inner
        ];

        // center vertex (index 10)
        this.meshComponent.vertexData.push(0.0, 0.0, 0.0);

        // Index Data
        this.meshComponent.indexData = this.getDefaultStarIndices();

    }  

    getDefaultStarIndices(){
        const indices = [];
        const centerIndex = 10;
        this.meshComponent.indexData = [];

        for (let i = 0; i < 10; i++) {
            const next = (i + 1) % 10;
            indices.push(centerIndex, i, next);
        }
        return indices;
    }
}

export{
    Star
}