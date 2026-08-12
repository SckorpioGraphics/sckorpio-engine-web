import { Shape } from "./shape.js";
import { MeshComponent } from "../../componentList/meshComponent.js";

const defaultSphereOptions = {
    mode: 'basic',
    radius: 1.0,
    latitudeBands: 36,
    longitudeBands: 36
};
class Sphere extends Shape{
    constructor(options) {
        super();
        options = Object.assign({}, defaultSphereOptions, options);

        //Sphere data
        this.mode = options.mode;
        this.radius = options.radius;
        this.latitudeBands = options.latitudeBands;
        this.longitudeBands = options.longitudeBands;
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
            case 'texture': this.setTextureMeshComponentData(); break;
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

        //vertices data
        for (let latNumber = 0; latNumber <= this.latitudeBands; ++latNumber) {
            const theta = latNumber * Math.PI / this.latitudeBands;
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);
            
            for (let lonNumber = 0; lonNumber <= this.longitudeBands; ++lonNumber) {
                const phi = lonNumber * 2 * Math.PI / this.longitudeBands;
                const sinPhi = Math.sin(phi);
                const cosPhi = Math.cos(phi);
                
                const x = this.radius * cosPhi * sinTheta;
                const y = this.radius * cosTheta;
                const z = this.radius * sinPhi * sinTheta;
                
                this.meshComponent.vertexData = this.meshComponent.vertexData.concat([x, y, z]);
            }
        }

        //index data
        for (let latNumber = 0; latNumber < this.latitudeBands; ++latNumber) {
            for (let lonNumber = 0; lonNumber < this.longitudeBands; ++lonNumber) {
                const first = (latNumber * (this.longitudeBands + 1)) + lonNumber;
                const second = first + this.longitudeBands + 1;
                
                this.meshComponent.indexData = this.meshComponent.indexData.concat([first, second, first + 1]);
                this.meshComponent.indexData = this.meshComponent.indexData.concat([second, second + 1, first + 1]);
            }
        }
    }

    setTextureMeshComponentData(){
        // 1. Set up your textured material defaults
        this.setTextureMaterial(); // Or your equivalent textured material setter
        
        // 2. Define your layout tracking both position and texture coordinates
        this.meshComponent.layout = [
            {type:"float",count:3,name:"a_vertPosition"},
            {type:"float",count:2,name:"a_vertUV"}
        ];

        // 3. Clear/initialize data targets
        this.meshComponent.vertexData = [];
        this.meshComponent.indexData = [];

        // 4. Vertices and UV Data Generation
        for (let latNumber = 0; latNumber <= this.latitudeBands; ++latNumber) {
            // v ranges perfectly from 0.0 (top pole) to 1.0 (bottom pole)
            const v = latNumber / this.latitudeBands; 
            
            const theta = v * Math.PI;
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);
            
            for (let lonNumber = 0; lonNumber <= this.longitudeBands; ++lonNumber) {
                // u ranges perfectly from 0.0 to 1.0 around the seam equator
                const u = lonNumber / this.longitudeBands;
                
                const phi = u * 2 * Math.PI;
                const sinPhi = Math.sin(phi);
                const cosPhi = Math.cos(phi);
                
                // Mathematical 3D Spatial Positions
                const x = this.radius * cosPhi * sinTheta;
                const y = this.radius * cosTheta;
                const z = this.radius * sinPhi * sinTheta;
                
                // Push data to vertex stream matching your layout sequence: X, Y, Z, U, V
                this.meshComponent.vertexData.push(x, y, z, u, v);
            }
        }

        // 5. Index Data Generation (Remains exactly identical to your basic mesh math)
        for (let latNumber = 0; latNumber < this.latitudeBands; ++latNumber) {
            for (let lonNumber = 0; lonNumber < this.longitudeBands; ++lonNumber) {
                const first = (latNumber * (this.longitudeBands + 1)) + lonNumber;
                const second = first + this.longitudeBands + 1;
                
                this.meshComponent.indexData.push(first, second, first + 1);
                this.meshComponent.indexData.push(second, second + 1, first + 1);
            }
        }
    }
}

export{
    Sphere
}