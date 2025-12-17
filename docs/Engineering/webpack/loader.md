
## 一、loader 是什么？怎么配置？

* **作用**：让 webpack 能“理解”各种非 JS 资源（CSS / TS / 图片 / Vue 单文件组件等），把它们转成 JS 能处理的模块。
* **配置位置**：`webpack.config.js` 的 `module.rules` 中。

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.xxx$/,      // 匹配文件
        use: [               // 从右到左、从下到上执行
          {
            loader: 'loader-name',
            options: { /* ... */ }
          }
        ]
      }
    ]
  }
}
```

---

## 二、样式相关 loader

### 1. `style-loader` + `css-loader`（最基本）

* `css-loader`：让 webpack 认识 `import './index.css'`
* `style-loader`：把 CSS 通过 `<style>` 插入到页面中（开发环境常用）

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',   // 把 CSS 插入到 DOM
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,  // 在 css-loader 之前还有几个 loader
              modules: false     // 若 true，则启用 CSS Modules
            }
          }
        ]
      }
    ]
  }
}
```

#### CSS Modules 示例：

```js
{
  test: /\.module\.css$/,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        modules: {
          localIdentName: '[name]__[local]__[hash:base64:5]'
        }
      }
    }
  ]
}
```

---

### 2. 预处理器：`sass-loader` / `less-loader` / `stylus-loader`

一般链路：

* `style-loader` / `MiniCssExtractPlugin.loader`
* `css-loader`
* `postcss-loader`（可选）
* `sass-loader` / `less-loader` …

```js
{
  test: /\.s[ac]ss$/,
  use: [
    'style-loader',
    'css-loader',
    'postcss-loader',    // 若需要 autoprefixer 等
    'sass-loader'
  ]
}
```

less 类似：

```js
{
  test: /\.less$/,
  use: [
    'style-loader',
    'css-loader',
    'postcss-loader',
    {
      loader: 'less-loader',
      options: {
        lessOptions: {
          javascriptEnabled: true // antd 常用
        }
      }
    }
  ]
}
```

---

### 3. `postcss-loader`（自动添加前缀等）

配合 `postcss.config.js`：

```js
// webpack.config.js
{
  test: /\.css$/,
  use: [
    'style-loader',
    'css-loader',
    'postcss-loader'
  ]
}
```

```js
// postcss.config.js
module.exports = {
  plugins: [
    require('autoprefixer')(),
    // require('postcss-preset-env')()
  ]
}
```

---

### 4. 生产环境抽离 CSS：`MiniCssExtractPlugin.loader`

