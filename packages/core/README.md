# splitkit-core

[![npm version](https://badgen.net/npm/v/splitkit-core)](https://www.npmjs.com/package/splitkit-core)
[![zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](./package.json)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

Deterministic A/B test bucketing and feature flags for **any JavaScript runtime**: Node, Next.js, Cloudflare Workers, Deno, Bun, browsers and React Native. No backend, no network calls, no SDK keys, zero dependencies.

This is the engine behind [`expo-splitkit`](https://www.npmjs.com/package/expo-splitkit). Use it on its own to bucket users on a server, or to compute the **same** assignment your Expo app shows, without calling the app.

```bash
npm install splitkit-core
```

## Usage

```ts
import { evaluateExperiment } from 'splitkit-core';

const onboarding = {
  key: 'onboarding_v2',
  variants: [
    { name: 'video_intro', weight: 0.5, payload: { title: 'Watch Intro Video' } },
    { name: 'quick_swipe', weight: 0.5, payload: { title: '3-Step Swipe Walkthrough' } },
  ],
  fallback: 'video_intro',
};

evaluateExperiment(onboarding, { id: 'user-123' });
// => { variant: 'quick_swipe', payload: { title: '3-Step Swipe Walkthrough' } }
```

The result is a pure function of the user id and the experiment config. Call it in an API route, a server component, a worker or a script, and you'll get the same variant every time, in every runtime, and the same one `expo-splitkit` shows on the device.

Feature flags are just two-variant experiments, with `enabled: false` or `targetingRules` for hard gating:

```ts
const newCheckout = {
  key: 'new_checkout',
  variants: [
    { name: 'off', weight: 0.9 },
    { name: 'on', weight: 0.1 }, // 10% rollout
  ],
  fallback: 'off',
  targetingRules: (attrs) => attrs.plan === 'pro',
};

evaluateExperiment(newCheckout, { id: userId, attributes: { plan: user.plan } }).variant === 'on';
```

## API

| Export | Description |
| --- | --- |
| `evaluateExperiment<T>(experiment, user)` | Returns `{ variant, payload? }` for a user. |
| `getBucketScore(userId, experimentKey)` | Stable score in `[0, 1)` for a user and experiment. |
| `murmur3_32(key, seed?)` | Canonical MurmurHash3 (x86, 32-bit) over UTF-8 bytes. |
| `Variant`, `Experiment`, `UserContext`, `ExposureCallback` | Types. |

Ships ESM and CommonJS with TypeScript types.

## How bucketing works

`murmur3_32("<userId>:<experimentKey>") / 2^32` gives a score in `[0, 1)`. The first variant whose cumulative weight exceeds the score wins. Because the hash is the canonical MurmurHash3 over UTF-8 bytes, a backend in any language can reproduce it. See [How bucketing works](https://swapnil20711.github.io/expo-splitkit/guide/how-bucketing-works) for the details.

## License

MIT
