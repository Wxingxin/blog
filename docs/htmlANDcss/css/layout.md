
## FLEX 布局大全

### 容器属性（作用于父元素）

**常见属性：**

| 属性              | 作用                                                    |
| ----------------- | ------------------------------------------------------- |
| `display: flex`   | 启用 Flex 布局                                          |
| `flex-direction`  | 主轴方向（row / row-reverse / column / column-reverse） |
| `flex-wrap`       | 是否换行（nowrap / wrap / wrap-reverse）                |
| `flex-flow`       | `flex-direction` + `flex-wrap` 的简写                   |
| `justify-content` | 沿主轴对齐方式                                          |
| `align-items`     | 沿交叉轴对齐方式                                        |
| `align-content`   | 多根轴线的对齐方式（多行时生效）                        |

---

### 子项属性（作用于子元素）

常见属性：

| 属性          | 作用                                               |
| ------------- | -------------------------------------------------- |
| `order`       | 定义子项排列顺序（默认 0，值越小越靠前）           |
| `flex-grow`   | 放大比例（默认 0，不放大）                         |
| `flex-shrink` | 缩小比例（默认 1，允许缩小）                       |
| `flex-basis`  | 分配空间前的初始大小                               |
| `flex`        | `flex-grow flex-shrink flex-basis` 的简写          |
| `align-self`  | 单个子项在交叉轴上的对齐方式（覆盖 `align-items`） |

## CSS Grid 布局大全

- **Grid** 是二维布局系统，可以同时控制 **行（row）** 和 **列（column）**。
- **容器（container）**：使用 `display: grid` 定义。
- **网格项（item）**：Grid 容器的直接子元素。
- **轨道（track）**：行或列。
- **单元格（cell）**：行列交叉形成的矩形区域。
- **区域（area）**：多个单元格组合形成的矩形区域。

---

### 2️⃣ 容器属性（控制整体布局）

| 属性                             | 说明                       | 常用值                              |
| -------------------------------- | -------------------------- | ----------------------------------- |
| `display`                        | 定义网格容器               | `grid`, `inline-grid`               |
| `grid-template-columns`          | 定义列宽                   | `100px 200px 1fr`，`repeat(3, 1fr)` |
| `grid-template-rows`             | 定义行高                   | `100px 200px`, `auto`               |
| `grid-template-areas`            | 给网格命名区域             | `"header header" "sidebar main"`    |
| `gap` / `row-gap` / `column-gap` | 行列间距                   | `10px`, `1rem`                      |
| `justify-items`                  | 单元格内子元素水平方向对齐 | `start`, `center`, `stretch`        |
| `align-items`                    | 单元格内子元素垂直方向对齐 | `start`, `center`, `stretch`        |
| `justify-content`                | 整个网格水平对齐           | `start`, `center`, `space-between`  |
| `align-content`                  | 整个网格垂直对齐           | `start`, `center`, `space-around`   |

---

### 3️⃣ 子元素属性（控制网格项）

| 属性                      | 说明             | 示例                                              |
| ------------------------- | ---------------- | ------------------------------------------------- |
| `grid-column-start / end` | 设置起始和结束列 | `grid-column: 1 / 3`（跨两列）                    |
| `grid-row-start / end`    | 设置起始和结束行 | `grid-row: 1 / 2`                                 |
| `grid-column`             | 快捷写法         | `grid-column: 2 / span 3`（从第 2 列开始跨 3 列） |
| `grid-row`                | 快捷写法         | `grid-row: 1 / span 2`                            |
| `grid-area`               | 指定元素区域     | `grid-area: header`（对应 grid-template-areas）   |
| `justify-self`            | 水平对齐         | `start`, `center`, `end`, `stretch`               |
| `align-self`              | 垂直对齐         | `start`, `center`, `end`, `stretch`               |

---

## css 的两栏布局怎么实现


### 1️⃣ float 布局（老方法）

```css
.container {
  width: 100%;
}
.left {
  float: left;
  width: 70%;
}
.right {
  float: right;
  width: 30%;
}
```

- 特点：简单，但需要清除浮动（`clearfix`）。
- 不适合复杂响应式布局。

