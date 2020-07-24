const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


module.exports = {

    /*入口*/
    entry: {
        app:[
            path.join(__dirname, '../src/index.js')
        ],
        vendor: ['react', 'react-router-dom', 'redux', 'react-dom', 'react-redux']
    },
    /*输出到dist目录，输出文件名字为bundle.js*/
    output: {
        path: path.join(__dirname, '../dist'),
        filename: '[name].[hash].js',
        chunkFilename: '[name].[chunkhash].js',
        publicPath : '/'
    },
    // 配置环境变量
    mode:'production',
    /*src目录下面的以.js结尾的文件，要使用babel解析*/
    /*cacheDirectory是用来缓存编译结果，下次编译加速*/
    module: {
        rules: [{
            test: /\.js$/,
            use: ['babel-loader?cacheDirectory=true'],
            include: path.join(__dirname, '../src')
        },{
            test: /\.css$/,
            use: [{
                    loader: MiniCssExtractPlugin.loader
                }, {
                    loader:'css-loader',
                    options: {
                        modules: {
                            localIdentName: '[local]--[hash:base64:5]',
                        },
                    }
                }, 'postcss-loader']
        },{
            test: /\.(png|jpg|gif)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 8192
                }
            }]
        }]
    },
    devtool: 'none',
    // webpack插件
    plugins: [
        // html入口文件
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.join(__dirname, '../public/index.html')
        }),
        new MiniCssExtractPlugin({ // 压缩css
            filename: '[name].[contenthash].css',
            chunkFilename: '[id].[contenthash].css'
        }),
        new OptimizeCssAssetsPlugin(),
        new CleanWebpackPlugin(), // 每次打包前清空
    ],
    resolve: {
        alias: {
            '@pages': path.join(__dirname, '../src/pages'),
            '@components': path.join(__dirname, '../src/components'),
            '@router': path.join(__dirname, '../src/router'),
            '@actions': path.join(__dirname, '../src/redux/actions'),
            '@reducers': path.join(__dirname, '../src/redux/reducers'),
            '@images': path.join(__dirname, '../src/images')
        }
    },
    optimization: {
        splitChunks: {
          chunks: 'all'
        }
    }
};