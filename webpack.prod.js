const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: './src/index.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new BundleAnalyzerPlugin({analyzerMode: 'disabled'}),
  ],
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  mode: 'production',
  output: {
    filename: 'bundle.prod.js',
    path: path.resolve(__dirname, 'static'),
  },
};