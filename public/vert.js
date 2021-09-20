class Vert
{

    static id = 0;
    /** @type {Vert[]} */
    static verts = [];
    static edges = new Array(MAX_VERTS * MAX_VERTS);

    static clearGraph(){
        Vert.verts = [];
        Vert.edges = new Array(MAX_VERTS * MAX_VERTS); 
        Vert.id = 0;
    }

    static getWeight(vertU, vertV){
        return Vert.edges[vertU.id * MAX_VERTS + vertV.id];
    }

    constructor(position = new Vector2()){
        
        this.id = Vert.id++;

        /** @type {Vector2} */
        this.position = position;
        
        /** @type {Vert[]} */
        this.children = [];

        /** @type {Vert[]} */
        this.parents = [];
        
        this.color = Camera.background;

        Vert.verts.push(this);
    }

    pushChild(vert, weight){
        this.children.push(vert);
        vert.pushParent(this);
        Vert.edges[this.id * MAX_VERTS + vert.id] = Math.floor(weight);
    }
    
    pushParent(vert){
        this.parents.push(vert);
    }

    destroy(){

        for (let mae of this.parents){
            mae.children = mae.children.filter(x => x.id !== this.id);
        }
        for (let filho of this.children){
            filho.parents = filho.parents.filter(x => x.id !== this.id);
        }
        
        Vert.verts = Vert.verts.filter(x => x.id !== this.id);
    }

}