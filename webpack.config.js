const path = require('path');

module.exports = {
  entry: {
    index: './src/index.js',
    options: './src/options.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: ['babel-loader']
      }
    ]
  }
};