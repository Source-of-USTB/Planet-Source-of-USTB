import { join } from "node:path";
import type { Post } from "../src/type/feed";
import { STATUS_DOC, type LinkAuditCandidate, type LinkAuditFile } from "../src/type/link-audit";
import { readJson, writeJson } from "../src/utils/json";

const postsPath = join("src/data/generated", "posts.json");
const reviewPath = join("data/review", "link-audit.json");

// 预览, 省的直接删出问题
const isDryRun = process.argv.includes("--dry-run");

const posts = await readJson<Post[]>(postsPath, []);
const file = await readJson<LinkAuditFile>(reviewPath, { _statusValues: STATUS_DOC, candidates: [] });
const candidates = file.candidates as LinkAuditCandidate[];

const deadIds = new Set(
    candidates.filter((c) => c.status === "dead").map((c) => c.id),
);

if (deadIds.size === 0) {
    console.log("No confirmed dead links to clean. Nothing to do.");
} else {
    const removedPosts = posts.filter((post) => deadIds.has(post.id));
    const remainingPosts = posts.filter((post) => !deadIds.has(post.id));
    const remainingCandidates = candidates.filter((c) => !deadIds.has(c.id));

    console.log(`${isDryRun ? "[dry run] Would remove" : "Removing"} ${removedPosts.length} confirmed dead posts:`);
    for (const post of removedPosts) {
        console.log(`  - [${post.id}] (${post.link}) ${post.title}`);
    }

    if (!isDryRun) {
        await writeJson(postsPath, remainingPosts);
        await writeJson(reviewPath, {
            _statusValues: STATUS_DOC,
            candidates: remainingCandidates,
        });
        // await writeJson(reviewPath, remainingCandidates);
        console.log(`Done. ${remainingPosts.length} posts remain.`);
    }
}