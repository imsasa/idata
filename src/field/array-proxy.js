let proto = Object.create(Array.prototype);
let mthds = ["push", "pop", "shift", "unshift", "splice", "sort", "reverse"];

function proxy(m, fn) {
    return function () {
        let pre    = [...this];
        let result = m.apply(this, arguments);
        fn(this, pre);
        return result;
    }
}

export default function (initVal = [], fn) {
    let arr = [...initVal];
    mthds.forEach(method => proto[method] = proxy(Array.prototype[method], fn));
    arr.__proto__ = proto;
    return arr;
}
