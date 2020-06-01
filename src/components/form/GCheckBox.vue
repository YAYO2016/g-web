<template>
    <div class='GCheckBox'>
        <!--多选框和全选-->
        <div v-if="type==='checkbox'" class="CheckBox" :style="{width: width}">
            <el-checkbox-group v-model="viewValue" style="display: inline-block" :disabled="disabled">
                <el-checkbox v-for="(option,index) in options"
                             :key="index"
                             :label="option[optionValue]"
                > {{option[optionKey]}}
                </el-checkbox>
            </el-checkbox-group>
            <el-checkbox v-if="allSelect"
                         style="display: inline-block;margin-left: 20px"
                         v-model="checked"
                         @change='selectAll'>全选
            </el-checkbox>
        </div>
    </div>
</template>

<script>
    /**
     * Created by yanyue on 2020/5/31 10:14
     */

    export default {
        name: "GCheckBox",
        data() {
            return {}
        },
        methods: {}
    }
</script>

<style lang='scss' scoped>
    .GCheckBox {

    }
</style>
