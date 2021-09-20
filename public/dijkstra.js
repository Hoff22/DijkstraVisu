class Dijkstra{

    static speed = 20;

    static root = null;

    static spt = new Array(MAX_VERTS);
    
    static dist = new Array(MAX_VERTS);
    
    static parent = new Array(MAX_VERTS);
    
    static pq = new PriorityQueue((a, b) => Dijkstra.dist[a.id] < Dijkstra.dist[b.id]);

    static async startSolve(root){
        Dijkstra.root = root;

        Camera.clearSptColors();
        Camera.clearPathColors();
        Camera.clearVertColors();

        for(let noh of Vert.verts){
            Dijkstra.dist[noh.id] = Infinity;
            Dijkstra.spt[noh.id] = false;
        }

        Dijkstra.clearQueue();

        Dijkstra.pq.push(Dijkstra.root);
        Dijkstra.dist[Dijkstra.root.id] = 0;
        Dijkstra.parent[Dijkstra.root.id] = Dijkstra.root.id;
        Dijkstra.root.color = "#ff6600";

        while(!Dijkstra.pq.isEmpty()){
            /**
             * @type {Vert}
             */
            const u = Dijkstra.pq.pop();

            if(Dijkstra.spt[u.id]) continue;

            let oldColor = u.color;
            u.color = "#ff0066";
            

            Camera.edgesColorsSpt[u.id * MAX_VERTS + Dijkstra.parent[u.id]] = "#ff6600";
            Camera.edgesColorsSpt[Dijkstra.parent[u.id] * MAX_VERTS + u.id] = "#ff6600";
            

            Dijkstra.spt[u.id] = true;

            for(let v of u.children){
                if(Dijkstra.spt[v.id]) continue;

                let weight = Vert.getWeight(u, v);

                // animacao de blink
                let a = 1;
                for(let i = 10; i > 0; i--){
                    Camera.edgesColorsBoundary[u.id * MAX_VERTS + v.id] = Utils.lerpColor(Camera.lineColor, "#ff0066", a);
                    Camera.edgesColorsBoundary[v.id * MAX_VERTS + u.id] = Utils.lerpColor(Camera.lineColor, "#ff0066", a);
                    v.color = Utils.lerpColor(Camera.background, "#ff0066", a);
                    a -= 0.1;
                    if(Dijkstra.speed > 0) await Utils.sleep(Dijkstra.speed);
                }
                
                Camera.edgesColorsBoundary[u.id * MAX_VERTS + v.id] = undefined;
                Camera.edgesColorsBoundary[v.id * MAX_VERTS + u.id] = undefined;
                v.color = Camera.background;

                if(Dijkstra.dist[v.id] > Dijkstra.dist[u.id] + weight){
                    Dijkstra.dist[v.id] = Dijkstra.dist[u.id] + weight;
                    Dijkstra.pq.push(v);
                    Dijkstra.parent[v.id] = u.id;
                }
            }

            u.color = oldColor;
        }
    }

    static showPath(vert){
        Camera.clearPathColors();
        Camera.clearVertColors();
        Dijkstra.path(vert.id, Dijkstra.parent[vert.id]);
    }

    static path(u, v){
        if (Dijkstra.parent[u] == u) return;
        Vert.verts[u].color = "#6600ff";
        Camera.edgesColorsPath[v * MAX_VERTS + u] = "#6600ff";
        Camera.edgesColorsPath[u * MAX_VERTS + v] = "#6600ff";
        Dijkstra.path(v, Dijkstra.parent[v]);
    }

    static clearQueue(){
        Dijkstra.pq = new PriorityQueue((a, b) => Dijkstra.dist[a.id] < Dijkstra.dist[b.id]);
    }

}