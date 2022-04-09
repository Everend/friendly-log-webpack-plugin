const { fancyUrl, fancyInterval, fancyTime, log } = require('./lib/fancyLog')
const { prepareUrls } = require('./lib/resolveUrl')
const openBrowser = require('./lib/openBrowser')
const fancyAssets = require('./lib/fancyAssets')

// 开发环境在终端上输出url，生产环境输出资源信息。
class FriendlyLogPlugin {
  constructor(options) {
    this.options = Object.assign({ disabled: false, open: false }, options)
    this.options.countControl = Object.assign(
      { css: 0, js: 0, img: 20, font: 20 },
      options?.countControl,
    )
  }
  apply(compiler) {
    if (this.options.disabled) return
    let isFirstCompile = true
    compiler.hooks.done.tap('FriendlyLogPlugin', stats => {
      // 检查编译期是否有错误，存在就返回，否则会影响到编译错误的显示。
      if (stats.hasErrors()) return
      const { assets, startTime, endTime, modules } = stats.compilation

      if (process.env.NODE_ENV !== 'production') {
        // 开发环境
        // 获取开发服务器请求信息，值为 D:\xxx\node_modules\webpack-dev-server\client\index.js?protocol=ws%3A&hostname=0.0.0.0&port=8080&pathname=%2Fws&logging=info&reconnect=10。
        const request = [...modules].find(i =>
          i.context?.includes('\\node_modules\\webpack-dev-server\\client'),
        ).request
        const searchParams = new URL(request).searchParams
        const protocol = compiler.options.devServer?.https ? 'https' : 'http'
        const host = searchParams.get('hostname')
        const port = searchParams.get('port')
        const urls = prepareUrls(protocol, host, port)

        const abbr = 'FLP'
        console.log()
        log(`Project is running at ${fancyTime(new Date(endTime))}`, abbr)
        log(`Local:   ${fancyUrl(urls.localUrl)}`, abbr)
        log(`Network: ${fancyUrl(urls.lanUrl)}`, abbr)
        log(`Compiled successfully in ${fancyInterval(endTime - startTime)}`, abbr)
        console.log()

        // 在默认浏览器上打开页面，只在第一次编译中生效。
        if (isFirstCompile) {
          isFirstCompile = false
          this.options.open && openBrowser(urls.localUrl)
        }
      } else {
        // 生产环境
        const path = compiler.options.output.path
        console.log(fancyAssets(assets, path, this.options.countControl))
      }
    })
  }
}

module.exports = FriendlyLogPlugin
