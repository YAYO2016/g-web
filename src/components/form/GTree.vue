<template>
    <div class='GTree'>
        <!--树形控件-->
        <el-tree
                v-if="type==='tree'"
                :data="treeOptions"
                :default-expanded-keys="viewValue"
                show-checkbox
                :node-key="optionId"
                :check-strictly="true"
                ref="tree"
                :highlight-current="true"
                @check="checkTree"
                :props="defaultProps">
            <!--
                check-stricty 父、子节点之间没有关联【不写这个，选了父节点，会默认选择全部的子节点】
                default-expanded-keys 默认展开的节点

                props
                label 指定 节点标签 为节点对象的某个属性值
                children 指定 子树 为节点对象的某个属性值
                disabled 指定节点选择框是否禁用为节点对象的某个属性值
                isLeaf 指定节点是否为叶子节点，仅在指定了 lazy 属性的情况下生效
            -->
        </el-tree>
    </div>
</template>

<script>
    /**
     * Created by yanyue on 2020/4/14 20:15
     */

    export default {
        name: "GTree",
        props: {
            width: {
                type: String,
                default: "175px"
            },
            //表单控件的类型
            type: {
                type: String,
                default: "tree"
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
                default: "key"
            },
            optionValue: {
                type: String,
                default: "value"
            },
            //options选项中的唯一性键名 一般就是id
            optionId: {
                type: String,
                default: "id"
            },
            //options选项中的父级id
            optionParentId: {
                type: String,
                default: "parentId"
            }
        },
        data() {
            return {
                viewValue: [],
            }
        },
        computed: {
            defaultProps() {
                return {
                    children: this.optionValue,
                    label: this.optionKey
                }
            },
            treeOptions() {
                //console.log("options",this.options);
                //这里使用深拷贝 因为translateDataToTree递归函数会修改options本身，所以需要保持源数据options的纯净
                let options = JSON.parse(JSON.stringify(this.options));
                return this.translateDataToTree(options, this.optionId, this.optionParentId);
            }
        },
        mounted() {
            //回显数据
            this.viewValue = this.value;
            this.$refs.tree.setCheckedKeys([...this.viewValue]);
        },
        watch: {
            value(newVal) {
                this.viewValue = newVal;
            },
            viewValue(newVal) {
                this.$emit("update:value", newVal);
            }
        },
        methods: {
            isTrue(o) {  //是否是true
                return !this.isFalse(o)
            },
            isFalse(o) {  //是否是false
                if (o == '' || o == undefined || o == null || o == 'null' || o == 'undefined' || o == 0 || o == false || o == NaN) return true;
                return false
            },
            //把扁平数据转成树形数据
            /**
             * 该方法用于将有父子关系的数组转换成树形结构的数组
             * 接收一个具有父子关系的数组作为参数
             * 返回一个树形结构的数组
             * data 待过滤的数组
             * id 唯一性id
             * parentId 所属于的父级的id
             * children 子类的键名
             */
            translateDataToTree(data, id = 'id', parentId = 'parentId', children = 'children') {
                //console.log("data", data);
                //没有父节点的数据(parentId不存在或者是0的一般是最高级别的节点)
                let parents = data.filter(value => value[parentId] == 'undefined' || value[parentId] == null || value[parentId] == 0);
                //有父节点的数据
                let childrens = data.filter(value => value[parentId] !== 'undefined' && value[parentId] != null && value[parentId] != 0);
                //定义转换方法的具体实现
                let translator = (parents, childrens) => {
                    //遍历父节点数据
                    parents.forEach((parent) => {
                            //遍历子节点数据
                            childrens.forEach((current, index) => {
                                    //此时找到父节点对应的一个子节点
                                    if (current[parentId] === parent[id]) {
                                        //对子节点数据进行深复制，这里只支持部分类型的数据深复制，对深复制不了解的童靴可以先去了解下深复制
                                        let temp = JSON.parse(JSON.stringify(childrens));
                                        //让当前子节点从temp中移除，temp作为新的子节点数据，这里是为了让递归时，子节点的遍历次数更少，如果父子关系的层级越多，越有利
                                        temp.splice(index, 1);
                                        //让当前子节点作为唯一的父节点，去递归查找其对应的子节点
                                        translator([current], temp);
                                        //把找到子节点放入父节点的childrens属性中
                                        typeof parent[children] !== 'undefined' ? parent[children].push(current) : parent[children] = [current]
                                    }
                                }
                            )
                        }
                    )
                };
                //调用转换方法
                translator(parents, childrens);
                //返回最终的结果
                //console.log(parents);
                return parents;
            },
            checkTree() {
                //树形接口选择节点，  返回key的集合，一般就是option的id集合
                this.viewValue = this.$refs.tree.getCheckedKeys();
                //返回node 节点本身对象的数组集合
                //this.viewValue = this.$refs.tree.getCheckedNodes();
            },
        }

    }

</script>

<style lang='scss' scoped>
    .GTree {
        display: inline-block;
    }
</style>
