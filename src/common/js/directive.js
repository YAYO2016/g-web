/**
 * Created by yanyue on 2020/7/11 23:24
 * vue 自定义指令
 */

import Vue from 'vue';
import store from '@/store'

// 注册一个全局自定义指令 `v-btnPerm`  用来控制按钮的显示权限
Vue.directive('btnPerm', {
    // 1.bind:只调用一次，指令第一次绑定到元素时调用，用这个钩子函数可以定义一个绑定时执行一次的初始化动作。
    // 被绑定
    bind: function (el, binding, vnode) {
        // el 指令所绑定的元素，可以用来直接操作 DOM
        // binding 一个对象，包含以下 property：
        //      name指令名，不包括 v- 前缀
        //      value，指令的绑定值，例如：v-my-directive="1 + 1" 中，绑定值为 2。
        //      oldValue，指令绑定的前一个值，仅在 update 和 componentUpdated 钩子中可用。无论值是否改变都可用。
        //      expression，字符串形式的指令表达式。例如 v-my-directive="1 + 1" 中，表达式为 "1 + 1"。
        //      arg，传给指令的参数，可选。例如 v-my-directive:foo 中，参数为 "foo"。
        //      modifiers：一个包含修饰符的对象。例如：v-my-directive.foo.bar 中，修饰符对象为 { foo: true, bar: true }
        // vnode：Vue 编译生成的虚拟节点。移步 VNode API 来了解更多详情。
        // oldVnode：上一个虚拟节点，仅在 update 和 componentUpdated 钩子中可用。

        // 根据权限来修改样式  是否显示   binding.def指令的实例
        if (binding.def.hasBtnPerm(binding.value)) {
            el.style.display = "inline-block";
        } else {
            el.style.display = "none";
        }

    },
    // 2.inserted:被绑定元素插入父节点时调用（父节点存在即可调用，不必存在于document中）。
    // 绑定到节点
    inserted: function (el) {
    },
    // 3.update:被绑定于元素所在的模板更新时调用，而无论绑定值是否变化。通过比较更新前后的绑定值，可以忽略不必要的模板更新。
    // 组件更新
    update: function () {
    },
    // 4.componentUpdated:被绑定元素所在模板完成一次更新周期时调用。
    // 组件更新完成
    componentUpdated: function () {
    },
    // 5.unbind:只调用一次，指令与元素解绑时调用。
    // 解绑
    unbind: function () {
    },
    hasBtnPerm: function (permission) {
        const buttons = store.state.user.userInfo.buttons;
        const [modules, buttonName] = permission.split('.');
        console.log(modules, buttonName);
        //先过滤出模块中的按钮组   然后判断按钮组中是否有指令的按钮权限
        return buttons.filter(button => (button.value === modules))[0].selectedButtons
            .indexOf(buttonName) !== -1;
    }

})




