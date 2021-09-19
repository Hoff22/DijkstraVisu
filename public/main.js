
const MAX_VERTS = 1000;
const MAX_WEIGHT = 100;
const MAX_EDGE_WIDTH = 3;
const VERT_RADIUS = 10;

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

    let curP = new Vector2();
    let curV = new Vert(curP);

    setInterval(() => {
        let newV = new Vert(curP.add(new Vector2(0, Math.random() * 50 + 50).rotate(Math.random() * Math.PI * 2)));
        curV.pushChild(newV, Math.floor(Math.random() * (MAX_WEIGHT - 1) + 1));
        curV = newV;
        curP = curV.position;
    }, 1000);

}

const update = () => {
    Controller.inputLoops();
    camera.draw();

    requestAnimationFrame(update);
}
