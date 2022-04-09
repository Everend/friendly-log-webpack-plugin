const chalk = require('chalk')
const round = require('./round')

function addZero(val) {
  return (val + '').padStart(2, '0')
}

function formatTime(year, month, date, hours, minites, seconds) {
  return `${year}-${addZero(month)}-${addZero(date)} ${addZero(hours)}:${addZero(
    minites,
  )}:${addZero(seconds)}`
}

module.exports = {
  // 添加url专用样式
  fancyUrl: msg => {
    return chalk.bold.cyan(msg)
  },
  // 添加时间间隔专用样式
  fancyInterval: val => {
    let interval
    if (val >= 1000) {
      interval = `${round(val / 1000, 2)}s`
    } else {
      interval = `${val}ms`
    }
    return chalk.blueBright(interval)
  },
  // 格式化时间并添加专用样式
  fancyTime: date => {
    const curTime = formatTime(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
    )
    return chalk.greenBright(curTime)
  },
  // 输出内容，状态+信息
  log: (msg, status = 'VOID') => {
    console.log(`${chalk.gray('｢' + chalk.magentaBright(status) + '｣')} ${msg}`)
  },
}
