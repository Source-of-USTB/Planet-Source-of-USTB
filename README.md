# Planet Source-of-USTB

[Chinese](./README.zh-CN.md)

RSS-based blog aggregation site for Source of USTB members.

[Click here to visit](https://source-of-ustb.github.io/Planet-Source-of-USTB/).

The site does not crawl article content. It only reads member RSS feeds and shows basic post metadata:

- title
- link
- description
- publish date
- author

## Add a member

Edit `src/data/members.ts`:

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

Put avatar files in:

```txt
public/avatars/
```

Notes: 

- `id` is a stable identifier used by generated data and post ownership. Do not change it casually.
- `name` is only for display and can be changed.
- The RSS feed should provide `title`, `link`, `description`, and `pubDate` for each post.

## Structure

```txt
src/data/members.ts          # member source config
src/data/generated/          # generated data
scripts/build-member-map.ts  # build member map
scripts/fetch-feeds.ts       # fetch RSS feeds
src/pages/index.astro        # blog timeline
src/pages/members.astro      # member list
src/pages/about.astro        # about page
```

## Development

```bash
npm install
npm run build:data
npm run dev
```

## Build

```bash
npm run build
```

`npm run build` will generate data first, then build the Astro site.

## Deploy

GitHub Actions deploys the site to GitHub Pages on:

- manual workflow dispatch
- weekly scheduled run
