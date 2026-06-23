export type Member = {
    id: string;
    name: string;
    site: string;
    feed: string;
    avatar?: string;
    description?: string;
};

export type MemberMapItem = {
    name: string;
    site: string;
    feed: string;
    avatar: string;
    description: string;
};

export type MemberMap = Record<string, MemberMapItem>;