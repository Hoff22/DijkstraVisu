class Camera
{

    static alreadyDrawn = new Array(MAX_VERTS * MAX_VERTS);

    static background = "#222222";
    static lineColor = "#cfcfcf";
    
    static edgeColors = [];
    static vertColors = [];

    static setEdgeColor(edge, color, layer = 0){
        if (!this.edgeColors[layer]){
            this.edgeColors[layer] = new Array(MAX_VERTS * MAX_VERTS);
        }
        this.edgeColors[layer][edge] = color;
    }

    static setVertColor(vert, color, layer = 0){
        if (!this.vertColors[layer]){
            this.vertColors[layer] = new Array(MAX_VERTS);
        }
        this.vertColors[layer][vert.id] = color;
    }
    
    static getEdgeColor(edge){
        let color = null;
        for (let layer of this.edgeColors){
            if (!layer) continue;
            if (layer[edge]) color = layer[edge];
        }
        return color ? color : Camera.lineColor;
    }
    
    static getVertColor(vert){
        let color = null;
        for (let layer of this.vertColors){
            if (!layer) continue;
            if (layer[vert.id]) color = layer[vert.id];
        }
        return color ? color : Camera.background;
    }
    
    static clearEdgeColors(layer = null){
        if (layer == null){
            Camera.edgeColors = [];
            return;
        }
        Camera.edgeColors[layer] = new Array(MAX_VERTS * MAX_VERTS);
    }
    
    static clearVertColors(layer = null){
        if (layer == null){
            Camera.vertColors = [];
            return;
        }
        Camera.vertColors[layer] = new Array(MAX_VERTS);
    }

    constructor(){

        /** @type {Vector2} */
        this.position = new Vector2();

        /** @type {Number} */
        this.size = 1;

        this.resize();

    }

    /**
     * @param {Vector2} position 
     */
    worldToScreenPosition(position){
        return position.sub(this.position).scale(1 / this.size).add(new Vector2(canvas.width, canvas.height).scale(0.5));
    }

    screenToWorldPosition(position){
        return position.sub(new Vector2(canvas.width, canvas.height).scale(0.5)).scale(this.size).add(this.position);
    }
    
    worldToScreenLength(length){
        return length / this.size;
    }
    
    /**
     * @param {Vert} vert 
     */
    drawVert(vert){
        
        const sPos = this.worldToScreenPosition(vert.position);
        const sLen = this.worldToScreenLength(VERT_RADIUS);
        
        ctx.lineWidth = Math.min(3, this.worldToScreenLength(0.5));
        ctx.strokeStyle = Camera.lineColor;
        ctx.fillStyle = Camera.getVertColor(vert);
        ctx.beginPath();
        ctx.arc(sPos.x, sPos.y, sLen, 0, 7);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = Camera.lineColor;
        ctx.font = `${sLen}px Arial`;
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText(vert.id, sPos.x, sPos.y);
        
        if(Dijkstra.dist[vert.id]){
            ctx.fillStyle = "#ff0066";
            ctx.font = `${sLen/3}px Arial`;
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.fillText(Dijkstra.dist[vert.id], sPos.x, sPos.y+sLen/2);
        }
    }
    
    /**
     * @param {Vert} vert 
     */
    drawEdges(vert){
        const sPos = this.worldToScreenPosition(vert.position);

        for (let child of vert.children){

            const edgeIndex = vert.id * MAX_VERTS + child.id;

            if (Camera.alreadyDrawn[edgeIndex] == undefined){
                Camera.alreadyDrawn[edgeIndex] = true;

                this.drawEdge(vert, child);

            }

        }
    }

    drawVerts(){
        Camera.alreadyDrawn = new Array(MAX_VERTS * MAX_VERTS);
        for (let vert of Vert.verts){
            this.drawEdges(vert);
        }
        for (let vert of Vert.verts){
            this.drawVert(vert);
        }
    }

    drawEdge(vU, vV){
        const vUPos = this.worldToScreenPosition(vU.position);
        const edgeIndex = vU.id * MAX_VERTS + vV.id;
        const vVPos = this.worldToScreenPosition(vV.position);
        const weight = Vert.edges[edgeIndex];
        const color = Camera.getEdgeColor(edgeIndex);

        ctx.strokeStyle = color;
        ctx.lineWidth = this.worldToScreenLength(Utils.remap(weight, 1, MAX_WEIGHT, MIN_EDGE_WIDTH, MAX_EDGE_WIDTH));
        ctx.beginPath();
        ctx.moveTo(vUPos.x, vUPos.y);
        ctx.lineTo(vVPos.x, vVPos.y);
        ctx.stroke();

        const sTextPos = Vector2.lerp(vUPos, vVPos, 0.4);
        const sTextLen = this.worldToScreenLength(VERT_RADIUS / 3);

        ctx.fillStyle = Camera.background;
        ctx.font = `${sTextLen}px Arial`;
        ctx.beginPath();
        ctx.arc(sTextPos.x, sTextPos.y, Math.max(ctx.measureText(weight).width, sTextLen) / 2 + sTextLen / 5, 0, 7);
        ctx.fill();
        
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText(weight, sTextPos.x, sTextPos.y);

        Camera.alreadyDrawn[vV.id * MAX_VERTS + vU.id] = true;
    }

    applyZoom(amount){
        this.size *= amount;
    }

    translate(offset){
        this.position = this.position.add(offset);
    }

    resize(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    clear(){
        ctx.beginPath();
        ctx.fillStyle = Camera.background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    draw(){

        this.resize();
        this.clear();
        this.drawVerts();

    }

}