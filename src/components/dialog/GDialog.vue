<template>
    <div class="GDialog">
        <el-dialog
                :title="title"
                :visible.sync="visible"
                v-if="visible"
                @close="$emit('update:show', false)"
                :width="width"
                :modal-append-to-body='false'
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :append-to-body="appendToBody"
        >
            <!--
                @closed="closedDialog"
                @open="openDialog"

                v-if="visible"
                使用v-if的话，dialog关闭，里面的子组件也会关闭，下次打开的话，子组件中的方法会重新执行的
                避免发生dialog中存在子组件的created或者mounted方法就执行一次的问题
            -->
            <slot></slot>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'GDialog',
        props: {
            title: {
                type: String,
                default: ''
            },
            width: {
                type: String,
                default: "700px"
            },
            show: {
                type: Boolean,
                default: false
            },
            appendToBody: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                visible: this.show
            }
        },
        watch: {
            show() {
                this.visible = this.show;
            },
            visible: {
                //immediate: true,
                handler(newVal, oldVal) {
                    if (newVal) {
                        //打开弹窗时候执行的操作
                        //console.log("open dialog");
                        this.$emit('openDialog');
                    } else {
                        //关闭弹窗的时候执行的操作
                        //console.log("close dialog");
                        this.$emit('closedDialog');
                    }
                }
            }
        },
        methods: {
            //closedDialog() {
            //    let vm = this;
            //    //vm.$emit('closedDialog');
            //},
            //openDialog() {
            //    let vm = this;
            //    //vm.$emit('openDialog');
            //}
        }
    }
</script>

<style lang="scss" scoped>
    .GDialog {
        /deep/ .el-dialog {
            border-radius: 5px;
            position: absolute;
            top: 50%;
            left: 50%;
            margin: 0 !important;
            transform: translate(-50%, -50%);
            max-height: calc(100% - 30px);
            max-width: calc(100% - 30px);
            display: flex;
            flex-direction: column;

            .el-dialog__header {
                border-radius: 5px 5px 0 0;
                background-color: #EEEEEE;
                height: 30px;
                font-size: 14px;
                padding: 0;
                line-height: 30px;
                text-align: left;

                .el-dialog__title {
                    font-size: 14px;
                    padding-left: 14px;
                }

                .el-dialog__headerbtn {
                    top: 7px;
                }
            }

            .el-dialog__body {
                text-align: left;
                /*padding: 5px 17px 5px 5px;*/
                padding: 20px;
                max-height: 900px;
                overflow-y: auto;

                .back-table {
                    margin-top: 15px;
                }

                /deep/ .dialog-footer {
                    margin-top: 20px;
                    text-align: center;
                }

                textarea {
                    height: 100px;
                }
            }
        }
    }
</style>
