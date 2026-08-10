# ret2Byte.github.io

这是 ret2Byte 的个人博客仓库，已基于 [Mizuki](https://github.com/matsuzaka-yuki/Mizuki) 模板完成初始化。站点使用 Astro 构建，默认发布地址为：

https://ret2byte.github.io/

## 本地运行

```bash
corepack enable
pnpm install
pnpm dev
```

开发服务器默认运行在 `http://localhost:3000/`。

## 常用命令

```bash
pnpm dev       # 本地预览
pnpm build     # 构建静态站点
pnpm preview   # 预览 dist 构建结果
pnpm new-post  # 新建文章
```

## 写文章

文章放在 `src/content/posts/`，支持 Markdown 和 MDX。最小 frontmatter 示例：

```yaml
---
title: "文章标题"
published: 2026-08-10
description: "文章摘要"
tags: ["Blog"]
category: Notes
draft: false
---
```

模板自带的示例文章已保留在源码中，默认可以继续作为 Markdown、图片网格、Mermaid、加密文章等功能参考。

## 主要配置

- `src/config/siteConfig.ts`：站点名、URL、语言、主题色、横幅、功能页开关。
- `src/config/profileConfig.ts`：头像、昵称、简介、社交链接。
- `src/config/navBarConfig.ts`：顶部导航。
- `src/config/commentConfig.ts`：评论系统配置，当前默认关闭。
- `src/content/spec/about.md`：关于页内容。

## GitHub Pages 部署

仓库已包含 `.github/workflows/deploy.yml`。推送到 `main` 后，工作流会构建站点并发布到 GitHub Pages。

在 GitHub 仓库设置中，将 Pages 来源设置为 `GitHub Actions`。发布完成后访问：

https://ret2byte.github.io/

## 上游模板

- 模板仓库：[matsuzaka-yuki/Mizuki](https://github.com/matsuzaka-yuki/Mizuki)
- 中文说明：[README.zh.md](README.zh.md)
- 用户文档：[docs.mizuki.mysqil.com](https://docs.mizuki.mysqil.com/)
