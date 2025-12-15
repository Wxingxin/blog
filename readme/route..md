先给你一句话概括：**Rspress 的路由 = 文件系统约定式路由 + 配置过滤 + i18n & 多版本前缀 + 插件扩展自定义路由**。下面我按场景帮你“从零到骚操作”过一遍。

---

## 一、最核心：文件系统约定式路由

### 1. 文档根目录 `root`

默认情况下，Rspress 会把 **`docs` 目录当成“路由的世界中心”**，从这里往下所有 `.md / .mdx / .tsx` 文件都会被扫一遍，生成路由。`root` 可以通过配置修改：([Rspress][1])

```ts
// rspress.config.ts
import { defineConfig } from 'rspress/config';

export default defineConfig({
  root: 'docs', // 默认就是 docs，可以改成 'content' 等
});
```

后面所有提到的“文件路径”，都是相对于这个 `root` 的。

---

### 2. 基础映射规则（**必须背会的那张表**）

官方的核心规则可以总结成这一张表：([Rspress][2])

| 文件路径            | 路由路径       |
| --------------- | ---------- |
| `index.md`      | `/`        |
| `/foo.md`       | `/foo`     |
| `/foo/bar.md`   | `/foo/bar` |
| `/zoo/index.md` | `/zoo/`    |

再加几个组合例子：

```text
docs
├── index.md            ->  /
├── foo.md              ->  /foo
├── foo
│   └── bar.md          ->  /foo/bar
└── zoo
    └── index.md        ->  /zoo/
```

核心记忆点：

* `index.md` 表示“当前目录的首页”，路由就是该目录对应的路径。
* 其他 `.md/.mdx` 文件就按 “文件名 + 目录” 直接映射。
* 不需要自己去写路由表，只要**管好文件结构**。

---

## 二、组件路由：用 `.tsx` 直接当页面

除了 MD/MDX 以外，Rspress 也支持用 React 组件文件作为路由页面：([Rspress][2])

```tsx
// docs/foo.tsx -> /foo
export default () => {
  return <div>Foo Page</div>;
};
```

如果你想**用完全自定义布局**（比如不要侧边栏），可以在文件里导出 `frontmatter` 来声明 `pageType`：

```tsx
// docs/custom.tsx -> /custom
export const frontmatter = {
  pageType: 'custom', // 自定义布局，不会套默认文档布局
};

export default () => {
  return <main>完全自定义页面</main>;
};
```

`pageType` 会影响默认主题怎么渲染页面（是否有侧边栏、是否当作文档页等），具体枚举可以在 API 文档里看。([Rspress][2])

这在做“文档 + landing page/展示页”的项目时很好用。

---

## 三、路由过滤配置：`route.include` / `route.exclude`

如果你的 `root` 目录里有一些文件**不想进路由**（例如 demo 组件、实验页），或者想从其他目录额外引入文件做页面，可以用 `route` 配置。([Rspress][2])

```ts
// rspress.config.ts
import { defineConfig } from 'rspress/config';

export default defineConfig({
  route: {
    // 不参与路由生成的文件，支持 glob
    exclude: ['components/**/*', 'drafts/**'],

    // 额外参与路由生成的文件（不在 root 下也没关系）
    include: ['other-docs/**/*'],
  },
});
```

常见用法：

* `exclude: ['**/*.draft.md']` —— 写到一半的草稿，先不想暴露。
* `include` 指到某个外部目录：可以把博客文章、第三方生成的 md 通过脚本放到一个目录，然后 include 进来。

---

## 四、国际化路由（i18n）：语言前缀 & 默认语言去前缀

Rspress i18n 的路由规则可以概括成：

> **多语言目录 + `locales` + 默认 `lang` = 自动语言前缀，默认语言自动去前缀**。([Rspress][3])

### 1. 配置语言列表 & 默认语言

```ts
// rspress.config.ts
import { defineConfig } from 'rspress/config';

export default defineConfig({
  // 站点级语言信息
  locales: [
    {
      lang: 'en',
      label: 'English',
      title: 'My Site',
      description: 'Docs',
    },
    {
      lang: 'zh',
      label: '简体中文',
      title: '我的站点',
      description: '文档',
    },
  ],
  themeConfig: {
    // 主题（比如侧边栏标题、上一页/下一页文案）里的多语言配置
    locales: [
      { lang: 'en', outlineTitle: 'ON THIS PAGE' },
      { lang: 'zh', outlineTitle: '本页目录' },
    ],
  },

  // 默认语言（**关键：决定是否带语言前缀**）
  lang: 'en',
});
```

### 2. 不同语言的目录结构

在 `root` 下按语言建子目录，例如：([Rspress][3])

```text
docs
├── en
│   └── guide
│       ├── getting-started.md
│       └── features.md
└── zh
    └── guide
        ├── getting-started.md
        └── features.md
```

路由行为大致是：

* 对于**默认语言 `en`**：

  * `docs/en/guide/getting-started.md` → `/guide/getting-started`
  * 也就是 **路由里自动去掉 `/en` 前缀**。([Rspress][3])
* 非默认语言（如 `zh`）：

  * `docs/zh/guide/getting-started.md` → `/zh/guide/getting-started`

因此你的外链一般写的不需要带语言前缀，当前语言会自动补前缀。

---

