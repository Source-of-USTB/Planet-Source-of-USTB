import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { Post } from "../src/type/feed";
import { members } from "../src/data/members";

type PostCountSnapshot = {
    date: string;
    total: number;
    counts: Record<string, number>;
};

const targetPath = "src/data/generated";

async function readJson<T>(path: string, fallback: T): Promise<T> {
    try {
        return JSON.parse(await readFile(path, "utf-8")) as T;
    } catch (e) {
        if (e instanceof Error && "code" in e && e.code === "ENOENT") {
            return fallback;
        }
        throw e;
    }
}

function countPosts(posts: Post[]) {
    const counts: Record<string, number> = Object.fromEntries(
        members.map((member) => [member.id, 0]),
    );

    for (const post of posts) {
        counts[post.authorId] = (counts[post.authorId] ?? 0) + 1;
    }

    return counts;
}

function todayKey() {
    return new Date().toISOString().slice(0, 10);
}

const posts = await readJson<Post[]>(join(targetPath, "posts.json"), []);

const snapshots = await readJson<PostCountSnapshot[]>(
    join(targetPath, "post-counts.json"),
    [],
);

const snapshot: PostCountSnapshot = {
    date: todayKey(),
    total: posts.length,
    counts: countPosts(posts),
};

snapshots.push(snapshot);

await writeFile(
    join(targetPath, "post-counts.json"),
    JSON.stringify(snapshots, null, 2),
);