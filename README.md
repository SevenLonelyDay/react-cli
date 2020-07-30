# 搭建react 全家桶框架

## 运行环境
1.技术栈

```
node                    8.11.1
react                   16.8.6
react-router-dom        5.0.0
redux                   4.0.1
webpack                 4.28.2
@babel/core             7.10.5
@babel/preset-env       7.10.4
@babel/preset-react     7.10.4
babel-loader            8.1.0
```

2.包管理工具

常用的有`npm`,`yarn`等，本人这里使用`yarn`，使用`npm`的小伙伴注意下命令区别

## 构建项目

### 初始化项目

1. 先创建一个目录并进入
```shell script
mkdir react-cli && cd react-cli
```

2. 初始化项目,填写项目信息（可一路回车）
```shell script
npm init
```

### 创建webpack打包环境

```shell script
yarn add webpack -D 
yarn add webpack-cli -D 
```
- `yarn`使用`add`添加包，`-D`等于`--save-dev` `-S`等于`--save`
- `-D`和`-S`两者区别：`-D`是你开发时候依赖的东西，`-S` 是你发布之后还依赖的东西

安装好后新建`build`目录放一个webpack基础的开发配置`webpack.dev.config.js`

```shell script
mkdir build && cd build && echo. > webpack.dev.config.js
```

配置内容很简单，配置入口和输出

```javascript
const path = require('path');

module.exports = {
 
    /*入口*/
    entry: path.join(__dirname, '../src/index.js'),

    /*输出到dist目录，输出文件名字为bundle.js*/
    output: {
        path: path.join(__dirname, '../dist'),
        filename: 'bundle.js'
    }
};
```

然后根据我们配置的入口文件的地址，创建`../src/index.js`文件(请注意src目录和build目录同级)

```shell script
mkdir src && cd src && echo. > index.js
```

然后写入一行内容

```javascript
document.getElementById('app').innerHTML = 'Hello React';
```

在`package.json`文件`scripts`节点中添加可执行的打包命令脚本

```json
{
  "scripts": {
    "build": "webpack --config ./build/webpack.dev.config.js"
  }
}
```

现在在根目录下执行配置的打包命令

```shell script
yarn build
```

我们可以看到生成了`dist`目录和`bundle.js`。（消除警告看后面mode配置） 接下来我们在dist目录下新建一个`index.html`来引用这个打包好的文件
```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
<div id="app"></div>
<script type="text/javascript" src="./bundle.js" charset="utf-8"></script>
</body>
</html>
```

然后双击打开`index.html`,我们就看到浏览器输出

```javascript
Hello React
```

- 环境

刚才打包成功但是带有一个警告，意思是`webpack4`需要我们指定`mode`的类型来区分开发环境和生产环境，他会帮我们自动执行相应的功能，`mode`可以写到启动命令里`--mode=production or development`，也可以写到配置文件里,这里我们将`webpack.dev.config.js`里面添加mode属性。

```javascript
    /*入口*/
    entry: path.join(__dirname, '../src/index.js'),
    mode:'development',
```
再执行打包命令，警告就消失了。

### 配置 babel

> `Babel` 把用最新标准编写的 `JavaScript` 代码向下编译成可以在今天随处可用的版本。 
  这一过程叫做“源码到源码”编译， 也被称为转换编译。(本教程使用的babel版本是7，请注意包名和配置与6的不同)

- @babel/core 调用Babel的API进行转码
- @babel/preset-env 用于解析 ES6
- @babel/preset-react 用于解析 JSX
- babel-loader 加载器

安装babel

```shell script
yarn add @babel/core @babel/preset-env @babel/preset-react babel-loader -D
```

然后在根目录下新建一个`babel`配置文件`babel.config.js`

```javascript
const babelConfig = {
    presets: ["@babel/preset-react", "@babel/preset-env"],
    plugins: []
}

module.exports = babelConfig;
```

修改`webpack.dev.config.js`，增加`babel-loader`！

```javascript
/*src目录下面的以.js结尾的文件，要使用babel解析*/
/*cacheDirectory是用来缓存编译结果，下次编译加速*/
module: {
    rules: [{
        test: /\.js$/,
        use: ['babel-loader?cacheDirectory=true'],
        include: path.join(__dirname, '../src')
    }]
}
```

现在我们简单测试下，是否能正确转义ES6~

修改 src/index.js