## 五、多版本路由：`multiVersion` + 版本目录

多版本文档（比如 v1 / v2 / next）用 `multiVersion` 配置：([Rspress][4])

```ts
// rspress.config.ts
export default defineConfig({
  multiVersion: {
    default: 'v1',
    versions: ['v1', 'v2'],
  },
});
```

然后在 `docs` 下面按版本建目录：

```text
docs
├── v1
│   ├── README.md          // -> /README
│   └── guide
│       └── README.md      // -> /guide/README
└── v2
    ├── README.md          // -> /v2/README
    └── guide
        └── README.md      // -> /v2/guide/README
```

路由规则关键点：([Rspress][4])

* 对于 `multiVersion.default` 指定的**默认版本**（这里是 `v1`）：

  * **URL 不带版本前缀**，保持简洁/SEO 友好。
* 非默认版本（如 `v2`）：

  * 路径前面会多一个 `/v2`。

另外：

* 文档里的相对链接写成 `/guide/README`，Rspress 会根据当前版本自动带上对应版本前缀（如 `/v2/guide/README`）。([Rspress][4])
* 搜索可以配置只搜当前版本：

```ts
export default defineConfig({
  multiVersion: {
    default: 'v1',
    versions: ['v1', 'v2'],
  },
  search: {
    versioned: true, // 搜索只在当前版本内
  },
});
```

---

## 六、插件扩展自定义路由（例如 `/blog`）

除了“常规文件路由”外，Rspress 还可以通过插件添加完全自定义的路由，比如 `/blog`、`/playground` 等。([Rspress][5])

插件能力里明确写了：

> 在约定式路由的基础上，可以通过插件新增路由，比如新增 `/blog` 路由显示博客列表，内容完全自定义。([Rspress][5])

常见玩法：

* 写一个插件，在构建阶段通过 `addPages` 之类的钩子**动态生成路由和页面**（官方 2.x 文档里有示意，社区也有用这个方式把 Hexo / 旧博客迁移到 Rspress 的例子）。([SumyBlog][6])
* 根据外部数据源（文件系统、接口、RSS 等）批量注入页面，比如：

  * `/blog/2025/01/01/my-post`
  * `/changelog/2025-12`

适合需求：

* “老博客 URL 不能变，但想换成 Rspress 渲染”。
* “从某个 CMS 拉内容，在构建时生成静态页面”。

---

## 七、导航相关：`_meta.json` 自动导航 & 路由关系

路由本身还是由“文件路径 → 路径规则”决定，但顶部导航和侧边栏可以通过 `_meta.json` 自动生成：([Rspress][7])

简单理解：

* 路由 = 文件结构 + i18n + 多版本 + route 配置。
* 导航 / 侧边栏 = 在 `_meta.json` 中描述“哪些路由要出现在导航中，以及它们的顺序和分组”。

示例（放在某个目录下的 `_meta.json`）：

```json
[
  {
    "type": "dir",
    "name": "guide",
    "label": "gettingStarted"  // 可配合 i18n.json 做多语言
  }
]
```

`label` 可以写成 i18n key，Rspress 会用当前语言翻译：([Rspress][3])

---

## 八、实践向的小建议

1. **统一用目录表达层级**
   不要把所有文档塞在根目录里；用 `guide/`, `api/`, `blog/` 等目录，让 URL 一眼看懂结构。

2. **首页 & 概览页用 `index.md` 或 `README.md`**

   * 顶层 `index.md` 做站点首页。
   * 每个目录里也可以放 `index.md` 当该部分的“概览页”。

3. **草稿/实验页用 `exclude` 过滤**
   比如把草稿文档放到 `drafts/` 目录，然后：

   ```ts
   route: {
     exclude: ['drafts/**'],
   }
   ```

4. **多语言 + 多版本同时存在时的路径心智**
   一般推荐结构类似：

   ```text
   docs
   ├── v1
   │   ├── en
   │   └── zh
   └── v2
       ├── en
       └── zh
   ```

   这样 URL 会长成类似：

   * 默认语言 + 默认版本：`/guide/getting-started`
   * 非默认语言：`/zh/guide/getting-started`
   * 非默认版本：`/v2/guide/getting-started`
   * 非默认语言 + 非默认版本：`/v2/zh/guide/getting-started`（根据实际配置而定）

---

如果你愿意把**当前项目的目录结构**贴出来，我可以帮你直接把“文件树 → 路由表”列一份，并顺带给你一个适合你项目的 `route` / `multiVersion` / `i18n` 示例配置。

[1]: https://rspress.rs/api/config/config-basic?utm_source=chatgpt.com "Basic config"
[2]: https://rspress.rs/guide/basic/conventional-route "Conventional route - Rspress"
[3]: https://rspress.rs/guide/default-theme/i18n "Internationalization - Rspress"
[4]: https://rspress.rs/guide/default-theme/multi-version "Multi version - Rspress"
[5]: https://v2.rspress.rs/plugin/system/introduction "Introduction - Rspress"
[6]: https://sumygg.com/2023/11/19/new-blog-with-rspress/index.html?utm_source=chatgpt.com "博客引擎迁移到rspress - SumyBlog"
[7]: https://rspress.rs/guide/basic/auto-nav-sidebar?utm_source=chatgpt.com "Autogenerated navigation"
