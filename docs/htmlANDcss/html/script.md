
## 1. `<script>`, `defer`, `async` 的区别？

**问：**
在 HTML 中，`<script>...</script>`、`<script defer>...</script>`、`<script async>...</script>` 有什么区别？

**答：**

1. **普通 script（不带属性）**

   ```html
   <script src="main.js"></script>
   ```

   - **加载：** 浏览器解析 HTML 时遇到 script，就**暂停 DOM 解析**，去下载 JS。
   - **执行：** 下载完**立即执行**，执行完再继续解析后面的 HTML。
   - **特点：** 阻塞渲染（render-blocking / parser-blocking）。

2. **`defer` 脚本**

   ```html
   <script src="main.js" defer></script>
   ```

   - **加载：** 和解析 HTML **并行加载**脚本，不阻塞 HTML 解析。
   - **执行时机：**

     - 在 DOM **解析完成后**，但在 `DOMContentLoaded` 触发前执行。

   - **多个 defer 脚本：** 会**按照在页面中出现的顺序**依次执行。
   - **常用于：** 放在 `<head>` 中加载页面主逻辑脚本，不阻塞页面结构解析。

3. **`async` 脚本**

   ```html
   <script src="main.js" async></script>
   ```

   - **加载：** 同样与 HTML **并行加载**。
   - **执行时机：** 下载完成后**立即执行**，哪怕此时 DOM 还没解析完。
   - **多个 async 脚本：** 谁先下载完谁先执行，**不保证顺序**。
   - **常用于：** 广告、统计埋点、独立模块，不依赖 DOM 结构和其它脚本。

一句话总结：

> - **普通**：边下边执行，阻塞解析。
> - **defer**：并行下载，等 DOM 解析完再按顺序执行。
> - **async**：并行下载，谁先下完谁先执行，不等 DOM，也不等其他脚本。

---

## 2. 它们对 DOM 解析和页面渲染有什么影响？

**问：**
`<script>` / `defer` / `async` 对 DOM 解析顺序和页面渲染有什么影响？

**答：**

- **普通 `<script>`：**

  - 遇到标签 → **暂停** 解析 HTML → 下载 + 执行 JS → 再继续解析。
  - 可能导致 **白屏时间变长**，因为渲染要等脚本执行完。

- **`defer`：**

  - DOM 一直正常解析，脚本在后台下载。
  - 会在 DOM 解析完成后、`DOMContentLoaded` 事件之前执行。
  - **不阻塞** DOM 解析，页面首屏更快展示。

- **`async`：**

  - DOM 正常解析，脚本在后台下载。
  - 一旦脚本下载完成就**立即执行**，可能在 DOM 完成前。
  - 执行时会短暂阻塞当前解析，但总体上**减少了初始阻塞**。
  - 执行时间不稳定，**可能打断 DOM 解析**的连续性。

---

## 3. 多个 `defer` / `async` 脚本的执行顺序？

**问：**
多个 `defer` 脚本和多个 `async` 脚本的执行顺序是怎样的？

**答：**

- **多个 `defer`：**

  ```html
  <script src="a.js" defer></script>
  <script src="b.js" defer></script>
  ```

  - 即使 `b.js` 先下载完，也会**按出现顺序**：先执行 `a.js` 再 `b.js`。
  - 都在 DOM 解析完成后执行。

- **多个 `async`：**

  ```html
  <script src="a.js" async></script>
  <script src="b.js" async></script>
  ```

  - 谁先下载完谁先执行。
  - **执行顺序不受 HTML 中位置控制**。
  - 不适合有顺序依赖的脚本（例如必须先加载库再加载插件的场景）。

---

## 4. 什么时候用 `defer`，什么时候用 `async`？

**问：**
实际项目中，分别在什么场景下使用 `defer` 和 `async`？

**答：**

