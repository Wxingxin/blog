## 手写loader


可以，咱们来写一个**“去掉 console 的自定义 loader”**，难度适中，足够能看出你会写 loader，又不至于太复杂。

下面我会给你：

1. 完整 loader 代码（`strip-console-loader.js`）
2. 在 `webpack.config.js` 里的使用方式
3. 面试时可以怎么【讲代码 & 扩展说法】

---

## 一、这个 loader 干什么？

**目标：**
写一个 `strip-console-loader`，把代码中的 `console.log / console.warn / console.error ...` 删掉，支持通过 `options` 配置要删除哪些方法。

举例：

```js
// 源代码
console.log('debug');
console.warn('warn');
alert('hello');
```

经过 loader 处理后：

```js
alert('hello');
```

---

## 二、loader 完整代码（strip-console-loader.js）

```js
// loaders/strip-console-loader.js
const { validate } = require('schema-utils');

/**
 * 配置项的校验规则
 * 方便在使用 loader 时给出更友好的报错提示
 */
const schema = {
  type: 'object',
  properties: {
    methods: {
      type: 'array',
      items: { type: 'string' },
      description: '需要移除的 console 方法名，比如 ["log", "warn"]'
    }
  },
  additionalProperties: false
};

module.exports = function stripConsoleLoader(source) {
  // 声明这是一个可缓存的 loader（输入一样就不需要重复执行）
  if (this.cacheable) {
    this.cacheable();
  }

  // 通过 schema-utils + this.getOptions 拿到并校验 options（webpack5 写法）
  const options = this.getOptions ? this.getOptions() : {};
  validate(schema, options, {
    name: 'strip-console-loader'
  });

  // 默认要删除的 console 方法
  const methods = options.methods || ['log', 'warn', 'error', 'info', 'debug'];

  let code = source;

  // 简单用正则粗暴删除 console.xxx(...) 语句
  // 不做 AST 解析是为了保持难度适中
  methods.forEach((method) => {
    const reg = new RegExp(
      // \bconsole.method(...)  ;?  换行也能删
      String.raw`\bconsole\.${method}\s*\([^;]*\);?`,
      'g'
    );
    code = code.replace(reg, '');
  });

  // 这里是同步 loader，直接 return 处理后的源码
  return code;
};
```

> ⭐ 这个 loader 的难度点：
>
> * 用了 `schema-utils` 做 options 校验（说明你懂 loader 的“工程化”一点）
> * 用了 `this.cacheable()` 和 `this.getOptions()`（说明你懂 loader 的上下文 API）
> * 做了一个真实有用的功能（去 `console` 在生产很常见）

---

## 三、在 webpack 里怎么用？

假设你的 loader 文件在项目根目录 `loaders/strip-console-loader.js`

```js
// webpack.config.js
const path = require('path');

module.exports = {
  // ...entry / output 省略
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: path.resolve(__dirname, 'loaders/strip-console-loader.js'),
          options: {
            // 只删除 log 和 debug，warn/error 保留
            methods: ['log', 'debug']
          }
        }
      }
    ]
  }
};
```

---

## 四、你在面试时可以这样讲（话术示范）

> 面试官：你自己有写过 loader 吗？

你可以这样回答：

---

### 1）先整体描述功能

> 有写过一个简单的自定义 loader，叫 `strip-console-loader`，主要作用是在打包时把源码里的 `console.xxx` 语句删掉，用在生产环境，避免多余的日志输出。

---

### 2）再讲 loader 的基本结构

> loader 本质上就是一个函数，它接受源代码字符串 `source`，返回处理后的代码。
> 我这边是这么写的：
>
> * `module.exports = function (source) { ... }` 这是一个同步 loader；
> * 内部用 `this.getOptions()` 拿到配置；
> * 用 `this.cacheable()` 告诉 webpack 这个 loader 的结果是可缓存的。

---

### 3）讲讲 options + schema 校验（加分点）

> 我还用了 `schema-utils` 对 options 做了一层校验，定义了一个 schema，比如：
>
> * `methods` 是一个字符串数组，表示要移除的 console 方法名；
> * 如果传入了不认识的字段，就会在构建时报错，这样配置体验更好，也符合 webpack 官方推荐。

---

### 4）讲讲实现逻辑（核心）

> 逻辑上就是：
>
> 1. 拿到 `methods`，比如 `['log', 'warn']`；
> 2. 遍历这些方法，为每个方法构造一个正则：
>    `\bconsole.log(...)` 这样的调用；
> 3. 用 `code = code.replace(reg, '')` 把这些语句删掉；
> 4. 最后 `return code`，交回给 webpack 后面的流程。
>
> 这个版本用的是正则，不是 AST，优点是实现简单，缺点是对某些复杂语法不那么精准，但对于业务项目的大部分场景已经够用了。

---

### 5）顺便展示你知道异步 loader（简单提一下就行）

> 目前这个 loader 是同步的，直接 `return`。
> 如果要做一些异步操作，比如读文件、发请求，可以用 `const callback = this.async()` 拿到回调，然后在异步完成后 `callback(null, newCode)`，就变成异步 loader。

