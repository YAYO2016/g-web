/**
 * Created by yanyue on 2020/5/27 21:47
 */
const Layout = () => import('@/views/layout/Layout');
const NoFound = () => import('@/views/errorPages/NoFound');

/**
 * hidden: true                   如果hidden为true则在左侧菜单栏不展示
 * name:'router-name'             路由名称，必须填写
 * meta : {
    title: 'title'               对应路由在左侧菜单栏的标题名称
    icon: 'icon-class'           对应路由在左侧菜单栏的图标样式，样式使用fontawesome图标库
    roles:[xxx,xxx]              可以访问该路由的用户权限，没有该属性的话就是谁都可以访问
  }
 **/

export const constantRoutes = [
    //重定向路由必须放在第一位
    {
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [
            {
                path: '/redirect/:path(.*)',  //*代表匹配0个或者多个路由
                component: () => import('@/views/redirect/Redirect')
            }
        ]
    },
    {
        path: '/login',
        component: () => import('@/views/login/Login'),
        hidden: true
    },
    {
        path: '/register',
        component: () => import('@/views/register/Register'),
        hidden: true
    },
    {
        path: '/forgetPassword',
        component: () => import('@/views/forgetPassword/ForgetPassword'),
        hidden: true
    },
    //404错误页面
    {
        path: '/404',
        name: 'noFound',
        component: NoFound,
    },
    {
        path: '/',
        component: Layout,
        redirect: '/home',
        children: [
            {
                path: '/home',
                component: () => import('@/views/home/Home'),
                name: 'Home',
                meta: {title: '首页', icon: 'svg-home'}
            }
        ]
    },

];

export const asyncRoutes = [
    {
        path: '/bank',
        component: Layout,
        name: 'Bank',
        redirect: '/bank/banklist',
        meta: {title: '银行', icon: 'fa fa-university', roles: ["visitor", "admin"]},
        children: [
            {
                path: '/bank/banklist',
                component: () => import('@/views/bank/BankList'),
                name: 'BankList',
                // keepAlive 添加组件缓存
                meta: {title: '银行列表', icon: 'fa fa-university', roles: ["visitor", "admin"], keepAlive: true}
            },
        ]
    },
    {
        path: '/form',
        component: Layout,
        name: 'Form',
        redirect: '/form/formTest',
        meta: {title: '自定义控件', icon: 'fa fa-fort-awesome', roles: ["visitor", "admin"]},
        children: [
            {
                path: '/form/formTest',
                component: () => import('@/views/formManager/FormTest'),
                name: 'FormTest',
                meta: {title: '自定义表单元素测试', icon: 'svg-dashboard', roles: ["visitor", "admin"]}
            },
            {
                path: '/form/formTabs',
                component: () => import('@/views/formManager/FormTabs'),
                name: 'FormTabs',
                meta: {title: '自定义tabs控件', icon: 'fa fa-keyboard-o', roles: ["visitor", "admin"]}
            },
            {
                path: '/form/formrules',
                component: () => import('@/views/formManager/FormRules'),
                name: 'FormRules',
                meta: {title: '表单校验', icon: 'fa fa-keyboard-o', roles: ["visitor", "admin"]}
            },
            {
                path: '/form/formcomponents',
                component: () => import('@/views/formManager/FormComponents'),
                name: 'FormComponents',
                meta: {title: '自定义表单控件', icon: 'fa fa-keyboard-o', roles: ["visitor", "admin"]}
            },
            {
                path: '/form/formmore',
                component: () => import('@/views/formManager/FormMore'),
                name: 'FormMore',
                meta: {title: '多个表单校验', icon: 'fa fa-keyboard-o', roles: ["visitor", "admin"]}
            },
            {
                path: '/form/formcycle',
                component: () => import('@/views/formManager/FormCycle'),
                name: 'FormCycle',
                meta: {title: '循环表单', icon: 'fa fa-keyboard-o', roles: ["visitor", "admin"]}
            },
        ]
    },
    {
        path: '/table',
        component: Layout,
        name: 'Table',
        redirect: '/table/tabledemo',
        meta: {title: '表格控件', icon: 'fa fa-table', roles: ["visitor", "admin"]},
        children: [
            {
                path: '/table/tabledemo',
                component: () => import('@/views/table/TableDemo'),
                name: 'TableDemo',
                meta: {title: '普通表格', icon: 'svg-excel', roles: ["visitor", "admin"]}
            },
            {
                path: '/table/tableselect',
                component: () => import('@/views/table/TableSelect'),
                name: 'TableSelect',
                meta: {title: '多选表格', icon: 'fa fa-keyboard-o', roles: ["visitor", "admin"]}
            },
            {
                path: '/table/tablesearch',
                component: () => import('@/views/table/TableSearch'),
                name: 'TableSearch',
                meta: {title: '表格搜索', icon: 'fa fa-keyboard-o', roles: ["visitor", "admin"]}
            },
        ]
    },
    {
        path: '/meeting',
        component: Layout,
        name: 'Meeting',
        redirect: '/meeting/meetingList',
        meta: {title: '会议管理', icon: 'fa fa-clock-o', roles: ["admin"]},
        children: [
            {
                path: '/meeting/meetingList',
                component: () => import('@/views/meeting/MeetingList'),
                name: 'MeetingList',
                meta: {title: '会议列表', icon: 'fa fa-clock-o', roles: ["admin"]}
            },
            {
                path: '/meeting/addMeeting',
                component: () => import('@/views/meeting/AddMeeting'),
                name: 'AddMeeting',
                meta: {title: '自定义表格控件', icon: 'fa fa-calendar', roles: ["admin"]}
            },
        ]
    },
    {
        path: '/info',
        component: Layout,
        name: 'Info',
        redirect: '/info/infoList',
        meta: {title: '信息管理', icon: 'svg-info', roles: ["admin"]},
        children: [
            {
                path: '/info/infoList',
                component: () => import('@/views/infoManager/InfoList'),
                name: 'InfoList',
                meta: {title: '信息列表', icon: 'svg-info-list', roles: ["admin"]}
            },
            {
                path: '/info/infoCategory',
                component: () => import('@/views/infoManager/InfoCategory'),
                name: 'InfoCategory',
                meta: {title: '信息分类', icon: 'svg-info-classify', roles: ["admin"]}
            },
            {
                path: '/info/infoDetail',
                component: () => import('@/views/infoManager/InfoDetail'),
                hidden: true,
                name: 'InfoDetail',
                meta: {title: '信息详情', icon: 'svg-info-classify', roles: ["admin"]}
            },
        ]
    },
    {
        path: '/user',
        component: Layout,
        redirect: '/user/userManager',
        meta: {title: '用户模块', icon: 'el-icon-s-custom', roles: ["visitor", "admin"]},
        children: [
            {
                path: '/user/userManager',
                component: () => import('@/views/userManager/UserManager'),
                name: 'UserManager',
                meta: {title: '用户列表', icon: 'svg-userList', roles: ["admin"]}
            },
            {
                path: '/user/userInfo',
                component: () => import('@/views/userManager/UserInfo'),
                hidden: true,
                name: 'UserInfo',
                meta: {title: '用户信息', icon: 'el-icon-s-custom', roles: ["admin", "visitor"]}
            },
        ]
    },

    // 404一定要放到最后面，不然会被之前的拦截掉
    {path: '*', redirect: '/404', hidden: true}

];


