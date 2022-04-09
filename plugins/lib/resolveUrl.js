const address = require('address')
const defaultGateway = require('default-gateway')

// 是否为绝对url(以'<scheme>://'或'//'开头)
exports.isAbsoluteUrl = function (url) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url)
}

// 准备IP地址、本地url和局域网url
exports.prepareUrls = function (protocol, host, port, pathname = '/') {
  const formatUrl = hostname => {
    // WHATWG URL API
    const myURL = new URL('https://example.org')
    myURL.protocol = protocol
    myURL.hostname = hostname
    myURL.port = port
    myURL.pathname = pathname
    return myURL.href
  }
  // pretty hostname：灵活(别名)主机名，允许使用自由形式(包括特殊/空白字符)的主机名，以展示给终端用户。
  let prettyHost, ipAddress, localUrl
  let lanUrl = 'unavailable'
  // 是否为不确定的主机名
  if (host === '0.0.0.0' || host === '::') {
    prettyHost = 'localhost'
    try {
      // 获取IPv4的默认网关IP地址和网络适配器的名称
      const result = defaultGateway.v4.sync()
      // 获取IPv4地址
      ipAddress = address.ip(result && result.interface)
      if (ipAddress) {
        // 是否为私有IP地址
        if (/^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(ipAddress)) {
          lanUrl = formatUrl(ipAddress)
        } else {
          ipAddress = undefined
        }
      }
    } catch {
      // ignored
    }
  } else {
    prettyHost = host
    ipAddress = host === 'localhost' ? '127.0.0.1' : host
    lanUrl = formatUrl(ipAddress)
  }
  localUrl = formatUrl(prettyHost)
  return {
    ipAddress,
    lanUrl,
    localUrl,
  }
}
