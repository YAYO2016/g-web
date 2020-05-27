/**
 * Created by yanyue on 2020/3/14 21:45
 * getter是对state中的数据进行二次处理，然后输出
 */
const getters = {
    userRoles: state => state.user.userInfo ? state.user.userInfo.roles.split(",") : null
};
export default getters

