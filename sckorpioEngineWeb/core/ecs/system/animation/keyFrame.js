class KeyFrame {
    constructor(time, value) {
        // Time in seconds
        this.time = time;

        // Value of property: "position", "rotation", "scale", "opacity", "color", etc...
        this.value = value;
    }
}

export {
    KeyFrame
};