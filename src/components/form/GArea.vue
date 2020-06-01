<template>
    <div class='GArea'>
        <!--区域选择-->
        <el-cascader
                v-if="type==='areas'"
                :clearable="clearable"
                class="Areas"
                :options="areaOptions"
                v-model="viewValue"
                :style="{width:width }"
                :disabled="disabled"
        >
        </el-cascader>
    </div>
</template>

<script>
    /**
     * Created by yanyue on 2020/4/14 20:15
     */
    import areaJson from "@/assets/json/area.json"

    export default {
        name: "GArea",
        props: {
            width: {
                type: String,
                default: "175px"
            },
            //表单控件的类型
            type: {
                type: String,
                default: "areas"
            },
            //表单控件的值value
            value: {
                default: ""
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
        },
        data() {
            return {
                viewValue: "",
                areaOptions: [],
            }
        },
        mounted() {
            //回显数据
            if (this.type === 'areas') {
                this.areaOptions = this.getAreaList();
                this.viewValue = this.value;
            }
        },
        watch: {
            //value(newVal){
            //    this.viewValue = newVal;
            //},
            viewValue(newVal) {
                //区域选择
                if (this.type === 'areas') {
                    if (this.isTrue(newVal)) {
                        this.$emit("update:value", newVal[newVal.length - 1]);
                    } else {
                        this.$emit("update:value", "");
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
            //获取所有省市数据
            getAreaList() {
                let options = [];
                Object.keys(areaJson).forEach((item, index) => {
                    let obj = {};
                    obj["value"] = areaJson[item].code;
                    obj["label"] = areaJson[item].name;
                    if (areaJson[item].children) {
                        let cityList = [];
                        obj["children"] = [];
                        Object.keys(areaJson[item].children).forEach((item2, index2) => {
                            let cityObj = {};
                            cityObj["value"] = areaJson[item].children[item2].code;
                            cityObj["label"] = areaJson[item].children[item2].name;
                            if (areaJson[item].children[item2].children) {
                                let areaList = [];
                                cityObj["children"] = [];
                                Object.keys(areaJson[item].children[item2].children).forEach((item3, index3) => {
                                    let areaObj = {};
                                    areaObj["value"] = areaJson[item].children[item2].children[item3].code;
                                    areaObj["label"] = areaJson[item].children[item2].children[item3].name;
                                    areaObj["parentCode"] = areaJson[item].children[item2].code;
                                    areaObj["parentLabel"] = areaJson[item].children[item2].name;
                                    areaList.push(areaObj);
                                });
                                cityObj["children"] = areaList;
                            }
                            cityObj["parentCode"] = areaJson[item].code;
                            cityObj["parentLabel"] = areaJson[item].name;
                            cityList.push(cityObj);
                        });
                        obj["children"] = cityList;
                    }
                    options.push(obj);
                });
                return options;
            },
            //根据地址码获取具体的地址信息
            getArea(addressCode) {
                let code = addressCode;
                // let code = '130103';
                let list = this.getAreaList();
                let parentList = [];
                let temporary = [], area = [];

                //生成父列表数据
                function buildParentList(arr) {
                    arr.forEach(g => {
                        if (g.value != undefined) {
                            let pid = g['parentCode'];
                            let oid = g['value'];
                            parentList[oid] = pid;
                        }
                        if (g.children != undefined) {
                            buildParentList(g['children']);
                        }
                    })
                }

                //参数是code，按照code查询地址
                function findParent(idx) {
                    if (parentList[idx] != undefined) {
                        let pid = parentList[idx];
                        temporary.push(pid);
                        findParent(pid);
                    }
                }

                buildParentList(list);

                findParent(code);

                if (temporary.length === 0) {
                    //没有查询父级别地址,判断是否是第一级，不是就是脏数据
                    Object.keys(areaJson).indexOf(code) != -1 ? area.push(code) : area = [];
                } else {
                    //有父级别地址
                    for (let i = temporary.length - 1; i >= 0; i--) {
                        area.push(temporary[i]);
                    }
                    area.push(code);
                }
                if (area.length > 0) {
                    return area;
                }
            },
            setArea(code) {//获取地区名 
                if (!code) {
                    return;
                }
                let list = this.getAreaList();
                let parentList = [];
                let temporary = [], area = [];

                function buildParentList(arr) {
                    arr.forEach(g => {
                        if (g.value != undefined) {
                            let pid = g['parentCode'];
                            let oid = g['value'];
                            parentList[oid] = pid;
                        }
                        if (g.children != undefined) {
                            buildParentList(g['children']);
                        }
                    })
                }

                function findParent(idx) {
                    if (parentList[idx] != undefined) {
                        let pid = parentList[idx];
                        temporary.push(pid);
                        findParent(pid);
                    }
                }

                buildParentList(list);
                findParent(code); // 0 1 2 
                for (let i = temporary.length - 1; i >= 0; i--) {
                    area.push(temporary[i]);
                }
                area.push(code);
                let aName = "";
                for (let i = 0; i < list.length; i++) {
                    if (list[i].value == area[0]) {
                        aName += list[i].label;       // debugger 
                        if (area.length > 1) {
                            for (let j = 0; j < list[i].children.length; j++) {
                                if (list[i].children[j].value == area[1]) {
                                    aName += list[i].children[j].label;
                                    if (area.length > 2) {
                                        for (let k = 0; k < list[i].children[j].children.length; k++) {
                                            if (list[i].children[j].children[k].value == area[2]) {
                                                aName += list[i].children[j].children[k].label;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return aName;
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
    .GArea {
        display: inline-block;
    }
</style>