开发用 `style-loader`，生产改为抽离成单独 CSS 文件。

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV === 'production'
            ? MiniCssExtractPlugin.loader
            : 'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css'
    })
  ]
};
```

---

## 三、TS(方法1) 相关 loader

###  `ts-loader`（编译 TypeScript）

### 1. 安装基础依赖

```bash
npm install --save-dev  typescript
```

### 2. 创建 `tsconfig.json`（示例）

```bash
npx tsc --init
```

```jsonc
{
  "compilerOptions": {
    "target": "ES2017",
    "module": "ESNext",
    "moduleResolution": "Node",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "sourceMap": true
  },
  "exclude": ["node_modules", "dist"]
}
```

> 特点：
> * 使用 TypeScript 官方编译器 `tsc` 做 **语法、类型检查 + 编译**
> * 速度相对 Babel 可能稍慢一点（项目大时）

### 1. 安装依赖

```bash
npm install --save-dev ts-loader
```

**（可选）**再装一个独立做类型检查的插件，以提升构建速度：

```bash
npm install --save-dev fork-ts-checker-webpack-plugin
```

### 2. webpack 配置示例（`webpack.config.js`）

```js
const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
  mode: "development", // 或 "production"
  entry: "./src/index.tsx", // 你的入口文件
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  resolve: {
    // 支持 import xxx from './file'
    extensions: [".ts", ".tsx", ".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              // 使用独立线程做类型检查，提升构建速度
              transpileOnly: true
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin()
  ],
  devtool: "source-map"
};
```

### 3. 小结（ts-loader）

* ✅ 类型检查最权威，完全按 TS 编译器来
* ✅ 对一些高级 TS 特性 / 配置兼容度好
* ⚠️ 项目大时，纯 ts-loader 可能比较慢，因此常配合 `ForkTsCheckerWebpackPlugin` 做异步类型检查
* ⚠️ 如果你还要用到很多 Babel 插件/新语法，就要再把 Babel 接进来，配置稍复杂



## 四、静态资源 loader（图片 / 字体等）


### 1. 老写法：`file-loader` / `url-loader`

* `file-loader`：把文件复制到输出目录，返回 URL
* `url-loader`：小文件转为 base64，大文件 fallback 到 `file-loader`

```js
{
  test: /\.(png|jpe?g|gif|svg)$/i,
  use: [
    {
      loader: 'url-loader',
      options: {
        limit: 8 * 1024,          // 小于 8kb 转成 base64
        name: 'img/[name].[hash:8].[ext]'
      }
    }
  ]
}
```

字体类似：

```js
{
  test: /\.(woff2?|eot|ttf|otf)$/,
  use: [{
    loader: 'file-loader',
    options: {
      name: 'fonts/[name].[hash:8].[ext]'
    }
  }]
}
```

---

### 2. webpack5 推荐：`asset/resource` / `asset/inline` / `asset`

```js
module.exports = {
  module: {
    rules: [
      // 自动在 inline 与 resource 之间选择（默认 8kb）
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024
          }
        },
        generator: {
          filename: 'img/[name].[hash:8][ext]'
        }
      },
      // 始终输出文件
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash:8][ext]'
        }
      }
    ]
  }
};
```

---

### 3. 图片优化：`image-webpack-loader`

配合 `url-loader` / `asset` 使用：

```js
{
  test: /\.(png|jpe?g|gif)$/i,
  use: [
    {
      loader: 'url-loader',
      options: { limit: 8 * 1024 }
    },
    {
      loader: 'image-webpack-loader',
      options: {
        mozjpeg: { progressive: true },
        optipng: { enabled: true },
        pngquant: { quality: [0.65, 0.90], speed: 4 }
      }
    }
  ]
}
```

生产环境打包时压缩图片。

---

## 五、HTML & 模板相关 loader

### 1. `html-loader`

让 HTML 里的 `<img src="...">` 等资源交给 webpack 处理。

```js
{
  test: /\.html$/,
  use: 'html-loader'
}
```

一般配合 `HtmlWebpackPlugin` 使用。

---

### 2. 模板引擎 loader 示例

* `ejs-loader`
* `pug-loader`
* `handlebars-loader`
* 等…

```js
{
  test: /\.ejs$/,
  use: [
    {
      loader: 'ejs-loader',
      options: {
        esModule: false
      }
    }
  ]
}
```

---

## 六、框架相关 loader

### 1. `vue-loader`

Vue 单文件组件（`.vue`）必须配合 `VueLoaderPlugin`：

```js
// webpack.config.js
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
};
```

`.vue` 里面的 `<style>`、`<script>` 会根据其他 loader 再走一遍，例如 sass / babel。

---

### 2. React

React 本身不需要专门 loader，一般通过 `babel-loader` + `@babel/preset-react` 即可。

```js
{
  test: /\.(js|jsx)$/,
  use: 'babel-loader',
  exclude: /node_modules/
}
```

---

## 七、工具 & 辅助类 loader

### 1. 代码检查：`eslint-loader`（已不推荐）→ `eslint-webpack-plugin`

**新推荐方式：插件**

```js
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  plugins: [
    new ESLintPlugin({
      extensions: ['js', 'jsx', 'ts', 'tsx'],
      fix: true
    })
  ]
};
```

---

### 2. 多进程构建：`thread-loader`

适用于 `babel-loader` / `ts-loader` 等耗时 loader 前面，加快构建。

```js
{
  test: /\.[jt]sx?$/,
  use: [
    {
      loader: 'thread-loader',
      options: {
        workers: 2
      }
    },
    'babel-loader'
  ],
  exclude: /node_modules/
}
```

---

### 3. 缓存：`cache-loader`（webpack5 已内置持久化缓存）

```js
{
  test: /\.[jt]sx?$/,
  use: [
    'cache-loader',
    'babel-loader'
  ],
  exclude: /node_modules/
}
```

webpack5 更建议使用：

```js
module.exports = {
  cache: {
    type: 'filesystem'
  }
}
```





---

## 九、面试话术总结（可以直接说）

> 在 webpack 里，loader 负责把各种非 JS 资源转换成模块。常见的比如：
>
> * 样式相关：`style-loader`、`css-loader`、`sass-loader`、`less-loader`、`postcss-loader`，生产环境会配合 `MiniCssExtractPlugin.loader` 把 CSS 抽离出来；
> * 脚本相关：`babel-loader` 做 ES6+ 转换，`ts-loader` 或 `babel-loader + preset-typescript` 处理 TS；
> * 资源相关：早期用 `file-loader`、`url-loader`，webpack5 推荐用内置的 `asset/resource`、`asset/inline`、`asset`；图片优化可用 `image-webpack-loader`；
> * 框架相关：如 `vue-loader` 处理 `.vue`，React 通过 `babel-loader + preset-react` 即可；
> * 工具类：如代码检查 `eslint-webpack-plugin`、多进程的 `thread-loader`、缓存 `cache-loader` / 内置 filesystem cache 等。
>
> 在配置上，统一写在 `module.rules` 里，通过 `test` 匹配文件，`use` 或 `loader+options` 指定处理链路，注意 loader 执行是从右到左的。


