<div align="center">
  <h1>Friendly Log Webpack Plugin</h1>
  <p>Plugin that provides optimized terminal output.</p>
</div>

## Getting Started

friendly-log-webpack-plugin 会以表格的形式按不同类型在终端输出资源文件信息，同类型的文件按体积降序排列。

每种类型的显示条数可控，不可见部分会通过合计行提示总条数。

目前仅支持 HTML、CSS、JS、图片和字体的展示。

## Install

```bash
# NPM
  npm install --save-dev friendly-log-webpack-plugin

# Yarn
  yarn add --dev friendly-log-webpack-plugin
```

## Options

|     Name     |  Type   |               Default                | Description                |
| :----------: | :-----: | :----------------------------------: | :------------------------- |
|   disabled   | Boolean |                false                 | 是否禁用                   |
|     open     | Boolean |                false                 | 编译完成是否自动打开浏览器 |
| countControl | Object  | { css: 0, js: 0, img: 20, font: 20 } | 不同类型文件显示数量控制   |

## Usage

**webpack.config.js**

```js
const FriendlyLogPlugin = require('friendly-log-webpack-plugin')

module.exports = {
  // only display errors and warnings
  stats: {
    preset: 'none',
    errors: true,
    warnings: true,
  },
  // webpack-dev-server only display errors and warnings
  infrastructureLogging: {
    level: 'warn',
  },
  plugins: [new FriendlyLogPlugin()],
}
```

Terminal output in development mode:

![development](./src/assets/screenshot1.png)

Terminal output in production mode:

![production](./src/assets/screenshot2.png)
