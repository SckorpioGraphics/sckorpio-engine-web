import { logger } from "../../canvas/logger.js";
import { gl } from "../../canvas/utils.js";
import { Mesh } from "../../core/ecs/entityList/mesh/mesh.js"

class WebGLRenderer {
    constructor() {
        this.uid = 0;
        this.cameraEntity;
        this.entityList = [];
        this.clearColor = vec3.fromValues(0.14, 0.11, 0.26);
    }

    setCamera(cameraEntity) {
        this.cameraEntity = cameraEntity;
    }

    init() {
        this.clear();
        this.enableDepthTest();
        this.enableTransparency();
    }

    enableDepthTest() {
        gl.enable(gl.DEPTH_TEST);
    }

    enableTransparency() {
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }

    clear() {
        gl.clearColor(this.clearColor[0], this.clearColor[1], this.clearColor[2], 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    setClearColor(color) {
        this.clearColor = color;
    }

    addEntity(entity) {
        this.entityList.push(entity);
    }

    addEntityList(entityList) {
        this.entityList = this.entityList.concat(entityList);
    }

    loadEntityDataToGPU() {
        this.entityList.forEach((entity)=>{
            if(entity instanceof Mesh){
                entity.loadGPUData();
            }
        });
    }

    render() {
        // Clear the canvas and enable WebGL states
        this.init();

        // reset logger data
        logger.resetFrameCounters();

        // Render each mesh from the mesh list
        this.entityList.forEach(async (entity) => {
            
            if(entity.meshComponent && entity.meshComponent.isVisible()){
                //get renderComponent
                const renderComponent = entity.meshComponent.renderComponent;
                //bind resources
                renderComponent.bind();
                
                if(renderComponent.instanced) {
                    // if instanced

                    // set is instanced uniform
                    renderComponent.setInstanced();

                    // Setting Only VP
                    renderComponent.setViewProjection(
                        this.cameraEntity.cameraComponent.getViewMatrix(),
                        this.cameraEntity.cameraComponent.getProjectionMatrix()
                    );

                    renderComponent.setColor();

                    //DrawCall
                    if(renderComponent.useElements){
                        gl.drawElementsInstanced(
                            renderComponent.topology, 
                            renderComponent.count, 
                            renderComponent.indexType, 
                            renderComponent.offset,
                            renderComponent.instanceCount
                        );
                    } else{
                        gl.drawArraysInstanced(
                            renderComponent.topology, 
                            renderComponent.offset, 
                            renderComponent.count,
                            renderComponent.instanceCount
                        );
                    }

                    // logger data (instanced)
                    logger.drawCalls += 1;
                    logger.totalTriangles += (renderComponent.count / 3) * renderComponent.instanceCount;
                } else {
                    // if just source mesh

                    // set is instanced uniform
                    renderComponent.setInstanced();
                    
                    // Setting MVP
                    renderComponent.setMVP(
                        entity.transformComponent.getModelMatrix(),
                        this.cameraEntity.cameraComponent.getViewMatrix(),
                        this.cameraEntity.cameraComponent.getProjectionMatrix()
                    );

                    renderComponent.setColor();

                    //DrawCall
                    if(renderComponent.useElements){
                        gl.drawElements(
                            renderComponent.topology, 
                            renderComponent.count, 
                            renderComponent.indexType, 
                            renderComponent.offset
                        );
                    } else{
                        gl.drawArrays(
                            renderComponent.topology, 
                            renderComponent.offset, 
                            renderComponent.count
                        );
                    }

                    // logger data (sourceMesh)
                    logger.drawCalls += 1;
                    logger.totalTriangles += (renderComponent.count / 3);
                }

                // Unbind VAO after draw call
                renderComponent.vertexArray.unbind();
                gl.bindVertexArray(null);
            }
        });

        // show logger
        logger.show();
    }
}

export { 
    WebGLRenderer 
};
