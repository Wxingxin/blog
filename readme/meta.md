这里说的应该是 **`_meta.json`**（不是 `_mate.json`），Rspress 里它是**自动导航 / 侧边栏 / 概览页**的核心配置文件。下面我用「**是什么 → 放哪儿 → 怎么写 → 高级用法**」的结构给你一份真正的「使用大全 + 配置大全」。

---

## 0. `_meta.json` 是干嘛用的？

在 Rspress 里有两种配置导航的方式：([rspress.rs][1])

1. 在 `rspress.config.ts` 里写 `themeConfig.nav`、`themeConfig.sidebar`
2. 在各个目录里写 **`_meta.json`**，由框架自动生成导航和侧边栏

> ⚠ 注意：如果你用了 `_meta.json` 想自动生成 nav/sidebar，**就不要在 `rspress.config.ts` 里再写 `nav` / `sidebar`**，否则自动导航不会生效。([rspress.rs][1])

---

## 1. `_meta.json` 放在哪？两种级别

### 1.1 导航栏级（Navbar level）

放在 **文档根目录**：

```text
docs
├── _meta.json     // 顶部导航栏用
├── guide
│   ├── _meta.json // guide 目录的侧边栏
│   └── ...
└── leetcode
    ├── _meta.json // leetcode 目录的侧边栏
    └── ...
```

多语言时，每个语言目录都有自己的根 `_meta.json`：([rspress.rs][1])

```text
docs
├── en
│   ├── _meta.json
│   └── guide
│       └── _meta.json
└── zh
    ├── _meta.json
    └── guide
        └── _meta.json
```

### 1.2 侧边栏级（Sidebar level）

放在 **某个子目录里**，用来描述这个目录的侧边栏：([rspress.rs][1])

```text
docs
└── guide
    ├── _meta.json      // 控制 /guide/ 下的 sidebar
    ├── introduction.mdx
    └── advanced
        ├── _meta.json  // 控制 /guide/advanced/ 下的 sidebar
        └── plugin-development.md
```

---

## 2. 导航栏级 `_meta.json`：生成顶部导航

根目录的 `_meta.json` 内容，其类型 = `themeConfig.nav` 的结构。([rspress.rs][1])

**最简单示例：**

```json
[
  {
    "text": "Guide",
    "link": "/guide/introduction",
    "activeMatch": "^/guide/"
  },
  {
    "text": "LeetCode",
    "link": "/leetcode/",
    "activeMatch": "^/leetcode/"
  }
]
```

* `text`：导航显示文字
* `link`：点击后跳转的路径
* `activeMatch`：用正则字符串控制「当前高亮」规则（可选）

**带下拉菜单（和 `themeConfig.nav` 一样）：**

```json
[
  {
    "text": "文档",
    "items": [
      { "text": "指南", "link": "/guide/" },
      { "text": "API", "link": "/api/" }
    ]
  },
  {
    "text": "GitHub",
    "link": "https://github.com/xxx/your-repo"
  }
]
```

> 这里还能使用 `tag` 字段加图标（SVG 或图片 URL），下文会讲。([rspress.rs][1])

---

## 3. 侧边栏级 `_meta.json`：控制目录里的侧边栏

侧边栏级 `_meta.json` 是一个数组，内部每一项可以是以下几种类型（`SideMetaItem` 联合类型）：([rspress.rs][1])

```ts
type SideMetaItem =
  | string
  | { type: 'file'; ... }
  | { type: 'dir'; ... }
  | { type: 'divider'; ... }
  | { type: 'section-header'; ... }
  | { type: 'custom-link'; ... };
```

### 3.1 最简单写法：用字符串表示文件

```json
["introduction", "install", "advanced"]
```

* `"introduction"` 代表 `introduction.md(x)`
* 没写后缀时默认匹配 `.mdx` / `.md`

### 3.2 `type: 'file'` —— 精细控制单个文档

```json
{
  "type": "file",
  "name": "introduction",
  "label": "介绍",
  "overviewHeaders": [2, 3],
  "tag": "🔥",
  "context": "intro"
}
```

