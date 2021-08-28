const path = require('path')
const debug = process.env.NODE_ENV !== 'production'

let cdn = { css: [], js: [] };
// 通过环境变量 来区分是否使用cdn
const isProd = process.env.NODE_ENV === 'production' // 判断是否是生产环境
let externals = {}
    // 如果是生产环境 就排除打包 否则不排除
if (isProd) {
    externals = {
        // key(包名) / value(这个值 是 需要在CDN中获取js, 相当于 获取的js中 的该包的全局的对象的名字)
        'vue': 'Vue', // 后面的名字不能随便起 应该是 js中的全局对象名
        'element-ui': 'ELEMENT', // 都是js中全局定义的
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
    }
    cdn = {
        css: [
            'https://cdn.staticfile.org/nprogress/0.2.0/nprogress.min.css',
            'https://cdn.staticfile.org/quill/1.3.4/quill.core.min.css',
            'https://cdn.staticfile.org/quill/1.3.4/quill.snow.min.css',
            'https://cdn.staticfile.org/quill/1.3.4/quill.bubble.min.css',
            'https://cdn.staticfile.org/element-ui/2.15.5/theme-chalk/index.css'
        ], // 放置css文件目录
        js: [
                'https://cdn.staticfile.org/vue/2.6.11/vue.min.js', // vuejs
                'https://cdn.staticfile.org/element-ui/2.15.5/index.js', // element
                'https://cdn.staticfile.org/axios/0.18.0/axios.min.js',
                'https://cdn.staticfile.org/lodash.js/4.17.11/lodash.min.js',
                'https://cdn.staticfile.org/echarts/4.1.0/echarts.min.js',
                'https://cdn.staticfile.org/nprogress/0.2.0/nprogress.min.js',
                'https://cdn.staticfile.org/quill/1.3.4/quill.min.js',
                'https://cdn.jsdelivr.net/npm/vue-quill-editor@3.0.4/dist/vue-quill-editor.js'
            ] // 放置js文件目录
    }
}

module.exports = {

    chainWebpack: config => {
        // 发布模式
        config.when(process.env.NODE_ENV === 'production', config => {
            config.entry('app').clear().add('./src/main-prod.js');
            // 排除 elementUI xlsx  和 vue
            // key(是要排除的包名):value(实际上是实际引入的包的全局的变量名)
            // 因为要排除element0ui，所以后面要引入CDN文件 CDN文件中有ELEMENT的全局变量名
            // externals首先会排除掉定义的包名，空出来的位置会用变量来替换
            config.set('externals', externals);
            // 注入CDN变量；这行代码会在执行打包的时候执行，会将cdn变量注入到 html 模板中
            config.plugin('html').tap(args => {
                // args 是注入html模板的一个变量
                args[0].cdn = cdn;
                args[0].isProd = true
                return args
            })
        });
        // 开发模式
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js');
            config.plugin('html').tap(args => {
                args[0].isProd = false
                return args
            });
        });

    },
    publicPath: process.env.NODE_ENV === 'production' ? '' : '/',

    devServer: {
        open: true,
        host: 'localhost',
        port: 8080,
        https: false,
        hotOnly: false,
        proxy: { // 配置跨域(拦截域名后面的第一个路径名)
            '/api': {
                target: 'http://127.0.0.1:8888/api/private/v1/',
                ws: true,
                changOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        },
        before: app => {}
    }
}