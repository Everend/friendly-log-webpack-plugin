// https://prettier.io/docs/en/options.html

module.exports = {
  // 每行最大长度
  printWidth: 100,
  // 使用tab缩进
  useTabs: false,
  // 每个tab占用的空格数
  tabWidth: 2,
  // 行末添加分号
  semi: false,
  // 换行符，可选'auto'|'lf'(换行)|'cr'(回车)|'crlf'。
  endOfLine: 'crlf',
  // 使用单引号
  singleQuote: true,
  // 对象字面量添加首尾空白符
  bracketSpacing: true,
  // 尾随逗号，可选'none'(无)，'es5'(在ES5中有效地尾随逗号，如对象，数组等)，'all'(尽可能尾随逗号，如函数参数)。
  trailingComma: 'all',
  // 箭头函数仅有一个参数时添加括号，可选'avoid'|'always'。
  arrowParens: 'avoid',
}
