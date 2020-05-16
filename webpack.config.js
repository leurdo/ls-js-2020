const HtmlPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const rules = require('./webpack.config.rules');
const path = require('path');
rules.push({
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader'
    })
});
module.exports = {
    entry: {
        cookie: './src/cookie.js'
    },
    devServer: {
        index: 'index.html'
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve('dist')
    },
    devtool: 'source-map',
    module: { rules },
    plugins: [
        new ExtractTextPlugin('styles.css'),
        new HtmlPlugin({
            title: 'Cookie',
            template: './src/cookie.hbs',
            filename: 'index.html',
            chunks: ['cookie']
        }),
        new CleanWebpackPlugin()
    ]
};