```javascript
    /*使用es6的箭头函数*/
    var func = str => {
        document.getElementById('app').innerHTML = str;
    };
    func('我现在在使用Babel!');
```

执行打包命令

```shell script
yarn build
```

现在刷新dist下面的index.html就会看到浏览器输出

```
我现在在使用Babel!
```

有兴趣的可以打开打包好的bundle.js，最下面会发现ES6箭头函数被转换为普通的function函数


### 接入react

安装`react`包

```shell script
yarn add react react-dom -S
```

这里使用 `-S` 来保证生产环境的依赖

修改 `src/index.js`使用`react`

```tsx
import React from 'react';
import ReactDom from 'react-dom';

ReactDom.render(
    <div>Hello React!</div>, document.getElementById('app'));
```

执行打包命令后，刷新`index.html`查看运行效果

接下来我们使用`react`的组件化思想做一下封装，`src`下新建`components`目录，然后新建一个`Hello`目录，里面创建一个`index.js`，写入：

```tsx
import React, { PureComponent } from 'react';

export default class Hello extends PureComponent  {
    render() {
        return (
            <div>
                Hello,组件化-React!
            </div>
        )
    }
}
```

然后让我们修改`src/index.js`，引用`Hello`组件！

```tsx
import React from 'react';
import ReactDom from 'react-dom';
import Hello from './components/Hello';

ReactDom.render(
    <Hello/>, document.getElementById('app'));
```

注：import 模块化导入会默认选择目录下的index文件，所以直接写成`./components/Hello`

在根目录执行打包命令,刷新`index.html`查看运行效果


### 使用react-router路由

对接react的路由`react-router`

```shell script
yarn add react-router-dom -S
```

接下来为了使用路由，我们建两个页面来做路由切换的内容。首先在`src`下新建一个`pages`目录，然后`pages`目录下分别创建`home`和`page`目录，里面分别创建一个`index.js`。

`src/pages/home/index.js`

```tsx
import React, {PureComponent} from 'react';

export default class Home extends PureComponent {
    render() {
        return (
            <div>
                this is home~
            </div>
        )
    }
}
```

`src/pages/page/index.js`

```tsx
import React, {PureComponent} from 'react';

export default class Page extends PureComponent {
    render() {
        return (
            <div>
                this is Page~
            </div>
        )
    }
}
```

两个页面就写好了，然后创建我们的菜单导航组件

`components/Nav/index.js`

```tsx
import React from 'react';
import { Link } from 'react-router-dom';

export default () => {
    return (
        <div>
            <ul>
                <li><Link to="/">首页</Link></li>
                <li><Link to="/page">Page</Link></li>
            </ul>
        </div>
    )
}
```

注：使用`Link`组件改变当前路由

然后我们在`src`下面新建`router.js`，写入我们的路由，并把它们跟页面关联起来

```tsx
import React from 'react';
import { Route, Switch } from 'react-router-dom';

// 引入页面
import Home from './pages/home';
import Page from './pages/page';

// 路由
const getRouter = () => (
    <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/page" component={Page}/>
    </Switch>
);

export default getRouter;
```


页面和菜单和路由都写好了，我们把它们关联起来。在`src/index.js`中

```tsx
import React from 'react';
import ReactDom from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import Nav from './components/Nav';
import getRouter from './router';

ReactDom.render(
    <Router>
        <Nav/>
        {getRouter()}
    </Router>,
    document.getElementById('app')
)
```

现在执行`yarn build`打包后就可以看到内容了，但是点击菜单并没有反应，这是正常的。因为我们目前使用的依然是本地磁盘路径，并不是ip+端口的形式，接下来我们引入`webpack-dev-server`来启动一个简单的服务器。
安装

```shell script
yarn global add webpack-dev-server -D
```

修改`webpack.dev.config.js`,增加`webpack-dev-server`的配置。

```javascript
// webpack-dev-server
devServer: {
    contentBase: path.join(__dirname, '../dist'), 
    compress: true,  // gzip压缩
    host: '0.0.0.0', // 允许ip访问
    hot:true, // 热更新
    historyApiFallback:true, // 解决启动后刷新404
    port: 8000 // 端口
},
```

注：contentBase一般不配，主要是允许访问指定目录下面的文件，这里使用到了dist下面的index.html

然后在`package.json`里新建启动命令

```shell script
"start": "webpack-dev-server --config ./build/webpack.dev.config.js",
```

执行`yarn start`命令后打开 `http://localhost:8000` 即可看到内容，并可以切换路由了！

