import defineModel from "../src/model.js";
import Vue         from "vue";
import assert      from "assert";

describe("验证isValid", function () {
    it("默认值", function () {
        let M   = defineModel(
            [
                {
                    name        : "fname",
                    alias       : "姓名",
                    defaultValue: "sasa",
                    required    : true,
                    validator   : function () {
                        return this.value.length > 3;
                    }
                },
                {
                    name        : "flist",
                    defaultValue: ["1", "3", "3", "5"],
                    isA         : true,
                    validator   : function () {
                        return this.value.length > 3;
                    }
                }]
        );
        let ins = new M();
        ins.validate().then(function (ret) {
            assert.equal(ins.isValid, true);
        });
        // assert.equal(ins.$isValid, true);
    });
    let M = defineModel(
        [
            {
                name        : "fname",
                alias       : "姓名",
                defaultValue: "sasa",
                required    : true,
                validator   : function (value) {
                    return value.length > 3;
                }
            },
            {
                name        : "flist",
                defaultValue: ["1", "3", "3", "5"],
                validator   : function (value) {
                    return value.length > 3;
                }
            }]
    );
    it("给定初始值", function (done) {
        let ins = new M({flist: [1, 2, 3]});
        // assert.equal(ins.$isValid, false);
        ins.validate().then(function (ret) {
            let validation = ins.validation;
            assert.equal(validation.fname, true);
            assert.equal(validation.flist, false);
            assert.equal(ins.fields.fname.isValid, true);
            assert.equal(ins.fields.flist.isValid, false);
            done();
        });
    });
    it("修改字段00", function (done) {
        let ins = new M({flist: [1, 2]});
        ins.value.flist.push(3);
        ins.validate().then(function (ret) {
            assert.equal(ins.fields.flist.isValid, false);
            done();
        });
    });
    it("修改字段01", function (done) {
        let ins = new M({flist: [1, 2, 3]});
        ins.value.flist.push(4);
        ins.validate().then(function (ret) {
            // assert.equal(ins.$isValid, true);
            assert.equal(ins.validation.flist, true);
            assert.equal(ins.validation.fname, true);
            done();
        });
    });
    it("修改字段02", function (done) {
        let ins = new M({flist: [1, 2, 3]});
        ins.value.flist.push(4);
        ins.value.flist.splice(3, 1);
        ins.validate().then(function () {
            assert.equal(ins.isValid, false);
            assert.equal(ins.validation.flist, false);
            assert.equal(ins.validation.fname, true);
            done();
        });
    });
    it("修改字段03", function () {
        let ins = new M({flist: [1, 2, 3]});
        ins.validate().then(function () {
                assert.equal(ins.validation.fname, true);
            }
        );
    });
    it("修改字段04", function (done) {
        let ins         = new M();
        ins.value.fname = "sa";
        ins.validate().then(function () {
            assert.equal(ins.validation.fname, false);
            done();
        });

    });
});
describe("配合vue使用", function () {
    let M = defineModel("person", [
        {
            name        : "fname",
            alias       : "姓名",
            defaultValue: "sas",
            required    : true,
            validator   : function () {
                return this.value.length > 3;
            }
        },
        {
            name        : "fage",
            defaultValue: 28,
            validator   : function (val) {
                return parseInt(val) > 20;
            }
        }
    ]);

    it("修改值01", function () {
        let foo    = new M();
        let vobj   = new Vue({
            data: foo.value
        });
        vobj.fname = 'saaa';
        assert.equal(foo.value.fname, "saaa");
    });
    it("修改值02", function () {
        let foo         = new M();
        let vobj        = new Vue({
            data: foo.value
        });
        foo.value.fname = 'saaa';
        assert.equal(vobj.fname, "saaa");
    });
    it("修改值03", function () {
        let foo         = new M();
        let vobj        = new Vue({
            data: foo
        });
        foo.value.fname = 'saaa';
        assert.equal(vobj["value"].fname, "saaa");
    });
    it("修改值04", function () {
        let foo             = new M();
        let vobj            = new Vue({
            data: foo
        });
        vobj["value"].fname = 'saaa';
        assert.equal(foo.value.fname, "saaa");
    });
    it("校验01", function () {
        let foo  = new M();
        let vobj = new Vue({
            data: foo
        });
        foo.validate().then(function (ret) {
            assert.equal(vobj.isValid, false);
        });
    });
    it("校验02", function () {
        let foo          = new M();
        let vobj         = new Vue({
            data: foo
        });
        vobj.value.fname = 'saaa';
        foo.validate().then(function () {
            assert.equal(vobj.isValid, true);
        });
    });
});