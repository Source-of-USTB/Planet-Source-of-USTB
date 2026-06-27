import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export async function readJson<T>(path: string, fallback: T): Promise<T> {
    try {
        return JSON.parse(await readFile(path, "utf-8")) as T;
    } catch (e) {
        if (e instanceof Error && "code" in e && e.code === "ENOENT") {
            return fallback;
        }
        throw e;
    }
}

export async function writeJson(path: string, data: unknown): Promise<void> {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, JSON.stringify(data, null, 2));
}