### 配置代理

devServer下有个proxy属性可以帮助我们设置代理，代理后台接口和前端在一个域名下

修改`webpack.dev.config.js`
```javascript
     devServer: {
       ...
        proxy: { // 配置服务代理
            '/api': {
                 target: 'http://localhost:8000',
                 pathRewrite: {'^/api' : ''},  //可转换
                 changeOrigin:true
            }
        },
        port: 8000 // 端口
     },
```

在 `localhost:8000` 上有后端服务的话，你可以这样启用代理。请求到 `/api/users` 现在会被代理到请求`http://localhost:8000`。（注意这里的第二个属性，它将`'/api'`替换成了`''`空字符串）。`changeOrigin:true`可以帮我们解决跨域的问题。


### devtool优化

当启动报错或者像打断点的时候，会发现打包后的代码无从下手。所以我们使用`devtool`方便调试。在`webpack.dev.config.js`里面添加
```javascript
devtool: 'inline-source-map'
```

然后就可以在srouce里面能看到我们写的代码，也能打断点调试哦~

### 文件路由优化

正常我们引用组件或者页面的时候，一般都是已`../`的形式去使用。若是文件层级过深，会导致`../../../`的情况，不好维护和读懂，为此`webpack`提供了`alias` 别名配置。

看这里：切记名称不可声明成你引入的其他包名。别名的会覆盖你的包名，导致你无法引用其他包。栗子：`redux`、`react`等
首先在`webpack.dev.config.js`里面加入

```javascript
resolve: {
    alias: {
        '@pages': path.join(__dirname, '../src/pages'),
        '@components': path.join(__dirname, '../src/components'),
        '@router': path.join(__dirname, '../src/router')
    }
}
```

然后我们的router.js里面引入组件就可以改为

```tsx
// 之前引入页面
import Home from './pages/home';
import Page from './pages/page';

// 现在引入页面
import Home from 'pages/home';
import Page from 'pages/page';
```

此功能层级越复杂越好用。

### 使用redux

接下来我们要集成`redux`，我们先不讲理论，直接用`redux`做一个最常见的例子，计数器。首先我们在`src`下创建一个`redux`目录，里面分别创建两个目录，`actions`和`reducers`，分别存放我们的`action`和`reducer`。

安装`redux`和`react-redux`
```shell script
yarn add redux -S
yarn add react-redux  -S
```

在目录下`redux/actions`下创建`counter.js`

```tsx
/*action*/

export const INCREMENT = "counter/INCREMENT";
export const DECREMENT = "counter/DECREMENT";
export const RESET = "counter/RESET";

export function increment() {
    return {type: INCREMENT}
}

export function decrement() {
    return {type: DECREMENT}
}

export function reset() {
    return {type: RESET}
}
```

在目录下`redux/reducers`下创建`counter.js`

```tsx
import {INCREMENT, DECREMENT, RESET} from '@actions/counter';

/*
* 初始化state
 */

const initState = {
    count: 0
};
/*
* reducer
 */
export default function reducer(state = initState, action) {
    switch (action.type) {
        case INCREMENT:
            return {
                count: state.count + 1
            };
        case DECREMENT:
            return {
                count: state.count - 1
            };
        case RESET:
            return {count: 0};
        default:
            return state
    }
}
```

在`webpack.dev.config.js`配置里添加`actions`和`reducers`的别名。

```tsx
'@actions': path.join(__dirname, '../src/redux/actions'),
'@reducers': path.join(__dirname, '../src/redux/reducers')
```

到这里要说一下，`action`创建函数，主要是返回一个`action`类，`action`类有个`type`属性，来决定执行哪一个`reducer`。`reducer`是一个纯函数（只接受和返回参数，不引入其他变量或做其他功能），主要接受旧的`state`和`action`，根据`action`的`type`来判断执行，然后返回一个新的`state`。

>特殊说明：你可能有很多`reducer`，`type`一定要是全局唯一的，一般通过`prefix`来修饰实现。例子：`counter/INCREMENT`里的`counter`就是他所有type的前缀。


接下来我么要在redux目录下创建一个store.js。

```tsx
import {createStore} from 'redux';
import counter  from '@reducers/counter';

let store = createStore(counter);

export default store;
```


store的具体功能介绍：

- 维持应用的 state；
- 提供 getState() 方法获取 state；
- 提供 dispatch(action) 触发reducers方法更新 state；
- 通过 subscribe(listener) 注册监听器;
- 通过 subscribe(listener) 返回的函数注销监听器。

