export type Member = {
    id: string;
    name: string;
    site: string;
    feed: string;
    avatar?: string;
    description?: string;
};

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
