const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://49.50.174.94:8080',
        changeOrigin: true
      }
    }
  }
})