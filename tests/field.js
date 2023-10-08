// var assert = require("assert");
import assert from "assert";
import defineField from "../src/Field.js";
// import Vue   from "vue"
// required 默认为false


describe("数据验证", function () {
    let F =  defineField("fage",{
        required    : true,
        validator   : function () {
            return this.value > 3;
        }
    });
    it("验证数据的初始值01）", function () {
        let foo = new F();
        assert.equal(undefined, foo.value);
    });
    it("验证数据的初始值02）", function () {
        let F   =  defineField("fage",{
            name        : "fage",
            defaultValue: 4,
            required    : true,
            validator   : function () {
                return this.value > 3;
            }
        });
        let foo = new F();
        assert.equal(4, foo.value);
    });
    it("验证数据的初始值（初始值给定错误）", function () {
        let foo = new F(2);
        return foo.validate().then(
            (ret) => {
                assert.equal(false, foo.isValid);
            }
        );
    });
    it("验证数据的初始值（初始值给定正确）", function () {
        let foo = new F(8);
        return foo.validate().then(
            (ret) => {
                assert.equal(true, ret);
            }
        );
    });
    it("赋值后验证数据(使用错误的初始值)", function () {
        let foo   = new F(3);
        foo.value = 6;
        return foo.validate().then(
            (ret) => {
                assert.equal(true, foo.isValid);
            }
        );
    });
    it("赋值后验证数据(反复修改01)", function () {
        let foo   = new F(2);
        foo.value = 5;
        foo.value = 3;
        return foo.validate().then(
            (ret) => {
                assert.equal(false, foo.isValid);
            }
        );
    });
    it("赋值后验证数据(反复修改02)", function () {
        let foo   = new F(2);
        foo.value = 5;
        foo.value = 7;
        foo.value = 8;
        return foo.validate().then(
            (ret) => {
                assert.equal(true, foo.isValid);
            }
        );
    });

    it("赋值后验证数据(反复修改03)", function () {
        let foo   = new F();
        foo.value = 5;
        foo.value = 7;
        foo.value = 7;
        return foo.validate().then(
            (ret) => {
                assert.equal(true, foo.isValid);
            }
        );
    });
});

describe("监听值变化", function () {
    let F   = new defineField({
        name      : "fage",
        defaultVal: 4,
        validator :  (val)=>val > 3
    });
    let foo = new F();
    // foo.on('valueChg', function (value) {
    //     assert.equal(value, "saa");
    // });
    foo.value = "saa";
});
// describe("节流效果01", function () {
//     let cnt = 0;
//     let F   = new defineField({
//         name      : "fage",
//         defaultVal: 4,
//         validator : function (val) {
//             cnt++;
//             return val > 3;
//         }
//     });
//     let foo = new F();
//     it("限制执行01", function () {
//         assert.equal(0, cnt);
//     });
//     it("限制执行02", function () {
//         foo.value = 5;
//         // assert.equal(1, cnt);
//         foo.$validate();
//         // assert.equal(1, cnt);
//         foo.$validate();
//         foo.$validate();
//         return foo.$validate().then(
//             () => {
//                 assert.equal(1, cnt);
//             }
//         )
//     });
// });

describe("修改状态", function () {
    let F = new defineField({
        name      : "fage",
        defaultVal: 4,
        validator : function () {
            return this.value > 3;
        }
    });
    it("数据是否修改（初始状态）", function () {
        let foo = new F();
        assert.equal(false, foo.isModified);
    });
    it("数据是否修改（修改）", function () {
        let foo   = new F();
        foo.value = '7';
        assert.equal(true, foo.isModified);
    });
});

