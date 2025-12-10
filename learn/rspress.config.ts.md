我先给你一份「**带注释的 rspress.config.ts 模板**」，然后把常用配置按模块讲一遍，你直接对照抄 + 挑着用就行 👇

---

## 一、典型 `rspress.config.ts` 模板（带中文注释）

```ts
// rspress.config.ts
import { defineConfig } from 'rspress/config';

export default defineConfig({
  /* -------- 基础站点配置（Basic config） -------- */
  root: 'docs',              // 文档根目录，默认就是 docs :contentReference[oaicite:0]{index=0}
  base: '/',                 // 部署子路径，放 GitHub Pages 子目录时要改 :contentReference[oaicite:1]{index=1}
  title: '我的BLOG网站',     // 全站标题（浏览器 tab 标题）:contentReference[oaicite:2]{index=2}
  description: '一个学习前端的网站', // HTML meta description :contentReference[oaicite:3]{index=3}
  icon: '/favicon.ico',      // 站点 favicon，优先从 public 下找 :contentReference[oaicite:4]{index=4}
  lang: 'zh',                // 默认语言，用于 html lang 属性 + i18n :contentReference[oaicite:5]{index=5}

  // 多语言配置（可选）
  locales: [
    {
      lang: 'zh',
      label: '简体中文',
      title: '我的BLOG网站',
      description: '一个学习前端的网站',
    },
    {
      lang: 'en',
      label: 'English',
      title: 'My Blog',
      description: 'A frontend learning site',
    },
  ],

  head: [
    // 自定义 <head> 标签
    ['meta', { name: 'keywords', content: '前端,Blog,Rspress' }],
    ['link', { rel: 'stylesheet', href: '/custom.css' }],
  ],

  /* -------- 主题相关配置（Theme config） -------- */
  themeConfig: {
    // 顶部导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/' },
      { text: 'LeetCode', link: '/leetcode/' },
    ],

    // 左侧侧边栏
    sidebar: {
      '/guide/': [
        {
          text: '入门',
          items: [
            { text: '快速开始', link: '/guide/' },
            { text: '基础配置', link: '/guide/config' },
          ],
        },
      ],
      '/leetcode/': [
        {
          text: 'LeetCode 题解',
          collapsed: false,
          items: [
            { text: '介绍', link: '/leetcode/' },
            { text: '数组', link: '/leetcode/array' },
          ],
        },
      ],
    },

    // 页脚
    footer: {
      message: '© 2025 Jiaxing Wei · Powered by Rspress',
    },

    // 社交链接（右上角 icon）
    socialLinks: [
      { icon: 'github', mode: 'link', content: 'https://github.com/xxx/your-repo' },
    ], :contentReference[oaicite:6]{index=6}

    // 其他文案 & 功能开关
    outlineTitle: '本页目录',
    lastUpdated: true,
    lastUpdatedText: '最后更新',
    prevPageText: '上一页',
    nextPageText: '下一页',
    search: true,                // 是否显示搜索框 :contentReference[oaicite:7]{index=7}
    darkMode: true,              // 是否允许明暗色切换 :contentReference[oaicite:8]{index=8}
    enableScrollToTop: true,     // 右下角返回顶部按钮
    hideNavbar: 'never',         // 'auto' 下滑隐藏, 'always' 总是隐藏 :contentReference[oaicite:9]{index=9}
  },

  /* -------- Markdown / 构建相关配置（Build config） -------- */
  markdown: {
    // 代码块、锚点等进阶配置（默认够用，一般先不用动）
  },

  builderConfig: {
    // 直接透传给 Rsbuild/Rspack 的构建配置，高阶用法
    output: {
      // 例如：cdn 前缀
      // assetPrefix: 'https://static.example.com/',
    },
  },

  /* -------- 插件（Plugins） -------- */
  plugins: [
    // 比如 Shiki 高亮插件、Module Federation 插件等 :contentReference[oaicite:10]{index=10}
  ],
});
```

---

## 二、`Basic config` 常用配置总览

这些是写在 `defineConfig({...})` 根上的字段。官方 API 页上都列出来了。([v2.rspress.rs][1])

### 1. 路径 & 站点信息

- **root**：文档根目录，默认 `docs`，你现在就是用的这个。
- **base**：部署子路径，GitHub Pages / 子路径部署时必须改，比如部署到 `myname.github.io/blog/`，就设 `base: '/blog/'`。
- **title / description / icon / lang**：站点标题、描述、图标、默认语言（直接影响 `<html lang>`）。

### 2. 多语言 / 本地化

- **locales**：一个数组，每个对象代表一个语言版本（`lang`、`label`、`title`、`description` 等），配合 `lang` 使用。([rspress.rs][2])
- 配合 `themeConfig.locales` 可以定制不同语言下的导航/侧边栏文案。

### 3. head 注入

- **head**：和 VitePress 很像，是 `([tagName, attrs])[]`，用于注入额外的 `<meta>`、`<link>`、`<script>`。

```ts
head: [
  ['meta', { name: 'keywords', content: '前端,Blog,Rspress' }],
  ['script', { src: 'https://xx.com/analytics.js', async: true }],
],
```

### 4. 搜索 / 缩放等

在新版文档里，还包括：

- **mediumZoom**：是否给正文中的图片加点击放大效果。([rspress.rs][2])
- **search / searchHooks**：是否启用默认搜索，以及定制搜索行为（一般默认够用）。

---

## 三、`themeConfig` 主题配置大全（默认主题）

`themeConfig` 是你现在最常打交道的部分（导航、侧边栏、页脚、文案等）([rspress.rs][3])

