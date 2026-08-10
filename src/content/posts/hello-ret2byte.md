---
title: "Hello, Byte"
published: 2026-08-10
description: "Byte 博客迁移到 Mizuki 模板后的第一篇记录。"
tags: ["Blog", "Mizuki"]
category: Notes
pinned: true
priority: 0
draft: false
---

新的博客骨架已经搭好。

这个仓库现在基于 Mizuki 模板运行，后续可以把安全研究、代码片段、工具链配置和学习记录都整理到这里。文章统一放在 `src/content/posts/`，图片可以放在同级目录或 `public/` 下。

接下来要做的事情很简单：

- 把旧文章迁移成 Markdown 或 MDX
- 按需要调整 `src/config/` 下的站点配置
- 推送到 GitHub 后让 Actions 自动发布到 GitHub Pages

先从这里开始。
