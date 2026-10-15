// Extends app.json. EXPO_BASE_URL lets the docs workflow serve the web build from
// a GitHub Pages subpath (e.g. /expo-splitkit/demo); unset, it serves from root.
module.exports = ({ config }) => ({
  ...config,
  web: { ...config.web, bundler: 'metro', output: 'single' },
  experiments: {
    ...config.experiments,
    ...(process.env.EXPO_BASE_URL ? { baseUrl: process.env.EXPO_BASE_URL } : {}),
  },
});
