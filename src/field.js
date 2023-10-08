import arrayProxy from "./field/array-proxy.js";
import isDiff     from "./field/is-diff.js";

function validate() {
    let val      = this.value;
    let ths      = this;
    let vali     = this.validator ? this.validator(val) : true;
    let isValid  = this.isValid;
    this.isValid = undefined;
    return Promise.resolve(vali).then((res) => {
        ths.isValid = res;
        isValid !== res && ths["onValidChange"]?.(res, ths);
        return res;
    });
}


export default function defineField(name, clsOpt = {}) {
    if (typeof clsOpt === "string" || Array.isArray(clsOpt) || (clsOpt instanceof Date)) {
        clsOpt = {
            defaultValue: clsOpt
        };
    }
    let {
            defaultValue,
            value,
            validator,
            parser, ...otherOpts
        } = clsOpt;

    class F {
        constructor(value) {
            let ths = this;
            if (value === undefined) {
                value = typeof ths.defaultValue === "function" ? ths.defaultValue() : ths.defaultValue;
            }
            const initVal = ths.parser ? ths.parser(value) : value;
            // initVal = ths.formatter(value);
            if (Array.isArray(initVal)) {
                value = arrayProxy(initVal, setV);
            }

            function setV(val) {
                value          = ths.parser ? ths.parser(val) : val;
                // value          = ths.formatter ? ths.formatter(val) : val;
                let isModified = ths.isModified;
                ths.isModified = isDiff(value, initVal);
                isModified !== ths.isModified && ths["onModifiedChange"]?.(ths.isModified, ths);
                return ths.validate();
            }

            this.isModified = false;
            Object.defineProperty(this, "value", {set: setV, get: () => value, enumerable: true});
            // if (opts.validator !== undefined) {
            //     ths.validator = opts.validator;
            // }
            // if (opts.formatter !== undefined) {
            //     ths.formatter = opts.formatter;
            // }
        }

        name         = name;
        isField      = true;
        validate     = validate;
        defaultValue = defaultValue === undefined ? value : defaultValue;
        validator    = validator;
        parser       = parser;
    }

    Object.defineProperty(F, "name", {value: name})
    F._name = name;
    Object.assign(F.prototype, otherOpts);
    return F;
}

export function defineFields(fieldsCfg = {}, flag) {
    let fields = [];
    if (flag) {
        Object.entries(fieldsCfg).forEach(([k, v]) => fields.push(defineField(k, {defaultValue: v})));
    } else if (Array.isArray(fieldsCfg)) {
        fieldsCfg.forEach(i => fields.push(defineField(i.name, i)));
    } else {
        Object.entries(fieldsCfg).forEach(([k, cfg]) => {
            if (typeof cfg === 'string' || Array.isArray(cfg)) {
                cfg = {defaultValue: cfg};
            }
            fields.push(defineField(k, cfg));
        });
    }
    return fields;
}