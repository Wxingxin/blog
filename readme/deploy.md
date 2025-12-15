


#

# 💯💯💯
可以，总结成一句话就是：

> **本地 `npm run build` → 把静态文件部署到 GitHub Pages（分支 / 路径要配合 `base`） → 用 GitHub Actions 或 Pages 设置自动部署。**

我给你一个**标准 Rspress → GitHub Pages 部署流程**，你可以照着做一遍。

---

## 0. 先搞清楚你是哪种仓库形式

GitHub Pages 有两种常见情况：

1. **用户主页仓库**：`yourname/yourname.github.io`
   访问地址：`https://yourname.github.io/`
2. **普通项目仓库**：`yourname/your-rspress-site`
   访问地址：`https://yourname.github.io/your-rspress-site/`

> 这两种区别的核心就是：**第二种要设置 `base` 前缀**。([rspress.rs][1])

---

## 1. 配置 `rspress.config.ts` 的 `base`

### 情况 A：用户主页仓库（`yourname.github.io`）

* 最终访问是：`https://yourname.github.io/`
* **`base` 保持默认 `/` 就行**：

```ts
import { defineConfig } from 'rspress/config';

export default defineConfig({
  base: '/',           // 默认就是这个，可以不写
  title: '我的BLOG网站',
});
```

### 情况 B：普通项目仓库（推荐你现在大概率是这个）

比如：

* 仓库：`yourname/rspress-blog`
* Pages 地址一般是：`https://yourname.github.io/rspress-blog/`

那就要：

```ts
import { defineConfig } from 'rspress/config';

export default defineConfig({
  base: '/rspress-blog/',   // 注意前后都有斜杠
  title: '我的BLOG网站',
});
```

`base` 的规则：

> 部署到 `https://foo.github.io/bar/`，就设 `base: '/bar/'`。([rspress.rs][1])

---

## 2. 添加 GitHub Actions 工作流（官方推荐方式）

Rspress 官方文档直接给了一个现成的 Actions 模板，用的是 **GitHub Pages + Actions** 部署。([rspress.rs][2])

在你的项目根目录创建文件：
**`.github/workflows/deploy.yml`**

内容如下（直接复制即可）：

```yml
name: Deploy Rspress site to Pages

on:
  push:
    branches: [main]   # 或者你用的是 master 就写 master

  workflow_dispatch:    # 手动触发

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: doc_build    # Rspress 默认输出目录是 doc_build :contentReference[oaicite:3]{index=3}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

关键点：

* `npm run build` 会生成静态站点到 `doc_build/` 目录 ([rspress.rs][3])
* 我们用 `upload-pages-artifact` 把 `doc_build` 传给 `deploy-pages`，GitHub 会自动托管到 Pages。

---

## 3. 在 GitHub 仓库里启用 Pages

1. 打开你的 GitHub 仓库
2. 进入 **Settings → Pages**
3. 在 **Source** 选择：**GitHub Actions**（而不是 `branch`）([rspress.rs][2])
4. 保存

之后只要：

* 往 `main` 分支 push 代码，就会自动触发部署
* 你也可以在 **Actions** 页手动点这个 workflow 的「Run workflow」

部署完成后，GitHub Pages 页面会显示访问地址，比如：

* `https://yourname.github.io/`
  或
* `https://yourname.github.io/rspress-blog/`

---

## 4. 本地能不能先预览一下？

可以，正常流程就是：

```bash
# 安装依赖
npm install

# 开发模式（本地调试）
npm run dev

# 生产构建
npm run build

# （可选）本地静态服务预览 doc_build
npx serve doc_build
# 或者用你喜欢的静态服务器
```

确认 `doc_build` 里生成的站点没问题，再走 GitHub Actions 部署。

---

## 5. 常见坑提醒一下

1. **`base` 没配对**

   * 本地用 `/`，部署后路径变成 `/项目名/`，就会出现：CSS 丢失、路由 404
   * 记得：**项目仓库 = 必须设 base 为 `'/仓库名/'`**

