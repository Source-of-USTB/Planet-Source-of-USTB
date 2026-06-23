import Parser from "rss-parser";
import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { members } from "../src/data/members";
import type { FeedStatus, Post } from "../src/type/feed";



const parser = new Parser({
    timeout: 10000,
    headers: {
        "User-Agent": "planet-rss-aggregator/0.1",
    },
});

function hash(s: string) {
    // 取sha256 hash的十六进制前16位
    return createHash("sha256").update(s).digest("hex").slice(0, 16);
}

function normalizeText(s = "") {
    return s.replace(/\s+/g, " ").trim();
}

function extractDate(item: Parser.Item) {
    // rss 2.0采用pubDate, Atom采用isoDate.
    if (item.isoDate) return new Date(item.isoDate);
    if (item.pubDate) return new Date(item.pubDate);
    return null;
}

const posts: Post[] = [];
const status: FeedStatus[] = [];
const fetchedAt = new Date().toISOString();

for (const member of members) {
    try {
        const feed = await parser.parseURL(member.feed); // 解析出xml

        for (const item of feed.items) {

            const title = item.title?.trim();
            const link = item.link?.trim();
            if (!title || !link) continue;

            const date = extractDate(item);
            const publishedAt =
                date && !Number.isNaN(date.getTime())
                    ? date.toISOString()
                    : null;

            const dateKey = publishedAt?.slice(0, 10) ?? null;
            const monthKey = publishedAt?.slice(0, 7) ?? null;
            const yearKey = publishedAt?.slice(0, 4) ?? null;

            const rawId =
                item.guid ||
                link ||
                `${member.id}:${title}:${publishedAt ?? ""}`;

            posts.push({
                id: hash(`${member.id}:${rawId}`),
                title,
                link,
                description: normalizeText(item.contentSnippet || item.content || item.summary || ""),
                publishedAt,
                dateKey,
                monthKey,
                yearKey,
                authorId: member.id,
                authorName: member.name,
                sourceFeed: member.feed,
            });
        }

        status.push({
            memberId: member.id,
            ok: true,
            count: feed.items.length,
            fetchedAt,
        });
    } catch (e) {
        status.push({
            memberId: member.id,
            ok: false,
            count: 0,
            error: e instanceof Error ? e.message : String(e),
            fetchedAt,
        });
    }
}

// ai的防御性编程, 防止出现重复.
const deduped = Array.from(
    new Map(posts.map((post) => [post.id, post])).values(),
);

deduped.sort((a, b) => {
    const ta = a.publishedAt ? Date.parse(a.publishedAt) : 0;
    const tb = b.publishedAt ? Date.parse(b.publishedAt) : 0;
    return tb - ta;
});

await mkdir("src/data/planet", { recursive: true });

await writeFile(
    "src/data/planet/posts.generated.json",
    JSON.stringify(deduped, null, 2),
);

await writeFile(
    "src/data/planet/feed-status.generated.json",
    JSON.stringify(status, null, 2),
);

console.log(`Fetched ${deduped.length} posts from ${members.length} feeds.`);