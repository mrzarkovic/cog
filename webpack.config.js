const path = require("path");
const fs = require("fs");
const TerserPlugin = require("terser-webpack-plugin");

const common = (env) => {
    return {
        module: {
            rules: [
                {
                    test: /\.ts$/, // Use ts-loader for .ts files
                    use: {
                        loader: "babel-loader",
                    },
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: [".ts", ".js"], // Resolve these extensions
        },
        mode: env && env.WEBPACK_BUILD ? "production" : "development",
        optimization: {
            minimize: env && env.WEBPACK_BUILD ? true : false,
            minimizer: [
                new TerserPlugin({
                    // Use TerserPlugin for minification
                    test: /\.js(\?.*)?$/i,
                    terserOptions: {
                        mangle: {
                            toplevel: true,
                            eval: true,
                            keep_fnames: false,
                            properties: {
                                reserved: [
                                    "connectedCallback",
                                    "cogAnchorId",
                                    "shouldUpdate",
                                    "attributes",
                                    "lastTemplateEvaluation",
                                    "parentId",
                                    "Cog",
                                    "render",
                                    "variable",
                                ],
                            },
                        },
                        keep_fnames: false,
                        compress: {
                            drop_console: false,
                            passes: 2,
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
};

// Get a list of all files in the examples directory
const exampleFiles = fs.readdirSync(path.resolve(__dirname, "examples", "src"));

// Create an entry object where the keys are the file names without the extension
// and the values are the paths to the files
const exampleEntries = exampleFiles.reduce((entries, file) => {
    const fileNameWithoutExt = path.basename(file, path.extname(file));
    entries[fileNameWithoutExt] = `./examples/src/${file}`;
    return entries;
}, {});

module.exports = (env) => {
    return [
        Object.assign({}, common(env), {
            entry: {
                cog: "./src/cog.ts",
            },
            output: {
                path: path.resolve(__dirname, "lib"),
                filename: "[name].js",
                library: "Cog",
                libraryTarget: "umd",
            },
        }),
        Object.assign({}, common(env), {
            entry: exampleEntries,
            output: {
                path: path.resolve(__dirname, "examples", "dist"),
                filename: "[name].js",
                library: "[name]",
                libraryTarget: "umd",
            },
        }),
    ];
};
