<template>
    <div class='GDate'>
        <!--日期类-->
        <el-date-picker
                v-if="type==='date'||type==='datetime'||type==='daterange' || type==='datetimerange'"
                v-model="viewValue"
                :type="type"
                :clearable="clearable"
                :placeholder="placeholder"
                :format="type==='datetimerange'||type==='datetime'?'yyyy-MM-dd HH:mm:ss':dateFormat"
                :value-format="type==='datetimerange'||type==='datetime'?'yyyy-MM-dd HH:mm:ss':valueFormat"
                :style="{width: type==='datetimerange'||type==='daterange'?'':width}"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :disabled="disabled"
                :picker-options="expireTimeOption"
        >
        </el-date-picker>
    </div>
</template>

<script>
    /**
     * Created by yanyue on 2020/5/31 10:13
     */

    export default {
        name: "GDate",
        props: {
            width: {
                type: String,
                default: "200px"
            },
            //表单控件的类型
            type: {
                type: String,
                default: "date"
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
            //日期开始时间
            startDate: {
                type: [String, Date, Number],
                default: ""
            },
            //日期结束时间
            endDate: {
                type: [String, Date, Number],
                default: ""
            },
            //日期显示值的格式
            dateFormat: {
                type: String,
                default: "yyyy-MM-dd"
            },
            //默认的日期返回值的格式
            valueFormat: {
                type: String,
                default: "yyyy-MM-dd"
            },
            disabled: {
                type: Boolean,
                default: null
            },
            // 设置时间的选中范围 开始时间
            expireStartTime: {
                type: [Number, String],
                default: null
            },
            // 设置时间的选中范围 结束时间
            expireEndTime: {
                type: [Number, String],
                default: null
            }

        },
        data() {
            return {
                viewValue: (this.type === 'datetimerange' || this.type === 'datetime') ? [] : "",
            }
        },
        computed: {
            expireTimeOption() {
                const startTime = this.expireStartTime ? Number(this.expireStartTime) : null;
                const endTime = this.expireEndTime ? Number(this.expireEndTime) : null;
                // 设置时间的选择范围
                return {
                    disabledDate(date) {
                        if (startTime && endTime) {
                            return (startTime > date.getTime() || date.getTime() > endTime - 24 * 60 * 60 * 1000);
                        } else if (startTime) {
                            return startTime > date.getTime()
                        } else if (endTime) {
                            return date.getTime() > endTime - 24 * 60 * 60 * 1000;
                        } else {
                            return true
                        }
                    }
                }
            }
        },
        mounted() {
            //如果是时间区间选择的话
            if ((this.type === 'daterange' || this.type === 'datetimerange')) {
                this.viewValue = [this.startDate, this.endDate];
            } else {
                this.viewValue = this.value;
            }
        },
        watch: {
            value(newVal) {
                this.viewValue = newVal;
            },
            startDate(newVal) {
                this.$set(this.viewValue, 0, newVal);
                //this.viewValue[0] = newVal;
            },
            endDate(newVal) {
                this.$set(this.viewValue, 1, newVal);
                //this.viewValue[1] = newVal;
            },
            viewValue(newVal) {
                if (this.isTrue(newVal)) {
                    this.$emit("update:value", newVal);
                } else {
                    //如果值是0的话，也会是false，但是有时候数据本身就是0，这是需要的
                    if (newVal === 0) {
                        this.$emit("update:value", 0);
                    } else {
                        this.$emit("update:value", "");
                    }
                }
                if (this.type === 'daterange' || this.type === 'datetimerange') {
                    if (this.isTrue(newVal)) {
                        this.$emit("update:startDate", newVal[0]);
                        this.$emit("update:endDate", newVal[1]);
                    } else {
                        this.$emit("update:startDate", "");
                        this.$emit("update:endDate", "");
                    }
                }
            }
        },
        methods: {
            isTrue(o) {  //是否是true
                return !this.isFalse(o)
            },
            isFalse(o) {  //是否是false
                if (o == '' || o == undefined || o == null || o == 'null' || o == 'undefined' || o == 0 || o == false || o == NaN) return true;
                return false
            }
        }
    }
</script>

<style lang='scss' scoped>
    .GDate {
        display: inline-block;
    }
</style>
