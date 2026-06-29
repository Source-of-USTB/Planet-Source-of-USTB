export function toDayKey(iso: string): string {
    return iso.slice(0, 10);
}

export function toMonthKey(iso: string): string {
    return iso.slice(0, 7);
}

export function toYearKey(iso: string): string {
    return iso.slice(0, 4);
}

const TIMEZONE_OFFSET_MS = 8 * 60 * 60 * 1000;

export function toLocalDayKey(iso: string): string {
    return toDayKey(new Date(new Date(iso).getTime() + TIMEZONE_OFFSET_MS).toISOString());
}