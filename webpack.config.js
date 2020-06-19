const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: path.join(__dirname, 'example/src/index.html'),
    filename: './index.html',
});

module.exports = {
    entry: path.join(__dirname, 'example/src/index.js'),
    output: {
        path: path.join(__dirname, 'example/dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ['file-loader'],
            },
        ],
    },
    plugins: [htmlWebpackPlugin],
    resolve: {
        alias: {
            'react-native$': 'react-native-web',
        },
        extensions: ['.js', '.jsx', '.web.js'],
    },
    devServer: {
        port: 3001,
    },
};