字段说明：([rspress.rs][1])

* `name`：文件名（可带后缀也可不带）
* `label`：侧边栏显示文字（不填就用文档的 H1）
* `overviewHeaders`：这个文件在「概览页」中展示哪些级别的标题（默认 `[2]`）
* `tag`：显示在标题前的 SVG 字符串或图片 URL，或者简单文字
* `context`：生成 sidebar DOM 时，附加到元素上的 `data-context` 属性，用来自定义样式/行为

> `overviewHeaders` 和「概览页」联动，后面单独讲。

### 3.3 `type: 'dir'` —— 目录项 / 折叠组

```json
{
  "type": "dir",
  "name": "advanced",
  "label": "进阶",
  "collapsible": true,
  "collapsed": false,
  "overviewHeaders": [2],
  "tag": "💡",
  "context": "advanced-group"
}
```

字段说明：([rspress.rs][1])

* `name`：目录名（文件夹名）
* `label`：在侧边栏显示的组名
* `collapsible`：是否可折叠
* `collapsed`：是否默认折叠
* `overviewHeaders`：这个目录里文档用于概览页的标题级别
* `tag` / `context`：同上

💡 **点击目录显示内容的小技巧：**

如果你想「点击目录名也能显示一个页面」，可以在**同级**加一个同名 mdx 文件：([rspress.rs][1])

```text
docs
├── advanced.mdx   // 点击“进阶”组显示这个页面
└── advanced
    ├── _meta.json
    └── ...
```

### 3.4 `type: 'divider'` —— 分割线

```json
{
  "type": "divider",
  "dashed": true
}
```

* `dashed: true` 表示虚线，否则实线。([rspress.rs][1])

### 3.5 `type: 'section-header'` —— 小标题分组

```json
{
  "type": "section-header",
  "label": "基础部分",
  "tag": "📚"
}
```

通常和 `divider` 一起用，把侧边栏分段：([rspress.rs][1])

```json
[
  { "type": "section-header", "label": "基础" },
  "introduction",
  { "type": "divider" },
  { "type": "section-header", "label": "进阶" },
  "advanced"
]
```

### 3.6 `type: 'custom-link'` —— 自定义链接（可外链）

```json
{
  "type": "custom-link",
  "label": "GitHub",
  "link": "https://github.com",
  "context": "github-link"
}
```

* `link`：可以是站内路由 `/my-link`，也可以是完整外链。([rspress.rs][1])

### 3.7 一个“全集合”例子

```json
[
  "install",
  {
    "type": "file",
    "name": "introduction",
    "label": "介绍",
    "tag": "📖"
  },
  {
    "type": "dir",
    "name": "advanced",
    "label": "进阶",
    "collapsible": true,
    "collapsed": false,
    "tag": "<svg width=\"1em\" height=\"1em\" viewBox=\"0 0 32 32\"><path fill=\"currentColor\" d=\"M4 6h24v2H4z\"/></svg>"
  },
  {
    "type": "section-header",
    "label": "其它"
  },
  {
    "type": "custom-link",
    "link": "/changelog",
    "label": "更新日志"
  },
  {
    "type": "divider",
    "dashed": true
  }
]
```

---

## 4. 「概览页」和 `_meta.json` 的关系（overview page）

Rspress 自带一种「概览页」（preview/overview），可以汇总某个目录里多个文档的标题。([rspress.rs][2])

### 4.1 如何开启概览页？

1. 某目录下写一个 `index.md`（或同名 `.md`），frontmatter：

```md
---
overview: true
title: API 总览
---
这是概览页的简介内容……
```

2. 在这一层目录的 `_meta.json` 里，把需要被汇总的 **文件/目录** 配进去：

```text
docs
└── api
    ├── index.md       // overview: true
    ├── theme
    │   ├── component.mdx
    │   └── utils.mdx
    └── _meta.json
```

`api/_meta.json`：

