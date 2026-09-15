// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";

const isPages = process.env.DEPLOY_TARGET === 'pages';

// https://astro.build/config
export default defineConfig({
    site: isPages
        ? "https://Source-of-USTB.github.io"
        : "https://planet.source-ustb.com",
    base: isPages ? "/Planet-Source-of-USTB/" : "/",
    integrations: [sitemap()],
});
