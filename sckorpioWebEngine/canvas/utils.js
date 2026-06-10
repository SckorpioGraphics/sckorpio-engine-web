/*
WebGL
*/

export function verifyWebGLSupport() {
  var gl = getWebGLContext();
  if (!gl) {
    console.log("WebGL not supported, falling back on experimential webgl");
    gl = canvas.getContext("experimental-webgl");
  }

  if (!gl) {
    alert("Your browser does not support webGL");
    console.log("our browser does not support webGL...");
  } else {
    console.log("🚀 webgl-context set OK!!!");
    // Check if the context is WebGL 2.0
    if (gl instanceof WebGL2RenderingContext) {
        console.log("✅ Sckorpio Engine Status: Running on PURE WebGL 2.0!");
    } else {
        console.warn("⚠️ Warning: Engine falling back to WebGL 1.0. Instancing might break!");
    }
  }
}

var resourceID = 0;
export function getWebGLResourceID() {
  return resourceID++;
}

export function getWebGLContext() {
  var canvas = document.getElementById("sckorpioWebEngine-webgl-surface");
  var gl = canvas.getContext("webgl2");
  return gl;
}

export let gl = getWebGLContext();

export function getWebGLCanvas() {
  var canvas = document.getElementById("sckorpioWebEngine-webgl-surface");
  return canvas;
}

export function getWebGLCanvasWidth() {
  var canvas = document.getElementById("sckorpioWebEngine-webgl-surface");
  return canvas.width;
}

export function getWebGLCanvasHeight() {
  var canvas = document.getElementById("sckorpioWebEngine-webgl-surface");
  return canvas.height;
}

export function getWebGLCanvasRatio() {
  var canvas = document.getElementById("sckorpioWebEngine-webgl-surface");
  return canvas.width / canvas.height;
}

/*
Title
*/

export function getTitleCanvas() {
  var canvas = document.getElementById("sckorpioWebEngine-2d-title-surface");
  return canvas;
}

export function getTitleContext() {
  var canvas = document.getElementById("sckorpioWebEngine-2d-title-surface");
  if (!canvas) {
    console.error("Canvas element not found.");
    return null;
  }
  var context = canvas.getContext("2d");
  if (!context) {
    console.error("Failed to get 2D context.");
  }
  return context;
}

/*
Logger
*/

export function getLoggerCanvas() {
  var canvas = document.getElementById("sckorpioWebEngine-2d-logger-surface");
  return canvas;
}

export function getLoggerContext() {
  var canvas = document.getElementById("sckorpioWebEngine-2d-logger-surface");
  if (!canvas) {
    console.error("Canvas element not found.");
    return null;
  }
  var context = canvas.getContext("2d");
  if (!context) {
    console.error("Failed to get 2D context.");
  }
  return context;
}

