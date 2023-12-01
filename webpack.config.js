const path = require("path");
const fs = require("fs");
const TerserPlugin = require("terser-webpack-plugin");

const common = {
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
    mode: "production", // Set mode to production for optimizations
    optimization: {
        minimize: false,
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
                            reserved: ["connectedCallback"],
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

// Get a list of all files in the examples directory
const exampleFiles = fs.readdirSync(path.resolve(__dirname, "examples", "src"));

// Create an entry object where the keys are the file names without the extension
// and the values are the paths to the files
const exampleEntries = exampleFiles.reduce((entries, file) => {
    const fileNameWithoutExt = path.basename(file, path.extname(file));
    entries[fileNameWithoutExt] = `./examples/src/${file}`;
    return entries;
}, {});

module.exports = [
    Object.assign({}, common, {
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
    Object.assign({}, common, {
        entry: exampleEntries,
        output: {
            path: path.resolve(__dirname, "examples", "dist"),
            filename: "[name].js",
            library: "[name]",
            libraryTarget: "umd",
        },
    }),
];
