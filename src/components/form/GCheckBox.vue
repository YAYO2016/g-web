<template>
    <div class='GCheckBox'>
        <!--多选框和全选-->
        <el-checkbox-group v-model="viewValue" style="display: inline-block"
                           :disabled="disabled"
                           @change="handleCheckedOptionsChange"
        >
            <el-checkbox v-for="(option,index) in options"
                         :key="index"
                         :label="returnItem?option:option[optionValue]"
            > {{option[optionKey]}}
            </el-checkbox>
        </el-checkbox-group>
        <!-- 本来想将el-checkbox全选放在el-checkbox-group里面的，但是出现问题，不生效，根据elementUI，只能放在外面了-->
        <el-checkbox v-if="allSelect" style="margin-left: 30px" :indeterminate="isIndeterminate" v-model="checkAll"
                     @change="handleCheckAllChange">全选
        </el-checkbox>
    </div>
</template>

<script>
    /**
     * Created by yanyue on 2020/5/31 10:14
     * checkbox 多选框控件
     */

    export default {
        name: "GCheckBox",
        props: {
            width: {
                type: String,
                default: "175px"
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
            //select是否存在全选框
            allSelect: {
                type: Boolean,
                default: false
            },
            placeholder: {
                type: String,
                default: "请输入"
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
            //el-checkbox 默认返回值是选中item的optionValued的值，如果想要返回的是item对象本身，设置这个为true
            //还有设置value-key  作为 value 唯一标识的键名
            returnItem: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                viewValue: [],
                //indeterminate 属性用以表示 checkbox 的不确定状态
                isIndeterminate: true,
                checkAll: false
            }
        },
        mounted() {
            this.viewValue = this.value;
        },
        methods: {
            isTrue(o) {  //是否是true
                return !this.isFalse(o)
            },
            isFalse(o) {  //是否是false
                if (o == '' || o == undefined || o == null || o == 'null' || o == 'undefined' || o == 0 || o == false || o == NaN) return true;
                return false
            },
            // 选择全部，获取一个不选切换
            handleCheckAllChange(val) {
                // returnItem true返回是对象选项  false返回选中对象中的value对应的值
                let optionsValue = this.returnItem ? this.options : this.options.map(option => (option[this.optionValue]));
                this.viewValue = val ? optionsValue : [];
                this.isIndeterminate = false;
            },
            // 选中选项改变的函数
            handleCheckedOptionsChange(value) {
                let checkedCount = value.length;
                console.log(checkedCount);
                this.checkAll = checkedCount === this.options.length;
                console.log(this.checkAll);
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.options.length;
            }
        },
        watch: {
            value(newVal) {
                this.viewValue = newVal;
            },
            viewValue(newVal) {
                if (this.isTrue(newVal)) {
                    this.$emit("update:value", newVal);  //如果是多选的时候，后台需要的多项的字符串
                }
            }
        }
    }
</script>

<style lang='scss' scoped>
    .GCheckBox {

    }
</style>