2. **把 Pages 设成了 `gh-pages` 分支但 YAML 又是 Actions 模式**

   * 现在推荐你直接用「Source: GitHub Actions」

3. **忘记把 `doc_build` 写进 workflow**

   * path 要写 `doc_build`，别写成 `dist`，Rspress 默认就是 `doc_build` ([rspress.rs][3])

---

## 6. 想更自动一点：用插件一键部署（进阶）

社区有个现成插件 `rspress-plugin-gh-pages`，可以一键把 `doc_build` 推到 `gh-pages` 分支。([GitHub][4])

大致思路是：

* 安装插件
* 在 `rspress.config.ts` 里挂上这个插件
* 在 GitHub 上设置 Pages 来源为 `gh-pages` 分支

如果你想走插件方案而不是 Actions，我也可以帮你把整套配置脚本写好。

---

如果你告诉我：

* 你的仓库名，比如 `recallwei/rspress-starter`
* 你想最终访问地址长啥样（根域名还是子路径）

我可以直接按你的仓库，帮你写一份**完全定制好的 `rspress.config.ts + deploy.yml`**，粘贴就能用那种。

[1]: https://rspress.rs/api/config/config-basic?utm_source=chatgpt.com "Basic config"
[2]: https://rspress.rs/guide/basic/deploy?utm_source=chatgpt.com "Deployment"
[3]: https://rspress.rs/guide/basic/ssg?utm_source=chatgpt.com "Static site generation"
[4]: https://github.com/linbudu599/rspress-plugins?utm_source=chatgpt.com "rspack-contrib/rspress-plugins"


# 💯💯💯
好，既然仓库是 **`Wxingxin/blog`**，而且你说的是 **普通项目仓库**，那我直接给你从 0 → 1 的「完全配置版教程」，你照着干就能部署成功。

最终访问地址会是：

> 🟢 `https://wxingxin.github.io/blog/`

---

## 第一步：配置 `rspress.config.ts`

因为是普通项目仓库，**必须设置 `base` 为仓库名 `/blog/`**。

打开你项目根目录下的 `rspress.config.ts`，确认里边至少有：

```ts
import { defineConfig } from 'rspress/config';

export default defineConfig({
  // 文档根目录，如果你用的是 docs 就保持默认
  // root: 'docs',

  // ⭐⭐ 一定要加这一行 ⭐⭐
  base: '/blog/',

  title: '我的BLOG网站',
  description: '一个学习前端的网站',
});
```

> 规则记一下：
> 部署到 `https://用户名.github.io/仓库名/`，就设置 `base: '/仓库名/'`，你就是 `'/blog/'`。

---

## 第二步：加 GitHub Actions 自动部署

在你的项目仓库中新建文件：

**`.github/workflows/deploy.yml`**

目录结构大概是：

```text
blog/
├── src/
├── docs/
├── rspress.config.ts
└── .github/
    └── workflows/
        └── deploy.yml
```

`deploy.yml` 内容直接用这一份（适配好 Rspress 和 GitHub Pages 的）：

```yml
name: Deploy Rspress site to GitHub Pages

on:
  push:
    branches: [main]     # ⚠ 如果你的默认分支是 master，就改成 master
  workflow_dispatch:      # 支持手动触发

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          # ⭐ Rspress 默认构建输出目录是 doc_build
          path: doc_build

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

注意两个点：

1. **分支名**：

   * 你的仓库默认分支如果是 `main` → 不用改
   * 如果是 `master` → 把 `branches: [main]` 改成 `branches: [master]`
2. **构建目录**：

   * Rspress 默认构建输出是 `doc_build`，所以 `path: doc_build` 一定不要乱改

---

## 第三步：在 GitHub 上启用 Pages（选 GitHub Actions）

1. 打开你的仓库：
   👉 `https://github.com/Wxingxin/blog`
2. 点击上方的 **Settings**
3. 左侧菜单里找到 **Pages**
4. 在 **Build and deployment → Source** 这里选：

   * ✅ **GitHub Actions**
5. 保存（如果有 Save/Apply 按钮）

这一步是告诉 GitHub：

