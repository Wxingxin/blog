
## 请描述下 SEO 中的 TDK？

### ✅ **TDK = Title + Description + Keywords**

分别对应 HTML 中 `<title>`、`<meta name="description">`、`<meta name="keywords">`。


### 📌 **1. T = Title（网页标题）**

```html
<title>网站标题 - 关键词</title>
```

### 作用：

- 影响**搜索引擎**对网页**主题**的判断（SEO 最重要的因素之一）
- 影响用户在**搜索结果**中的**点击率**（CTR）

### 要求：

- **唯一、精准、简短（一般 ≤ 60 字符）**
- （建议靠前）

---

### 📌 **2. D = Description（网页描述）**

```html
<meta
  name="description"
  content="网页内容的简要描述，通常显示在搜索结果标题下方。"
/>
```

### 作用：

- 作为 **页面摘要** 显示在 **搜索结果** 中
- 影响 **点击率**，但对排名影响较弱

### 要求：

- 100左右 字符较合适
- 自然包含关键词
- **内容准确**概括页面主题

---

### 📌 **3. K = Keywords（关键词）**

```html
<meta name="keywords" content="关键词1, 关键词2, 关键词3" />
```

### 作用：

- 早期 SEO 的关键字段，现在**主流搜索引擎（如 Google/Bing）已基本忽略**

### 要求：

- 控制 3–5 个相关性最高的关键词

---

### 📌 面试中怎么回答更加专业？

可以这样回答：

> **TDK 指 Title、Description 和 Keywords，是网页 SEO 的三大基础优化要素。Title 负责页面主题定位，是 SEO 权重最高的字段；Description 主要影响搜索结果展示摘要和点击率；Keywords 虽然在现代搜索引擎权重已大幅降低，但在部分国内场景仍有意义。合理设置 TDK 有助于提升网页在搜索引擎中的可见性与排名。**

> ### 什么是可替换元素，什么是非可替换元素，它们各自有什么特点？

在 CSS 中，根据元素在渲染时的**行为**和**是否可以被其内容完全“替换”掉**，将元素分为**可替换元素（replaced element）**和**非可替换元素（non-replaced element）**。

### 1. 可替换元素（replaced element）

**定义**：  
一个元素的**内容**由**浏览器**根据元素的**标签**和**属性**，在元素**外部**提供（替换）来决定，而不是由**元素内部**的**普通文档**内容决定。典型特征是：它的渲染内容不是直接由 CSS 格式化的文本或子元素，而是被“替换”成其他东西（图片、视频、嵌入的对象等）。

**常见可替换元素**：

- `<img>`
- `<video>`
- `<audio>`
- `<iframe>`
- `<canvas>`
- `<object>`
- `<embed>`
- `<input>`（大多数类型，尤其是 type="image"、type="file"、type="checkbox" 等）
- `<textarea>`（在某些老旧规范讨论中也算，但现代浏览器中更倾向于视作非替换，实际情况偏非替换）
- `<picture>` 中的 `<source>`（间接）
- CSS 中的 `content` 属性生成的伪元素（如 `::before/::after` 用 `content: url(...)` 生成图片时）

**可替换元素的主要特点**：

1. **有内在尺寸（intrinsic dimensions）**
   - 比如图片有天然的像素宽高，视频有分辨率。
   - 即使你不设置 width/height，浏览器也能根据内在尺寸渲染一个默认大小。
2. **width、height 属性默认是“有效”的**
   - 给 `<img>` 设置 width/height 会直接缩放内容，而不是像普通块级元素那样只是改变盒子大小。
3. **可以有内在宽高比（intrinsic aspect ratio）**
   - 现代浏览器会根据内在宽高比自动保持比例（配合 `height: auto` 或 `aspect-ratio` 属性）。
4. **内容不受 CSS 文字相关属性直接控制**
   - `font-size`、`line-height`、`text-align` 等对替换内容本身无效（只影响替代文本 alt 或 placeholder）。
5. **某些属性行为特殊**
   - `vertical-align` 默认是 baseline（对图片尤其明显，会出现底部空隙）。
   - `object-fit`、`object-position` 只对可替换元素和少数特殊元素有效。

### 2. 非可替换元素（non-replaced element）

**定义**：  
元素的内容就是其直接的**文本内容**和**子元素**，渲染完全由**CSS**和**文档流**决定。最常见的普通元素都属于这一类。

**常见非可替换元素**：

- `<div>`、`<p>`、`<span>`、`<h1>`~`<h6>`
- `<ul>`、`<li>`、`<table>`
- `<section>`、`<article>` 等几乎所有普通块级和行内元素
- `<textarea>`（现代浏览器中被视为非替换）
- `<select>`（部分浏览器特殊处理，但规范上是非替换）

**非可替换元素的主要特点**：

1. **没有内在尺寸**
   - 宽高完全由内容、CSS width/height、父容器决定。
   - 不设置宽度时，块级元素默认宽度 100%，行内元素由内容决定。
2. **width/height 默认可能是无效的（取决于 display）**
   - 行内元素（如 `<span>`）设置 width/height 无效（除非改成 `inline-block` 等）。
   - 块级元素设置了 width 才生效，否则填满父容器。
3. **没有内在宽高比**
   - 除非手动用 `aspect-ratio` 属性设置。
4. **内容完全受 CSS 控制**
   - `font`、`color`、`text-align`、`line-height` 等全部生效。
5. **垂直对齐默认 baseline，但没有图片那种“底部空隙”问题**（因为没有内在下行区）。

### 简要对比表

| 特性                  | 可替换元素                            | 非可替换元素                  |
| --------------------- | ------------------------------------- | ----------------------------- |
| 典型例子              | img, video, input(type=image), iframe | div, p, span, h1, ul          |
| 是否有内在尺寸        | 有（图片分辨率、视频尺寸等）          | 无                            |
| 是否有内在宽高比      | 通常有                                | 无（需手动设置 aspect-ratio） |
| width/height 默认有效 | 是                                    | 取决于 display（行内无效）    |
| object-fit 生效       | 生效                                  | 不生效                        |
| 文字相关属性影响内容  | 不影响（只影响 alt/placeholder）      | 完全影响                      |
| vertical-align 行为   | 容易出现底部间隙                      | 正常 baseline 对齐            |