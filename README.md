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

```javascript
import React from 'react';
import ReactDom from 'react-dom';

ReactDom.render(
    <div>Hello React!</div>, document.getElementById('app'));
```

执行打包命令后，刷新`index.html`查看运行效果

接下来我们使用`react`的组件化思想做一下封装，`src`下新建`components`目录，然后新建一个`Hello`目录，里面创建一个`index.js`，写入：

```javascript
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

```javascript
import React from 'react';
import ReactDom from 'react-dom';
import Hello from './components/Hello';

ReactDom.render(
    <Hello/>, document.getElementById('app'));
```

注：import 模块化导入会默认选择目录下的index文件，所以直接写成'./components/Hello'

在根目录执行打包命令,刷新`index.html`查看运行效果

