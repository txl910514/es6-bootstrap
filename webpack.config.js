/**
 * Created by txl-pc on 2017/8/6.
 */
let path = require('path')
let HtmlWebpackPlugin = require('html-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
let ExtractTextPlugin = require("extract-text-webpack-plugin");
let webpack = require('webpack')
let dist =path.resolve(__dirname,"dist")
const utils = {
  assetsPath:function (_path) {
    return path.posix.join('static', _path)
  }
}
module.exports = {
  entry: {
    main: './src/main.js'
  },
  output:{
    path: dist,
    filename: utils.assetsPath('js/[name].js'),
    publicPath: "/",
  },
  resolve: {
    extensions: ['.js','.json'],
    alias: {
      'jquery': 'jquery/src/jquery'
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use:[{
          loader: 'babel-loader'
        }]
      },
      {
        test: /\.css$/,
        // exclude: /(node_modules|bower_components)/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
                sourceMap: false
              }
            }
          ]
        })
      },
      {
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.html/,
        exclude: /(node_modules|bower_components)/,
        use:[{
          loader: 'html-loader'
        }]
      }
    ]
  },
  devServer: {
    contentBase: dist,
    publicPath: "/",
    compress: true,
    port: 5000,
    disableHostCheck: true,
    proxy: {
      '/mock': {
        target: 'http://127.0.0.1:3090',
        changeOrigin: true,
        pathRewrite: {
          '^/mock': '/mock'
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title:"main",
      filename: 'main.html',
      template: path.resolve(__dirname, './index.html'),
      chunks: ['main', 'vendor'],
      inject: true
    }),
    new ExtractTextPlugin(utils.assetsPath('css/[name].css')),
    new OpenBrowserPlugin({url: 'http://localhost:5000/main.html'}),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      minChunks: Infinity,
    }),
    new webpack.ProvidePlugin({
      $:"jquery",
      jQuery:"jquery",
      "window.$":"jquery",
      "window.jQuery":"jquery"
    })
  ]
}