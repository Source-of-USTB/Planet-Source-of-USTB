// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
    site: "https://Source-of-USTB.github.io",
    base: "/Planet-Source-of-USTB/",
    integrations: [sitemap()],
});
