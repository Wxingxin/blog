### Rspress 中的 rspress.config.ts 知识点大全和配置大全

Rspress 是一个基于 Rspack 的高性能静态站点生成器（SSG），专为文档站点设计，支持 MDX、React 渲染和开箱即用的功能如搜索、多版本文档等。`rspress.config.ts` 是其核心配置文件，使用 TypeScript 编写，通过 `defineConfig` 函数导出配置对象。该文件允许你自定义站点行为，包括主题、路由、构建、Markdown 处理等。

Rspress 的配置设计原则是**简单、直觉、低心智负担**：
- **声明式配置优先**：推荐使用目录下的 `_meta.json` 文件配置侧边栏、元数据等，而非全部依赖 `rspress.config.ts`，减少上下文切换。
- **开箱即用**：默认支持全文搜索（基于 FlexSearch）、代码高亮（Prism.js 或 Shiki）、多版本文档等，无需额外配置。
- **插件生态**：支持 Rsbuild/Rspack 插件扩展构建，支持自定义插件如 `@rspress/plugin-typedoc`（API 文档生成）。
- **主题扩展**：基于默认主题，提供插槽（slots）自定义布局，如 `beforeNavTitle`、`afterNavTitle`。
- **多版本支持**：通过简单配置启用版本切换，目录结构保持直觉。
- **构建调试**：运行 `rspress dev` 或 `build` 时添加 `DEBUG=rsbuild` 可查看默认 Rspack/Rsbuild 配置。

以下是 `rspress.config.ts` 的**完整配置选项大全**，基于官方文档（Rspress v1.x 和 v2.x 兼容性高，v2 有少量 breaking changes 如 Markdown 配置调整）。我将按类别组织，包含**类型**、**默认值**、**描述**和**示例**。所有配置通过 `defineConfig({ ... })` 导出。

#### 1. **基础配置（Basic Config）**
这些是站点级的基础设置，控制根目录、路由和全局组件。

