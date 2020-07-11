<template>
    <div class='GArea'>
        <!--区域选择-->
        <el-cascader
                :clearable="clearable"
                class="Areas"
                :options="areaOptions"
                v-model="viewValue"
                :style="{width:width}"
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
            this.areaOptions = this.getAreaList();
            this.viewValue = this.getArea(this.value) || "";
        },
        watch: {
            value(newVal) {
                this.viewValue = this.getArea(newVal) || "";
            },
            viewValue(newVal) {
                //区域选择
                if (this.isTrue(newVal)) {
                    this.$emit("update:value", newVal[newVal.length - 1]);
                } else {
                    this.$emit("update:value", "");
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
            //获取地区名 
            setArea(code) {
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
            }
        }

    }

</script>

<style lang='scss' scoped>
    .GArea {
        display: inline-block;
    }
</style>

