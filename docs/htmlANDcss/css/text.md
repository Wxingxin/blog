
# 💯💯💯 关于文本

## div 的文本溢出如何解决

这是前端面试中很常见的 **CSS 问题** ✅，解决文本溢出的方式主要有几种，面试可以简单列出


# 1️⃣ 单行文本溢出显示省略号



```css
div {
  width: 200px; /* 固定宽度 */
  white-space: nowrap; /* 不换行 */
  overflow: hidden; /* 超出隐藏 */
  text-overflow: ellipsis; /* 超出显示省略号 */
}
```

**效果：**

内容超出 div 宽度时，显示 `...`，只显示一行。



## 2️⃣ 多行文本溢出显示省略号

```
div {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3; /* 限制显示 3 行 */
  overflow: hidden;
}
```

**效果：**

> 内容超过三行，显示省略号。
> 注意：多行省略号需要浏览器支持 `-webkit-line-clamp`（Chrome、Safari 支持较好）。

---

### 3️⃣ 超出滚动显示

```css
div {
  width: 200px;
  height: 50px;
  overflow: auto; /* 超出显示滚动条 */
}
```

**效果：**

> 内容超出 div 时出现滚动条，可查看全部内容。

---

### 4️⃣ 面试简答模板

- 1️⃣ 解决 div 文本溢出主要有三种方式：
- 2️⃣ 单行文本：`white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`
- 3️⃣ 多行文本：使用 `-webkit-line-clamp` 限制行数 + 隐藏溢出
- 4️⃣ 超出滚动：`overflow: auto` 或 `scroll` 显示滚动条

> ## line-height: 120% 和 line-height: 1.2 有什么区别?

- 当你使用百分比值时，子元素会继承计算后的行高值；
- 而当你使用数值时，子元素会继承这个数值，并根据 自己的字体大小重新计算行高。

> ## css 文本水平居中（块级元素和行内块级元素）

`text-align: center`

> ## css 文本垂直居中（块级元素和行内块级元素）

- line-height （单行文本） 将行高 (line-height) 设置为与父容器高度相同。

> ## 如何实现字体小于 12px?

1. 然后过 CSS 的 transform 属性对其进行视觉上的缩小，因此不会有字体渲染模糊的问题

**优点：**

- ✅ 所有浏览器都支持；
- ✅ 兼容性好；
- ✅ 不影响字体渲染质量。

**缺点：**

- ❌ 占位仍按原始尺寸计算；
- ❌ 可能影响行高、排版；
- ❌ 如果嵌入行内文字可能不齐。

```html
<style>
  span {
    font-size: 12px;
    border: 1px solid red;
  }

  .one {
    display: inline-block;
    transform: scale(0.5);
    transform-origin: 100% 100%;
  }
</style>
<body>
  <span class="one">小于12px的字体</span>
  <span class="two">12px的字体</span>
</body>
```

2. 使用 SVG

```html
<style>
  svg text {
    font-size: 6px;
  }
</style>
<body>
  <svg width="100" height="20">
    <text>
      <tspan x="0" dy="6">我是6号文字</tspan>
      <tspan x="0" dy="6">我是6号文字</tspan>
    </text>
  </svg>
  <div style="font-size：12px">我是12号文字</div>
</body>
```

3. 使用图片代替 (针对少量固定文本)

**优点：**(使用 SVG 一样)

- ✅ 视觉可完全控制；
- ✅ 不受字体渲染限制。

**缺点：**(使用 SVG 一样)

- ❌ 不可选中；
- ❌ 无法被搜索引擎识别；
- ❌ 不利于无障碍阅读；
- ❌ 改动不灵活。

> ## 为什么浏览器默认最小字体是 12px？

- 可读性： 12px 通常被认为是 PC 端屏幕上文字可读性的一个经验下限。小于 12px 的字体在大多数显示器上会变得难以辨认，影响用户体验。

- 兼容性： 早期浏览器在处理小于 12px 的字体时，可能会出现渲染问题或显示效果不佳。为了统一和保证基本的可读性，大多数浏览器设定了最小字体大小。

- 防止滥用： 限制最小字体大小可以防止开发者过度使用极小的字体，从而损害用户体验。

> ## ❓：移动端为什么可以用 10px、8px？

**答：**
移动端**字体渲染机制**不同（DPR 高、抗锯齿好），且 WebKit 内核放宽了最小字体限制。

---

> ## ❓：`transform: scale()` 和直接减小 `font-size` 的区别？

| 项目     | font-size      | transform: scale   |
| -------- | -------------- | ------------------ |
| 字体渲染 | 按真实大小绘制 | 缩放渲染结果       |
| 占位宽高 | 会变小         | 不变（仍是原字号） |
| 兼容性   | 所有浏览器     | 所有浏览器         |
| 适用场景 | 通用文字       | 特殊视觉缩放       |

---

> ## ❓：如何让小字体在高分屏中更清晰？

**答：**

- 使用高分辨率字体；
- 开启 `-webkit-font-smoothing: antialiased;`
- 或使用 SVG 字体（矢量）；
- 避免过小字号（建议 ≥ 12px）。
