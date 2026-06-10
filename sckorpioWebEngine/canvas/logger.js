import { getLoggerCanvas, getLoggerContext } from "./utils.js";

class Logger {
  constructor() {
    this.lastTime = 0;
    this.deltaTime = 0;
    this.frameCount = 0;

    this.prevTimeStamp = 0;
    this.frameTime = 0;
    this.fps = 0;

    this.drawCalls = 0;
    this.totalTriangles = 0;

    this.isEnabled = false;

    this.setEventlisteners();
  }

  show() {
    //console.log("logger show");
    if (this.isEnabled) {
      //calculate logs
      this.calculateFPS();
      //display logs
      this.displayLogs();
    }
  }

  resetFrameCounters() {
    this.drawCalls = 0;
    this.totalTriangles = 0;
  }

  calculateFPS() {
    const timestamp = performance.now();
    this.deltaTime = timestamp - this.lastTime;
    
    if (this.deltaTime >= 1000) {
      this.fps = this.frameCount;
      this.frameTime = timestamp - this.prevTimeStamp;
      this.frameCount = 0;
      this.lastTime = timestamp;
      this.deltaTime = 0;
      
      // console.clear();
      // console.log("##### LOGGER #####");
      // console.log("FPS:", this.fps);
      // console.log("Frame Time:",this.frameTime);
    }

    this.prevTimeStamp = timestamp;
    this.frameCount++;
  }

  displayLogs() {
    const canvas = getLoggerCanvas();
    const context2D = getLoggerContext();
    context2D.clearRect(0, 0, canvas.width, canvas.height);
    context2D.font = '22px Arial';
    context2D.textAlign = 'left';
    context2D.textBaseline = 'top';

    //FPS
    context2D.fillStyle = 'silver';
    context2D.shadowColor = 'white';
    context2D.shadowBlur = 70;
    context2D.fillText("FPS: ", 10, 10);

    context2D.fillStyle = 'cyan';
    context2D.shadowColor = 'cyan';
    context2D.shadowBlur = 70;
    context2D.fillText(this.fps.toString(), 80, 10);

    //Frame Time
    context2D.fillStyle = 'silver';
    context2D.shadowColor = 'white';
    context2D.shadowBlur = 70;
    context2D.fillText("Frame time: ", 10, 50);

    context2D.fillStyle = 'cyan';
    context2D.shadowColor = 'cyan';
    context2D.shadowBlur = 70;
    context2D.fillText(this.frameTime.toFixed(0).toString()+ " ms", 180, 50);

    // Draw Calls
    context2D.fillStyle = 'silver';
    context2D.fillText("Draw Calls: ", 10, 90);
    context2D.fillStyle = 'cyan';
    context2D.fillText(this.drawCalls.toString(), 185, 90);

    context2D.fillStyle = 'silver';
    context2D.fillText("Triangles: ", 10, 130);
    context2D.fillStyle = 'cyan';
    context2D.fillText(this.totalTriangles.toLocaleString(), 165, 130);

  }

  setEventlisteners() {
    // For the Logger
    window.addEventListener('keydown', (event) => {
      if (event.key === "L" || event.key === "l") {
        if (this.isEnabled) {
          //disable
          this.isEnabled = false;
          //hide the 2d canvas
          getLoggerCanvas().style.display = "none";
        } else {
          //enable
          this.isEnabled = true;
          //hide the 2d canvas
          getLoggerCanvas().style.display = "block";
        }
      }
    });
  }

}

// Start FPS tracking
export const logger = new Logger();

