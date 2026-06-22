export type Member = {
    id: string;
    name: string;
    site: string;
    feed: string;
    avatar?: string;
    description?: string;
};

export const members: Member[] = [
    {
        id: "Siriuns",
        name: "Siriuns",
        site: "https://siriuns.netlify.app",
        feed: "https://siriuns.netlify.app/rss.xml",
        // avatar: "/avatars/test.webp",
        description: "Siriuns",
    },
    {
        id: "wdlin",
        name: "wdlin",
        site: "https://wdlin233.github.io",
        feed: "https://wdlin233.github.io/rss.xml",
    }
];