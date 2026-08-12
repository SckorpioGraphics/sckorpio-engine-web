import { VertexArray } from "../../../renderer/webgl/buffer/vertexArray.js";
import { VertexBuffer } from "../../../renderer/webgl/buffer/vertexBuffer.js";
import { IndexBuffer } from "../../../renderer/webgl/buffer/indexBuffer.js";
import { InstanceBuffer } from "../../../renderer/webgl/buffer/instanceBuffer.js";
import { BufferLayout } from "../../../renderer/webgl/buffer/bufferLayout.js";
import { gl } from "../../../canvas/utils.js";

class RenderComponent{
    constructor() {
        this.uid = 0;

        //geometry data
        this.vertexArray;
        this.vertexBuffer;
        this.vertexBufferLayout;
        this.indexBuffer;
        this.useElements = false;
        this.indexType = gl.UNSIGNED_SHORT;
        this.topology = gl.TRIANGLES;
        this.offset = 0;
        this.count;

        //material
        this.material;

        //instanceData
        this.isInstanced = false;
        this.instanceCount = 0;
        this.instanceBuffer = null;
        this.instanceBufferLayout;
    }

    setData(vertexDataLayout,vertexData,indexData){
        //GPU buffers creation
 
        //vertex array
        this.vertexArray = new VertexArray()
        this.vertexArray.generate();

        //vertex buffer
        this.vertexBuffer = new VertexBuffer();
        this.vertexBuffer.generate(vertexData);

        //Vertex Buffer layout
        this.vertexBufferLayout = new BufferLayout('vertex');
        let layoutSize = 0;
        let attribLocation;
    
        vertexDataLayout.forEach((layoutElement) => {
            //finding attrib location from attached shader
            attribLocation = this.material.shader.getAttribLocation(layoutElement.name);

            //creating layout
            if(layoutElement.type == "float"){
                this.vertexBufferLayout.pushFloat(layoutElement.count,attribLocation);
            } else if(layoutElement.type == "int"){
                this.vertexBufferLayout.pushInt(layoutElement.count,attribLocation);
            }
            layoutSize += layoutElement.count;
        });
        
        //add vertex buffer & layout to vertex Array
        this.vertexArray.addBuffer(this.vertexBuffer,this.vertexBufferLayout);

        //set count to vertices size
        this.count = vertexData.length/layoutSize;
    
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

    setInstancedData(instanceDataLayout,instanceData,totalInstances){
        // set isInstanced flag = true
        this.isInstanced = true;
        this.instanceCount = totalInstances;

        // Instance Buffer
        this.instanceBuffer = new InstanceBuffer();
        this.instanceBuffer.generate(instanceData, totalInstances);

        // Instance Buffer Layout
        this.instanceBufferLayout = new BufferLayout('instance');
        let layoutSize = 0;
        let attribLocation;
    
        instanceDataLayout.forEach((layoutElement) => {
            //finding attrib location from attached shader
            attribLocation = this.material.shader.getAttribLocation(layoutElement.name);

            //creating layout
            if (layoutElement.type == "mat4f") {
                this.instanceBufferLayout.pushMat4f(attribLocation);
            } else if(layoutElement.type == "float"){
                this.instanceBufferLayout.pushFloat(layoutElement.count,attribLocation);
            } else if(layoutElement.type == "int"){
                this.instanceBufferLayout.pushInt(layoutElement.count,attribLocation);
            }
            layoutSize += layoutElement.count;
        });
        
        //add vertex buffer & layout to vertex Array
        this.vertexArray.addBuffer(this.instanceBuffer,this.instanceBufferLayout);

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
        // set color of material
        if(this.material.shader.shaderName == "basic3D"){
            this.material.shader.setUniform3fv("u_color",this.material.color);
        }
    }

    setIsInstanced(){
        // set isInstanced in shader
        if(this.isInstanced){
            this.material.shader.setUniform1i("u_isInstanced",1);
        } else {
            this.material.shader.setUniform1i("u_isInstanced",0);
        }
        
    }

    setMVP(model,view,projection){
        // set MVP
        this.material.shader.setUniformMat4f("u_model",model);
        this.material.shader.setUniformMat4f("u_view",view);
        this.material.shader.setUniformMat4f("u_projection",projection);
    }

    setViewProjection(view, projection) {
        // set VP
        this.material.shader.setUniformMat4f("u_view",view);
        this.material.shader.setUniformMat4f("u_projection",projection);
    }

    

    bind(){
        //bind GPU buffers (NOTE:Keep order stict like this)
        this.vertexArray.bind();
        //this.vertexBuffer.bind();
        // if(this.useElements){
        //     this.indexBuffer.bind();
        // }
        
        //bind shader
        this.material.shader.bind();

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