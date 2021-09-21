class Utils
{

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

    static startCoroutine(coroutine, updatesPerSecond){
        const id = `${this.hashCode(Math.random().toString())}${Date.now()}`;
        const res = {
            id: id, coroutine: coroutine
        }
        const i = setInterval(() => {
            if (!coroutine.next().value) this.stopCoroutine(res);
        }, 1000 / updatesPerSecond);
        this.coroutines.set(id, { coroutine, i });
        return res;
    }

    static stopCoroutine(coroutine){
        const c = this.coroutines.get(coroutine.id);
        if (!c) return;
        clearInterval(c.i);
        this.coroutines.delete(coroutine.id);
    }
    
}