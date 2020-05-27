const NotEmpty = [
    {required: true, message: '输入不能为空', trigger: ['blur', 'change']},
];
const TypeEmpty = [
    {required: true, message: '输入不能为空', trigger: ['blur']},
];
const NumberRule = [
    {required: true, message: '输入不能为空', trigger: 'blur'},
    // {type: 'number', message: '必须为数字类型', trigger: ['blur', 'change']}
];
const PasswordRule = [
    {required: true, message: '密码不能为空', trigger: 'blur'},
    {min: 2, max: 30, message: '长度在2-30个字符之间', trigger: 'blur'}
];
const TelRule = [
    {
        required: true,
        message: '请输入手机号码',
        trigger: 'blur'
    },
    {
        validator: function (rule, value, callback) {
            if (/^1[34578]\d{9}$/.test(value) == false) {
                callback(new Error("请输入正确的手机号"));
            } else {
                callback();
            }
        }, trigger: 'blur'
    }
];
const EmailRule = [
    {
        required: true,
        message: '请输入邮箱地址',
        trigger: 'blur'
    },
    {
        type: 'email',//要检验的类型（number，email，date等）
        message: '请输入正确的邮箱地址',
        trigger: ['blur', 'change']
    }
];
const DateRule = [
    {
        required: true,
        message: '请输入日期',
        trigger: 'blur'
    },
    {
        type: 'date',
        message: '请输入正确的日期地址',
        trigger: ['blur', 'change']
    }
];
export default {
    NotEmpty, NumberRule, TelRule, EmailRule, DateRule, TypeEmpty, PasswordRule
};
