import Parser from "rss-parser";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { members } from "../src/data/members";
import type { FeedStatus, Post } from "../src/type/feed";
import { readJson, writeJson } from "../src/utils/json";
import { toDayKey, toMonthKey, toYearKey } from "../src/utils/date";

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

function extractDate(item: Parser.Item): string | null {
    // rss 2.0采用pubDate, Atom采用isoDate.
    const rawDate = item.isoDate?.trim() || item.pubDate?.trim();
    if (!rawDate) return null;

    const date = new Date(rawDate);

    return Number.isNaN(date.getTime())
        ? null
        : date.toISOString();
}


const targetPath = "src/data/generated";
const oldPosts = await readJson<Post[]>(join(targetPath, "posts.json"), []);
const postMap = new Map(oldPosts.map((post) => [post.id, post]));
const status: FeedStatus[] = [];
const fetchedAt = new Date().toISOString();

for (const member of members) {
    try {
        const feed = await parser.parseURL(member.feed);

        for (const item of feed.items) {
            const title = item.title?.trim();
            const link = item.link?.trim();
            if (!title || !link) continue;

            const id = hash(link);
            if (postMap.has(id)) continue;

            const publishedAt = extractDate(item);
            const dateKey = publishedAt ? toDayKey(publishedAt) : null;
            const monthKey = publishedAt ? toMonthKey(publishedAt) : null;
            const yearKey = publishedAt ? toYearKey(publishedAt) : null;

            const newPost: Post = {
                id,
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
            };
            postMap.set(id, newPost);
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

const newPosts = [...postMap.values()].sort((a, b) => {
    const ta = a.publishedAt ? Date.parse(a.publishedAt) : 0;
    const tb = b.publishedAt ? Date.parse(b.publishedAt) : 0;
    return tb - ta;
});

await writeJson(join(targetPath, "posts.json"), newPosts);

await writeJson(join(targetPath, "feed-status.json"), status);

console.log(`Fetched ${newPosts.length - oldPosts.length} posts from ${members.length} feeds.`);

process.exit(0);