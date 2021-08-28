import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        component: () =>
            import ( /* webpackChunkName: "login_home_welcome" */ '../views/Login.vue')
    },
    {
        path: '/home',
        name: 'Home',
        component: () =>
            import ( /* webpackChunkName: "login_home_welcome" */ '../views/Home.vue'),
        redirect: '/home/welcome',
        children: [{
                path: 'welcome',
                name: 'Welcome',
                component: () =>
                    import ( /* webpackChunkName: "login_home_welcome" */ '../views/Welcome.vue')
            },
            {
                path: 'users',
                name: 'Users',
                component: () =>
                    import ( /* webpackChunkName: "Users_Rights_Roles" */ '../views/user/Users.vue')
            },
            {
                path: 'rights',
                name: 'Rights',
                component: () =>
                    import ( /* webpackChunkName: "Users_Rights_Roles" */ '../views/power/Rights.vue')
            },
            {
                path: 'roles',
                name: 'Roles',
                component: () =>
                    import ( /* webpackChunkName: "Users_Rights_Roles" */ '../views/power/Roles.vue')
            },
            {
                path: 'categories',
                name: 'Categories',
                component: () =>
                    import ( /* webpackChunkName: "Cate_Params" */ '../views/goods/Categories.vue')
            },
            {
                path: 'params',
                name: 'Params',
                component: () =>
                    import ( /* webpackChunkName: "Cate_Params" */ '../views/goods/Params.vue')
            },
            {
                path: 'goods',
                name: 'Goods',
                component: () =>
                    import ( /* webpackChunkName: "GoodsList_Add" */ '../views/goods/Goods.vue'),

            },
            {
                path: 'goods/add',
                name: 'Add',
                component: () =>
                    import ( /* webpackChunkName: "GoodsList_Add" */ '../views/goods/Add.vue')
            }, {
                path: 'orders',
                name: 'Order',
                component: () =>
                    import ( /* webpackChunkName: "Order_Report" */ '../views/order/Order.vue')
            },
            {
                path: 'reports',
                name: 'Report',
                component: () =>
                    import ( /* webpackChunkName: "Order_Report" */ '../views/report/Report.vue')
            },
        ]
    },
]

const router = new VueRouter({
    // mode: 'history',
    base: process.env.BASE_URL,
    routes
})

/* 
    如果用户没有登录，但是直接通过URL访问特定页面，需要重新登录导航到登录页面
    路由守卫判断本地 token 是否过期
    to:将要访问的路径;from:从哪个路径而来;next:函数（强制跳转路由）
*/
router.beforeEach((to, from, next) => {
    const isLogin = sessionStorage.getItem('userToken') ? true : false;
    if (to.path == '/login') {
        next();
    } else {
        isLogin ? next() : next('/login');
    }
})

export default router