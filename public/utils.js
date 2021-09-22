class Utils
{

    /**
     * Linearly interpolate beetwen color a and color b by the factor amount.
     * @param {string} a 
     * @param {string} b 
     * @param {Number} amount 
     * @returns {string}
     */
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
    
    /**
     * @param {string} str 
     * @returns {Number}
     */
    static hashCode(str) {
        var hash = 0, i, chr;
        if (str.length === 0) return hash;
        for (i = 0; i < str.length; i++) {
            chr   = str.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };

    static coroutines = new Map();

    /**
     * Starts a coroutine
     * @param {Generator} coroutine 
     * @param {Number} updatesPerSecond 
     */
    static startCoroutine(coroutine){
        const id = `${this.hashCode(Math.random().toString())}${Date.now()}`;
        const res = {
            lastTick: Date.now(), deltaTime: 0, waitForSec: 0,
            id: id, coroutine: coroutine
        }

        const handler = () => {
            const now = Date.now();
            res.deltaTime = (now - res.lastTick) / 1000;
            while (res.deltaTime >= res.waitForSec){
                res.lastTick = now;
                res.deltaTime -= res.waitForSec;
                const update = coroutine.next();
                if (update.done) {
                    this.stopCoroutine(res);
                    return;
                }
                if (update.value == undefined){
                    res.waitForSec = 0;
                    break;
                }
                else if (!isNaN(update.value)){
                    res.waitForSec = update.value;
                }
            }
        }

        this.coroutines.set(id, { coroutine, handler });
        handler();
        return res;
    }

    /**
     * Stops a coroutine
     * @param {{id: Number, coroutine: Generator}} coroutine 
     */
    static stopCoroutine(coroutine){
        if (!this.coroutines.get(coroutine.id)) return;
        this.coroutines.delete(coroutine.id);
    }

    static doCoroutines(){
        this.coroutines.forEach(c => c.handler())
    }

    /**
     * Clamps a value beetwen min and max.
     * @param {Number} value 
     * @param {Number} min 
     * @param {Number} max 
     * @returns {Number}
     */
    static clamp(value, min, max){
        return Math.max(min, Math.min(value, max));
    }

    /**
     * Linearly interpolate beetwen a and color b by the factor t
     * @param {Number} a 
     * @param {Number} b 
     * @param {Number} t 
     * @returns {Number}
     */
    static lerp(a, b, t){
        return a + (b - a) * t;
    }

    /**
     * Returns the factor of the linear interpolation beetwen a and b where value is the result.
     * @param {Number} value 
     * @param {Number} a 
     * @param {Number} b 
     * @returns {Number}
     */
    static inverseLerp(value, a, b){
        return (value - a) / (b - a);
    }

    /**
     * Remaps a value with a initial minimum and maximum range to a final minimum and maximum range.
     * @example Utils.remap(10, 5, 15, 30, 50) //Returns 40
     * @param {Number} value 
     * @param {Number} minA 
     * @param {Number} maxA 
     * @param {Number} minB 
     * @param {Number} maxB 
     */
    static remap(value, minA, maxA, minB, maxB){
        return this.lerp(minB, maxB, this.inverseLerp(value, minA, maxA));
    }
    
}
