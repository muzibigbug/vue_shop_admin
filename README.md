# vue_shop_admin

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### 技术学习
```
    1. 梳理项目，删除不需要的文件
    2. 导入重置/全局/icon样式 （assets/css/reset.css；assets/css/global.css；assets/fonts/iconfont.css）
    3. less 的使用：（存在问题）
```
#### 登录退出页
```
    1. element-ui:(按需加载)(每个元素的标签是一个内置class)
    2. axios
    3. token
```
#### 知识点学习 
```
    1. 页面布局
        1.1 左侧菜单icon的使用:根据id的不同渲染不同的图标(把id当成键,icon-class当成值封装到iconsObj对象中)
        1.2 切换菜单的折叠与展开
    2. 用户列表页面(views/user/Users.vue)
        2.1 默认左侧菜单高亮
            sessionStorage.setItem(); 保存状态
        2.2 获取用户列表数据(get参数)
            get('/users',{params:{}})
            put请求传参与post一样
        2.3 dialog对话框: v-model改为  :visible.sync
    3. 角色列表中表格多级的展示
    4. 角色列表中分配权限 tree 递归获取当前三级权限id
        // 通过递归的形式，获取角色下所有的三级权限的id，并保存到 defKeys 数组中
          getLeafKeys(node, arr) {
            if (!node.children) {
              return arr.push(node.id);
            }
            node.children.forEach((item) => {
              this.getLeafKeys(item, arr);
            });
          },
    5. 用户列表中的分配权限
    6. 商品分类中的 树形表格 vue-table-with
        npm i vue-table-with-tree-grid -S

        import Vue from 'vue'
        import ZkTable from 'vue-table-with-tree-grid'
 
        Vue.component(ZkTable.name自定义组件名字, ZkTable)
    7. 商品分类中的添加分类的级联选择器(bug:选择任意级别)
    8. 表格中自定义列模块的scope属性是双向绑定的
    9. 数字字符串减0会变成number
    10. 富文本编辑器 vue-quill-editor
        npm install vue-quill-editor -S
        import VueQuillEditor from 'vue-quill-editor'
        Vue.use(VueQuillEditor);
        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
    11. lodash 工具包：
        npm i --save lodash
        import _ from "lodash";
        _.cloneDeep(obj); 深拷贝
        _.merge(obj,obj1); 合并对象
    12. Echarts 图标的使用
        npm install echarts --save 
    13. 进度条加载效果（发起ajax会触发）
        npm install nprogress --save
        // 导入 nprogress ，进度条加载效果
        import NProgress from 'nprogress'
        import 'nprogress/nprogress.css'
        展示进度条(开始请求) NProgress.start()
        隐藏进度条(请求结束) NProgress().done()

```
#### 优化项目
```
    1. 生成打包报告
        1.1 移除项目中所有的 console 方法的插件
            npm install babel-plugin-transform-remove-console -D
            babel.config.js 中配置
            module.exports = {
                "plugins": [
                    ["transform-remove-console", { "exclude": ["error", "warn"] }]
                ]
            }
        1.2 打包时，为了直观地发现项目中存在的问题，可以在打包时生成报告。（两种方式）
            1.通过vue-cli的命令选项可以生成打包报告
                vue-cli-service build --report  (--report选项可以生成report.html帮助分析包内容)

            2.通过可视化ui 直接查看报告（推荐）
                通过黑窗口  vue ui 进入可视化窗口
        1.3 通过vue.config.js修改webpack的默认配置
        1.4  为开发模式与发布模式指定不同的打包入口
            默认情况下，Vue项目的开发模式与发布模式，共用同一个打包的入口文件（即 src/main.js）。为了将项目的开发过程与发布过程分离，我们可以为两种模式，各自指定打包的入口文件，即：
                ① 开发模式的入口文件为 src/main-dev.js
                ② 发布模式的入口文件为 src/main-prod.js
    2. 第三方库启用CDN（减少项目的体积）
        默认情况下，通过 import 语法导入的第三方依赖包，最终会被打包合并到同一个文件中，从而导致打包成功后，单文件体积过大的问题。
        为了解决上述问题，可以通过 webpack 的 externals 节点，来配置并加载外部的 CDN 资源。凡是声明在externals 中的第三方依赖包，都不会被打包。

        实质上就是：在public/index.html加载其他服务器提供的资源
        注意：要把入口main.js文件中导入的第三方包的样式删除掉，然后在public/index.html中静态引入
    3. Element-UI 组件按需加载
    4. 路由懒加载
    5. 首页内容定制（public/index.html）

```
### 打包上线
```
    1. 安装 express ，创建 web 服务器
    2. 静态托管 dist 文件目录
        // 托管静态资源文件
        app.use(express.static('./dist'));
```
