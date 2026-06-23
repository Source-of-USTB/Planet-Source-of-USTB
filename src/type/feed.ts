export type Post = {
    id: string;
    title: string;
    link: string;
    description: string;
    publishedAt: string | null;
    dateKey: string | null;
    monthKey: string | null;
    yearKey: string | null;
    authorId: string;
    authorName: string;
    sourceFeed: string;
};

export type FeedStatus = {
    memberId: string;
    ok: boolean;
    count: number;
    error?: string;
    fetchedAt: string;
};
