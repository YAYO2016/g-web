<template>
    <div class='InputView'>
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

        <!--下拉单选和下拉多选选择框-->
        <el-select
                class="Select"
                v-if="type==='select'"
                v-model="viewValue"
                :placeholder="placeholder"
                :style="{width: width}"
                :clearable="clearable"
                :multiple="multiple||allSelect"
                :disabled="disabled"
        >
            <!--全选框-->
            <el-checkbox
                    class="SelectAll"
                    v-if="allSelect"
                    v-model="checked"
                    @change='selectAll'
            >全选
            </el-checkbox>
            <el-option v-for="(option,index) in options"
                       :key="index"
                       :value="option[optionValue]"
                       :label="option[optionKey]"
            >
            </el-option>
        </el-select>

        <!--下拉单选和下拉多选选择框--通过样式将选中框变为checkbox  -->
        <el-select
                class="Select-CheckBox"
                v-if="type==='select-checkbox'"
                v-model="viewValue"
                :placeholder="placeholder"
                :style="{width: width}"
                :clearable="clearable"
                :multiple="multiple||allSelect"
                :disabled="disabled"
        >
            <!--全选框-->
            <el-checkbox
                    class="SelectAll"
                    v-if="allSelect"
                    v-model="checked"
                    @change='selectAll'
            >全选
            </el-checkbox>
            <el-option v-for="(option,index) in options"
                       class="G-CheckBox"
                       :key="index"
                       :value="option[optionValue]"
                       :label="option[optionKey]"
            >
                <span class="check"></span>
                <span style="margin-left: 8px">{{option[optionKey]}}</span>
            </el-option>
        </el-select>

        <!--radio单选-->
        <el-radio-group
                class="Radio"
                v-if="type==='radio'"
                v-model="viewValue"
                :placeholder="placeholder"
                :disabled="disabled"
                :style="{width: width}">
            <el-radio v-for="(option,index) in options"
                      :key="index"
                      :label="option[optionValue]">
                {{option[optionKey]}}
            </el-radio>
        </el-radio-group>

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


        <!--日期类-->
        <el-date-picker
                v-if="type==='date'||type==='daterange' || type==='datetimerange'"
                v-model="viewValue"
                :type="type"
                :clearable="clearable"
                :placeholder="placeholder"
                :format="type==='datetimerange'?'yyyy-MM-dd HH:mm:ss':dateFormat"
                :value-format="type==='datetimerange'?'yyyy-MM-dd HH:mm:ss  ':valueFormat"
                :style="{width: width}"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :disabled="disabled"
        >
        </el-date-picker>

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

        <!--颜色选择-->
        <el-color-picker
                v-if="type==='color'"
                v-model="viewValue"
                :show-alpha="alpha"
                :disabled="disabled"
                :size="size?size:null"
                :predefine="predefineColor?predefineColors:[]">
        </el-color-picker>

        <!--树形控件-->
        <el-tree
                v-if="type==='tree'"
                :data="treeOptions"
                show-checkbox
                :node-key="optionId"
                :check-strictly="true"
                ref="tree"
                highlight-current
                @check="checkTree"
                :props="defaultProps">
            <!--
                check-stricty 父、子节点之间没有关联【不写这个，选了父节点，会默认选择全部的子节点】

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
    import areaJson from "@/assets/json/area.json"

    export default {
        name: "InputView",
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
            multiple: {
                type: Boolean,
                default: false
            },
            //select是否存在全选框
            allSelect: {
                type: Boolean,
                default: false
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
            placeholder: {
                type: String,
                default: "请输入"
            },
            clearable: {
                type: Boolean,
                default: true
            },
            max: {
                type: [Number, String],
                default: Infinity
            },
            min: {
                type: [Number, String],
                default: -Infinity
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
            predefineColor: {
                type: [Boolean, String],
                default: false
            },
            //颜色选择器透明度的设置
            alpha: {
                type: Boolean,
                default: false
            },
            size: {
                type: String,
                default: null
                //medium / small / mini
            },
            disabled: {
                type: Boolean,
                default: null
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
                viewValue: "",
                checked: false,
                areaOptions: [],
                predefineColors: [
                    '#ff4500',
                    '#ff8c00',
                    '#ffd700',
                    '#90ee90',
                    '#00ced1',
                    '#1e90ff',
                    '#c71585',
                    'rgba(255, 69, 0, 0.68)',
                    'rgb(255, 120, 0)',
                    'hsv(51, 100, 98)',
                    'hsva(120, 40, 94, 0.5)',
                    'hsl(181, 100%, 37%)',
                    'hsla(209, 100%, 56%, 0.73)',
                    '#c7158577'
                ]
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
            if (this.type === 'areas') {
                this.areaOptions = this.getAreaList();
                this.viewValue = this.getArea(this.value);
            } else if (this.type === 'tree') {
                //将树形结构一开始的数据加载到组织树上
                this.viewValue = this.value;
                this.$refs.tree.setCheckedKeys([...this.viewValue]);
            }
            if ((this.type === 'daterange' || this.type === 'datetimerange')) {
                this.viewValue = [this.startDate, this.endDate];
            } else {
                this.viewValue = this.value;
            }
        },
        watch: {
            value(newVal){
                this.viewValue = newVal;
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
                if (this.allSelect) {
                    if (newVal.length === this.options.length) {
                        this.checked = true;
                    } else {
                        this.checked = false;
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
    .InputView {
        display: inline-block;
    }
</style>
