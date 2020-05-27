<template>
    <div class='SplitLevel'
         :style="{height}"
    >
    </div>
</template>

<script>
    /**
     * Created by yanyue on 2020/4/5 12:48
     * 占据水平空间100%宽度；一定高度的的空间控件
     */

    export default {
        name: "SplitLevel",
        props: {
            height: {
                type: String || Number,
                default: () => {
                    return "16px"
                }
            }
        }
    }
</script>

<style scoped>
    .SplitLevel {
        width: 100%;
    }
</style>
