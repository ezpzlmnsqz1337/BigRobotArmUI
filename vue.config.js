module.exports = {
  pwa: {
    name: 'BigRobotArmUI',
    short: 'BRAUI',
    // themeColor: '#2b1eff'
    themeColor: '#f5f5f5'
  },
  chainWebpack: config => {
    config.module
      .rule('models')
      .test(/\.(glb|gltf|fpbx)$/)
      .use('file-loader')
      .loader('file-loader')
      .tap(options => {
        // modify the options...
        return options
      })
  }
}
