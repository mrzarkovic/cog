const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    entry: "./src/index.ts", // The entry point of your library
    output: {
        path: path.resolve(__dirname, "lib"), // The output directory
        filename: "cog.js", // The name of the output file
    },
    module: {
        rules: [
            {
                test: /\.ts$/, // Use ts-loader for .ts files
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-typescript",
                        ],
                    },
                },
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"], // Resolve these extensions
    },
    mode: "production", // Set mode to production for optimizations
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                // Use TerserPlugin for minification
                test: /\.js(\?.*)?$/i,
                terserOptions: {
                    mangle: {
                        toplevel: true,
                        eval: true,
                        keep_fnames: false,
                    },
                    keep_fnames: false,
                    compress: {
                        drop_console: false,
                    },
                    output: {
                        comments: false,
                    },
                },
                extractComments: false,
            }),
        ],
    },
};
