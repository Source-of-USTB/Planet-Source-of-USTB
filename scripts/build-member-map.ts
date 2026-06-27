import { members } from "../src/data/members";
import type { MemberMapItem } from "../src/type/member";
import { writeJson } from "../src/utils/json";


const outputDir = "src/data/generated";
const outputFile = `${outputDir}/member-map.json`;
const defaultAvatar = "default.png";

const memberMap: Record<string, MemberMapItem> = {};

for (const member of members) {
    if (memberMap[member.id]) {
        throw new Error(`Duplicate member id: ${member.id}`);
    }

    memberMap[member.id] = {
        name: member.name,
        site: member.site,
        feed: member.feed,
        avatar: member.avatar ? `${member.avatar}` : defaultAvatar,
        description: member.description?.trim() || "No description",
    };
}

await writeJson(outputFile, memberMap);

console.log(`Generated ${outputFile}`);