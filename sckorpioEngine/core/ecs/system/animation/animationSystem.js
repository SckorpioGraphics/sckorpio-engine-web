class AnimationSystem {
    constructor() {
        // Entities having Animation Component
        this.entities = [];
    }

    // Add Entity
    addEntity(entity) {
        this.entities.push(entity);
    }

    // Add Entity List
    addEntities(entityList) {
        for(const entity of entityList) {
            this.addEntity(entity);
        }
    }

    update(deltaTime) {
        for(const entity of this.entities) {

            // Animation Component
            const animationComponent = entity.animationComponent;
            if(!animationComponent) {
                continue;
            }

            // Animation Clip
            const animationClip = animationComponent.animationClip;
            if(!animationClip) {
                continue;
            }

            // Is Playing?
            if(!animationComponent.playing) {
                continue;
            }

            //================================
            // Animation Time
            //================================

            // Update Animation Time
            animationComponent.currentTime += deltaTime * animationComponent.speed;

            // Handle When Animation Clip 'End'
            if(animationClip.duration > 0.0) {
                // if current time > clip duration (ENDs)
                if(animationComponent.currentTime >= animationClip.duration){
                    // check if looping was ON..
                    if(animationComponent.loop) { 
                        // Repeat it!
                        animationComponent.currentTime = animationComponent.currentTime % animationClip.duration;
                    } else { 
                        // END it!
                        animationComponent.currentTime = animationClip.duration;
                        animationComponent.playing = false;
                    }
                }
            }

            //================================
            // Now Evaluate Animation
            //================================

            const animationResult = animationClip.evaluate(animationComponent.currentTime);

            //================================
            // Apply Animation 
            //================================
            // Currently Animation Clips have only TRS property
            // So now we are applying only to Transform component
            // for future.. Light intensity, opacity, colors etc...

            if(entity.transformComponent) {
                entity.transformComponent.applyAnimation(animationResult);
            }

        }
    }

}

export {
    AnimationSystem
}