describe("数组", function () {
        let F = new defineField("farr",{
            defaultValue: [1, 2, 3, 4],
            validator : function (val) {
                return val.length > 3;
            }
        });
        describe("使用默认值", function () {
            let foo = new F();
            it("数据是否正确", function () {
                foo.validate().then((isValid) => {
                    assert.equal(true, foo.isValid);
                })
            });

            it("数据是否修改", function () {
                assert.equal(false, foo.isModified);
            });
        });
        describe("使用初始值", function () {
            let foo = new F([1, 2]);
            it("数据是否正确", function () {
                assert.equal(undefined, foo.isValid);
            });
            it("数据是否正确", function () {
                return foo.validate().then((isValid) => {
                    assert.equal(false, foo.isValid);
                })
            });
            it("数据是否修改", function () {
                assert.equal(false, foo.isModified);
            });
        });
        describe("修改数组后验证有效性", function () {
            let foo = new F([1, 2]);
            foo.value.push(3, 4);
            it("数据是否正确", function () {
                return foo.validate().then((isValid) => {
                    assert.equal(true, isValid);
                })
            });
        });
        describe("修改数组后验证是否修改", function () {
            let foo = new F([1, 2]);
            foo.value.push(3, 4);
            it("数据是否修改", function () {
                assert.equal(true, foo.isModified);
            });
        });
    }
);
describe("异步验证", function () {
    let F   = new defineField("farr",{
        defaultVal: [1, 2, 3, 4],
        isA       : true,
        validator : function (val) {
            return new Promise(function (res) {
                setTimeout(function () {
                    res(val.length > 3);
                }, 600);
            })
        }
    });
    let foo = new F([1, 2]);
    it("异步验证", function () {
        return foo.validate().then(
            (ret) => {
                assert.equal(false, foo.isValid);
            }
        );
    });

});

//     describe("使用初始值", function () {
//         let foo = new F([1, 2]);
//         assert.equal(undefined, foo.$isValid);
//         it("数据是否修改", function () {
//             assert.equal(false, foo.$isMod);
//         });
//     });
//     describe("修改值01", function () {
//         let foo = new F([1, 2]);
//         assert.equal(undefined, foo.$isValid);
//         foo.$val.push(3, 4);
//         // assert.equal(true, foo.$isValid);
//         it("数据是否有效", function () {
//             setTimeout(function () {
//                 assert.equal(true, foo.$isValid);
//             },300)
//         });
//         it("数据是否修改", function () {
//             assert.equal(true, foo.$isMod);
//         });
//
//     });
//     describe("修改值02", function () {
//         let foo = new F([1, 2]);
//         assert.equal(undefined, foo.$isValid);
//         foo.$val.push(3,5);
//         assert.equal(undefined, foo.$isValid);
//         it("数据是否有效", function () {
//             foo.$validate().then(function () {
//                 assert.equal(true, foo.$isValid);
//             });
//         });
//         it("数据是否修改", function () {
//             assert.equal(true, foo.$isMod);
//         });
//
//     });
//     describe("修改值03", function () {
//         let foo = new F([1, 2]);
//         foo.$val=[1,2,3,4];
//         // assert.equal(undefined, foo.$isValid);
//         it("数据是否有效", function () {
//             foo.$validate(function (ret) {
//                 assert.equal(true, foo.$isValid);
//             })
//         });
//         it("数据是否修改", function () {
//             setTimeout(function () {
//                 assert.equal(true, foo.$isMod);
//             },800)
//
//         });
//     });
//     describe("修改值04", function () {
//         let foo = new F([1, 2]);
//         foo.$val=[1,2,3,4];
//         foo.$validate().then(function () {
//             assert.equal(true, foo.$isValid);
//         });
//         it("数据是否修改", function () {
//             setTimeout(function () {
//                 assert.equal(true, foo.$isMod);
//             },800)
//
//         });
//     });
//     describe("修改值05", function () {
//         let foo = new F([1, 2]);
//         // foo.$val=[1,2,3,4];
//         foo.$val.push(3,4);
//         // assert.equal(undefined, foo.$isValid);
//         it("数据是否有效", function () {
//             setTimeout(function () {
//                 assert.equal(true, foo.$isValid);
//             },1600);
//
//         });
//         it("数据是否修改", function () {
//             setTimeout(function () {
//                 assert.equal(true, foo.$isMod);
//             },800)
//         });
//     });
// });
