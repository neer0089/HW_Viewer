/* module.exports = {
  lintOnSave: false,
  devServer: {
    disableHostCheck: true,
    proxy: 'http://127.0.0.1:3000/',
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3000"
    }
  }
}; */

module.exports = {
  lintOnSave: false,
  devServer: {
      disableHostCheck: true,
      port: 8080,
      public: '0.0.0.0:8080'
  },
  publicPath: "/"
}