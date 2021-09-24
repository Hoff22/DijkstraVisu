class Dijkstra{

    static iterationsPerSecond = 100;

    static root = null;

    static spt = new Array(MAX_VERTS);
    
    static dist = new Array(MAX_VERTS);
    
    static parent = new Array(MAX_VERTS);
    
    static pq = new PriorityQueue((a, b) => Dijkstra.dist[a.id] < Dijkstra.dist[b.id]);

    static coroutine = null;

    static startSolve(root){
        Camera.clearVertColors();
        Camera.clearEdgeColors();
        
        if (Dijkstra.coroutine) Utils.stopCoroutine(Dijkstra.coroutine);
        Dijkstra.coroutine = Utils.startCoroutine(Dijkstra.solve(root), 15);
    }
    
    static solve = function* (root){

        Dijkstra.root = root;
        
        for(let noh of Vert.verts){
            Dijkstra.dist[noh.id] = Infinity;
            Dijkstra.spt[noh.id] = false;
        }

        Dijkstra.clearQueue();

        Dijkstra.pq.push(Dijkstra.root);
        Dijkstra.dist[Dijkstra.root.id] = 0;
        Dijkstra.parent[Dijkstra.root.id] = Dijkstra.root.id;
        Camera.setVertColor(Dijkstra.root, "#ff6600", 3);

        while(!Dijkstra.pq.isEmpty()){
            
            /**
             * @type {Vert}
             */
            const u = Dijkstra.pq.pop();
            
            if(Dijkstra.spt[u.id]) continue;
            
            let oldColor = Camera.getVertColor(u);
            Camera.setVertColor(u, "#ff0066", 1);
            
            
            Camera.setEdgeColor(u.id * MAX_VERTS + Dijkstra.parent[u.id], "#ff6600", 0);
            Camera.setEdgeColor(Dijkstra.parent[u.id] * MAX_VERTS + u.id, "#ff6600", 0);
            
            
            Dijkstra.spt[u.id] = true;
            
            for(let v of u.children){
                if(Dijkstra.spt[v.id]) continue;
                
                let weight = Vert.getWeight(u, v);
                
                Camera.setEdgeColor(u.id * MAX_VERTS + v.id, "#ff0066", 1);
                Camera.setEdgeColor(v.id * MAX_VERTS + u.id, "#ff0066", 1);
                
                // MAGIC
                yield 1 / Dijkstra.iterationsPerSecond;
                
                Camera.setEdgeColor(u.id * MAX_VERTS + v.id, undefined, 1);
                Camera.setEdgeColor(v.id * MAX_VERTS + u.id, undefined, 1);

                Camera.setVertColor(v, Camera.background, 1);
                
                if(Dijkstra.dist[v.id] > Dijkstra.dist[u.id] + weight){
                    Dijkstra.dist[v.id] = Dijkstra.dist[u.id] + weight;
                    Dijkstra.pq.push(v);
                    Dijkstra.parent[v.id] = u.id;
                }
            }
            
            Camera.setVertColor(u, oldColor, 1);
        }
    }

    static showPath(vert){
        Camera.clearEdgeColors(2);
        Camera.clearVertColors(2);
        Utils.startCoroutine(Dijkstra.path(vert.id, Dijkstra.parent[vert.id]));
    }

    static path = function* (u, v){
        if (Dijkstra.parent[u] == u) return;
        Camera.setVertColor(Vert.verts[u], "#6600ff", 2);
        Camera.setEdgeColor(v * MAX_VERTS + u, "#6600ff", 2);
        Camera.setEdgeColor(u * MAX_VERTS + v, "#6600ff", 2);
        yield 1 / (Dijkstra.iterationsPerSecond / 5);
        return yield* Dijkstra.path(v, Dijkstra.parent[v]);
    }

    static clearQueue(){
        Dijkstra.pq = new PriorityQueue((a, b) => Dijkstra.dist[a.id] < Dijkstra.dist[b.id]);
    }

}