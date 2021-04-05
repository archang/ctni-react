const path = require('path')

// noinspection WebpackConfigHighlighting
module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.js'),
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    devServer: {
        disableHostCheck: true
      }
  }
}