import Dash from '../pages/dash';
import Login from '../pages/login';

export default [
    {
        /**
         * 页面名,菜单命中
         */
        name: 'home',
        /**
         * 显示名称
         */
        title: '首页',
        /**
         * 图标
         */
        icon: '',
        /**
         * url路径
         */
        path: '/',
        /**
         * 页面组件
         */
        page: Dash,
        /**
         * 是否强制匹配
         */
        exact: true,
        /**
         * 是否隐藏外层视图
         */
        hideLayout: true,
        /**
         * 是否不在菜单展示
         */
        hide: false,
    },

    //登录
    { name: 'login', title: '登录', path: '/login', page: Login, exact: true, hide: true, hideLayout: true },

    // { name: 'test', path: '*', page: Test, exact: true, hide: true }
];
