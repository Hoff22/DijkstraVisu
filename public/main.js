
const MAX_VERTS = 1000;
const MAX_WEIGHT = 100;
const MAX_EDGE_WIDTH = 5;
const MIN_EDGE_WIDTH = 0.5;
const VERT_RADIUS = 10;
const DEPTH = 100;
const SEED = new URLSearchParams(window.location.search).get("seed") || undefined;

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

    Builder.startBuild(SEED);

    let aPos = new Vector2();
    for (let v of Vert.verts){
        aPos = aPos.add(v.position);
    }
    camera.position = aPos.scale(1 / (Vert.id));
    camera.size = 1;

}

const update = () => {
    Controller.inputLoops();
    camera.draw();

    requestAnimationFrame(update);
}
