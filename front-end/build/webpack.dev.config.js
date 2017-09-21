const baseConfig = require('./webpack.base.config');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = Object.assign(baseConfig, {
    devServer: {
        hot: true,
        inline: true,
        open: true,
        openPage: '',
        port: 8080,
        proxy: {
            '/asd': {
                target: 'http://localhost:7869/lis'
            }

        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/index.html'),
            inject: 'body'
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
});