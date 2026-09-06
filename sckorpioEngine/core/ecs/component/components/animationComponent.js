import { Component } from "../component.js";

class AnimationComponent extends Component {
    constructor(){
        super();
        // animation clip
        this.animationClip = null;
        // playback
        this.currentTime = 0.0;
        this.playing = false;
        this.loop = true;
        this.speed = 1.0;
    }

    setClip(clip){
        this.animationClip = clip;
        this.currentTime = 0.0;
    }

    play(){
        if(!this.animationClip){
            return;
        }
        this.playing = true;
    }

    pause(){
        this.playing = false;
    }

    stop(){
        this.playing = false;
        this.currentTime = 0.0;
    }

    setSpeed(speed){
        this.speed = speed;
    }

    isPlaying(){
        return this.playing;
    }
}

export {
    AnimationComponent
};