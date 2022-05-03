

const webpack = require('webpack');
const dotenv = require('dotenv'); // to parse env file
const fs = require('fs'); // to check if the file exists
const path = require('path'); // to get the current path


const BundleTracker = require('webpack-bundle-tracker');
//const HtmlWebpackPlugin = require('html-webpack-plugin');
//var SplitByPathPlugin = require('webpack-split-by-path');

const paths = {
  STATIC: path.resolve(__dirname, 'main_app/static/main_app/'),
  SRC: path.resolve(__dirname, 'app_frontend/'), // source folder path -> ADDED IN THIS STEP
  JS: path.resolve(__dirname, 'app_frontend/'),
  NODE_MODULES: path.resolve(__dirname, 'node_modules'),
  
};


// Webpack configuration
module.exports = (env) => {
    // Get the root path (assuming your webpack config is in the root of your project!)
    const currentPath = path.join(__dirname);
  
    // Create the fallback path (the production .env)
    const basePath = currentPath + '/.env';

    // We're concatenating the environment name to our filename to specify the correct env file!
    const envPath = env? basePath + '.' + env.ENVIRONMENT : basePath;

    // Check if the file exists, otherwise fall back to the production .env
    const finalPath = fs.existsSync(envPath) ? envPath : basePath;

    // Set the path parameter in the dotenv config
    const fileEnv = dotenv.config({ path: finalPath }).parsed;
    
    // reduce it to a nice object, the same as before
    const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
        return prev;
    }, {});

    return {
        mode: 'development',
        entry: path.join(paths.JS, 'src/index.tsx'),

        output: {
            path: paths.STATIC,
            filename: 'app.bundle.js',
        },

        // Dev server configuration -> ADDED IN THIS STEP
        // Now it uses our "src" folder as a starting point
        devServer: {
            contentBase: paths.SRC,
            hot : true,
        },

        context: __dirname,
        node: {
            dirname: true
        },

        devtool: 'inline-source-map',
   
        plugins: [
            new webpack.DefinePlugin(envKeys),
            new BundleTracker({filename: './wiplayit_app/webpack-stats.json'}),

        ],

        module: {
            rules: [
                {test: /\.ts|.tsx?$/, loader: "ts-loader"},

                {
                    test: /\.(js)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            "presets": ["@babel/preset-typescript"],
                            "plugins": [
                                [ "@babel/plugin-proposal-class-properties"]
                            ]
                        }
                    }
                },

                { test: /\.txt$/i, use: 'raw-loader',},
 
                {test: /\.svg$/, loader: 'svg-inline-loader'},

                { test: /\.css$/, use: [ 'style-loader', 'css-loader' ]},
                { test: /\.json$/, loader: "json-loader" },
                { test: /\.(png|jp(e*)g|jpg|woff|woff2|eot|ttf|svg)$/,loader: 'url-loader?limit=1000000' },
                
                {
                    test: /\.scss$/,
                    use: [
                        "style-loader", // creates style nodes from JS strings
                        "css-loader", // translates CSS into CommonJS
                        "sass-loader" // compiles Sass to CSS, using Node Sass by default
                    ]
                }
            ],
        },

        resolve: {
  
            alias:{
                config     : path.resolve(paths.JS, 'src/config.json'),
                containers : path.resolve(paths.JS, 'src/containers/'),
                templates  : path.resolve(paths.JS, 'src/templates/'),
                components : path.resolve(paths.JS, 'src/components/'),
                css        : path.resolve(paths.JS, 'src/css/'),
                types      : path.resolve(paths.JS, 'src/types/'),
                actions    : path.resolve(paths.JS, 'src/actions/'),
                dispatch   : path.resolve(paths.JS, 'src/dispatch/'),
                reducers   : path.resolve(paths.JS, 'src/reducers/'),
                api        : path.resolve(paths.JS, 'src/api/'),
                media      : path.resolve(paths.JS, 'src/media/'),
                utils      : path.resolve(paths.JS, 'src/utils.ts/'),
                store      : path.resolve(paths.JS, 'src/store/'),
                App        : path.resolve(paths.JS, 'src/App.tsx'),
                tests      : path.resolve(paths.JS, 'src/tests/'),
                timeStamp  : path.resolve(paths.JS, 'src/timeStamp.ts'),
                serviceWorker : path.resolve(paths.JS, 'src/serviceWorker.js'),
                authService : path.resolve(paths.JS, 'src/authService.ts'),
                typeChecker : path.resolve(paths.JS, 'src/typeChecker.ts'),
            },

            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
        }
    }
};