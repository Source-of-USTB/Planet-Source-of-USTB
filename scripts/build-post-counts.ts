import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { Post } from "../src/type/feed";
import { members } from "../src/data/members";
import type { PostCountSnapshot } from "../src/type/post-count";
import { readJson, writeJson } from "../src/utils/json";
import { todayKey } from "../src/utils/date";

const targetPath = "src/data/generated";

function countPosts(posts: Post[]) {
    const counts: Record<string, number> = Object.fromEntries(
        members.map((member) => [member.id, 0]),
    );

    for (const post of posts) {
        counts[post.authorId] = (counts[post.authorId] ?? 0) + 1;
    }

    return counts;
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

await writeJson(join(targetPath, "post-counts.json"), snapshots);