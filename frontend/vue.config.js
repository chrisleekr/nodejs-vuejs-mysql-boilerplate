// vue.config.js

module.exports = {
  publicPath: process.env.BASE_URL || '/',
  configureWebpack: {
    performance: {
      hints: 'warning',
      maxAssetSize: 2048576,
      maxEntrypointSize: 2048576
    }
  }
};
