const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/js/main.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
        assetModuleFilename: 'assets/[name][ext]',
        clean: true,
        publicPath: '/komus_expert_app/build/'
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.html$/i,
                loader: "html-loader",
                options: {
                    sources: {
                        list: [
                            '...',
                            {
                                tag: 'img',
                                attribute: 'src',
                                type: 'src'
                            }
                        ]
                    }
                }
            },
            {
                test: /\.(svg|png|jpg|jpeg|gif)$/i,
                type: "asset/resource"
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "index.html"
        })
    ],
    devServer: {
        static: "./dist",
        port: 4200,
        open: true,
        historyApiFallback: {
            index: '/komus_expert/'
        }
    },
    resolve: {
        alias: {
            jquery: "jquery/src/jquery"
        }
    },
    mode: "development"
};