接着我们创建一个`counter`页面来使用`redux`数据。在`pages`目录下创建一个`counter`目录和`index.js`。
页面中引用我们的`actions`来执行`reducer`改变数据。

```tsx

import React, {PureComponent} from 'react';
import { connect } from 'react-redux';
import { increment, decrement, reset } from '@actions/counter';

class Counter extends PureComponent {
    render() {
        return (
            <div>
                <div>当前计数为{this.props.count}</div>
                <button onClick={() => this.props.increment()}>自增
                </button>
                <button onClick={() => this.props.decrement()}>自减
                </button>
                <button onClick={() => this.props.reset()}>重置
                </button>
            </div>
        )
    }
}
export default connect((state) => state, dispatch => ({
    increment: () => {
        dispatch(increment())
    },
    decrement: () => {
        dispatch(decrement())
    },
    reset: () => {
        dispatch(reset())
    }
}))(Counter);
```


`connect`是什么呢？`react-redux`提供了一个方法`connect`。`connect`主要有两个参数，一个`mapStateToProps`,就是把`redux`的`state`，转为组件的`Props`，还有一个参数是`mapDispatchToprops`,把发射`actions`的方法，转为`Props`属性函数。


接着我们添加计数器的菜单和路由来展示我们的计数器功能。

```tsx
Nav组件

<li><Link to="/counter">Counter</Link></li>
```

```tsx
router.js
import Counter from '@pages/counter';
---
<Route path="/counter" component={Counter}/>
```

最后在`src/index.js`中使用`store`功能

```tsx
import {Provider} from 'react-redux';
import store from './redux/store';

ReactDom.render(
    <Provider store={store}>
        <Router>
            <Nav/>
            {getRouter()}
        </Router>
    </Provider>,
    document.getElementById('app')
)
```
Provider组件是让所有的组件可以访问到store。不用手动去传。也不用手动去监听。 接着我们启动一下，`yarn start`,然后就可以再浏览器中看到我们的计数器功能了。

我们开发中会有很多的`reducer`，`redux`提供了一个`combineReducers`函数来合并`reducer`，使用起来非常简单。在`store.js`中引入`combineReducers`并使用它。


```tsx
import {combineReducers} from 'redux';

let store = createStore(combineReducers({counter}));
```

然后我们在`counter`页面组件中，使用`connect`注入的`state`改为`counter`即可(`state`完整树中选择你需要的数据集合)。

```tsx
export default connect(({counter}) => counter, dispatch => ({
    increment: () => {
        dispatch(increment())
    },
    decrement: () => {
        dispatch(decrement())
    },
    reset: () => {
        dispatch(reset())
    }
}))(Counter);
```


梳理一下redux的工作流：

- 调用`store.dispatch(action)`提交action。
- `redux store`调用传入的`reducer`函数。把当前的`state`和`action`传进去。
- 根 `reducer` 应该把多个子 `reducer` 输出合并成一个单一的 `state` 树。
- `Redux store` 保存了根 `reducer` 返回的完整 `state` 树。


### HtmlWebpackPlugin优化

之前我们一直通过webpack里面`contentBase: path.join(__dirname, '../dist'),`的配置获取`dist/index.html`来访问。需要写死引入的JS，比较麻烦。这个插件，每次会自动把js插入到你的模板index.html里面去。

我们使用
```shell script
yarn add html-webpack-plugin -D
```


然后注释`webpack.dev.config.js`的`contentBase`配置，并在根目录下新建`public`目录，将`dist`下的`index.html`移动到`public`下，然后删除`bundle.js`的引用

接着在`webpack.dev.config.js`里面加入`html-webpack-plugin`的配置。


```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');

plugins: [
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.join(__dirname, '../public/index.html')
    })
]

```

接下来，我们每次启动都会使用这个`html-webpack-plugin`，`webpack`会自动将打包好的JS注入到这个`index.html`模板里面。


### 编译css优化

首先安装css的`loader`
```shell script
yarn add css-loader style-loader -D
```

然后在我们之前的`pages/page`目录下添加`index.css`文件，写入一行css

```css
.page-box {
    border: 1px solid red;
    display: flex;
}
```

然后我们在`page/index.js`中引入并使用

```tsx
import './index.css';

<div class="page-box">
    this is Page~
</div>
```

最后我们让webpack支持加载css，在`webpack.dev.config.js` `rules`增加

