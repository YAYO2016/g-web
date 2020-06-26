<template>
    <svg :class="svgClass" aria-hidden="true">
        <use :xlink:href="iconName"/>
    </svg>
</template>

<script>
    /**
     * Created by yanyue on 2020/6/26 10:48
     */

    export default {
        name: "SvgIcon",
        props: {
            // 图标的名称
            iconClass: {
                type: String,
                required: true
            },
            // 给图标 新增的样式类（比如 大小和颜色），非必须
            className: {
                type: String,
                default: ''
            }
        },
        computed: {
            iconName() {
                return `#icon-${this.iconClass}`
            },
            svgClass() {
                if (this.className) {
                    return 'svg-icon ' + this.className
                } else {
                    return 'svg-icon'
                }
            }
        }
    }
</script>

<style lang='scss' scoped>
    .svg-icon {
        width: 1em;
        height: 1em;
        vertical-align: -0.15em;
        fill: currentColor; //继承当前元素color的颜色，如果当前元素的color未设定，则继承祖先元素的color值
        overflow: hidden;
    }
</style>
