import {defineFields} from "./field.js";

// import { ref }    from "vue";

function init($fields, $data = {}, ths) {
    const fields                   = {};
    const validation               = ths.validation
    const modified                 = ths.modified;
    const vobj                     = ths.value;
    let fieldModifiedChangeHandler = (val, f) => {
        let isModified = ths.isModified;
        if (val === false && isModified) {
            ths.isModified = Object.values(modified).some((v) => v === true);
        } else if (isModified === false) {
            ths.isModified = true;
        }
        modified[f.name] = val;
    };
    let fieldValidChangeHandler    = (val, f) => {
        let isValid        = ths.isValid;
        validation[f.name] = val;
        if (val === true && !isValid) {
            ths.isValid = Object.values(validation).every((v) => v !== true);
        } else if (isValid === true) {
            ths.isValid = false;
        }
    };
    for (let Field of $fields) {
        let val, fieldName, field, get, set;
        fieldName              = Field.name;
        validation[fieldName]  = undefined;
        modified[fieldName]    = false;
        val                    = $data[fieldName];
        field                  = new Field(val);
        get                    = () => field.value;
        set                    = (val) => field.value = val;
        field.onModifiedChange = fieldModifiedChangeHandler;
        field.onValidChange    = fieldValidChangeHandler;
        Object.defineProperty(vobj, field.name, {get, set, enumerable: true});
        fields[field.name] = field;
    }
    ths.fields = fields;
}

function $validate(validateAll) {
    let ths    = this,
        fields = Object.values(ths.fields),
        varr   = [];
    for (let field of fields) {
        if (field.isValid === undefined) {
            let v = field.validate();
            varr.push(v);
        }
    }
    return Promise.all(varr).then((ret) => ths.isValid);
}

/**
 *
 * @param {string} [name]
 * @param fields
 * @param opts
 * @return {M}
 */
export default function defineModel(name, fields, opts = {}) {
    if (typeof name === 'object') {
        opts   = fields;
        fields = name;
        name   = undefined;
    }
    class _ extends Model {
        constructor(obj) {
            super(obj);
        }
        name          = name;
        static fields = defineFields(fields);
    }
    return _;
}
export class Model {
    constructor(data = {}) {
        let $fields     = this.constructor.fields;
        this.validation = {};
        this.modified   = {};
        this.value      = {};
        if (!$fields) {
            $fields = defineFields(data);
            data    = {};
        }
        init($fields, data, this);
    }
    set(k, v) {
        this.value[k] = v;
        return this;
    }
    validate      = $validate;
}
// export class IForm extends Model {
//   constructor(data,ajax) {
//     super(data);
//     Object.defineProperty(this, "$ajax", {value:ajax,enumerable:true});
//   }
//   $submit(url) {
//     return url?this.$ajax.send(url,this.$data()):this.$ajax.send(this.$data());
//   }
// }
// let testModel = defineModel("testModel", {name: "string", age: "number"});
// let m         = new testModel();
// m.name        = 123;
// let d         = m.$data()
// console.log(m.name);
