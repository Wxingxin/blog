

# 🔥 一、Plugin 是什么？和 Loader 的区别？

面试必答：

> **Loader 用来处理单个文件，转换类型。Plugin 则用来执行更广泛的构建任务，例如压缩、优化、环境注入、生成 HTML、清空目录、分析打包等，是 webpack 的核心扩展机制。**

配置位置：

```js
module.exports = {
  plugins: [
    new PluginName(options)
  ]
}
```

---

# 🎯 二、最常用 Plugin 速查表（按重要程度排序）

| 插件                         | 作用                    |
| -------------------------- | --------------------- |
| HtmlWebpackPlugin          | 自动生成 HTML，自动引入 bundle |
| DefinePlugin               | 定义全局变量（注入环境变量）        |
| MiniCssExtractPlugin       | 抽离 CSS 成独立文件          |
| CleanWebpackPlugin         | 清理 dist 目录            |
| CopyWebpackPlugin          | 拷贝静态资源                |
| ProvidePlugin              | 自动加载全局变量，如 `$`、`_`    |
| HotModuleReplacementPlugin | 热更新模块                 |
| ESLintWebpackPlugin        | 代码检查                  |
| TerserWebpackPlugin        | JS 压缩                 |
| CssMinimizerPlugin         | CSS 压缩                |
| BundleAnalyzerPlugin       | 构建分析可视化               |
| CompressionWebpackPlugin   | 生成 Gzip 压缩包           |
| VueLoaderPlugin            | 解析 .vue 文件            |
| DefinePlugin               | 注入环境变量                |
| EnvironmentPlugin          | 环境变量简化写法              |
| IgnorePlugin               | 忽略不需要的模块              |


## 1️⃣ HtmlWebpackPlugin（最常用）

自动生成 HTML，自动注入打包产物。

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    })
  ]
}
```

---

# 2️⃣ DefinePlugin（注入环境变量）

用于注入静态变量，让前端可用 `process.env.XXX`。

```js
const { DefinePlugin } = require('webpack');

module.exports = {
  plugins: [
    new DefinePlugin({
      'process.env.API_URL': JSON.stringify('https://api.example.com')
    })
  ]
}
```

**面试高频**：DefinePlugin 在构建阶段进行静态替换。

---

# 3️⃣ EnvironmentPlugin（DefinePlugin 的简写版）

```js
const webpack = require('webpack')

plugins: [
  new webpack.EnvironmentPlugin(['NODE_ENV', 'API_URL'])
]
```

效果等同：

```js
'Dprocess.env.NODE_ENV'
```

---

# 4️⃣ MiniCssExtractPlugin（CSS 抽离）

生产环境从 JS 中分离 CSS 避免闪屏（FOUC）。

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css'
    })
  ]
}
```

loader 配合：

```js
{
  test: /\.css$/,
  use: [MiniCssExtractPlugin.loader, 'css-loader']
}
```

---

# 5️⃣ CleanWebpackPlugin（自动清理 dist）

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

plugins: [
  new CleanWebpackPlugin()
]
```

---

# 6️⃣ CopyWebpackPlugin（复制静态文件）

比如复制 public 的静态资源到 dist。

```js
const CopyWebpackPlugin = require('copy-webpack-plugin');

plugins: [
  new CopyWebpackPlugin({
    patterns: [
      { from: 'public', to: 'public' }
    ]
  })
]
```

---

# 7️⃣ ProvidePlugin（自动引入全局变量）

让模块里用 `$` 不需要写 `import $ from 'jquery'`。

```js
const webpack = require('webpack');

plugins: [
  new webpack.ProvidePlugin({
    $: 'jquery',
    _: 'lodash'
  })
]
```

---

# 8️⃣ HotModuleReplacementPlugin（HMR 热更新）

开发环境使用：

```js
const webpack = require('webpack')

plugins: [
  new webpack.HotModuleReplacementPlugin()
]
```

（webpack5 大多数场景已自动开启）

---

# 9️⃣ ESLintWebpackPlugin（代码检查）

```js
const ESLintPlugin = require('eslint-webpack-plugin');

