const HtmlPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-3-webpack-plugin');
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
        main: './src/index.js',
        dnd: './src/dnd.js'
    },
    devServer: {
        index: 'dnd.html'
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
            title: 'Main Homework',
            template: 'index.hbs',
            chunks: ['main']
        }),
        new HtmlPlugin({
            title: 'Div Drag And Drop',
            template: 'dnd.hbs',
            filename: 'dnd.html',
            chunks: ['dnd']
        }),
        new CleanWebpackPlugin()
    ]
};