import { createHash } from "node:crypto";

export function hash(s: string) {
    // 取sha256 hash的十六进制前16位
    return createHash("sha256").update(s).digest("hex").slice(0, 16);
}

export function normalizeLink(link: string) {
    // 没做 url 创建的 try catch, 有错误上层会跳过.
    const u = new URL(link);
    return u.host + u.pathname.replace(/\/+$/, "") + u.search;
}