```json
[
  {
    "type": "file",
    "name": "index",
    "label": "API Overview"
  },
  {
    "type": "dir",
    "name": "theme",
    "label": "Theme"
  }
]
```

`api/theme/_meta.json`：

```json
["component", "utils"]
```

最后概览页会按 `_meta.json` 的结构，把 `component`、`utils` 两个文档的 H1 / H2 标题自动整理出来。([rspress.rs][2])

### 4.2 控制展示哪些级别的标题：`overviewHeaders`

* 在 `_meta.json` 的 `file` / `dir` 上写 `overviewHeaders: [2, 3]`
* 或在单独的文档 frontmatter 里写：

```md
---
overviewHeaders: [2, 3]
---
```

默认是 `[2]`（只展示 h2）。([rspress.rs][2])

---

## 5. 不写 `_meta.json` 时会怎样？

某些目录你懒得写 `_meta.json`，框架可以帮你**按文件名自动生成** sidebar：([rspress.rs][1])

前提：

* 目录里只有文档文件，没有子目录
* 对顺序要求不高（默认按文件名排序）

例如：

```text
docs
└── guide
    ├── _meta.json   // 这里只说有个 basic 目录
    └── basic
        ├── introduction.mdx
        ├── install.mdx
        └── plugin-development.md
```

`guide/_meta.json`：

```json
[
  {
    "type": "dir",
    "name": "basic",
    "label": "基础"
  }
]
```

`basic` 目录下**不写** `_meta.json`，侧边栏会自动生成 `introduction / install / plugin-development`，按文件名排序。如果你想控制顺序，可以给文件名加数字前缀，比如：([rspress.rs][1])

```text
basic
├── 1-introduction.mdx
├── 2-install.mdx
└── 3-plugin-development.md
```

---

## 6. `_meta.json` 里还能玩什么花活？

### 6.1 使用 `tag` 加 SVG / 图片图标

在 file/dir/section-header 里写 `tag`，值可以是：

* SVG 字符串
* 图片 URL（你自己的 `/home/css.png` 也可以）([rspress.rs][1])

比如之前你想在 sidebar 里加图片 icon，可以这么玩：

```json
{
  "type": "file",
  "name": "css",
  "label": "CSS",
  "tag": "/home/css.png"
}
```

或者：

```json
{
  "type": "file",
  "name": "introduction",
  "label": "Introduction",
  "tag": "<svg width=\"1em\" height=\"1em\" viewBox=\"0 0 32 32\"><path fill=\"currentColor\" d=\"M4 6h24v2H4z\"/></svg>"
}
```

### 6.2 `context` 做定制样式 / 行为

`context` 会变成 DOM 上的 `data-context`，比如：

```json
{
  "type": "file",
  "name": "introduction",
  "label": "Introduction",
  "context": "intro-doc"
}
```

渲染后的 HTML 类似：

```html
<li data-context="intro-doc">...</li>
```

你可以在自定义主题里根据这个属性加样式或点击行为。

---

## 7. 实战建议（给你一个套路）

如果你想**用 `_meta.json` 把整个站点导航管理起来**，可以按这个套路：

1. **删掉 `rspress.config.ts` 里的 `themeConfig.nav` 和 `sidebar`**（让自动导航生效）
2. 在 `docs/_meta.json` 里定义顶部导航
3. 在每个一级目录（如 `guide`、`leetcode`、`blog`）里写一个 `_meta.json` 管理子侧边栏
4. 需要概览页的目录（比如 `/api`），用 `overview: true + overviewHeaders + _meta.json` 组合

如果你愿意贴一下你现在的 `docs` 目录树，我可以直接帮你写一套 `_meta.json` 示例：

* `docs/_meta.json`（顶栏）
* `docs/guide/_meta.json`
* `docs/leetcode/_meta.json`

这样你直接复制粘贴就能跑起来。

[1]: https://rspress.rs/guide/basic/auto-nav-sidebar "Autogenerated navigation - Rspress"
[2]: https://rspress.rs/guide/default-theme/overview-page "Overview page - Rspress"
