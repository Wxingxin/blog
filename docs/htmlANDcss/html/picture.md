

##  加载图片的过程是怎样的？

**答：**

1. HTML 解析到 `<img>` 标签；
2. 发起**图片资源**请求；
3. 图片下载完成 ➡️ 解码 ➡️ 绘制到页面；

**补充**：图片解码在浏览器中是异步的，不会阻塞主线程。

##  加载失败如何处理？

**答：**

- 使用 `alt` 文本；
- 使用 JS 监听 `onerror`；

  ```html
  <img src="xxx.jpg" onerror="this.src='backup.jpg'" />
  ```

- 后端返回默认图片。

##  `<img>` 的常见属性有哪些？

**答：**

| 属性               | 作用                                   |
| ------------------ | -------------------------------------- |
| `src`              | 图片路径                               |
| `alt`              | 图片加载失败时显示的替代文字           |
| `width` / `height` | 显示尺寸（不影响原图）                 |
| `loading`          | 懒加载（如 `loading="lazy"`）          |
| `srcset` / `sizes` | 响应式加载不同分辨率的图片             |
| `crossorigin`      | 允许跨域访问图片（如配合 canvas 使用） |

---

##  图片太多，加载太慢怎么办？

**答：** 常见优化手段：

1. ✅ **使用 CDN 加速 💤 网络 💤**
2. ✅ **懒加载（Lazy Load）🛜code🛜**

   ```html
   <img src="..." loading="lazy" />
   ```

   或使用 IntersectionObserver。

3. ✅ **预加载关键图片 🛜code🛜**
4. ✅ **压缩图片（TinyPNG、ImageOptim）🫨not code🫨**
5. ✅ **图片格式优化（WebP、AVIF）🫨not code🫨**
6. ✅ **使用雪碧图（Sprite）🫨not code🫨** 减少 HTTP 请求。

---

##  图片懒加载原理？

**答：**

- 只有当图片 **即将进入视口(用户可见区域)** 时，才开始加载真实图片。
  未进入视口时先用占位符，减少初始加载资源，提高性能。

##### **方式 1：原生属性 `loading="lazy"`（最简单）**

```html
<img src="image.jpg" loading="lazy" alt="" />
```

✔ 浏览器自动在图片即将可见时加载。

---

##### **方式 2：IntersectionObserver（推荐）**

更精确可控，支持更多 API。

```html
<img data-src="real.jpg" class="lazy" alt="" />

<script>
  const imgs = document.querySelectorAll("img.lazy");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        observer.unobserve(img);
      }
    });
  });

  imgs.forEach((img) => observer.observe(img));
</script>
```

---

```html
<img data-src="real.jpg" class="lazy" alt="" />
```

**技巧点**：

- 故意不写 `src` 属性（或者写一个占位图如 1×1 的透明 gif），避免页面加载时立即请求图片
- 把真实地址存在 `data-src` 自定义属性里
- 加 `class="lazy"` 作为“需要懒加载”的标记，方便 JS 选中它们

```js
const imgs = document.querySelectorAll("img.lazy");
```

- 选中页面上所有带 `class="lazy"` 的 `<img>` 标签，得到一个 NodeList

```js
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
```

- 创建一个 **交叉观察者（IntersectionObserver）**
- 它会持续监听“被观察的元素是否进入或即将进入可视区域（viewport）”
- `entry.isIntersecting === true` → 表示这张图片已经**滚到屏幕里了**（或即将出现）

```js
const img = entry.target; // 当前滚进视口的 img 元素
img.src = img.dataset.src; // 把 data-src 的值赋给 src → 真正开始加载图片
img.classList.remove("lazy"); // 加载完后移除 lazy 类（可选，防止重复触发）
observer.unobserve(img); // 停止观察这张图片（已经加载了，没必要再观察）
```

**核心懒加载逻辑就在这四行**：

1. 把真实地址从 `data-src` → `src`，触发图片下载
2. 移除 `lazy` 类（方便配合 CSS 做 loading 占位效果）
3. 取消对这张图的观察，节省性能

```js
    }
  });
});
```

- 关闭回调函数

```js
imgs.forEach((img) => observer.observe(img));
```

- 把页面上所有 `.lazy` 图片都交给 observer 去监视
- 一旦用户滚动到它们附近，就会自动触发上面的加载逻辑

### 完整工作流程图解

```
页面加载 → img 只有 data-src，没有 src → 浏览器不请求图片
      ↓
用户向下滚动
      ↓
IntersectionObserver 检测到某张 img 进入视口
      ↓
自动执行：img.src = img.dataset.src
      ↓
浏览器真正开始下载 real.jpg
      ↓
图片加载完成并显示
      ↓
移除 lazy 类 + 停止观察（避免重复加载）
```

### 优点（为什么现在都用这个写法）

