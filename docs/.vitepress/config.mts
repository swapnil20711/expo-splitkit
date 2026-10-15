import { defineConfig } from 'vitepress';

// DOCS_BASE is set by the Pages workflow to "/<repo-name>/", so the site keeps
// working if the repository is renamed. Locally it serves from root.
const base = process.env.DOCS_BASE ?? '/';
const repo = 'https://github.com/swapnil20711/expo-splitkit';

export default defineConfig({
  base,
  title: 'SplitKit',
  description:
    'Deterministic A/B testing and feature flags for Expo & React Native. No backend, no network calls, no SDK keys.',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['meta', { property: 'og:title', content: 'SplitKit: offline A/B testing for Expo' }],
    [
      'meta',
      {
        property: 'og:description',
        content: 'Deterministic, zero-dependency A/B testing and feature flags for Expo & React Native.',
      },
    ],
  ],
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api' },
      { text: 'Live demo', link: '/demo' },
      { text: 'npm', link: 'https://www.npmjs.com/package/expo-splitkit' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting started', link: '/guide/getting-started' },
          { text: 'How bucketing works', link: '/guide/how-bucketing-works' },
          { text: 'Feature flags', link: '/guide/feature-flags' },
          { text: 'Exposure tracking', link: '/guide/exposure-tracking' },
          { text: 'Why SplitKit?', link: '/guide/why-splitkit' },
        ],
      },
      { text: 'Reference', items: [{ text: 'API', link: '/api' }] },
      { text: 'Try it', items: [{ text: 'Live demo', link: '/demo' }] },
    ],
    socialLinks: [{ icon: 'github', link: repo }],
    editLink: { pattern: `${repo}/edit/main/docs/:path`, text: 'Edit this page on GitHub' },
    search: { provider: 'local' },
    footer: { message: 'Released under the MIT License.' },
  },
});