（不用真的写代码，口头说有这个 API 就可以了）

---

### 6）最后讲一下在 webpack 里的使用（落地）

> 在 `webpack.config.js` 里，我是给所有 `.js` 文件加上这个 loader，比如：
>
> ```js
> {
>   test: /\.js$/,
>   use: {
>     loader: 'strip-console-loader',
>     options: { methods: ['log', 'debug'] }
>   }
> }
> ```
>
> 这样打包出来的代码就没有 `console.log` 和 `console.debug` 了。

---

## 五、如果想稍微再高级一点（你可以顺嘴补一句）

你还可以在面试时补一嘴：

* 这个 loader 现在是用正则实现的，如果要更严谨，可以用 **babel** 做 AST 解析，在 loader 里用 `@babel/parser` + `@babel/traverse` 删除 `MemberExpression` 为 `console.xxx` 的节点，再用 `@babel/generator` 生成代码，这样对各种语法兼容性更好。不过那样 loader 复杂度会拉得比较高。

> 这样你显得“知道更高级方案，但根据场景做了取舍”，很加分。

---

如果你愿意，我可以再给你写一个 **异步 loader 示例**，或者写一个 **支持在代码顶部自动加 banner 注释的 loader**，你面试时可以挑一个更顺手的讲。

## 手写plugin


那咱们来整一个 **难度刚刚好、看起来很专业** 的 webpack 插件：
👉 **BuildInfoPlugin：自动生成 `build-info.json` 的插件**

功能：每次打包时在 `dist` 目录里生成一个 `build-info.json`，记录：

* 打包 hash
* 构建时间
* 所有产物的文件名 & 文件大小
  （还能可选在控制台打印一个简单的构建报告）

这个既不low（不是简单 `console.log` 插件），又不至于上来就是 AST、自动上传 OSS 那种复杂度，面试讲起来非常合适。

---

## 一、插件完整代码（BuildInfoPlugin.js）

你可以放在：`plugins/BuildInfoPlugin.js`

```js
// plugins/BuildInfoPlugin.js
const { validate } = require('schema-utils');

const schema = {
  type: 'object',
  properties: {
    filename: {
      type: 'string',
      description: '生成的构建信息文件名'
    },
    showLog: {
      type: 'boolean',
      description: '是否在控制台输出构建信息'
    }
  },
  additionalProperties: false
};

class BuildInfoPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler) {
    // 1. 校验配置，避免使用出错
    validate(schema, this.options, {
      name: 'BuildInfoPlugin'
    });

    const pluginName = BuildInfoPlugin.name;
    const { webpack } = compiler;
    const { RawSource } = webpack.sources;

    // 2. 监听 thisCompilation 钩子，拿到 compilation 对象
    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      // 3. 在处理资源阶段插入我们自己的逻辑（webpack5 写法）
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,
          stage: webpack.Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE
        },
        (assets) => {
          // 4. 整理构建信息
          const buildInfo = {
            hash: compilation.hash,
            builtAt: new Date().toISOString(),
            assets: Object.keys(assets).map((name) => {
              const size = compilation.getAsset(name).source.size();
              return {
                name,
                size
              };
            })
          };

          const json = JSON.stringify(buildInfo, null, 2);
          const filename = this.options.filename || 'build-info.json';

          // 5. 往构建结果里“塞”一个新的虚拟文件
          compilation.emitAsset(
            filename,
            new RawSource(json)
          );

          // 6. 可选：在控制台简单打印一下信息
          if (this.options.showLog) {
            console.log(`\n[BuildInfoPlugin] emit ${filename}`);
            console.log(
              `[BuildInfoPlugin] assets count: ${buildInfo.assets.length}`
            );
          }
        }
      );
    });
  }
}

module.exports = BuildInfoPlugin;
```

---

## 二、webpack 中如何使用这个插件？

```js
// webpack.config.js
const path = require('path');
const BuildInfoPlugin = require('./plugins/BuildInfoPlugin');

module.exports = {
  // ... entry / output 等略
  plugins: [
    new BuildInfoPlugin({
      filename: 'meta/build-info.json', // 默认是 build-info.json
      showLog: true                     // 控制台打印构建信息
    })
  ]
};
```

打包后，你会在 `dist/meta/build-info.json` 里看到类似内容：

```json
{
  "hash": "4c7b5f0b7f9f5f15b8d2",
  "builtAt": "2025-11-19T03:12:45.123Z",
  "assets": [
    { "name": "main.abc123.js", "size": 10240 },
    { "name": "vendors~main.def456.js", "size": 523456 },
    { "name": "css/main.7890ab.css", "size": 20480 }
  ]
}
```

---

## 三、这段代码怎么在面试时“讲明白”？（话术模板）

> **面试官：你自己写过 webpack 插件吗？**

你可以这样回答，一层一层展开👇

---

### 1️⃣ 先讲清楚这个插件的功能（第一印象）

