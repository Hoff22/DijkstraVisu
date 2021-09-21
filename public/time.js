class Time
{

    static lastFrame = Date.now();
    static deltaTime = 0;

    static update(){
        const now = Date.now();
        this.deltaTime = (now - this.lastFrame) / 1000;
        this.lastFrame = now;
    }

}