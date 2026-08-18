import { KeyFrame } from "./keyframe.js";

import {
    scalarLerp,
    vec2Lerp,
    vec3Lerp,
    vec4Lerp
} from "./interpolators.js";

class AnimationTrack {

    constructor(property, valueType, keyFrames = []){
        // property: "position", "rotation", "scale", "opacity", "color", etc...
        this.property = property;
        // type: "float", "vec2", "vec3", "vec4"
        this.valueType = valueType;
        // keyFrames
        this.keyFrames = [];
        // add initial keyFrames
        for(const keyFrame of keyFrames) {
            this.addKeyFrame(keyFrame.time, keyFrame.value);
        }
    }

    addKeyFrame(time, value){
        // create a new keyFrame
        const keyFrame = new KeyFrame(time, value);
        // push into keyFrames
        this.keyFrames.push(keyFrame);
        // sort keyFrames according to time
        this.keyFrames.sort(
            (a,b) => a.time - b.time
        );
    }

    getDuration(){
        // if no keyFrames
        if(this.keyFrames.length === 0){
            return 0;
        }
        // return the time of last keyFrame
        return this.keyFrames[this.keyFrames.length - 1].time;
    }

    evaluate(time){        
        // if no keyFrame
        if(this.keyFrames.length === 0){
            return null;
        }

        // first & last keyFrame
        const firstKeyFrame = this.keyFrames[0];
        const lastKeyFrame = this.keyFrames[this.keyFrames.length - 1];

        // time before < First keyFrame time
        // return first keyFrame value
        if(time <= firstKeyFrame.time){
            return firstKeyFrame.value;
        }

        // time after > Last keyFrame time
        // return last keyFrame
        if(time >= lastKeyFrame.time){
            return lastKeyFrame.value;
        }

        // first keyFrame time < time between < last keyFrame time
        let previousKeyFrame = null;
        let nextKeyFrame = null;

        // pick the prev & next keyFrame
        for(let i = 0; i < this.keyFrames.length - 1; i++){
            const current = this.keyFrames[i];
            const next = this.keyFrames[i + 1];

            if(time >= current.time && time <= next.time){
                previousKeyFrame = current;
                nextKeyFrame = next;
                break;
            }
        }

        // Interpolation factor
        const alpha = (time - previousKeyFrame.time)/(nextKeyFrame.time - previousKeyFrame.time);

        // Final result value by interpolation
        const result = this.interpolateValue(this.valueType,previousKeyFrame,nextKeyFrame,alpha);

        return result;
    }

    interpolateValue(valueType,previousKeyFrame,nextKeyFrame,alpha){
        switch (valueType) {

            case "float":
                return scalarLerp(
                    previousKeyFrame.value,
                    nextKeyFrame.value,
                    alpha
                );


            case "vec2":
                return vec2Lerp(
                    previousKeyFrame.value,
                    nextKeyFrame.value,
                    alpha
                );


            case "vec3":
                return vec3Lerp(
                    previousKeyFrame.value,
                    nextKeyFrame.value,
                    alpha
                );


            case "vec4":
                return vec4Lerp(
                    previousKeyFrame.value,
                    nextKeyFrame.value,
                    alpha
                );


            default:
                console.error(
                    `Unsupported animation value type: ${this.valueType}`
                );

                return null;
        }

    }

}

export {
    AnimationTrack
};