```javascript
rules: [{
    test: /\.js$/,
    use: ['babel-loader?cacheDirectory=true'],
    include: path.join(__dirname, '../src')
},{
    test: /\.css$/,
    use: ['style-loader', 'css-loader']
}]
```

`yarn start` 启动后查看page路由就可以看到样式生效了。


- `css-loader`使你能够使用类似@import 和 url(...)的方法实现 require()的功能；


- `style-loader`将所有的计算后的样式加入页面中； 二者组合在一起使你能够把样式表嵌入webpack打包后的JS文件中。


### 集成PostCSS优化

刚才的样式我们加了个`display:flex;`样式,往往我们在写CSS的时候需要加浏览器前缀。可是手动添加太过于麻烦，`PostCSS`提供了`Autoprefixer`这个插件来帮我们完成这个工作。

安装`postcss-loader` `postcss-cssnext`


```shell script
yarn add postcss-loader postcss-cssnext -D
```

`postcss-cssnext` 允许你使用未来的 CSS 特性（包括 `autoprefixer`）。

然后配置`webpack.dev.config.js`

```shell script
rules: [{
    test: /\.(css)$/,
    use: ['style-loader', 'css-loader', 'postcss-loader']
}]
```

然后在根目录下新建`postcss.config.js`

```js
module.exports = {
    plugins: {
        'postcss-cssnext': {}
    }
};
```

现在你运行代码，然后写个css，去浏览器审查元素，看看，属性是不是生成了浏览器前缀!。如下：

```css
/** 编译前 */
.page-box {
    border: 1px solid red;
    display: flex;
}

/** 编译后 */
.page-box {
    border: 1px solid red;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
}

```

### CSS Modules优化


CSS的规则都是全局的，任何一个组件的样式规则，都对整个页面有效。产生局部作用域的唯一方法，就是使用一个独一无二的class的名字，不会与其他选择器重名。这就是 `CSS Modules` 的做法。

我们在`webpack.dev.config.js`中启用`modules`

```js
use: ['style-loader', 'css-loader?modules', 'postcss-loader']
```


接着我们在引入css的时候，可以使用对象`.`属性的形式。（这里有中划线，使用[属性名]的方式）

```tsx
import style from './index.css';

<div className={style["page-box"]}>
    this is Page~
</div>
```

这个时候打开控制台，你会发现`class`变成了一个哈希字符串。然后我们可以美化一下，使用`cssmodules`的同时，也能看清楚原先是哪个样式。修改`css-loader`


```
/** 修改之前 */
css-loader?modules

/** 之后 */
{
    loader:'css-loader',
    options: {
        modules: {
            localIdentName: '[local]--[hash:base64:5]',
        }
    }
}

```

重启webpack后打开控制台，发现class样式变成了`class="page-box--1wbxe"`


### 编译图片优化

安装图片的加载器


```shell script
yarn add url-loader file-loader -D
```


然后在src下新建images目录，并放一个图片`a.png`。


接着在`webpack.dev.config.js`的`rules`中配置，同时添加`images`别名。

```javascript
{
    test: /\.(png|jpg|gif)$/,
    use: [{
        loader: 'url-loader',
        options: {
            limit: 8192
        }
    }]
}

'@images': path.join(__dirname, '../src/images'),
```

options `limit 8192`意思是，小于等于8K的图片会被转成base64编码，直接插入HTML中，减少HTTP请求。

然后我们继续在刚才的page页面，引入图片并使用它。

```tsx
import pic from '@images/a.png'

<div className={style["page-box"]}>
    this is Page~
    <img src={pic}/>
</div>
```

重启webpack后查看到图片


### 按需加载

我们现在启动后看到他每次都加载一个bundle.js文件。当我们首屏加载的时候，就会很慢。因为他也下载其他的东西，所以我们需要一个东西区分我们需要加载什么。目前大致分为按路由和按组件。我们这里使用常用的按路由加载。react-router4.0以上提供了`react-loadable`。


首先引入`react-loadable`


```shell script
yarn add react-loadable -D
```

然后改写我们的`router.js`

```tsx
// 之前
import Home from 'pages/home';
import Page from 'pages/page';
import Counter from 'pages/counter';

// 之后
import loadable from 'react-loadable';
import Loading from '@components/Loading';

const Home = loadable({
    loader: () => import('@pages/Home'),
    loading: Loading,
    timeout: 10000, // 10 seconds
})
const Page = loadable({
    loader: () => import('@pages/page'),
    loading: Loading,
    timeout: 10000, // 10 seconds
})
const Counter = loadable({
    loader: () => import('@pages/Counter'),
    loading: Loading,
    timeout: 10000, // 10 seconds
})

```

