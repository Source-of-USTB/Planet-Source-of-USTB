export function todayKey(): string {
    return new Date().toISOString().slice(0, 10);
}