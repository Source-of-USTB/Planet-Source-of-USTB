export type PostCountSnapshot = {
    date: string;
    total: number;
    counts: Record<string, number>;
};