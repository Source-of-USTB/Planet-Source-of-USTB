import { join } from "node:path";
import type { Post } from "../src/type/feed";
import type { LinkAuditCandidate, LinkAuditResult } from "../src/type/link-audit";
import { readJson, writeJson } from "../src/utils/json";

const postsPath = join("src/data/generated", "posts.json");
const reviewPath = join("data/review", "link-check.json");

const CONCURRENCY = 5;   // 同时检测几个链接, 太大容易被对面网站当成攻击
const TIMEOUT_MS = 10000;

// 通用并发函数
async function mapWithConcurrency<T, R>(
    items: T[],
    limit: number,
    fn: (item: T) => Promise<R>,
): Promise<R[]> {
    const results: R[] = new Array(items.length);
    let nextIndex = 0;

    async function worker() {
        while (nextIndex < items.length) {
            const current = nextIndex++;
            results[current] = await fn(items[current]);
        }
    }

    await Promise.all(Array.from({ length: limit }, worker));
    return results;
}

async function checkLink(url: string): Promise<{
    checkResult: LinkAuditResult;
    statusCode?: number;
    errorMessage?: string;
}> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        const res = await fetch(url, {
            method: "GET",
            redirect: "follow",
            signal: controller.signal,
            headers: { "User-Agent": "planet-rss-aggregator/0.1 (link-check)" },
        });

        return res.status >= 400
            ? { checkResult: "http_error", statusCode: res.status }
            : { checkResult: "ok", statusCode: res.status };
    } catch (e) {
        if (e instanceof Error && e.name === "AbortError") {
            return { checkResult: "timeout", errorMessage: "请求超时" };
        }

        const code = (e as { cause?: { code?: string } })?.cause?.code;
        if (code === "ENOTFOUND" || code === "EAI_AGAIN") {
            return { checkResult: "dns_failure", errorMessage: code };
        }
        if (code?.startsWith("CERT_")) {
            return { checkResult: "tls_error", errorMessage: code };
        }

        return {
            checkResult: "unknown_error",
            errorMessage: e instanceof Error ? e.message : String(e),
        };
    } finally {
        clearTimeout(timer);
    }
}

function mergeCandidate(
    existing: LinkAuditCandidate | undefined,
    fresh: Omit<LinkAuditCandidate, "status" | "note">,
): LinkAuditCandidate | null {
    if (fresh.checkResult === "ok") {
        return null; // 链接现在好了, 不用管
    }

    // 原先有status就保留, 默认填pending, 原先由note也保留.
    return { ...fresh, status: existing?.status ?? "pending", note: existing?.note };
    // 等价于:
    // if (existing && existing.status !== "pending") {
    //     // 人工已经判断过, 保留判断, 只刷新检测细节
    //     return { ...fresh, status: existing.status, note: existing.note };
    // }

    // // 加问号防止仍然pending但是加上的note被去除
    // return { ...fresh, status: "pending", note: existing?.note };
}

const posts = await readJson<Post[]>(postsPath, []);
const existingCandidates = await readJson<LinkAuditCandidate[]>(reviewPath, []);
const existingMap = new Map(existingCandidates.map((c) => [c.id, c]));

const checkedAt = new Date().toISOString();

const merged = await mapWithConcurrency<Post, LinkAuditCandidate | null>(posts, CONCURRENCY,
    async (post) => {
        const result = await checkLink(post.link);
        return mergeCandidate(existingMap.get(post.id), {
            id: post.id,
            link: post.link,
            title: post.title,
            checkedAt,
            ...result,
        });
    });

const newCandidates = merged.filter((c): c is LinkAuditCandidate => c !== null);

await writeJson(reviewPath, newCandidates);

const pendingCount = newCandidates.filter((c) => c.status === "pending").length;
console.log(
    `Checked ${posts.length} links, ${newCandidates.length} flagged (${pendingCount} pending review).`,
);
