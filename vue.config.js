const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {

    port: 9000,             // Set the port to 9000
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://49.50.174.94:8080',
        changeOrigin: true
      }
    }
  },

  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  }
})