> “这个项目的 Pages 站点交给 Actions workflow 管了。”

---

## 第四步：推代码触发部署

1. 在本地把刚刚改的文件加到 Git：

```bash
git add rspress.config.ts .github/workflows/deploy.yml
git commit -m "chore: setup rspress github pages deploy"
git push origin main   # 或 master，对应你的默认分支
```

2. 去 GitHub 仓库 → 选上面「Actions」标签页

   * 能看到 `Deploy Rspress site to GitHub Pages` 这个 workflow 在跑
   * 等它显示 ✅ 绿色成功（如果红了，点进去看 log）

3. 再回到 **Settings → Pages**

   * 下面会出现一个绿色的 ✅ 和访问链接，一般类似：

     * `https://wxingxin.github.io/blog/`

如果那时候打开链接 404，多等几十秒刷新一下，一般就是 CDN 缓存的问题。

---

## 第五步：本地调试也顺带说一下

以后你开发流程就是：

```bash
# 安装依赖（只需要一次）
npm install

# 本地开发
npm run dev

# 本地构建（看一下 doc_build 里是不是正常）
npm run build
```

`npm run build` 会生成 `doc_build/`，里面就是 GitHub Pages 上那一份静态站点的内容。

---

## 最后再帮你检查一遍「容易翻车的点」

* [x] **`base` 必须是 `'/blog/'`**
* [x] 仓库 Settings → Pages **Source 选择 GitHub Actions**
* [x] workflow 里的构建目录是 `doc_build` 而不是 `dist`
* [x] Actions 中的部署任务显示成功 ✅

如果你愿意，把你现在的 `rspress.config.ts` 贴出来，我可以帮你再过一眼，顺便帮你把导航路径也都改成适配 `/blog/` 的（有些场景需要加上 `base`，有些保持 `/` 就好，我可以帮你统一一遍）。


# 💯💯💯

这是 VS Code 在看到你创建了 `deploy.yml`（GitHub Actions 工作流文件）时自动弹出的提示：

> **Do you want to install the recommended "GitHub Actions" extension from GitHub?**
> （你要安装 GitHub 官方推荐的 GitHub Actions 扩展吗？）

### ✅ 简单回答：

**可以安装，也可以不安装，不影响部署。**

---

# ✔ 是否应该安装？

### ✔ 推荐安装（对你有帮助）

安装之后你会得到这些功能：

* YAML 语法高亮 + 自动补全
* 对 GitHub Actions 语法提供代码提示
* 展示每个 step 的可用字段
* 在编辑 workflow 时显示错误提示
* 方便查看 GitHub Actions 的 logs & 状态
* 更容易写复杂工作流（如部署、自动 CI 等）

尤其你在写 `.github/workflows/deploy.yml` 时会很方便。

---

### ✔ 不安装也完全不影响 Rspress 部署

GitHub Pages 是否成功部署 **只跟你 push 的 workflow 文件 & GitHub 后台执行有关**，
和你本地 VS Code 有没有安装扩展没有任何关系。

扩展只是一个“更好写 Actions 文件的工具”。

---

# ✔ 我建议你点：“Install”（安装）

因为：

* 它是 GitHub 官方的插件
* 不会影响你的系统
* 对写 Actions 很有用
* 部署调试更方便
* 以后你想写更多自动化（CI/CD、自动构建）也更顺手

---

# ✔ 如果你不想管这些工具，也可以点 “No”

不会影响 GitHub Pages 的部署。你 workflow 文件照样运行。

---

# 🔧 最后提醒你检查一遍你的 `deploy.yml`

你的仓库 `blog` 是普通项目仓库，你的 `deploy.yml` 路径应该是：

```
.github/workflows/deploy.yml
```

内容应包含：

* `path: doc_build`
* `branches: [main]`（或 master）
* `deploy-pages@v4`

如果你想，我可以：

### 🔍 帮你检查你的 `deploy.yml` 是否完美

或者

### 🧰 给你做一个“你的项目专属的一键部署配置包”

你可以随时把你的 `deploy.yml` 内容贴上来，我帮你验证。
