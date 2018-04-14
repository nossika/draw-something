const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require('webpack');

const config = {
    entry: {
        main: path.resolve(__dirname, '../src/main.js'),
        vendor: ['react', 'redux', 'react-redux', 'react-dom', 'react-router-dom', 'rxjs', 'react-router'],
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'build.[name].[hash].js',
        chunkFilename: 'chunk.[name].[chunkhash].js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    "presets": ["es2015", "stage-0", "react"],
                    "plugins": ["transform-runtime", "transform-decorators-legacy"]
                }
            },
            {
                test: /\.(css|less)$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader!less-loader"
                })
            },
            {
                test: /\.(png|jpe?g|gif|svg|eot|ttf|woff)(\?\S*)?$/,
                loader: 'file-loader',
                query: {
                    name: '[name].[ext]?[hash]'
                }
            },
        ]
    },
    resolve: {
        alias: {
            'actions': path.resolve(__dirname, '../src/actions'),
            'components': path.resolve(__dirname, '../src/components'),
            'containers': path.resolve(__dirname, '../src/containers'),
            'utils': path.resolve(__dirname, '../src/utils'),
            'api': path.resolve(__dirname, '../src/api'),
            'flow': path.resolve(__dirname, '../src/flow'),
            'style': path.resolve(__dirname, '../src/style'),
            'lib': path.resolve(__dirname, '../src/lib'),
            'config': path.resolve(__dirname, '../src/config'),
        }
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.[hash].js',
        }),
        new ExtractTextPlugin('style.[hash].css'),
    ]
};

module.exports = config;