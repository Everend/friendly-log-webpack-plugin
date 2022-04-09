// 格式化资源信息并输出
module.exports = (assets, assetsDir, countControl) => {
  const fs = require('fs')
  const path = require('path')
  const zlib = require('zlib')
  const chalk = require('chalk')
  const ui = require('cliui')()

  const isJS = val => /\.js$/.test(val)
  const isCSS = val => /\.css$/.test(val)
  const isHTML = val => /\.html$/.test(val)
  const isIco = val => /\.ico$/.test(val)
  const isImg = val => /\.(jpe?g|png|gif|webp)$/i.test(val)
  const isFont = val => /\.(woff2?|eot|ttf|otf)$/i.test(val)

  const isJSWithSum = val => isJS(val) || /JS$/.test(val)
  const isCSSWithSum = val => isCSS(val) || /CSS$/.test(val)
  const isImgWithSum = val => isImg(val) || /Images$/.test(val)
  const isFontWithSum = val => isFont(val) || /Fonts$/.test(val)

  function formatSize(size) {
    return (size / 1024).toFixed(2) + ' KB'
  }

  function getGzippedSize(path) {
    const buffer = fs.readFileSync(path)
    return formatSize(zlib.gzipSync(buffer).length)
  }

  function makeRow(a, b, c, d) {
    return [
      { text: a, width: 17 },
      { text: b, width: 30, align: 'right' },
      { text: c, width: 15, align: 'right' },
      { text: d, width: 15, align: 'right' },
    ]
  }

  let countList = {
    css: 0,
    js: 0,
    img: 0,
    font: 0,
  }
  // 资源目录的相对路径，例如'dist'。
  const assetsDirX = path.relative('', assetsDir)
  // assets的数据格式为{ 'index.html': { _size: 5064 }, ... }
  const assetsX = Object.keys(assets)
    .map(key => {
      const tests = [isCSS, isJS, isImg, isFont]
      for (let test of tests) {
        if (test(key)) {
          const tpye = test.name.slice(2).toLowerCase()
          // 显示数量小于等于0则不受限制
          if (+countControl[tpye] <= 0) break
          countList[tpye]++
          if (countList[tpye] > countControl[tpye]) return null
        }
      }
      const assetPath = path.join(assetsDirX, key)
      return {
        name: assetPath.split('\\').pop(),
        dir: assetPath.split('\\').slice(0, -1).join('\\'),
        size: formatSize(assets[key]._size),
        gzippedSize: getGzippedSize(assetPath),
      }
    })
    // 过滤无关文件
    .filter(a => {
      return a && !/\.gz$/.test(a.name)
    })
    // 去除查询字符串并对过长文件名进行省略，例如字体文件名'DIN.Alternate.Bold.fa2eb2b6.ttf'。
    .map(a => {
      a.name = a.name.split('?')[0]
      const maxLength = 30
      if (a.name.length > maxLength) {
        const nameArr = a.name.split('.')
        const prefix = nameArr.slice(0, -2).join('.')
        const suffix = nameArr.slice(-1)[0]
        const hash =
          nameArr
            .slice(-2, -1)[0]
            .slice(0, Math.max(maxLength - prefix.length - suffix.length - 4, 0)) + '…'
        a.name = `${prefix}.${hash}.${suffix}`
      }
      return a
    })
  // 添加显示数量受控资源的合计行
  const suffixList = {
    css: 'CSS',
    js: 'JS',
    img: 'Images',
    font: 'Fonts',
  }
  Object.keys(countList).forEach(key => {
    if (+countControl[key] > 0 && countList[key] > countControl[key]) {
      assetsX.push({
        name: `${countControl[key]} / ${countList[key]} of ${suffixList[key]}`,
      })
    }
  })
  // 排序，优先级font>img>js>css>ico>html，大文件优先于小文件。
  assetsX.sort((a, b) => {
    const tests = [
      val => isFontWithSum(val),
      val => isImgWithSum(val),
      val => isJSWithSum(val),
      val => isCSSWithSum(val),
      isIco,
      isHTML,
    ]
    const testA = tests.findIndex(test => test(a.name))
    const testB = tests.findIndex(test => test(b.name))
    return testA - testB || parseFloat(b.size) - parseFloat(a.size)
  })

  ui.div(
    ...makeRow(
      chalk.bold('Dirctory'),
      chalk.bold('Asset'),
      chalk.bold('Size'),
      chalk.bold('Gzipped'),
    ),
  )
  assetsX.forEach(asset => {
    let fancyFile = chalk.white
    if (isJSWithSum(asset.name)) {
      fancyFile = chalk.yellow
    } else if (isCSSWithSum(asset.name)) {
      fancyFile = chalk.blue
    } else if (isHTML(asset.name) || isIco(asset.name)) {
      fancyFile = chalk.red
    } else if (isImgWithSum(asset.name)) {
      fancyFile = chalk.green
    } else if (isFontWithSum(asset.name)) {
      fancyFile = chalk.magenta
    }
    ui.div(
      ...makeRow(
        asset.dir || '-',
        fancyFile(asset.name),
        asset.size || '-',
        asset.gzippedSize || '-',
      ),
    )
  })

  return `\n` + ui.toString() + `\n`
}
