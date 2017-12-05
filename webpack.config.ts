import * as path from "path";

import webpack = require("webpack");
import * as UglifyJSPlugin from "uglifyjs-webpack-plugin";

const src = path.join(__dirname, "client");
const dist = path.join(__dirname, "public");

module.exports = {
    context: src,

    entry: [
        "./index"
    ],

    output: {
        filename: "bundle.js",
        path: dist
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            },
            {test: /\.css$/, use: "style-loader"},
            {test: /\.css$/, use: "css-loader"},
            {test: /\.(graphql|gql)$/, exclude: /node_modules/, loader: "graphql-tag/loader"},
            {
                test: /\.jpe?g$|\.gif$|\.png$|\.ttf$|\.eot$|\.svg$/,
                use: "file-loader?name=[name].[ext]?[hash]",
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&mimetype=application/fontwoff"
            },
        ]
    },

    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    devtool: "source-map",
    plugins: [
        new UglifyJSPlugin({
            sourceMap: true
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ]
};