| 配置选项 | 类型 | 默认值 | 描述 | 示例 |
|----------|------|--------|------|------|
| `root` | `string` | 当前工作目录 | 站点根目录路径，用于指定 docs 或主题位置。也可通过 CLI `--root` 指定。 | `root: './my-site'` |
| `docRoot` | `string` | `'docs'` | 文档根目录，MDX 文件存放处。影响路由生成。 | `docRoot: 'src/docs'` |
| `outDir` | `string` | `'dist'` | 构建输出目录。 | `outDir: 'build'` |
| `globalUIComponents` | `Array<string \| [string, Record<string, any>]>` | `[]` | 全局 UI 组件数组，用于在所有页面注入 React 组件（无需手动导入）。每个项可带 props。用于自定义功能如自定义布局、插件 UI。组件需默认导出 React 组件。 | ```globalUIComponents
| `extraRoutes` | `Array<{ path: string; element: string }>` | `[]` | 额外路由文件，扩展默认文档路由。只包含指定文件在路由中。 | ```extraRoutes: [{ path: '/custom', element: path.join(__dirname, 'pages/CustomPage.tsx') }``` |
| `head` | `Array<string \| object>` | `[]` | 全局 HTML `<head>` 元数据，如标题、meta 标签。 | ```head: [  '<meta name="description" content="My Site">',  { tag: 'link', props: { rel: 'icon', href: '/icon.png' } },]``` |

**知识点**：
- 全局组件渲染在主题中，支持 slots 自定义位置（如导航栏后）。
- 路由基于文件系统：MDX/TSX 文件自动生成路由，支持组件路由（.tsx）和文档路由（.mdx）。

#### 2. **主题配置（Theme Config）**
控制站点主题和布局。

| 配置选项 | 类型 | 默认值 | 描述 | 示例 |
|----------|------|--------|------|------|
| `theme` | `string \| object` | 默认主题（`'rspress/theme'`） | 主题路径或自定义主题对象。支持扩展默认主题，提供 slots 如 `Layout`、`beforeNavTitle`。 | ```theme: path.join(__dirname, 'theme/index.tsx')```<br>自定义：```tsx // theme/index.tsx import Theme from 'rspress/theme'; const Layout = () => <Theme.Layout beforeNavTitle={<p>Custom</p>} />; export default { ...Theme, Layout }; export * from 'rspress/theme';``` |
| `themeConfig` | `object` | `{}` | 传递给主题的配置，如 logo、nav、sidebar。 | ```themeConfig: { logo: 'logo.png', nav: [{ title: 'Guide', path: '/guide' }], sidebar: { '/guide': [ /* 侧边栏项 */ ] } }``` |

**知识点**：
- 默认主题支持插槽扩展：`beforeNavTitle`、`afterNavTitle` 等，用于添加自定义块（如 AI 问答组件 Documate）。
- 侧边栏优先使用 `_meta.json` 声明式配置：目录下 `_meta.json` 定义 title、order、collapsed 等，减少 config.ts 修改。
- 多版本主题：`multiVersion: { versions: ['v1', 'v2'] }`，自动生成版本切换器。

#### 3. **Markdown/MDX 配置（Markdown Config）**
控制内容解析和高亮。

| 配置选项 | 类型 | 默认值 | 描述 | 示例 |
|----------|------|--------|------|------|
| `markdown` | `object` | `{}` | Markdown 配置，包括高亮、Shiki/Prism。 | ```markdown: {  shiki: {    theme: 'nord',    transformers: [transformerNotationHighlight()],  },  highlight: {    langAlias: { js: 'javascript' },  },}``` |
| `markdown.shiki` | `object` | Prism.js 默认 | 代码高亮，使用 Shiki（需 `@rspress/plugin-shiki`）。支持 transformers 如高亮注释。 | 如上，支持语言别名：`['js', 'javascript'], ['ts', 'typescript']` 等。 |
| `markdown.highlight.languages` | `Array<[string, string]>` | 默认语言别名 | 高亮语言别名列表。 | ```highlight: {  languages: [['mdx', 'tsx']] }``` |
| `mdx` | `boolean \| object` | `true` | 启用 MDX 支持。 | `mdx: false`（禁用） |

**知识点**：
- 默认 Prism.js 高亮，支持自动导入语言。切换 Shiki：安装插件并配置 `shiki: { theme: 'nord' }`。
- v2 breaking change：Shiki transformers 如 `transformerNotationHighlight` 用于代码块注释高亮：```mdx ```js // [!code highlight] console.log('Highlighted') ````.

#### 4. **搜索配置（Search Config）**
全文搜索基于 FlexSearch，开箱即用。

| 配置选项 | 类型 | 默认值 | 描述 | 示例 |
|----------|------|--------|------|------|
| `search` | `object` | `{ maxResult: 10 }` | 搜索选项。 | ```search: {  searchHooks: path.join(__dirname, 'searchHooks.ts'),  versioned: true, // 多版本独立索引}``` |

**知识点**：
- 无需配置即可使用。`searchHooks` 自定义钩子（如过滤结果）。
- 多版本时，`versioned: true` 为每个版本创建独立索引，仅搜索当前版本。

#### 5. **构建配置（Build Config）**
底层基于 Rsbuild/Rspack。

| 配置选项 | 类型 | 默认值 | 描述 | 示例 |
|----------|------|--------|------|------|
| `builder` | `'rspack' \| 'webpack'` | `'rspack'` | 构建工具。 | `builder: 'webpack'` |
| `rspack` / `webpack` | `object` | Rsbuild 默认 | Rspack/Webpack 配置。 | `rspack: { output: { chunkLoadingGlobal: 'myChunk' } }` |
| `builderPlugins` | `Array<Plugin>` | 内置插件（如 React、Less） | 自定义 Rsbuild 插件。覆盖内置如 `@rsbuild/plugin-less`。 | ```builderPlugins: [  pluginLess({ lessLoaderOptions: { lessOptions: { math: 'always' } } }),]``` |

**知识点**：
- 支持覆盖内置插件：React、Sass、Less。
- 调试：`DEBUG=rsbuild rspress build` 查看完整配置。
- 性能优化：Rspack 提供快速构建，支持 ESM/Tree Shaking。

#### 6. **多版本文档配置（Multi-Version Config）**
内置支持版本管理。

| 配置选项 | 类型 | 默认值 | 描述 | 示例 |
|----------|------|--------|------|------|
| `multiVersion` | `object` | `false` | 启用多版本。目录结构：`docs/v1/`、`docs/v2/`。 | ```multiVersion: {  versions: ['v1.0', 'v2.0'],  defaultVersion: 'v1.0',  basePath: '/en', // 版本前缀}``` |

**知识点**：
- 目录直觉：无需特殊结构，Rspress 自动检测版本文件夹。
- 搜索/侧边栏独立：每个版本有独立索引和配置。

#### 7. **插件配置（Plugins）**
扩展功能。

| 配置选项 | 类型 | 默认值 | 描述 | 示例 |
|----------|------|--------|------|------|
| `plugins` | `Array<Plugin>` | `[]` | Rspress 插件，如 `@rspress/plugin-typedoc`。 | ```plugins: [  ['@rspress/plugin-typedoc', { entry: ['src/index.ts'] }],]``` |

**知识点**：
- 插件示例：TypeDoc 自动生成 TS API 文档。
- 自定义插件：实现钩子如 `configure`、`afterBuild`。

#### 8. **其他高级配置**
- `tsconfig`: 集成 tsconfig.json，支持 `mdx.checkMdx: true` 检查 MDX 类型。
- `dev: { open: true }`: 开发服务器自动打开浏览器。
- `sitemap`: 自动生成 sitemap.xml（需插件）。

**完整示例 rspress.config.ts**：
```ts
import { defineConfig } from 'rspress/config';
import path from 'path';

export default defineConfig({
  root: './site',
  docRoot: 'docs',
  theme: path.join(__dirname, 'theme'),
  themeConfig: {
    logo: 'logo.png',
    nav: [{ title: '首页', path: '/' }],
  },
  globalUIComponents: [
    [path.join(__dirname, 'components/GlobalUI.tsx'), { prop: 'value' }],
  ],
  markdown: {
    shiki: { theme: 'nord' },
  },
  search: { maxResult: 5 },
  multiVersion: { versions: ['v1', 'v2'] },
  builderPlugins: [
    pluginLess({ lessOptions: { math: 'always' } }),
  ],
});
```

**最佳实践**：
- 优先 `_meta.json` 配置侧边栏：`{ "title": "Guide", "order": 1, "collapsed": false }`。
- TS 支持：确保 tsconfig.json include `rspress.config.ts` 和 MDX。
- 升级注意：v2 调整 Markdown 配置，检查 breaking changes。

更多细节参考官方文档：https://rspress.dev/zh/api/config。 如需特定示例或更新，欢迎提供更多上下文！