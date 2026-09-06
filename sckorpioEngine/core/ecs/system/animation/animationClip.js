class AnimationClip {
    constructor(name) {
        // name
        this.name = name;
        // tracks  
        // This can be [TrackPosition,TrackRotation,TrackScale,TrackOpacity...etc]
        this.tracks = [];   
        // duration   
        this.duration = 0.0;
    }

    addTrack(track) {
        // push the track
        this.tracks.push(track);

        // Update duration
        const trackDuration = track.getDuration();
        if(trackDuration > this.duration) {
            this.duration = trackDuration;
        }
    }

    evaluate(time){
        const result = {};

        // Evaluate all tracks at 'time'
        for(const track of this.tracks) {
            result[track.property] = track.evaluate(time);
        }

        // return result of all tracks at 'time' 
        return result;
    }
}

export {
    AnimationClip
};