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
        this.meshComponent.unloadGPUData();
        this.meshComponent.loadGPUData();
    }   

    setMeshComponentData(){
        switch (this.mode) {
            case 'basic': this.setBasicSphereMeshComponentData(); break;
            // Future modes can be added here
        }
    }

    setBasicSphereMeshComponentData(){
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
                
                this.meshComponent.verticesData = this.meshComponent.verticesData.concat([x, y, z]);
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
}

export{
    Sphere
}