> 有自己写过一个 webpack 插件，叫 **BuildInfoPlugin**。
> 它的作用是在每次打包的时候，自动在输出目录里生成一个 `build-info.json`，里面记录这次构建的：
>
> * 打包的 `hash`
> * 构建时间
> * 所有产物的文件名和体积
>   这样方便排查问题或者给后端做版本信息展示。
>   插件还支持两个配置：输出文件名 `filename`，以及是否在控制台打印日志 `showLog`。

---

### 2️⃣ 说明你知道插件的基本结构

> webpack 插件本质上是一个带有 `apply(compiler)` 方法的对象，一般是一个 class：
>
> * 在 `constructor` 里接收 `options`；
> * 在 `apply` 里通过各种 hooks 去介入 webpack 的构建流程。

可以顺手指代码里这段：

```js
class BuildInfoPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler) {
    // ...
  }
}
```

---

### 3️⃣ 讲讲 options 校验（显示你“工程化思维”）

> 我用 `schema-utils` 对插件的 options 做了一层校验：
>
> * `filename` 要求是字符串；
> * `showLog` 是布尔值；
> * 不允许多余字段。
>   这样如果配置写错，构建时会有比较友好的错误提示。

引用下 schema：

```js
const schema = {
  type: 'object',
  properties: {
    filename: { type: 'string' },
    showLog: { type: 'boolean' }
  },
  additionalProperties: false
};

validate(schema, this.options, { name: 'BuildInfoPlugin' });
```

---

### 4️⃣ 核心：你怎么挂钩到 webpack 生命周期里的？

> 在 `apply` 里我用的是 `compiler.hooks.thisCompilation` 这个钩子，
> 它能拿到本次构建的 `compilation` 对象，然后在 `compilation` 上再去监听处理资源的阶段。

```js
compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
  compilation.hooks.processAssets.tap(
    {
      name: pluginName,
      stage: webpack.Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE
    },
    (assets) => {
      // 这里就是我真正处理构建结果的地方
    }
  );
});
```

你可以顺便说一句：

> `processAssets` 是 webpack5 里的一个钩子，在这个阶段所有资源基本已经生成好了，我可以统计它们并且再新增一个资产（`build-info.json`）进去。

---

### 5️⃣ 怎么生成这个 `build-info.json`？

> 在 `processAssets` 回调里，我主要做了几件事：
>
> 1. 遍历 `assets`，用 `compilation.getAsset(name).source.size()` 获取每个文件的大小；
> 2. 结合 `compilation.hash` 和当前时间拼出一个 `buildInfo` 对象；
> 3. `JSON.stringify` 成字符串；
> 4. 用 `compilation.emitAsset(filename, new RawSource(json))` 把它塞进构建结果里。

对应代码：

```js
const buildInfo = {
  hash: compilation.hash,
  builtAt: new Date().toISOString(),
  assets: Object.keys(assets).map((name) => {
    const size = compilation.getAsset(name).source.size();
    return { name, size };
  })
};

const json = JSON.stringify(buildInfo, null, 2);
compilation.emitAsset(
  filename,
  new RawSource(json)
);
```

---

### 6️⃣ 提一下 `RawSource`，显得你知道 webpack 内置工具

> 这里我用的是 `compiler.webpack.sources.RawSource` 来创建一个“虚拟文件内容”，
> 这个是 webpack5 提供的统一的 source 类型，可以直接被当成一个 asset 输出。

```js
const { webpack } = compiler;
const { RawSource } = webpack.sources;
```

---

### 7️⃣ 提一下同步/异步（简单点到即可）

> 这个插件主要是同步逻辑，所以直接 `tap` 即可。如果要做异步操作，比如从远程接口拉配置、打包完自动上传到 OSS，可以换成 `tapPromise` 或 `tapAsync`，在里边返回 Promise 或调用 callback 就行。

---

### 8️⃣ 最后讲一下在项目里怎么用（落地）

> 实际使用时，就是在 `webpack.config.js` 里 `new BuildInfoPlugin(...)` 一下：
>
> ```js
> const BuildInfoPlugin = require('./plugins/BuildInfoPlugin');
>
> module.exports = {
>   plugins: [
>     new BuildInfoPlugin({
>       filename: 'meta/build-info.json',
>       showLog: true
>     })
>   ]
> };
> ```
>
> 打包后我可以在 `dist/meta/build-info.json` 里看到这次构建的 hash 和所有文件的体积，这对于排查线上问题、做版本页面或者排查包体积变化都挺方便的。

---

## 四、这一套的“难度级别”刚刚好

你这个插件里已经体现出不少关键点：

* 知道插件是 `class + apply(compiler)` 结构
* 用了 `schema-utils` 做参数校验
* 知道 `compiler` / `compilation` / `processAssets` 这些生命周期
* 知道用 `emitAsset` + `RawSource` 往构建结果里加新文件
* 还考虑了简单的配置项（`filename`、`showLog`）

对面试官来说：
👉 “确实自己写过插件，而且理解 webpack 生命周期，不是网上随便抄一个 `console.log` 插件。”