### 1. 顶部导航栏 `nav`

- 类型：`NavItem[] | NavGroup[]`
- 简单项：

```ts
themeConfig: {
  nav: [
    { text: '首页', link: '/' },
    { text: '指南', link: '/guide/' },
  ],
}
```

- 下拉菜单（支持嵌套 group）：

```ts
nav: [
  { text: "首页", link: "/" },
  {
    text: "文档",
    items: [
      { text: "指南", link: "/guide/" },
      {
        text: "更多",
        items: [{ text: "博客", link: "https://xxx.blog" }],
      },
    ],
  },
];
```

`activeMatch` 可以手动控制当前高亮规则（用正则字符串）。([rspress.rs][3])

### 2. 左侧侧边栏 `sidebar`

支持两种形式：**对象** 或 **数组**。

- **对象形式：根据路径前缀匹配**

```ts
sidebar: {
  '/guide/': [
    {
      text: '指南',
      collapsed: false,
      items: [
        { text: '快速开始', link: '/guide/' },
        { text: '配置', link: '/guide/config' },
      ],
    },
  ],
  '/leetcode/': [
    {
      text: 'LeetCode',
      items: [
        { text: '介绍', link: '/leetcode/' },
      ],
    },
  ],
}
```

- `collapsed: false` 表示默认展开。

### 3. 页脚 `footer`

```ts
footer: {
  message: '文案可以包含 <a href="/">HTML</a>',
  copyright: '© 2025 Jiaxing Wei',
}
```

`message` 支持 HTML，会用 `dangerouslySetInnerHTML` 渲染。([rspress.rs][4])

### 4. 社交链接 `socialLinks`

```ts
socialLinks: [
  { icon: "github", mode: "link", content: "https://github.com/xxx" },
  { icon: "wechat", mode: "img", content: "/qrcode.png" },
];
```

支持 `link / text / img / dom` 四种模式。

### 5. 常用 UI & 文案开关

这些都是「体验优化项」，你可以按需打开：([rspress.rs][4])

- `outlineTitle`：右侧「ON THIS PAGE」标题文案。
- `lastUpdated / lastUpdatedText`：是否显示最后更新时间 + 文案。
- `prevPageText / nextPageText`：上一页 / 下一页按钮文字。
- `searchPlaceholderText / searchNoResultsText / searchSuggestedQueryText`：搜索框相关文案。
- `darkMode`：是否显示暗色模式切换按钮。
- `hideNavbar`: `"never" | "auto" | "always"` 控制滚动时导航栏行为。
- `enableContentAnimation`：切页动画（View Transition API）。
- `enableAppearanceAnimation`：切换明暗主题动画。
- `search`：是否显示搜索。
- `sourceCodeText`：右上角「Source」按钮文本。
- `enableScrollToTop`：右下角返回顶部按钮。
- `localeRedirect`：多语言场景下是否根据浏览器语言自动跳转。([rspress.rs][4])
- `fallbackHeadingTitle`：当页面没有 H1 时，是否用 frontmatter.title 兜底。

---

## 四、Build / Markdown / 插件配置

这些在官方 API 里归类为「Build config」。([v2.rspress.rs][1])

### 1. `builderConfig`

透传给 Rsbuild/Rspack 的高级配置，比如：

```ts
builderConfig: {
  output: {
    assetPrefix: 'https://cdn.example.com/',
  },
},
```

一般只有要改构建行为（CDN 前缀、打包细节）才需要。

### 2. `markdown`

控制 Markdown 渲染行为，比如代码高亮、toc、锚点等（v2 默认用 Shiki，高亮相关还有插件形式）。([GitHub][5])

常见能力：

- 自定义代码高亮 transformer
- 控制是否启用行号、diff、focus 行等

> 如果你只是写文档 / Blog，不动 `markdown` 也完全 OK。

### 3. `plugins`

用来挂载 Rspress 插件，例如官方的 Shiki 插件、Module Federation 插件等([GitHub][5])：

```ts
import { pluginShiki } from "@rspress/plugin-shiki";

export default defineConfig({
  // ...
  plugins: [
    pluginShiki({
      // options...
    }),
  ],
});
```

---

## 五、实战建议：你现在可以怎么玩 rspress.config.ts

结合你前面做的博客站点，我建议的几个“必配项”：

1. **基础信息**

   - `title` / `description` / `icon` / `lang`

2. **导航结构**

   - `themeConfig.nav + themeConfig.sidebar`
   - 给 `/leetcode/`、`/guide/`、`/blog/` 分区

3. **多语言（如果以后想中英双语）**

   - `lang + locales + themeConfig.locales`

4. **体验优化**

   - `lastUpdated: true`
   - `enableScrollToTop: true`
   - `outlineTitle: '本页目录'`

5. **后期再玩**

   - 插件（Shiki / Module Federation）
   - builderConfig（CDN、构建细节）

---

如果你愿意把你**现在正在用的 rspress.config.ts** 贴出来，我可以直接帮你「按上面这一套给你重构一版」，顺便帮你把 LeetCode / Blog / Guide 的导航、侧边栏都整理好。

[1]: https://v2.rspress.rs/api/ "API Overview - Rspress"
[2]: https://rspress.rs/api/config/config-basic "Basic config - Rspress"
[3]: https://rspress.rs/api/config/config-theme "Theme config - Rspress"
[4]: https://rspress.rs/api/config/config-theme?utm_source=chatgpt.com "Theme config"
[5]: https://github.com/web-infra-dev/rspress/discussions/1891?utm_source=chatgpt.com "Breaking changes in Rspress v2.0.0 #1891"
