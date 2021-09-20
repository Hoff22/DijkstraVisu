class Vector2
{

    static lerp(a, b, t){
        const x = a.x + (b.x - a.x) * t;
        const y = a.y + (b.y - a.y) * t;
        return new Vector2(x, y);
    }

    static from(object){
        return new Vector2(object.x, object.y);
    }

    static zero(){
        return new Vector2();
    }

    static dot(a, b){
        return a.x * b.x + a.y * b.y;
    }

    static distance(a, b){
        return b.sub(a).magnitude();
    }

    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    }

    add(vector2){
        return new Vector2(this.x + vector2.x, this.y + vector2.y);
    }
    
    sub(vector2){
        return new Vector2(this.x - vector2.x, this.y - vector2.y);
    }

    scale(factor){
        return new Vector2(this.x * factor, this.y * factor);
    }

    /**
     * @param {Number} angle 
     * @param {Vector2} pivot 
     */
    rotate(angle, pivot = Vector2.zero()){
        let point = this.sub(pivot);
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        return pivot.add(
            new Vector2(
                point.x * c - point.y * s,
                point.y * c + point.x * s
            )
        );
    }

    magnitude(){
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalized(){
        return this.scale(1 / (this.magnitude() || 1));
    }

    invertY(){
        return new Vector2(this.x, -this.y);
    }

    equals(vector2){
        return this.x == vector2.x && this.y == vector2.y;
    }

}