| 优点                   | 说明                                      |
| ---------------------- | ----------------------------------------- |
| 原生 API，性能极高     | 不需要 scroll + timer 轮询                |
| 准确触发               | 只有真正快出现时才加载                    |
| 自动处理动态添加的图片 | 只要再 observe 一下就行                   |
| 兼容性已经很好         | 2025 年所有现代浏览器都支持（包括手机端） |

### 可选增强（生产中常加的）

```html
<img data-src="real.jpg" class="lazy" alt="" loading="lazy" />
<!-- 浏览器原生也支持！ -->
```

现代浏览器已经原生支持 `loading="lazy"` 属性，如果你不追求极致兼容老浏览器，直接写这个就行，**一行属性搞定懒加载**，连 JS 都不用！

但手写 IntersectionObserver 的好处是：

- 兼容更老的浏览器
- 可以加加载动画、统计曝光等额外逻辑

##### **方式 3：滚动事件监听（不推荐）**

较老的方式，需要自行判断是否进入可视区。

---

##  响应式图片如何实现？

**答：**
有两种方式：

**方式 1：`srcset` + `sizes`（最推荐，现代浏览器通用）**

##### **1）使用不同分辨率的图片**

```html
<img
  src="img-800.jpg"
  srcset="img-400.jpg 400w, img-800.jpg 800w, img-1200.jpg 1200w"
  sizes="
    (max-width: 600px) 400px,
    (max-width: 1000px) 800px,
    1200px
  "
  alt="示例图片"
/>
```

##### **原理：**

- `srcset` 告诉浏览器“有哪些尺寸的图片可用”
- `sizes` 告诉浏览器“当前布局需要多宽的图片”
- 浏览器根据设备宽度、DPR（像素密度）自动选择最合适的图片文件。

---

#### **方式 2：使用 `<picture>` 元素**

适合需要 **不同格式**（如 WebP）或完全不同的图片资源。

```html
<picture>
  <source srcset="img.webp" type="image/webp" />
  <source srcset="img.jpg" type="image/jpeg" />
  <img src="img.jpg" alt="示例图片" />
</picture>
```

##### **原理：**

浏览器根据支持的格式自动选择最合适的 `<source>`。

##  常见图片格式区别？

| 格式                                 | 特点                        | 适用场景         |
| ------------------------------------ | --------------------------- | ---------------- |
| **PNG** 🚩                           | (无损 \ 有损)压缩，支持透明 | 图标、Logo       |
| **SVG** 🚩                           | 矢量图，可缩放              | 图标、Logo       |
| **JPEG/JPG** 🏴‍☠️                      | 有损压缩，小体积            | 照片类图片       |
| **GIF** 🏴‍☠️                           | 动图，最多 256 色           | 表情、动效       |
| **WebP** 🦋 | 体积小、支持透明            | 现代 Web（推荐） |
| **AVIF** 🦋 | 新一代格式，压缩更强        | 高性能网站       |

---

##  WebP 与 PNG 的区别？

**答：**

| 对比项         | WebP                                  | PNG          |
| -------------- | ------------------------------------- | ------------ |
| 压缩方式 🈶    | 有损 / 无损                           | 无损         |
| 透明度 🈶      | 支持                                  | 支持         |
| 动图 🈶        | 支持（WebP 动图）                     | 支持（APNG） |
| 文件大小 🈚️   | 通常更小                              | 相对大       |
| 浏览器支持 🈚️ | 新版 Chrome / Edge / Firefox / Safari | 全支持       |

---

##  Base64 图片是什么？优缺点？

**答：**
Base64 是把图片**二进制数据**编码成**文本**（ASCII 字符串）：

```html
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUg..." />
```

1. ✅ 优点：

- 减少 HTTP 请求（适合小图标）

2. ❌ 缺点：

- 会增大体积（大约 +30%）
- 无法缓存（嵌入 HTML 里）

---

##  雪碧图（Sprite）原理？

**答：**

- 把多个小图标拼成一张大图；
- 用 `background-position` 来定位显示哪个部分；

```css
.icon {
  background-image: url(sprite.png);
  width: 20px;
  height: 20px;
}
.icon-home {
  background-position: -20px -40px;
}
```

- ✅ 优点：减少请求数
- ❌ 缺点：维护成本高。

---

## 如何判断一张图片是否加载完成？

**答：**

#### ✅ **方式 1：使用 `new Image()`（你已经写的方式）**

这是最标准、最干净的做法，适合预加载图片。

```js
const img = new Image();
img.onload = () => console.log("加载完成");
img.onerror = () => console.log("加载失败");
img.src = "test.jpg";
```

#### ✅ **方式 2：判断页面中已有的 `<img>` 是否加载完成**

有时候 `<img>` 已在 HTML 中，你要判断它是否已经加载。

```html
<img id="photo" src="test.jpg" />
```

