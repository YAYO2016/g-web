<template>
    <!--
        自定义带建议的输入组件
        autocomplete 是一个可带输入建议的输入框组件
        fetch-suggestions 是一个返回输入建议的方法属性
    -->
    <el-autocomplete class="inline-input AutoComplete"
                     prefix-icon="el-icon-search"
                     v-model="data[valueKey.split(',')[searchValueIndex]]"
                     :fetch-suggestions="querySearch"
                     :placeholder="placeholder"
                     :debounce="0"
                     @select="item=>handleSelectItemFunction(item,valueKey,data)"
                     clearable
                     @clear="()=>{valueKey.split(',').forEach(key=>{data[key.replace('(NoShow)','').replace('NoBack','')]=''})}"
                     :style="{width:width}"
                     :popper-class="popperClass"
                     :disabled="disabled"
    >
        <!--
        debounce默认500，获取输入建议的去抖延时：设置为0防止出现查询时候的闪烁现象

        调用查询的方法获取数据并返回queryString查询关键字:fetch-suggestions="(queryString,cb)=>{querySearchFunction(queryString,cb);flag=false}"

        将选择的item中的数据按照key写到data中
        @select="item=>handleSelectItemFunction(item,valueKey,data,flag)"

        按照之前输入的key，将data中的key的value值全部清空
        @clear="()=>{valueKey.split(',').forEach(key=>{data[key.replace('(No)','')]=''})}"

        悬浮的时候会清除之前选择的数据
         @blur="()=>{flag?'':valueKey.split(',').forEach(key=>{data[key.replace('(No)','')]=''})}"
        -->
        <i slot="prefix" class="icon icon-search-btn-grey"></i>
        <template slot-scope="{item}">
            <!--
                下拉框显示数据的区域，
                没有查询到数据，显示nothingWords对应的字符串‘查无数据’
                查询到数据显示messageItems
            -->
            <div class="name" disabled :style="item.name===nothingWords?'text-align:center':''">
                {{item.name && item.name === nothingWords?nothingWords:messageItems(item,valueKey)}}
                <!--messageItems 下拉框展示数据的方式，通过valueKey返回需要的数据属性值-->
            </div>
        </template>
    </el-autocomplete>
</template>

<script>
    export default {
        name: "GAutoComplete",
        props: {
            //下拉框默认显示的键名对应的下标
            searchValueIndex: {
                type: Number,
                default: 0
            },
            placeholder: {
                type: String,
                default: "下拉选择，可模糊查询"
            },
            //查询的源数据表单{bankId:"",bankName:""}
            data: {
                type: Object,
                default: () => {
                    return {}
                }
            },
            querySearchFunction: {
                type: Function,
                default: () => {
                }
            },
            width: {
                type: String,
                default: "260px"
            },
            itemsLength: {
                type: String,
                default: ""
            },
            //查询的键名  bankName,bankId(NoShow),xxx(NoBack)
            // NoShow表示数据传入但是不显示在下拉框中
            // NoBack表示数据显示在下拉框，但是不用返回给v-model
            valueKey: {
                type: String,
                default: ''
            },
            disabled: {
                type: Boolean,
                default: false
            }

        },
        data() {
            return {
                //flag: false
                results: [],
                nothingWords: "查无数据"
            }
        },
        computed: {
            popperClass() {
                let vm = this;
                if (vm.results.length > 0) {
                    switch (vm.itemsLength) {
                        case "medium":
                            return "popper-class-medium";
                        case "long":
                            return "popper-class-long";
                        case "short":
                            return "popper-class-short";
                        default:
                            return "";
                    }
                } else {
                    return "";
                }

            },
        },
        methods: {
            //点击选择某个选项
            handleSelectItemFunction(item, valueKey, data) {
                //console.log(item);
                let vm = this;
                //没查到数据就把所有的查询项的值全部变为""
                if (item.name && item.name === vm.nothingWords) {
                    valueKey.split(",").forEach(value => {
                        //键名中不包含NoBack的，返回数据
                        if (value.indexOf('NoBack') == -1) {
                            data[value.replace("(NoShow)", "")] = "";
                        }
                    });
                } else {
                    valueKey.split(",").forEach(value => {
                        if (value.indexOf('NoBack') == -1) {
                            data[value.replace("(NoShow)", "")] = item[value.replace("(NoShow)", "")]
                        }
                    });
                }

            },
            async querySearch(queryString, cb) {
                let vm = this;
                //调用父组件传递过来的查询方法（一般是接口查询返回的数据）
                //输入建议数据准备好时通过 cb(data) 返回到 autocomplete 组件中
                vm.results = await vm.querySearchFunction(queryString);
                if (vm.results.length > 0) {
                    cb(vm.results);
                } else {
                    cb([{name: vm.nothingWords}]);
                }
            },
            messageItems(item, valueKey) {
                let message = "";
                //我个人觉得下拉框数据显示2个键的数据已经是极限了
                // 带有No的就是数据会返回，但是下拉框中不需要显示内容
                valueKey = valueKey.replace("(NoBack)", "");
                valueKey.split(",").forEach((key, index) => {
                    if (key.indexOf("(NoShow)") === -1 && index === 0) {
                        //下标0
                        message += `${item[key]}`;
                    } else if (key.indexOf("(NoShow)") === -1 && index === 1) {
                        //下标1
                        message += `（${item[key]}）`;
                    }
                });
                return message;
            }
        }
    }
</script>

<style scoped>
    .AutoComplete {

    }
</style>