`loadable`需要一个`loading`组件，我们在`components`下新增一个`Loading`组件

```tsx
import React from 'react';

export default () => {
    return <div>Loading...</div>
};
```

这个时候启动会发现报错不支持动态导入，那么我们需要babel支持动态导入。 首先引入

```shell script
yarn add @babel/plugin-syntax-dynamic-import -D
```

然后配置`babel.config.js`文件

```javascript
plugins: ["@babel/plugin-syntax-dynamic-import"]
```
再启动就会发现source下不只有`bundle.js`一个文件了。而且每次点击路由菜单，都会新加载该菜单的文件，真正的做到了按需加载。


### 添加404路由

pages目录下新建一个`notfound`目录和`404`页面组件

```tsx
import React, {PureComponent} from 'react';

class NotFound extends PureComponent {
    render() {
        return (
            <div>
                404
            </div>
        )
    }
}
export default NotFound;
```

`router.js`中添加404路由


```tsx
const NotFound = loadable({
    loader: () => import('@pages/notfound'),
    loading: Loading,
    timeout: 10000, // 10 seconds
})

<Switch>
    <Route exact path="/" component={Home}/>
    <Route path="/page" component={Page}/>
    <Route path="/counter" component={Counter}/>
    <Route component={NotFound}/>
</Switch>
```

这个时候输入一个不存在的路由，就会发现页面组件展现为404。


### 提取公共代码


我们打包的文件里面包含了`react`,`redux`,`react-router`等等这些代码，每次发布都要重新加载，其实没必要，我们可以将他们单独提取出来。在`webpack.dev.config.js`中配置入口：

```javascript
entry: {
    app:[
        path.join(__dirname, '../src/index.js')
    ],
    vendor: ['react', 'react-router-dom', 'redux', 'react-dom', 'react-redux']
},
output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].[hash].js',
    chunkFilename: '[name].[chunkhash].js'
},

```


### 提取css文件

我们看到`source`下只有js文件，但是实际上我们是有一个css文件的，它被打包进入了js文件里面，现在我们将它提取出来。 使用`webpack`的`mini-css-extract-plugin`插件。


```shell script
yarn add mini-css-extract-plugin -D
```


然后在`webpack`中配置

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

{
    test: /\.css$/,
    use: [{loader: MiniCssExtractPlugin.loader}, {
        loader:'css-loader',
        options: {
            modules: true,
            localIdentName: '[local]--[hash:base64:5]'
        }
    }, 'postcss-loader']
}
plugins: [
    ...,
    new MiniCssExtractPlugin({ // 压缩css
        filename: '[name].[contenthash].css',
        chunkFilename: '[id].[contenthash].css'
    })
]
```

然后在重启，会发现source中多了一个css文件，那么证明我们提取成功了

### 缓存

刚才我们`output`输出的时候写入了`hash`、`chunkhash`和`contenthash`，那他们到底有什么用呢？

- `hash`是跟整个项目的构建相关，只要项目里有文件更改，整个项目构建的`hash`值都会更改，并且全部文件都共用相同的`hash`值
- `chunkhash`和`hash`不一样，它根据不同的入口文件(`Entry`)进行依赖文件解析、构建对应的`chunk`，生成对应的哈希值。
- `contenthash`是针对文件内容级别的，只有你自己模块的内容变了，那么`hash`值才改变，所以我们可以通过`contenthash`解决上诉问题


### 生产坏境构建


开发环境(`development`)和生产环境(`production`)的构建目标差异很大。

在开发环境中，我们需要具有实时重新加载 或 热模块替换能力的 `source map` 和 `localhost server`。

在生产环境中，我们的目标则转向于关注更小的 `bundle`，更轻量的 `source map`，以及更优化的资源，以改善加载时间。

`build`目录下新建`webpack.prod.config.js`,复制原有配置做修改。首先删除`webpack.dev.config.js`中的`MiniCssExtractPlugin`，然后删除`webpack.prod.config.js`中的`devServer`，然后修改打包命令。


```shell script
"build": "webpack --config ./build/webpack.prod.config.js"
```


再把`webpack.prod.config.js`文件中的`devtool`的值改成`none`。

接下来我们为打包多做一些优化。



### 文件压缩

以前`webpack`使用`uglifyjs-webpack-plugin`来压缩文件，使我们打包出来的文件体积更小。

现在只需要配置`mode`即可自动使用开发环境的一些配置，包括JS压缩等等

```javascript
mode:'production',
```

打包后体积大幅度变小

### 公共块提取


这表示将选择哪些块进行优化。当提供一个字符串，有效值为`all`，`async`和`initial`。提供`all`可以特别强大，因为这意味着即使在异步和非异步块之间也可以共享块。


```javascript
optimization: {
    splitChunks: {
      chunks: 'all'
    }
}
```

重新打包，你会发现打包体积变小。

### css压缩

我们发现使用了生产环境的`mode`配置以后，JS是压缩了，但是css并没有压缩。这里我们使用`optimize-css-assets-webpack-plugin`插件来压缩css。以下是官网建议

> 虽然webpack 5可能内置了`CSS minimizer`，但是你需要携带自己的`webpack 4`。要缩小输出，请使用像`optimize-css-assets-webpack-plugin`这样的插件。设置`optimization.minimizer`会覆盖webpack提供的默认值，因此请务必同时指定`JS minimalizer`


安装`optimize-css-assets-webpack-plugin`插件

```shell script
yarn add optimize-css-assets-webpack-plugin -D
```


添加打包配置`webpack.prod.config.js`


```javascript
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