```js
const img = document.getElementById("photo");

if (img.complete) {
  console.log("已经加载完成（来自缓存或已经渲染）");
} else {
  img.onload = () => console.log("加载完成");
  img.onerror = () => console.log("加载失败");
}
```

###### `img.complete` 是关键：

| 状态         | `img.complete` | `img.naturalWidth` |
| ------------ | -------------- | ------------------ |
| 图片加载完成 | true           | > 0                |
| 图片加载失败 | true           | 0                  |
| 图片尚未加载 | false          | 0                  |

---

#### ✅ **方式 3：判断图片是否加载失败**

可以结合 naturalWidth 判断：

```js
const img = document.getElementById("photo");

img.onload = () => {
  if (img.naturalWidth > 0) {
    console.log("加载成功");
  }
};

img.onerror = () => console.log("加载失败");
```

---

#### ✅ **方式 4：使用 Promise 封装图片加载（更现代）**

适合 React / Vue / Node SSR 图片预处理。

```js
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

loadImage("test.jpg")
  .then(() => console.log("加载完成"))
  .catch(() => console.log("加载失败"));
```

---

##  如果需要上传图片前进行压缩，你会怎么做？

考察点：

- FileReader 读取图片
- Canvas 画图 + toDataURL 输出
- Blob 转 File 再上传

---

##  前端如何做图片优化策略？

**答：**

#### 1) 格式优化（收益最大）

- **优先 AVIF / WebP，兜底 JPEG/PNG**
  用 `<picture>` 做多格式回退。
- **透明/无损场景用 PNG**，图标/插画优先 **SVG**。
- 能裁剪的动图尽量用 **MP4/WebM/Lottie** 替代 GIF。

```html
<picture>
  <source srcset="a.avif" type="image/avif" />
  <source srcset="a.webp" type="image/webp" />
  <img src="a.jpg" alt="" />
</picture>
```

---

#### 2) 分辨率自适应（响应式/按需尺寸）

核心是：**不要让用户下载比容器大很多的图**。

- 后端/CDN 出多档尺寸（320/640/1280…）
- 前端用 `srcset + sizes` 选择最合适的
- 高 DPR 设备自动拿 2x/3x

```html
<img
  src="a-640.jpg"
  srcset="a-320.jpg 320w, a-640.jpg 640w, a-1280.jpg 1280w"
  sizes="(max-width: 600px) 320px, (max-width: 1200px) 640px, 1280px"
/>
```

---

#### 3) 加载优化

- **懒加载**：IntersectionObserver + rootMargin 预加载下一屏
- **关键图优先**：首屏 hero 图 `preload` / 框架里的 `priority`
- 列表大量图片：**虚拟列表** + 懒加载组合
- `decoding="async"`、`fetchpriority="high"`（支持时）
- 低网速优先加载低清，再替换高清（渐进式）

```html
<link rel="preload" as="image" href="hero.webp" />
<img src="hero.webp" fetchpriority="high" decoding="async" />
```

---

#### 4) CDN + 图片处理能力

- **CDN 就近分发**降低 RTT
- 用 CDN 的**动态裁剪/缩放/格式转换**参数
  例如：`?w=640&h=360&fit=cover&fm=webp&q=80`
- 大站常见策略：**同一张原图 + CDN 参数实时出不同版本**，避免存多份。

---

#### 5) 缓存策略（减少重复下载）

- 静态图长缓存：`Cache-Control: max-age=31536000, immutable`
- 文件名带 hash，更新不怕缓存
- 可选：Service Worker 做离线/二次访问加速（PWA）

---

#### 6) 体积/内联策略（小图 Base64 的正确用法）

你写的“小图转 Base64”要说清适用边界：

- **适合非常小且高频图标**（比如 < 2KB）
  避免额外请求、减少 RTT
- **不适合稍大图片**：Base64 会膨胀约 1/3，且不可独立缓存
- 更好的替代：**SVG sprite / iconfont / HTTP2 多路复用**。

---

#### 7) 渲染与体验（面试加分）

- 避免 CLS：给图片明确 `width/height` 或 `aspect-ratio`
- placeholder：LQIP / blur / blurhash / skeleton
- 渐进式加载淡入，让视觉更稳

```html
<img src="a.webp" width="640" height="360" style="aspect-ratio:16/9" />
```

#### 一段“标准面试总结”

> 图片优化我会按“格式—尺寸—加载—缓存—体验—监控”做：优先 AVIF/WebP + picture 兜底；用 CDN 多尺寸和 srcset/sizes 做分辨率自适应；列表图懒加载、首屏关键图 preload/priority；走 CDN 就近分发并按需裁剪转码；配长缓存和 hash 版本控制；渲染侧用 placeholder 和固定宽高避免 CLS；最后用 LCP/CLS 和体积监控持续优化。
