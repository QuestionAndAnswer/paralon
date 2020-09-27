const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

/**
 * @type {webpack.Configuration}
 */
module.exports = {
    mode: "development",
    entry: "./__tests__/tests/index.test.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: 'test.bundle.js',
    },
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /test\.ts$/,
                use: 'mocha-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.ts$/,
                loader: "ts-loader",
                exclude: /node_modules/,
                options: {
                    configFile: path.resolve(__dirname, 'tsconfig.json'),
                }
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin()
    ],
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    }
};