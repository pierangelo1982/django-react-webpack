var path = require('path');
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');
var ExtractText = require('extract-text-webpack-plugin');

module.exports = {
  entry:  path.join(__dirname, 'src/index'),
  output: {
    path: path.join(__dirname, 'dist'),
    //filename: '[name]-[hash].js'
    filename: '[name].js'
  },
  plugins: [
    new BundleTracker({
      path: __dirname,
      filename: 'webpack-stats.json'
    }),
    new ExtractText({
        filename: '[name]-[hash].css'
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader'],
      },
      {
        //test: /\.(png|svg|jpg|gif|jpe?g)$/,
        test: /\.(png|svg|jpg|gif|jpe?g)$/,
        use: [
          {
            options: {
              name: "[name].[ext]",
              outputPath: "img/"
            },
            loader: "file-loader"
          }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/"
            }
          }
        ]
      }
    ],
  },
}