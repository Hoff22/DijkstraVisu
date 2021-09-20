class Camera
{

    static alreadyDrawn = new Array(MAX_VERTS * MAX_VERTS);

    static background = "#222222";
    static lineColor = "#cfcfcf";

    static edgesColorsBoundary = new Array(MAX_VERTS * MAX_VERTS);
    static edgesColorsSpt = new Array(MAX_VERTS * MAX_VERTS);
    static edgesColorsPath = new Array(MAX_VERTS * MAX_VERTS);

    static getEdgeColor(edge){
        if (Camera.edgesColorsBoundary[edge]) return Camera.edgesColorsBoundary[edge];
        if (Camera.edgesColorsPath[edge]) return Camera.edgesColorsPath[edge];
        if (Camera.edgesColorsSpt[edge]) return Camera.edgesColorsSpt[edge];
        return Camera.lineColor;
    }

    static clearBoundaryColors(){
        Camera.edgesColorsBoundary = new Array(MAX_VERTS * MAX_VERTS);
    }

    static clearSptColors(){
        Camera.edgesColorsSpt = new Array(MAX_VERTS * MAX_VERTS);
    }

    static clearPathColors(){
        Camera.edgesColorsPath = new Array(MAX_VERTS * MAX_VERTS);
    }

    static clearVertColors(){
        for(let v of Vert.verts) if(v.id != Dijkstra.root.id) v.color = Camera.background;
    }

    constructor(){

        /** @type {Vector2} */
        this.position = new Vector2();

        /** @type {Number} */
        this.size = 1;

    }

    /**
     * @param {Vector2} position 
     */
    worldToScreenPosition(position){
        return position.sub(this.position).scale(1 / this.size).add(new Vector2(window.innerWidth, window.innerHeight).scale(0.5));
    }

    screenToWorldPosition(position){
        return position.sub(new Vector2(window.innerWidth, window.innerHeight).scale(0.5)).scale(this.size).add(this.position);
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
        
        ctx.lineWidth = 1;
        ctx.strokeStyle = Camera.lineColor;
        ctx.fillStyle = vert.color;
        ctx.beginPath();
        ctx.arc(sPos.x, sPos.y, sLen, 0, 7);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = Camera.lineColor;
        ctx.font = `${sLen}px Arial`;
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText(vert.id, sPos.x, sPos.y);
        
        if(Dijkstra.dist[vert.id] != undefined){
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
        ctx.lineWidth = this.worldToScreenLength(MAX_EDGE_WIDTH - MIN_EDGE_WIDTH) / MAX_WEIGHT * weight + this.worldToScreenLength(MIN_EDGE_WIDTH);
        ctx.beginPath();
        ctx.moveTo(vUPos.x, vUPos.y);
        ctx.lineTo(vVPos.x, vVPos.y);
        ctx.stroke();

        const sTextPos = Vector2.lerp(vUPos, vVPos, 0.4);
        const sTextLen = this.worldToScreenLength(VERT_RADIUS / 3);

        ctx.fillStyle = Camera.background;
        ctx.font = `${sTextLen}px Arial`;
        ctx.beginPath();
        ctx.arc(sTextPos.x, sTextPos.y, ctx.measureText(weight).width / 2 + sTextLen / 5, 0, 7);
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