```css
.container::after {
  content: "";
  display: block;
  clear: both;
}
```

---

### 2️⃣ Flex 布局（推荐现代方法）

```css
.container {
  display: flex;
}
.left {
  flex: 7; /* 占 70% */
}
.right {
  flex: 3; /* 占 30% */
}
```

- 特点：响应式好，顺序可调整，支持对齐和伸缩。
- 面试加分点：可以用 `justify-content` 和 `align-items` 控制对齐。

---

### 3️⃣ Grid 布局（现代 CSS 布局）

```css
.container {
  display: grid;
  grid-template-columns: 70% 30%;
}
.left {
  grid-column: 1;
}
.right {
  grid-column: 2;
}
```

- 特点：更适合复杂网格布局，精确控制行列大小。
- 面试加分点：可以轻松扩展到多行多列。

---

### 4️⃣ inline-block 布局

```css
.left,
.right {
  display: inline-block;
  vertical-align: top;
}
.left {
  width: 70%;
}
.right {
  width: 30%;
}
```

- 特点：兼容性好，但会有 **空白间隙问题**。

---

### 5️⃣ 绝对定位布局（不推荐，但经典面试题）

```css
.container {
  position: relative;
}
.left {
  position: absolute;
  left: 0;
  width: 70%;
}
.right {
  position: absolute;
  right: 0;
  width: 30%;
}
```

- 特点：固定位置，容易覆盖，不适合响应式。

---

### 📝 面试简答模板

两栏布局常见实现方式：
>
1. **Float 布局**：老方法，需要清除浮动；
2. **Flex 布局**：现代推荐，支持响应式和伸缩；
3. **Grid 布局**：现代网格布局，适合复杂多列；
4. **Inline-block**：兼容性好，但有空隙问题；
5. **绝对定位**：不推荐，适合固定布局。


## css 的三布局怎么实现


### 1️⃣ Float 布局（老方法）

```css
.container {
  width: 100%;
}
.left {
  float: left;
  width: 20%;
}
.center {
  float: left;
  width: 60%;
}
.right {
  float: right;
  width: 20%;
}

/* 清除浮动 */
.container::after {
  content: "";
  display: block;
  clear: both;
}
```

- 特点：经典老方法，需清除浮动。
- 不易实现响应式。



### 2️⃣ Flex 布局（现代方法）

```css
.container {
  display: flex;
}
.left {
  flex: 2;
}
.center {
  flex: 6;
}
.right {
  flex: 2;
}
```

- 特点：响应式好，顺序可调整。
- 面试加分点：可用 `order` 改变显示顺序，`justify-content`/`align-items` 控制对齐。


### 3️⃣ Grid 布局（现代 CSS）

```css
.container {
  display: grid;
  grid-template-columns: 20% 60% 20%;
  gap: 10px; /* 可选列间距 */
}
.left {
  grid-column: 1;
}
.center {
  grid-column: 2;
}
.right {
  grid-column: 3;
}
```

- 特点：精确控制列宽、间距和响应式。
- 面试加分点：可以轻松扩展为多行多列复杂布局。


### 4️⃣ inline-block 布局

```css
.left,
.center,
.right {
  display: inline-block;
  vertical-align: top;
}
.left {
  width: 20%;
}
.center {
  width: 60%;
}
.right {
  width: 20%;
}
```

- 特点：兼容性好，但存在 **空白间隙问题**。


### 5️⃣ 绝对定位布局（面试中可提）

```css
.container {
  position: relative;
}
.left {
  position: absolute;
  left: 0;
  width: 20%;
}
.center {
  position: absolute;
  left: 20%;
  width: 60%;
}
.right {
  position: absolute;
  right: 0;
  width: 20%;
}
```

- 特点：固定布局，不利于响应式，不推荐。


### 📝 面试简答模板

三栏布局实现方法：
>
1. **Float 布局**：老方法，需要清除浮动；
2. **Flex 布局**：现代推荐，响应式好，支持顺序调整；
3. **Grid 布局**：现代网格布局，精确控制列宽和间距；
4. **Inline-block**：兼容性好，但有空白间隙问题；
5. **绝对定位**：固定布局，不适合响应式。
