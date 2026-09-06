import { Mesh } from "../mesh.js";
import { MeshComponent } from "../../../../component/components/meshComponent.js";

class Grid extends Mesh{
    constructor(gridCount = 10.0, gridGap = 1.0){
        //constructor of Mesh Component
        super();

        //grid data
        this.gridCount = gridCount;
        this.gridGap = gridGap;
        this.setMeshComponentData();
    }

    setMeshComponentData(){
        //layout
        this.meshComponent.layout = [
            {type:"float",count:3,name:"a_vertPosition"}
        ];

        //fill Vertex data
        this.fillGridLinesVertices();

        //set topology
        this.meshComponent.renderComponent.setTopology("lines");
    }

    fillGridLinesVertices(){
        //Addling line parallel to Y axis
        for(let i = -this.gridCount; i <= this.gridCount; i++){
            let x1 = i * this.gridGap;
            let y1 = 0.0;
            let z1 = this.gridCount * this.gridGap;
            
            let x2 = i * this.gridGap;
            let y2 = 0.0;
            let z2 = -(this.gridCount * this.gridGap);
            
            this.meshComponent.vertexData = this.meshComponent.vertexData.concat([
                x1,y1,z1,
                x2,y2,z2
            ]);
        }

        //Addling line parallel to X axis
        for(let i = -this.gridCount; i <= this.gridCount; i++){
            let x1 = this.gridCount * this.gridGap;
            let y1 = 0.0;
            let z1 = i * this.gridGap;
            
            let x2 = -(this.gridCount * this.gridGap);
            let y2 = 0.0;
            let z2 = i * this.gridGap;
            
            this.meshComponent.vertexData = this.meshComponent.vertexData.concat([
                x1,y1,z1,
                x2,y2,z2
            ]);
        }
    }
}

export{
    Grid
}