- 使用 **`defer`**：

  - 页面**主业务逻辑**脚本。
  - 依赖 DOM 结构（但不要求 DOM 一解析完立刻执行）。
  - 多个脚本之间有严格的**依赖顺序**。
  - 常见写法：在 `<head>` 中

    ```html
    <head>
      <script src="vendor.js" defer></script>
      <script src="app.js" defer></script>
    </head>
    ```

- 使用 **`async`**：

  - **独立性强**的脚本，不依赖 DOM、不依赖其它脚本，也没人依赖它。
  - 比如：统计、广告、AB 测试、埋点、监控等。
  - 常见：

    ```html
    <script src="analytics.js" async></script>
    ```

---

## 5. `defer` 与 `DOMContentLoaded`、`load` 的关系？

**问：**
`defer` 脚本的执行时机和 `DOMContentLoaded` / `load` 事件的触发顺序是怎样的？

**答：**

对带 `defer` 的外部脚本：

1. 浏览器解析 HTML 时发现 `defer` 脚本 → 异步下载，不阻塞解析。
2. DOM 解析结束。
3. 所有 `defer` 脚本按顺序执行。
4. 执行完所有 `defer` 脚本后，触发 `DOMContentLoaded` 事件。
5. 等图片等资源加载完后，触发 `window.onload`。

记忆：

> **defer 脚本总是先于 `DOMContentLoaded` 执行**，但晚于 DOM 完全解析。

---

## 6. 为什么推荐把 `<script>` 放在 `</body>` 前面？和 `defer` 有什么区别？

**问：**
很多项目会把 `<script>` 放在 `</body>` 前面，这和使用 `defer` 有什么不同？

**答：**

- 把普通 `<script>` 放在 **`</body>` 前**：

  ```html
  ...
  <script src="main.js"></script>
  </body>
  </html>
  ```

  - 确保前面大部分 DOM 已经解析完，再开始阻塞下载+执行。
  - 简单粗暴，但**仍然会阻塞剩余解析**，也不如 `defer` 标准清晰。

- 使用 `<head> + defer`：

  ```html
  <head>
    <script src="main.js" defer></script>
  </head>
  ```

  - 更语义化，逻辑清晰：脚本在 DOM 完成后执行。
  - 浏览器可更好地做并行加载和优化。

总的来说，**现代推荐使用 `defer` 而不是一味把 `<script>` 往页面底部扔。**

---

## 7. 内联脚本可以用 `defer` / `async` 吗？

**问：**
内联脚本 `<script>console.log(1)</script>` 可以使用 `defer` 或 `async` 吗？效果如何？

**答：**

- 规范上：`defer` / `async` 主要是为**外部脚本（有 src）**设计的。
- 实际上：

  ```html
  <script defer>
    console.log("inline");
  </script>
  ```

  - 大多数浏览器**会忽略**内联 script 上的 `defer` / `async`，当作普通脚本执行。

- 面试答法：

  - 一般认为：**`defer` / `async` 只对带 `src` 的外部脚本有效**。
  - 想要延后执行内联脚本，应使用事件（如 `DOMContentLoaded`）、模块脚本或其他方式。

---

## 8. `type="module"` 与 `defer` / `async` 的关系？

**问：**
使用 `<script type="module">` 时，它的加载和执行行为和 `defer` / `async` 有什么关系？

**答（加分题）：**

- 模块脚本默认类似于带 `defer` 的外部脚本：

  ```html
  <script type="module" src="main.js"></script>
  ```

  - **默认不阻塞 DOM 解析**。
  - 在 DOM 解析完成后执行（相当于隐式 `defer`）。

- 也可以结合 `async`：

  ```html
  <script type="module" src="main.js" async></script>
  ```

  - 行为类似 `async`：并行加载，下载完成后立刻执行，不保证顺序。

回答的时候可以说：

> `type="module"` 的脚本默认是“延迟执行”的，行为很接近 `defer`，但支持模块语法（import/export）以及顶层 await。

---

如果你需要，我可以再给你出一套**选择题 / 填空题**版本，或者帮你把上面内容压缩成“3 分钟背诵版”方便面试前快速复习。

---