plugins: [
    ...
    new OptimizeCssAssetsPlugin()
],

```

重新打包，你会发现单独提取出来的CSS也压缩了。



### 打包清空

我们发现每次打包，只要改动后都会增加文件，怎么自动清空之前的打包内容呢？`webpack`提供了`clean-webpack-plugin`插件。 

安装`clean-webpack-plugin`


```shell script
yarn add clean-webpack-plugin -D
```

然后配置打包文件

```javascript
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
plugins: [
    ...
    new CleanWebpackPlugin(), // 每次打包前清空
],
```

### public path

`publicPath` 配置选项在各种场景中都非常有用。你可以通过它来指定应用程序中所有资源的基础路径。在打包配置中添加


```javascript
output: {
    publicPath : '/'
}
```

### 加入 @babel/polyfill、@babel/plugin-transform-runtime、core-js、@babel/runtime-corejs2、@babel/plugin-proposal-class-properties

```shell script
yarn add @babel/polyfill -S
```

将以下行添加到您的webpack配置文件的入口中：

```javascript
 /*入口*/
entry: {
    app:[
        "@babel/polyfill",
        path.join(__dirname, '../src/index.js')
    ],
    vendor: ['react', 'react-router-dom', 'redux', 'react-dom', 'react-redux']
},
```

`@babel/polyfill`可以让我们愉快的使用浏览器不兼容的es6、es7的API。但是他有几个缺点：

- 一是我们只是用了几个API，它却整个的引入了
- 二是会污染全局
- 接下来我们做一下优化，添加

``shell script
yarn add @babel/plugin-transform-runtime -D
yarn add core-js@2.6.5 -D
yarn add @babel/plugin-proposal-class-properties -D

yarn add @babel/runtime-corejs2 -S
```

添加完后配置`package.json`,添加`browserslist`，来声明生效浏览器
```json
"browserslist": [
    "> 1%",
    "last 2 versions"
  ],
```

在修改我们的`babel.config.js`配置文件

```javascript
const babelConfig = {
    presets: [['@babel/preset-env',{
        useBuiltIns: 'entry',
        corejs: 2
    }],'@babel/preset-react'],
    plugins: ['@babel/plugin-syntax-dynamic-import','@babel/plugin-transform-runtime','@babel/plugin-proposal-class-properties']
}

module.exports = babelConfig;
```

`useBuiltIns`是关键属性，它会根据 `browserlist` 是否转换新语法与 `polyfill` 新 AP业务代码使用到的新 API 按需进行 `polyfill`

- false : 不启用polyfill, 如果 import '@babel/polyfill', 会无视 browserlist 将所有的 polyfill 加载进来
- entry : 启用，需要手动 import '@babel/polyfill', 这样会根据 browserlist 过滤出 需要的 polyfill
- usage : 不需要手动import '@babel/polyfill'(加上也无妨，构造时会去掉), 且会根据 browserlist +

