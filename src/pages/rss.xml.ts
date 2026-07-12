import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import posts from "../data/generated/posts.json";
import type { Post } from "../type/feed";

export function GET(context: APIContext) {
    const typedPosts = posts as Post[];

    return rss({
        title: "Planet Source-of-USTB",
        description: "A blog aggregation page for Source-of-USTB's members.",
        site: new URL(import.meta.env.BASE_URL, context.site).href,
        items: typedPosts.map((post) => ({
            title: post.title,
            link: post.link,
            description: post.description,
            pubDate: post.publishedAt ? new Date(post.publishedAt) : undefined,
            author: post.authorName,
        })),
    });
}