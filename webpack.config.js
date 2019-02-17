const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackExternalsPlugin = require("html-webpack-externals-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PostCssPresetEnv = require("postcss-preset-env");

module.exports = {
    entry: {
        app: "./src/index.js"
    },
    output: {
        path: path.resolve(__dirname, "dist")
    },
    plugins: [
        new HtmlWebpackPlugin({
            minify: true,
            title: "Adnat",
            meta: {
                viewport: "width=device-width,initial-scale=1"
            }
        }),
        new HtmlWebpackExternalsPlugin({
            externals: [
                {
                    module: "roboto",
                    entry: {
                        path: "https://fonts.googleapis.com/css?family=Roboto",
                        type: "css"
                    }
                },
                {
                    module: "Patua One",
                    entry: {
                        path:
                            "https://fonts.googleapis.com/css?family=Patua+One",
                        type: "css"
                    }
                }
            ]
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use: [{ loader: "style-loader" }, { loader: "css-loader" }]
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: "css-hot-loader",
                        options: {
                            cssModule: true
                        }
                    },
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            importLoaders: 2,
                            sourceMap: true
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            ident: "postcss",
                            plugins: [PostCssPresetEnv()]
                        }
                    },
                    {
                        loader: "sass-loader"
                    }
                ]
            }
        ]
    }
};
