<template>
    <div class="SplitVertical" :style="{width}"></div>
</template>

<script>
    /**
     * Created by yanyue on 2020/4/5 12:48
     * 占据一定宽度的，100%高度的固定空间控件
     */
    export default {
        name: "SplitVertical",
        props: {
            width: {
                type: String || Number,
                default: () => {
                    return "16px"
                }
            }
        },
    }
</script>

<style scoped>
    .SplitVertical {
        display: inline-block;
    }
</style>
