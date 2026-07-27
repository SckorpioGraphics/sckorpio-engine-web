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

    // --- Default Theme State ---
    this.theme = {
      headerColor: '#1F1135',         // Ultra-deep midnight purple (Max contrast for labels)
      headerShadow: 'transparent',
      valueColor: '#4C2B85',          // Rich, deeply saturated dark royal purple (Punchy numbers)
      valueShadow: 'transparent'      // Completely remove shadow to avoid muddy anti-aliasing
    };

    this.setEventlisteners();
  }

  // --- Dynamic Theme Setter ---
  setThemeMode(mode) {
    if (mode === 'light' || mode === 'cyan') {
      // Light Mode: 
      this.theme = {
        headerColor: '#1F1135',         // Ultra-deep midnight purple (Max contrast for labels)
        headerShadow: 'transparent',
        valueColor: '#4C2B85',          // Rich, deeply saturated dark royal purple (Punchy numbers)
        valueShadow: 'transparent'      // Completely remove shadow to avoid muddy anti-aliasing
      };
    } else {
      // Dark Mode: 
      this.theme = {
        headerColor: '#C5BCE0',         // Sleek, pastel silver-purple (Instead of generic silver)
        headerShadow: 'rgba(197, 188, 224, 0.2)',
        valueColor: '#00FFFF',          // Classic neon cyan
        valueShadow: 'rgba(0, 255, 255, 0.6)' // Your tightened neon glow (blur: 15)
      };
    }
  }

  show() {
    if (this.isEnabled) {
      this.calculateFPS();
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
    }

    this.prevTimeStamp = timestamp;
    this.frameCount++;
  }

  displayLogs() {
    const canvas = getLoggerCanvas();
    const context2D = getLoggerContext();
    context2D.clearRect(0, 0, canvas.width, canvas.height);
    
    context2D.textAlign = 'left';
    context2D.textBaseline = 'top';

    //Sckorpio Engine Title ---
    context2D.font = 'bold 24px Inter, Arial, sans-serif'; // Sized up from 22px
    context2D.fillStyle = this.theme.valueColor;
    context2D.shadowColor = this.theme.valueShadow;
    context2D.shadowBlur = 25; 
    context2D.fillText("Sckorpio Engine", 10, 10);

    // --- Reset Font Size ---
    context2D.font = 'bold 20px Inter, Arial, sans-serif'; 
    context2D.shadowBlur = 15; // Consistent tight glow

    //FPS Row ---
    context2D.fillStyle = this.theme.headerColor;
    context2D.fillText("FPS: ", 10, 50);
    context2D.fillStyle = this.theme.valueColor;
    context2D.fillText(this.fps.toString(), 70, 50);

    //Frame Time Row ---
    context2D.fillStyle = this.theme.headerColor;
    context2D.fillText("Frame time: ", 10, 90);
    context2D.fillStyle = this.theme.valueColor;
    context2D.fillText(this.frameTime.toFixed(0).toString() + " ms", 145, 90);

    //Draw Calls Row ---
    context2D.fillStyle = this.theme.headerColor;
    context2D.fillText("Draw Calls: ", 10, 130);
    context2D.fillStyle = this.theme.valueColor;
    context2D.fillText(this.drawCalls.toString(), 145, 130);

    //Triangles Count Row ---
    context2D.fillStyle = this.theme.headerColor;
    context2D.fillText("Triangles: ", 10, 170);
    context2D.fillStyle = this.theme.valueColor;
    context2D.fillText(this.totalTriangles.toLocaleString(), 125, 170);
  }

  setEventlisteners() {
    window.addEventListener('keydown', (event) => {
      if (event.key === "L" || event.key === "l") {
        if (this.isEnabled) {
          this.isEnabled = false;
          getLoggerCanvas().style.display = "none";
        } else {
          this.isEnabled = true;
          getLoggerCanvas().style.display = "block";
        }
      }
    });
  }
}

export const logger = new Logger();