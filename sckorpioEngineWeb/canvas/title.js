import { getTitleCanvas, getTitleContext } from "./utils.js";
class Title {
    constructor() {
        this.setEventlisteners();
    }

    setIconTitle() {
        const canvas = getTitleCanvas();
        const context = getTitleContext();
        context.clearRect(0, 0, canvas.width, canvas.height);
    
        // Load the image
        const img = new Image();
        img.src = "sckorpioEngineWeb/canvas/resources/textures/sckorpioEngineLogo.png"; // Use correct path or URL
    
        // antialiasing
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';

        img.onload = function () {
            // add glow effect
            context.shadowColor = 'cyan';
            context.shadowBlur = 20;
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;

            // glow over image
            context.drawImage(img, 0, 0, 160, 80);  // x, y, width, height
        };
    }

    setEventlisteners() {
        // For the Title
        document.addEventListener('DOMContentLoaded',()=>{
            this.setIconTitle();
        });
    }
}

// To show title
export const title = new Title();
