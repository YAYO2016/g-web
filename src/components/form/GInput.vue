<template>
    <div class='GInput'>
        <!--输入框-->
        <el-input
                class="input"
                v-if="type==='input'"
                v-model="viewValue"
                :placeholder="placeholder"
                :style="{width: width}"
                :clearable="clearable"
                :disabled="disabled"
        ></el-input>

        <!--数字类-->
        <el-input-number
                v-if="type==='number'"
                v-model="viewValue"
                :style="{width: width}"
                :placeholder="placeholder"
                :min="Number(min)"
                :max="Number(max)"
                :clearable="clearable"
                :step="Number(step)"
                :label="placeholder"
                :precision="Number(precision)"
                :controls-position="controlsPosition"
                :disabled="disabled"
        >
        </el-input-number>
        <el-input
                v-if="type==='inputPositive'"
                :style="{width: width}"
                :clearable="clearable"
                :placeholder="placeholder"
                v-model="viewValue"
                oninput="value=/^\d*(?:\.\d{0,})?$/.test(value)?value:''"
                :disabled="disabled"
        >
            <!--只能输入数字>0的输入框（正数）-->
        </el-input>
        <el-input
                v-if="type==='inputPositiveInt' || type==='inputInt'"
                :style="{width: width}"
                :clearable="clearable"
                :placeholder="placeholder"
                v-model="viewValue"
                oninput="value=value.replace(/\D|^0/g,'')"
                :disabled="disabled"
        >
            <!--只能输入数字，没有小数的的输入框（正整数）-->
        </el-input>
        <el-input
                v-if="type==='money'"
                :placeholder="placeholder"
                :clearable="clearable"
                :style="{width: width}"
                v-model="viewValue"
                oninput="value=(/^\d*(?:\.\d{0,})?$/.test(value)?value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'):'')"
                :disabled="disabled"
        >
            <!--输入只能保留2位的正整数（一般用于货币）-->
        </el-input>
    </div>
</template>

<script>
    /**
     * Created by yanyue on 2020/5/31 10:14
     */

    export default {
        name: "GInput",
        props: {
            width: {
                type: String,
                default: "175px"
            },
            //表单控件的类型
            type: {
                type: String,
                default: "input"
            },
            //表单控件的值value
            value: {
                default: ""
            },
            clearable: {
                type: Boolean,
                default: true
            },
            placeholder: {
                type: String,
                default: "请输入"
            },
            step: {
                type: [Number, String],
                default: 1
            },
            precision: {  //精度
                type: [Number, String],
                default: 1
            },
            controlsPosition: {
                type: String,
                default: ""
            },
            max: {
                type: [Number, String],
                default: Infinity
            },
            min: {
                type: [Number, String],
                default: -Infinity
            },
        },
        data() {
            return {
                viewValue: "",
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
        },
        watch: {
            value(newVal) {
                this.viewValue = newVal;
            },
            viewValue(newVal) {
                if (this.isTrue(newVal)) {
                    this.$emit("update:value", newVal);
                }
            }
        }
    }
</script>

<style lang='scss' scoped>
    .GInput {
        display: inline-block;
    }
</style>
