
const MAX_VERTS = 50000;
const MAX_WEIGHT = 100;
const MAX_EDGE_WIDTH = 3;
const MIN_EDGE_WIDTH = 0.5;
const VERT_RADIUS = 10;
const SEED = new URLSearchParams(window.location.search).get("seed") || undefined;

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

/** @type {Camera} */
let camera;

const main = () => {
    setup();
    update();
    lateSetup();
}

const setup = () => {

    camera = new Camera();
    Controller.setListeners();

    Builder.startBuild(SEED);

}

const lateSetup = () => {

    const points = [];
    for (let v of Vert.verts) points.push(v.position);
    let vertsBB = Vector2.boundingBox(points);
    camera.position = vertsBB.center;
    camera.size = Math.max((Math.max(vertsBB.size.y, vertsBB.size.x) + VERT_RADIUS * 2) * 1.1 / Math.min(canvas.width, canvas.height), 0.05);

    // camera.draw();

}

const update = () => {
    // const start = Date.now();

    Controller.inputLoops();
    Utils.doCoroutines();
    camera.draw();

    console.log(Controller.lastMousePos);

    // console.log(`Took ${Date.now() - start}ms`);
    requestAnimationFrame(update);
}

const test = () => {
    

    final = Camera.transformMatrices(arr, [camera.position.x, camera.position.y, camera.size, canvas.width, canvas.height]);

    ctx.fillStyle = "#ffffff";
    const radius = camera.worldToScreenLength(VERT_RADIUS);
    for (let i = 0; i < Vert.id; i++){
        ctx.beginPath();
        ctx.arc(final[i * 2], final[i * 2 + 1], radius, 0, 7);
        ctx.fill()
    }

    // camera.drawVerts();

}
