
const MAX_VERTS = 1000;
const MAX_WEIGHT = 100;
const MAX_EDGE_WIDTH = 5;
const MIN_EDGE_WIDTH = 0.5;
const VERT_RADIUS = 10;
const DEPTH = 100;

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

/** @type {Camera} */
let camera;

const main = () => {

    setup();
    
    requestAnimationFrame(update);
}

const setup = () => {

    camera = new Camera();
    Controller.setListeners();

    Builder.startBuild(DEPTH);
    

}

const update = () => {
    Controller.inputLoops();
    camera.draw();

    requestAnimationFrame(update);
}
