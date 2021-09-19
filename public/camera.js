class Camera
{

    static alreadyDrawn = new Array(MAX_VERTS * MAX_VERTS);

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
        ctx.strokeStyle = "#000000";
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(sPos.x, sPos.y, sLen, 0, 7);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = "#000000";
        ctx.font = `${sLen}px Arial`;
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText(vert.id, sPos.x, sPos.y);
        
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

                const sChildPos = this.worldToScreenPosition(child.position);
                const weight = Vert.edges[edgeIndex];

                ctx.strokeStyle = "$0000000";
                ctx.lineWidth = this.worldToScreenLength(MAX_EDGE_WIDTH) / MAX_WEIGHT * weight;
                ctx.beginPath();
                ctx.moveTo(sPos.x, sPos.y);
                ctx.lineTo(sChildPos.x, sChildPos.y);
                ctx.stroke();

                const sTextPos = Vector2.lerp(sPos, sChildPos, 0.5);
                const sTextLen = this.worldToScreenLength(VERT_RADIUS / 3);

                ctx.fillStyle = "#ffffff";
                ctx.font = `${sTextLen}px Arial`;
                ctx.beginPath();
                ctx.arc(sTextPos.x, sTextPos.y, ctx.measureText(weight).width / 2 + sTextLen / 5, 0, 7);
                ctx.fill();
                
                ctx.beginPath();
                ctx.fillStyle = "#000000";
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                ctx.fillText(weight, sTextPos.x, sTextPos.y);

                if (this.isBidirectionalEdge(vert, child)){
                    Camera.alreadyDrawn[child.id * MAX_VERTS + vert.id] = true;
                } else {
                    //LINHA DIRECIONADA SERÁ DESENHADA AQUI KKKK
                }

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

    applyZoom(amount){
        this.size *= amount;
    }

    isBidirectionalEdge(vertU, vertV){
        return Vert.edges[vertU.id * MAX_VERTS + vertV.id] != undefined && Vert.edges[vertV.id * MAX_VERTS + vertU.id] != undefined;
    }

    translate(offset){
        this.position = this.position.add(offset);
    }

    resize(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    clear(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    draw(){

        this.resize();
        this.clear();
        this.drawVerts();

    }

}