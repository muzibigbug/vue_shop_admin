import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入重置样式
import '@/assets/css/reset.css'
// 导入全局样式
import '@/assets/css/global.css'
// 导入字体图标
import '@/assets/fonts/iconfont.css'

// 导入按需加载 element-ui
import '@/plugins/element.js'

// 导入 nprogress ，进度条加载效果
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1';
// 请求拦截器
// 在 request 拦截器中，展示进度条 NProgress.start()
axios.interceptors.request.use(config => {
    NProgress.start();
    // 判断本地是否有 token，并设置请求头 token 信息 
    if (sessionStorage.getItem('userToken')) {
        // 为请求头对象，添加 Token 验证的 Authorization 字段
        config.headers.Authorization = sessionStorage.getItem('userToken');
    }
    // 在最后必须 retnrn config;
    return config;
});
// 在 response 拦截器中，隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
    NProgress.done();
    return config;
});
Vue.prototype.$axios = axios

// 表格树
import ZkTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', ZkTable)

// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
Vue.use(VueQuillEditor);


Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')