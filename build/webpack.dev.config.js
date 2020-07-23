const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

    /*入口*/
    entry: path.join(__dirname, '../src/index.js'),
    // 配置环境变量
    mode:'development',
    /*src目录下面的以.js结尾的文件，要使用babel解析*/
    /*cacheDirectory是用来缓存编译结果，下次编译加速*/
    module: {
        rules: [{
            test: /\.js$/,
            use: ['babel-loader?cacheDirectory=true'],
            include: path.join(__dirname, '../src')
        }]
    },
    // webpack启动服务配置
    devServer: {
        // contentBase: path.join(__dirname, '../dist'),
        compress: true,  // gzip压缩
        host: '0.0.0.0', // 允许ip访问
        hot:true, // 热更新
        historyApiFallback:true, // 解决启动后刷新404
        proxy: { // 配置服务代理
            '/api': {
                target: 'http://localhost:8000',
                pathRewrite: {'^/api' : ''},  //可转换
                changeOrigin:true
            }
        },
        port: 8000 // 端口
    },
    devtool: 'inline-source-map',
    // webpack插件
    plugins: [
        // html入口文件
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.join(__dirname, '../public/index.html')
        })
    ],
    resolve: {
        alias: {
            '@pages': path.join(__dirname, '../src/pages'),
            '@components': path.join(__dirname, '../src/components'),
            '@router': path.join(__dirname, '../src/router'),
            '@actions': path.join(__dirname, '../src/redux/actions'),
            '@reducers': path.join(__dirname, '../src/redux/reducers')
        }
    },
    /*输出到dist目录，输出文件名字为bundle.js*/
    output: {
        path: path.join(__dirname, '../dist'),
        filename: 'bundle.js'
    }
};