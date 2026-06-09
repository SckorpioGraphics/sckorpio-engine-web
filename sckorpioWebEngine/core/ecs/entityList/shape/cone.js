import { Shape } from "./shape.js";

const defaultConeOptions = {
    mode: 'basic',
    radius: 1.0,
    height: 1.0,
    radialSegments: 36,
    uvRange: [0, 0, 1, 1]
};

class Cone extends Shape{
    constructor(options) {
        super();
        options = Object.assign({}, defaultConeOptions, options);

        this.mode = options.mode;
        this.radius = options.radius;
        this.height = options.height;
        this.radialSegments = options.radialSegments;
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
            case 'basic': this.setBasicConeMeshComponentData(); break;
            case 'textureFace': this.setTextureFaceMeshComponentData(this.uvRange); break;
            // Future modes can be added here
        }
        console.log(this.meshComponent);
    }

    setBasicConeMeshComponentData(){
        //basic material
        this.setBasicMaterial();
        
        //layout
        this.meshComponent.layout = [
            {type:"float",count:3,name:"a_vertPosition"}
        ];

        // Base center vertex
        this.meshComponent.verticesData = this.meshComponent.verticesData.concat([0, 0, 0]);

        // Base circle vertices
        for (let i = 1; i <= this.radialSegments; i++) {
            const theta = ((i-1) / this.radialSegments) * 2 * Math.PI;
            const x = this.radius * Math.cos(theta);
            const z = this.radius * Math.sin(theta);
            
            // Base circle vertex
            this.meshComponent.verticesData = this.meshComponent.verticesData.concat([x, 0, z]);
        }
        // Apex vertex
        this.meshComponent.verticesData = this.meshComponent.verticesData.concat([0, this.height, 0]);
        
        
        //index data
        this.meshComponent.indexData = this.getDefaultConeIndices();
    }

    setTextureFaceMeshComponentData(uvRange){
        //textureFace Material
        this.setTextureMaterial();

        //layout
        this.meshComponent.layout = [
            {type:"float",count:3,name:"a_vertPosition"},
            {type:"float",count:2,name:"a_vertUV"}
        ];

        // Base center vertex
        this.meshComponent.verticesData = this.meshComponent.verticesData.concat([0, 0, 0, (uvRange[0]+uvRange[2])/2, (uvRange[1]+uvRange[3])/2]);

        // Base circle vertices
        for (let i = 1; i <= this.radialSegments; i++) {
            const theta = ((i-1) / this.radialSegments) * 2 * Math.PI;
            const x = this.radius * Math.cos(theta);
            const z = this.radius * Math.sin(theta);
            const u = uvRange[0] + ( (Math.cos(theta) + 1) / 2 ) * (uvRange[2] - uvRange[0]);
            const v = uvRange[1] + ( (Math.sin(theta) + 1) / 2 ) * (uvRange[3] - uvRange[1]);
            
            // Base circle vertex
            this.meshComponent.verticesData = this.meshComponent.verticesData.concat([x, 0, z, u, v]);
        }
        // Apex vertex
        this.meshComponent.verticesData = this.meshComponent.verticesData.concat([0, this.height, 0, (uvRange[0]+uvRange[2])/2, (uvRange[1]+uvRange[3])/2]);
        
        
        //index data
        this.meshComponent.indexData = this.getDefaultConeIndices();
    }   

    getDefaultConeIndices(){
        const indices = [];
        // Base indices
        const baseCenterIndex = 0;
        for (let i = 1; i <= this.radialSegments; i++) {
            const nextIndex = (i % this.radialSegments) + 1;
            indices.push(baseCenterIndex, nextIndex, i);
        }

        // Side indices
        const apexIndex = this.radialSegments + 1;
        for (let i = 1; i <= this.radialSegments; i++) {
            const nextIndex = (i % this.radialSegments) + 1;
            indices.push(i, nextIndex, apexIndex);
        }
        return indices;
    }
}

export{
    Cone
}