class Dijkstra{

    static lerpColor(a, b, amount) { 

        var ah = parseInt(a.replace(/#/g, ''), 16),
            ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
            bh = parseInt(b.replace(/#/g, ''), 16),
            br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
            rr = ar + amount * (br - ar),
            rg = ag + amount * (bg - ag),
            rb = ab + amount * (bb - ab);

        return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
    }

    static speed = 20;

    static spt = new Array(MAX_VERTS);
    
    static dist = new Array(MAX_VERTS);
    
    static parent = new Array(MAX_VERTS);
    
    static pq = new PriorityQueue((a, b) => Dijkstra.dist[a.id] < Dijkstra.dist[b.id]);
    
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static async startSolve(root){

        for(let noh of Vert.verts){
            Dijkstra.dist[noh.id] = Infinity;
            Dijkstra.spt[noh.id] = false;
        }

        Dijkstra.pq.push(root);
        Dijkstra.dist[root.id] = 0;
        Dijkstra.parent[root.id] = root.id;

        while(!Dijkstra.pq.isEmpty()){
            /**
             * @type {Vert}
             */
            const u = Dijkstra.pq.pop();

            if(Dijkstra.spt[u.id]) continue;

            Camera.edgesColorsSpt[u.id * MAX_VERTS + Dijkstra.parent[u.id]] = "#ff6600";
            Camera.edgesColorsSpt[Dijkstra.parent[u.id] * MAX_VERTS + u.id] = "#ff6600";
            
            Dijkstra.spt[u.id] = true;

            for(let v of u.children){
                let weight = Vert.getWeight(u, v);

                // animacao de blink
                let a = 1;
                for(let i = 10; i > 0; i--){
                    Camera.edgesColorsBoundary[u.id * MAX_VERTS + v.id] = Dijkstra.lerpColor(Camera.lineColor, "#ff0066", a);
                    Camera.edgesColorsBoundary[v.id * MAX_VERTS + u.id] = Dijkstra.lerpColor(Camera.lineColor, "#ff0066", a);
                    a -= 0.1;
                    if(Dijkstra.speed > 0) await Dijkstra.sleep(Dijkstra.speed);
                }
                Camera.edgesColorsBoundary[u.id * MAX_VERTS + v.id] = undefined;
                Camera.edgesColorsBoundary[v.id * MAX_VERTS + u.id] = undefined;

                if(!Dijkstra.spt[v.id] && Dijkstra.dist[v.id] > Dijkstra.dist[u.id] + weight){
                    Dijkstra.dist[v.id] = Dijkstra.dist[u.id] + weight;
                    Dijkstra.pq.push(v);
                    Dijkstra.parent[v.id] = u.id;
                }
            }

        }
    }

    static showPath(u, v){
        if (Dijkstra.parent[u] == u) return;

        Camera.edgesColorsPath[v * MAX_VERTS + u] = "#6600ff";
        Camera.edgesColorsPath[u * MAX_VERTS + v] = "#6600ff";
        Dijkstra.showPath(v, Dijkstra.parent[v]);

    }

}