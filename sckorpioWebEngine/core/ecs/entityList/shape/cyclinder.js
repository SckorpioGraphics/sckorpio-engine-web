import { Shape } from "./shape.js";

const defaultCyclinderOptions = {
    mode: 'basic',
    radius: 1.0,
    height: 1.0,
    radialSegments: 36,
    uvRange: [0, 0, 1, 1]
};

class Cyclinder extends Shape{
    constructor(options) {
        super();
        options = Object.assign({}, defaultCyclinderOptions, options);

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
            case 'basic': this.setBasicMeshComponentData(); break;
            case 'textureFace': this.setTextureFaceMeshComponentData(this.uvRange); break;
            // Future modes can be added here
        }
    }

    setBasicMeshComponentData(){
        //basic material
        this.setBasicMaterial();
        
        //layout
        this.meshComponent.layout = [
            {type:"float",count:3,name:"a_vertPosition"}
        ];

        //bottom circle vertices
        for (let i = 0; i < this.radialSegments; i++) {
            const theta = (i / this.radialSegments) * 2 * Math.PI;
            const x = this.radius * Math.cos(theta);
            const z = this.radius * Math.sin(theta);
            this.meshComponent.vertexData = this.meshComponent.vertexData.concat([x, 0, z]);
        }
        //top circle vertices
        for (let i = 0; i < this.radialSegments; i++) {
            const theta = (i / this.radialSegments) * 2 * Math.PI;
            const x = this.radius * Math.cos(theta);
            const z = this.radius * Math.sin(theta);
            this.meshComponent.vertexData = this.meshComponent.vertexData.concat([x, this.height, z]);
        }
        
        //bottom center vertex
        this.meshComponent.vertexData = this.meshComponent.vertexData.concat([0, 0, 0]);

        //top center vertex
        this.meshComponent.vertexData = this.meshComponent.vertexData.concat([0, this.height, 0]);
        
        //index data
        this.meshComponent.indexData = this.setDefaultCyclinderIndices();
    }

    setDefaultCyclinderIndices(){
        let indices = [];

        //side faces
        for (let i = 0; i < this.radialSegments; ++i) {
            const bottom = i;
            const bottomNext = ( (i + 1) % this.radialSegments );
            const top = i + this.radialSegments;
            const topNext = ( ( (i + 1) % this.radialSegments ) + this.radialSegments );

            indices = indices.concat([
                bottom, top, bottomNext,
                top, topNext, bottomNext
            ]);
        }

        //bottom faces
        const bottomCenterIndex = this.radialSegments * 2;
        const bottomStartIndex = 0;
        for (let i = 0; i < this.radialSegments; ++i) {
            const bottom = bottomStartIndex + i;
            const next = bottomStartIndex + ( (i + 1) % this.radialSegments );

            indices = indices.concat([
                bottomCenterIndex, next, bottom
            ]);
        }

        //top faces
        const topCenterIndex = this.radialSegments * 2 + 1;
        const topStartIndex = this.radialSegments;
        for (let i = 0; i < this.radialSegments; ++i) {
            const top = topStartIndex + i;
            const next = topStartIndex + ( (i + 1) % this.radialSegments );

            indices = indices.concat([
                topCenterIndex, top, next
            ]);
        }

        return indices; 
    }
}

export { Cyclinder };