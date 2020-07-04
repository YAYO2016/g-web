<template>
    <div class='GSelect'>
        <!--下拉单选和下拉多选选择框-->
        <el-select
                class="Select"
                v-if="type==='select'"
                v-model="viewValue"
                :placeholder="placeholder"
                :style="{width: width}"
                :clearable="clearable"
                :multiple="multiple||allSelect"
                :disabled="disabled"
                @change="changeFun"
                @clear="clearFun"
                :value-key="optionKey"
        >
            <!--全选框-->
            <el-checkbox
                    class="SelectAll"
                    v-if="allSelect"
                    v-model="checked"
                    @change='selectAll'
            >全选
            </el-checkbox>
            <el-option v-for="(option,index) in options"
                       :key="index"
                       :value="returnItem?option:option[optionValue]"
                       :label="option[optionKey]"
            >
            </el-option>
        </el-select>

        <!--下拉单选和下拉多选选择框--通过样式将选中框变为checkbox  -->
        <el-select
                class="Select-CheckBox"
                v-if="type==='select-checkbox'"
                v-model="viewValue"
                :placeholder="placeholder"
                :style="{width: width}"
                :clearable="clearable"
                :multiple="multiple||allSelect"
                :disabled="disabled"
                @change="changeFun"
                @clear="clearFun"
                :value-key="optionKey"
        >
            <!--全选框-->
            <el-checkbox
                    class="SelectAll"
                    v-if="allSelect"
                    v-model="checked"
                    @change='selectAll'
            >全选
            </el-checkbox>
            <el-option v-for="(option,index) in options"
                       class="G-CheckBox"
                       :key="index"
                       :value="returnItem?option:option[optionValue]"
                       :label="option[optionKey]"
            >
                <span class="check"></span>
                <span style="margin-left: 8px">{{option[optionKey]}}</span>
            </el-option>
        </el-select>
    </div>
</template>

<script>
    /**
     * Created by yanyue on 2020/5/31 10:14
     */

    export default {
        name: "GSelect",
        props: {
            width: {
                type: String,
                default: "175px"
            },
            //表单控件的类型
            type: {
                type: String,
                default: "select"
            },
            //表单控件的值value
            value: {
                default: ""
            },
            //选择表单的选项(需要转换成键名是key-value的形式)
            options: {
                type: Array,
                default: () => {
                    return []
                }
            },
            //选项的key和value的属性值
            optionKey: {
                type: String,
                default: "label"
            },
            optionValue: {
                type: String,
                default: "value"
            },
            multiple: {
                type: Boolean,
                default: false
            },
            //select是否存在全选框
            allSelect: {
                type: Boolean,
                default: false
            },
            placeholder: {
                type: String,
                default: "请输入"
            },
            clearable: {
                type: Boolean,
                default: true
            },
            disabled: {
                type: Boolean,
                default: null
            },
            // 传入自定义的change函数，这样是为了在change执行的时候，能够执行更多的操作，而不仅仅只是获取v-model中的id值
            changeFun: {
                type: Function,
                default: () => {
                }
            },
            clearFun: {
                type: Function,
                default: () => {
                }
            },
            //el-select 默认返回值是选中item的id啥的，如果想要返回的是item对象本身，设置这个为true
            //还有设置value-key  作为 value 唯一标识的键名
            returnItem: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                viewValue: (this.multiple || this.allSelect) ? [] : "",
                checked: false,
            }
        },
        mounted() {
            this.viewValue = (this.multiple || this.allSelect) ? (this.value.length > 0 ? this.value.split(",") : []) : this.value;
        },
        watch: {
            value(newVal) {
                this.viewValue = (this.multiple || this.allSelect) ? this.isTrue(newVal) ? newVal.split(',') : [] : newVal;
            },
            viewValue(newVal) {
                if (this.isTrue(newVal)) {
                    this.$emit("update:value", (this.multiple || this.allSelect) ? newVal.join(',') : newVal);  //如果是多选的时候，后台需要的多项的字符串
                } else {
                    //如果值是0的话，也会是false，但是有时候数据本身就是0，这是需要的
                    if (newVal === 0) {
                        this.$emit("update:value", 0);
                    } else {
                        this.$emit("update:value", "");
                    }
                }
                if (this.allSelect) {
                    if (newVal.length === this.options.length) {
                        this.checked = true;
                    } else {
                        this.checked = false;
                    }
                }
            }

        },
        methods: {
            //选择框里面的全选按钮的操作
            selectAll() {
                let vm = this;
                //子组件通过update更改父组件中的属性值，父组件通过sync来修饰属性名
                //可以实现子组件修改父组件的值，并且不会报错
                //vm.$emit('update:value', []);
                vm.viewValue = [];
                if (vm.checked) {
                    let result = [];
                    vm.options.map((item) => {
                        result.push(item[vm.optionValue])
                    });
                    vm.viewValue = result;
                    //vm.$emit('update:value', result)
                } else {
                    vm.viewValue = [];
                    //vm.$emit('update:value', []);
                }
            },
            isTrue(o) {  //是否是true
                return !this.isFalse(o)
            },
            isFalse(o) {  //是否是false
                if (o == '' || o == undefined || o == null || o == 'null' || o == 'undefined' || o == 0 || o == false || o == NaN) return true;
                return false
            },
        }
    }
</script>

<style lang='scss' scoped>
    .GSelect {
        display: inline-block;
    }
</style>
