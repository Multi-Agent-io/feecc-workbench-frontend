const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.join(__dirname, "/target"),
        // publicPath: "/",
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.svg$/,
                use: [
                    '@svgr/webpack',
                    'url-loader'
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                },
            },
            {
                test: /.(gif|png|ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
                use: [{
                    loader : 'file-loader',
                    options: {
                        name      : '[contenthash].[ext]',
                        // outputPath: 'others',
                        // publicPath: 'public/images/'
                    }
                }]
            },
            { // compiles s[ac]ss to CSS
                test: /\.s[ac]ss$/,
                use : [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
                exclude: /\.module\.css$/
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: true
                        }
                    }
                ],
                include: /\.module\.css$/
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ],
                exclude: /\.module\.css$/
            },
            {
                test: /\.csv$/,
                exclude: [
                  /node_modules/,
                  /translation.csv$/
                ],
                use: 'csv-loader?header=true'
            },
            {
                test: /translation.csv$/,
                exclude: /node_modules/,
                use: [path.resolve('./loaders/i18next-custom-loader.js'), 'csv-loader?header=true?skipEmptyLines=true'],
            }
            
        ]
    },
    devServer: {
        historyApiFallback: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        })
    ],
    
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@components': path.resolve(__dirname, 'src/components'),
            '@reducers': path.resolve(__dirname, 'src/reducers'),
            '@steps': path.resolve(__dirname, 'configs/unitsSteps')
        }
    }
};
