var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    context: __dirname,
    entry: "./src",
    output: {
        path: __dirname + "/bin",
        filename: "app.js"
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                from: 'node_modules/monaco-editor/min/vs',
                to: 'vs',
            }
        ]),
    ],    
}