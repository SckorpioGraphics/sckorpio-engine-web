import { VertexArray } from "../../../renderer/webgl/buffer/vertexArray.js";
import { VertexBuffer } from "../../../renderer/webgl/buffer/vertexBuffer.js";
import { IndexBuffer } from "../../../renderer/webgl/buffer/indexBuffer.js";
import { BufferLayout } from "../../../renderer/webgl/buffer/bufferLayout.js";
import { gl } from "../../canvas/utils.js";

class RenderComponent{
    constructor() {
        this.uid = 0;
        //geometry data
        this.vertexArray;
        this.vertexBuffer;
        this.layout;
        this.indexBuffer;
        this.useElements = false;
        this.indexType = gl.UNSIGNED_SHORT;
        this.topology = gl.TRIANGLES;
        this.offset = 0;
        this.count;
        //material
        this.material;
    }

    setData(layoutData,verticesData,indexData){
        //GPU buffers creation
 
        //vertex array
        this.vertexArray = new VertexArray()
        this.vertexArray.generate();

        //vertex buffer
        this.vertexBuffer = new VertexBuffer();
        this.vertexBuffer.generate(verticesData);

        //Vertex Buffer layout
        this.layout = new BufferLayout();
        let layoutSize = 0;
        let attribLocation;
    
        layoutData.forEach((layoutDataElement) => {

            //finding attrib location from attached shader
            attribLocation = this.material.shader.getAttribLocation(layoutDataElement.name);

            //creating layout
            if(layoutDataElement.type == "float"){
                this.layout.pushFloat(layoutDataElement.count,attribLocation);
            } else if(layoutDataElement.type == "int"){
                this.layout.pushInt(layoutDataElement.count,attribLocation);
            }
            layoutSize += layoutDataElement.count;
        });
        
        //add vertex buffer & layout to vertex Array
        //console.log("passing",this.shader);
        this.vertexArray.addBuffer(this.vertexBuffer,this.layout);

        //set count to vertices size
        this.count = verticesData.length/layoutSize;
    
        //index buffer
        if(indexData.length > 0){
            //will use elements
            this.useElements = true;

            //set count to indices size
            this.count = indexData.length;
            
            //index buffer
            this.indexBuffer = new IndexBuffer();
            this.indexBuffer.generate(indexData);
        }
    }

    setTopology(topology){
        //set topology
        if(topology == "triangles"){
            this.topology = gl.TRIANGLES;
        } else if(topology == "lines"){
            this.topology = gl.LINES;
        }
    }

    setMaterial(material){
        //set material
        this.material = material;
    }

    setColor(){
        if(this.material.shader.shaderName == "basic3D"){
            this.material.shader.setUniform3fv("u_color",this.material.color);
        }
    }

    setMVP(model,view,projection){
        // set MVP
        this.material.shader.setUniformMat4f("u_model",model);
        this.material.shader.setUniformMat4f("u_view",view);
        this.material.shader.setUniformMat4f("u_projection",projection);
    }

    bind(){
        //bind GPU buffers (NOTE:Keep order stict like this)
        this.vertexArray.bind();
        this.vertexBuffer.bind();
        if(this.useElements){
            this.indexBuffer.bind();
        }
        
        //bind shader
        this.material.shader.bind();

        //console.log("is textur?? =",this.texture);
        //bind texture
        if(this.material.texture){
            this.material.texture.bind();
        }
    }

    unbind(){
        //Unbind GPU buffers (NOTE:Keep order strict like this)
        this.vertexArray.unbind();
        this.vertexBuffer.unbind();
        if(this.useElements){
            this.indexBuffer.unbind();
        }

        //Unbind shader
        this.material.shader.unbind();

        //Unbind texture
        if(this.texture){
            this.material.texture.unbind();
        }
    }
}

export{
    RenderComponent
}