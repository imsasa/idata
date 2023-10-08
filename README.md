# idata
> 或许能帮到你
## api
https://imsasa.github.io/iaop/

## 怎么用
0. 安装  `npm install idata`
1. 定义一个model
    ```javascript
      let M = modelDefine(
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
                        name        : "fage",
                        defaultValue: '28',
                        validator   : function () {
                            return this.value.length > 3;
                        }
                    }]
    );
    
    ```

2. 单独使用
    ```javascript
            let ins = new M();
            ins.fname= "saa";
            ins.validate().then(()=>{
                assert.equal(ins.$isValid, false);
                done();
            });
    
    ```
3. 与vue一起使用
    ```javascript
      let foo=new M();
      let vobj = new Vue({
          data:foo
      });
      vobj.fname='saaa';
      //foo.value.fname的值为sasa;
    ```

## 自动响应数据变化

```html
 <form class="ui form">
   <label>姓名</label>：<input autocomplete="off" type="text" name="fname" v-model="person.fname">
   <span>姓名输入{{ (validation.fname ? "正确" : "不正确") }}</span>
   <br>
   <label>年龄</label>：<input autocomplete="off" type="text" name="fage" v-model="person.fage">
   <span>年龄输入{{ (validation.fage ? "正确" : "不正确") }}</span>
   <br>
   <span>
            表单录入<span v-if="isValid">正确</span>
            <span style="color:red" v-else>不正确</span>
        </span>
   <br>
   <span>
            当前表单<span style="color:red" v-if="isModified">已经修改</span>
            <span v-else>没有任何修改</span>
        </span>
   <br>
   <button type="button" :disabled="!isValid">提交</button>
</form>

```
  ```javascript
//demo/index.html
new Vue({
   el  : '#app',
   data: function () {
      let person = new P();
      person.$watch('$isValid', (val) => this.isValid = val);
      person.$watch('$isModified', (val) => this.isModified = val);
      return {
         person    : person,
         isValid   : person.$isValid,
         isModified: person.$isModified,
         validation: person.$validation
      }
   }
});
   ```