注：经测试usage无法支持IE，推荐使用entry，虽然会大几十K。
`@babel/plugin-transform-runtime`和`@babel/runtime-corejs2`，前者是开发时候使用，后者是生产环境使用。主要功能：避免多次编译出helper函数：Babel转移后的代码想要实现和原来代码一样的功能需要借助一些帮助函数。还可以解决`@babel/polyfill`提供的类或者实例方法污染全局作用域的情况。
`@babel/plugin-proposal-class-properties`是我之前漏掉了，如果你要在class里面写箭头函数或者装饰器什么的，需要它的支持。

### 数据请求axios和Mock

我们现在做前后端完全分离的应用，前端写前端的，服务端写服务端的，他们通过API接口连接。
然而往往服务端接口写的好慢，前端没法调试，只能等待。这个时候我们就需要我们的`mock.js`来自己提供数据。
`Mock.js`会自动拦截的我们的`ajax`请求，并且提供各种随机生成数据。（一定要注释开始配置的代理，否则无法请求到我们的mock数据）

首先安装`mockjs`

```shell script
yarn add mockjs -D
```


然后在根目录下新建`mock`目录，创建`mock.js`

```javascript
import Mock from 'mockjs';
 
Mock.mock('/api/user', {
    'name': '@cname',
    'intro': '@word(20)'
});
```

上面代码的意思就是，拦截`/api/user`，返回随机的一个中文名字，一个20个字母的字符串。 然后在我们的`src/index.js`中引入它。
```javascript
import '../mock/mock.js';
```

接口和数据都准备好了，接下来我们写一个请求获取数据并展示。

首先引入axios

```shell script
yarn add axios -S
```

然后分别创建`userInfo`的`reducer`、`action`和`page`

`redux/actions/userInfo.js`如下

```javascript
import axios from 'axios';

export const GET_USER_INFO = "userInfo/GET_USER_INFO";

export function getUserInfo() {
    return dispatch=>{
        axios.post('/api/user').then((res)=>{
            let data = JSON.parse(res.request.responseText);
            dispatch({
                type: GET_USER_INFO,
                payload:data
            });
        })
    }
}
```

`redux/reducers/userInfo.js`如下

```javascript
import { GET_USER_INFO } from '@actions/userInfo';


const initState = {
    userInfo: {}
};

export default function reducer(state = initState, action) {
    switch (action.type) {
        case GET_USER_INFO:
            return {
                ...state,
                userInfo: action.payload,
            };
        default:
            return state;
    }
}
```

`pages/userInfo/index.js`如下

```javascript
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {getUserInfo} from "@actions/userInfo";

class UserInfo extends PureComponent {

    render() {
        const { userInfo={} } = this.props.userInfo;
        return (
            <div>
            {
            <div>
            <p>用户信息：</p>
        <p>用户名：{userInfo.name}</p>
        <p>介绍：{userInfo.intro}</p>
        </div>
    }
    <button onClick={() => this.props.getUserInfo()}>请求用户信息</button>
        </div>
    )
    }
}

export default connect((userInfo) => userInfo, {getUserInfo})(UserInfo);
```
然后将我们的`userInfo`添加到全局唯一的`state`，`store`里面去，

`store.js`文件中
```javascript
import userInfo  from '@reducers/userInfo';

let store = createStore(combineReducers({counter, userInfo}));
```

最后在添加新的路由和菜单即可

`router.js`如下

```javascript
const UserInfo = loadable({
    loader: () => import('@pages/UserInfo'),
    loading: Loading,
    timeout: 10000, // 10 seconds
})

<Route path="/userinfo" component={UserInfo}/>
```

`components/Nav/index.js`如下

```javascript
<li><Link to="/userinfo">UserInfo</Link></li>
```

运行，点击请求获取信息按钮，发现报错：`Actions must be plain objects. Use custom middleware for async actions.`这句话标识`actions`必须是个`action`对象，如果想要使用异步必须借助中间件。

### redux-thunk中间件

我们先引入它

```shell script
yarn add redux-thunk -S
```

然后我们使用`redux`提供的`applyMiddleware`方法来启动`redux-thunk`中间件，使`actions`支持异步函数。

`store.js` 如下

```javascript
import {createStore,applyMiddleware} from 'redux';
import counter  from '@reducers/counter';
import {combineReducers} from 'redux';
import userInfo  from '@reducers/userInfo';
import thunkMiddleware from 'redux-thunk';

let store = createStore(combineReducers({counter, userInfo}), applyMiddleware(thunkMiddleware));

export default store;
```

然后我们在重新启动一下，会发现获取到了数据。



