class Controller
{
    static m1 = null;
    static m2 = null;
    static m3 = null;

    static lastMousePos = new Vector2();

    static inputLoops(){
        if (Controller.m1){

        }
        if (Controller.m3){

        }
    }

    static setListeners(){

        canvas.addEventListener("mousedown", function(e){
            switch (e.button) {
                case 0:
                    Controller.m1 = Date.now();
                    break;
                case 1:
                    Controller.m2 = Date.now();
                    break;
                case 2:
                    Controller.m3 = Date.now();
                    break;
                default:
                    break;
            }
        });

        canvas.addEventListener("click", function (e){
            if (Date.now() - Controller.m1 < 200){
                
                const worldPos = camera.screenToWorldPosition(new Vector2(e.x, e.y));

                for (let vert of Vert.verts){
                    if (Vector2.distance(vert.position, worldPos) < VERT_RADIUS){
                        if(!Dijkstra.spt[vert.id]) continue;
                        Camera.clearPathColors();
                        Camera.clearVertColors();
                        Dijkstra.showPath(vert.id, Dijkstra.parent[vert.id]);
                    }
                }

            }

            Controller.m1 = null;
        });

        canvas.addEventListener("mouseup", function(e){
            if (e.button == 1){
                Controller.m2 = null;
            }
        });

        // document.addEventListener("mouseup", function(e){
        //     if (e.button == 0){
        //         Controller.m1 = null;
        //     }
        // });

        document.addEventListener("mousemove", function(e){
            if (Controller.m2){
                let offset = new Vector2(e.x, e.y).sub(Controller.lastMousePos).scale(-camera.size);
                camera.translate(offset);
            }
            Controller.lastMousePos = new Vector2(e.x, e.y);
        });

        canvas.addEventListener("wheel", function(e){
            if (e.wheelDeltaY < 1){
                camera.applyZoom(1.1);
            } else {
                camera.applyZoom(0.9);
            }
        });

        canvas.addEventListener("contextmenu", function(e){
            e.preventDefault();
            const worldPos = camera.screenToWorldPosition(new Vector2(e.x, e.y));

            for (let vert of Vert.verts){
                if (Vector2.distance(vert.position, worldPos) < VERT_RADIUS){
                    Dijkstra.root = vert;
                    Camera.clearSptColors();
                    Camera.clearPathColors();
                    Camera.clearVertColors();
                    Dijkstra.startSolve();
                }
            }
            Controller.m3 = null;
        });

        document.addEventListener("keypress", (e) => {

        });

        document.addEventListener("mouseleave", (e) => {
            this.m1 = null;
            this.m2 = null;
            this.m3 = null;
        });

        document.addEventListener("keydown", (e) => {
            // if (e.code == "F2"){
            //     camera.saveScreenshot();
            // }
        });

    }

}