plugins: [
  new ESLintPlugin({
    extensions: ['js', 'jsx', 'ts', 'tsx'],
    fix: true
  })
]
```

---

# 🔟 TerserWebpackPlugin （压缩 JS）

webpack5 production 默认开启，但可以自定义。

```js
const TerserWebpackPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserWebpackPlugin({
        parallel: true,
        extractComments: false
      })
    ]
  }
}
```

---

# 1️⃣1️⃣ CssMinimizerPlugin（压缩 CSS）

```js
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [
      new CssMinimizerPlugin()
    ]
  }
}
```

---

# 1️⃣2️⃣ BundleAnalyzerPlugin（打包体积可视化）

非常常用！

```js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

plugins: [
  new BundleAnalyzerPlugin()
]
```

运行后会在浏览器展示依赖图。

---

# 1️⃣3️⃣ CompressionWebpackPlugin（生成 .gz 文件）

服务器可直接 gzip 资源。

```js
const CompressionWebpackPlugin = require('compression-webpack-plugin');

plugins: [
  new CompressionWebpackPlugin({
    test: /\.(js|css|html|svg)$/,
    threshold: 10240
  })
]
```

---

# 1️⃣4️⃣ IgnorePlugin（忽略指定模块，减少体积）

例如忽略 moment.js 的本地化文件：

```js
new webpack.IgnorePlugin({
  resourceRegExp: /^\.\/locale$/,
  contextRegExp: /moment$/
})
```

可减少几百 KB。

---

# 1️⃣5️⃣ VueLoaderPlugin（解析 .vue 文件）

Vue 项目必须配置：

```js
const { VueLoaderPlugin } = require('vue-loader')

plugins: [
  new VueLoaderPlugin()
]
```

---

# 1️⃣6️⃣ DefinePlugin（再次强调）

面试会问：**webpack 如何区分开发/生产环境？**

一般用：

```js
new DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
})
```

---

# 🍎 四、常见组合方案

---

## 开发环境常用 Plugins

| 插件                         | 目的        |
| -------------------------- | --------- |
| HtmlWebpackPlugin          | 自动生成 html |
| HotModuleReplacementPlugin | 热更新       |
| DefinePlugin               | 注入环境变量    |
| ProvidePlugin              | 全局注入变量    |
| ESLintWebpackPlugin        | 代码检查      |

---

## 生产环境常用 Plugins

| 插件                       | 目的       |
| ------------------------ | -------- |
| MiniCssExtractPlugin     | 抽离 CSS   |
| CssMinimizerPlugin       | 压缩 CSS   |
| TerserWebpackPlugin      | 压缩 JS    |
| CleanWebpackPlugin       | 清理 dist  |
| CopyWebpackPlugin        | 拷贝静态资源   |
| CompressionWebpackPlugin | gzip 资源  |
| BundleAnalyzerPlugin     | 体积分析     |
| DefinePlugin             | 注入生产环境变量 |

---

# 🍉 五、面试高频问题：Plugin 和 Loader 区别？

回答模板：

> Loader 只处理某一类文件并返回处理结果，比如把 TS 变成 JS；
> Plugin 功能更广泛，在 webpack 构建生命周期中注入钩子，可以做压缩、环境注入、清理目录、生成 HTML、分析体积等。
> Loader 是“文件级转换”，Plugin 是“构建流程增强”。

---

# 📘 六、终极总结（背诵版）

> webpack 中常见 Plugin 包括：HtmlWebpackPlugin、DefinePlugin、MiniCssExtractPlugin、CleanWebpackPlugin、CopyWebpackPlugin、BundleAnalyzerPlugin、CompressionWebpackPlugin、ESLintWebpackPlugin、TerserWebpackPlugin、CssMinimizerPlugin 等。
> 它们分别负责自动生成 HTML、注入环境、抽离 CSS、清理目录、复制资源、分析打包、gzip 压缩、代码检查和 JS/CSS 的压缩优化。
> Plugin 的核心价值是通过 tapable 的生命周期钩子扩展打包构建流程，Loader 则只负责文件级别的内容转换。

---

如果你需要，我还可以整理一份 **webpack 配置模板（包含 loader + plugin 一整套）** 或 **webpack 面试题大全 + 答案**，你想要哪种？

