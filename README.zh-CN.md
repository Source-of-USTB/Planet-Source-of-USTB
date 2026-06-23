# Planet Source-of-USTB

[English](./README.md)

Source-of-USTB 成员博客聚合站。

站点地址：https://source-of-ustb.github.io/Planet-Source-of-USTB/

本项目不爬取文章正文，只读取成员 RSS，并展示基础文章元信息：

* 标题
* 链接
* 描述
* 发布时间
* 作者

## 添加成员

修改 `src/data/members.ts`：

```ts
{
  id: "example",
  name: "Example",
  site: "https://example.com",
  feed: "https://example.com/rss.xml",
  avatar: "example.webp",
  description: "Personal blog.",
}
```

头像文件放在：

```txt
public/avatars/
```

注意：

- `id` 是稳定标识，会用于生成数据和文章归属，不建议随意修改。
- `name` 只是展示名，可以调整。
- RSS 中每篇文章最好提供 `title`、`link`、`description` 和 `pubDate`。

## 项目结构

```txt
src/data/members.ts          # 成员源配置
src/data/generated/          # 生成数据
scripts/build-member-map.ts  # 生成成员映射
scripts/fetch-feeds.ts       # 拉取 RSS
src/pages/index.astro        # 博客时间线
src/pages/members.astro      # 成员列表
src/pages/about.astro        # 关于页面
```

## 本地开发

```bash
npm install
npm run build:data
npm run dev
```

## 构建

```bash
npm run build
```

`npm run build` 会先生成数据，然后构建 Astro 站点。

## 部署

GitHub Actions 会将站点部署到 GitHub Pages。

当前触发方式：

* 手动运行 workflow
* 每周定时运行
