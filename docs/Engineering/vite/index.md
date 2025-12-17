下面给你一套**Vite 常见面试题合集（附标准答案）**，从**基础 → 原理 → 实战 → 对比**，基本覆盖 **初中高级前端面试**。

---

## 一、基础必问题（必背）

### 1️⃣ 什么是 Vite？

**答：**
Vite 是一个基于 **原生 ES Module** 的前端构建工具，开发环境 **不打包、按需编译**，生产环境使用 **Rollup** 打包。

---

### 2️⃣ Vite 为什么启动快？

**答：**

* webpack：启动前要打包整个依赖图
* Vite：

  * 利用浏览器原生 ESM
  * 浏览器请求哪个模块，才编译哪个模块
    👉 所以启动速度极快

---

### 3️⃣ Vite 的开发和生产构建有什么区别？

**答：**

* 开发环境：ESM + 按需编译
* 生产环境：Rollup 打包，保证兼容性和性能

---

### 4️⃣ Vite 默认支持哪些框架？

**答：**

* 原生 JS / TS
* Vue（官方支持最好）
* React
* Preact、Svelte 等

---

## 二、原理类（⭐高频）

### 5️⃣ Vite 为什么要用 ESM？

**答：**

* 浏览器原生支持
* 天然支持依赖分析
* 支持按需加载
* 支持 Tree Shaking

---

### 6️⃣ Vite 的 HMR 原理是什么？

**答：**

* 基于 **ESM 模块关系**
* 精确到模块级更新
* 只更新受影响模块，不重新打包

👉 比 webpack 更快

---

### 7️⃣ Vite 是如何处理第三方依赖的？

**答：**

* 启动时会进行 **依赖预构建**
* 使用 **esbuild**
* 将 CommonJS 转成 ESM
* 结果缓存，避免重复处理

---

### 8️⃣ 什么是依赖预构建（Dependency Pre-bundling）？

**答：**

* 针对 node_modules
* 使用 esbuild
* 解决：

  * CommonJS → ESM
  * 多次请求问题
  * 提升启动和加载速度

---

## 三、配置 & 实战类（常问）

### 9️⃣ Vite 中 alias 怎么配置？

```js
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
```

---

### 🔟 Vite 如何配置环境变量？

**答：**

* 文件：

  * `.env`
  * `.env.development`
  * `.env.production`
* 变量必须以 `VITE_` 开头
* 使用方式：

```js
import.meta.env.VITE_API_URL
```

---

### 1️⃣1️⃣ Vite 中为什么要用 import.meta.env？

**答：**

* ESM 标准的一部分
* 比 `process.env` 更符合浏览器环境
* 构建时注入变量

---

### 1️⃣2️⃣ Vite 如何支持 TS？

**答：**

* 使用 esbuild 进行转译
* 不做类型检查
* 类型检查交给：

  * IDE
  * `tsc --noEmit`

---

## 四、对比 & 进阶（⭐中高级）

### 1️⃣3️⃣ Vite 和 webpack HMR 的区别？

**答：**

* webpack：重新构建依赖图
* Vite：基于 ESM，精确模块更新

---

### 1️⃣4️⃣ Vite 插件机制是怎样的？

**答：**

* 基于 **Rollup 插件规范**
* 生命周期：

  * config
  * resolveId
  * load
  * transform
* 开发和生产都可复用

---

### 1️⃣5️⃣ Vite 为什么选择 Rollup 而不是 webpack？

**答：**

* Rollup：

  * 更适合库打包
  * Tree Shaking 更好
  * 产物更干净

---

### 1️⃣6️⃣ Vite 适合大型项目吗？

**答：**

* 适合
* 但要注意：

  * 依赖预构建优化
  * 动态 import 控制
  * 插件合理使用

---

## 五、坑点 & 实际问题（面试加分）

### 1️⃣7️⃣ Vite 中为什么刷新页面会 404？

**答：**

* history 模式
* 服务器未做 fallback
* 需要配置 nginx：

```nginx
try_files $uri $uri/ /index.html;
```

---

### 1️⃣8️⃣ Vite 如何兼容老浏览器？

**答：**

* 使用 `@vitejs/plugin-legacy`
* 输出兼容代码

---

### 1️⃣9️⃣ Vite 为什么比 webpack 更适合组件库开发？

**答：**

* Rollup 打包
* Tree Shaking 更好
* 构建产物更小

---

## 六、终极背诵版（⭐30 秒）

> Vite 是基于原生 ESM 的构建工具，开发阶段按需编译不打包，启动和 HMR 非常快；
> 生产环境使用 Rollup 打包，保证兼容性和产物质量；
> 通过 esbuild 进行依赖预构建，提高开发效率。

---

如果你愿意，我可以帮你：

* ✅ 整理成 **一页面试速记表**
* ✅ 出 **Vite 高频追问 + 反问**
* ✅ 按 **初级 / 中级 / 高级** 面试官视角出题

直接说你面试的级别即可 👌
