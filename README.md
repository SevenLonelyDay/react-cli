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
```cmd
mkdir react-cli && cd react-cli
```

2. 初始化项目,填写项目信息（可一路回车）
```cmd
npm init
```

### 创建webpack打包环境

```cmd
yarn add webpack -D 
yarn add webpack-cli -D 
```
- `yarn`使用`add`添加包，`-D`等于`--save-dev` `-S`等于`--save`
- `-D`和`-S`两者区别：`-D`是你开发时候依赖的东西，`-S` 是你发布之后还依赖的东西

安装好后新建`build`目录放一个webpack基础的开发配置`webpack.dev.config.js`

```cmd
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

```cmd
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

```cmd
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

```cmd
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

```cmd
yarn build
```

现在刷新dist下面的index.html就会看到浏览器输出

```
我现在在使用Babel!
```

有兴趣的可以打开打包好的bundle.js，最下面会发现ES6箭头函数被转换为普通的function函数


### 接入react

安装`react`包

```cmd
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

```cmd
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

```cmd
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

```cmd
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
```cmd
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




