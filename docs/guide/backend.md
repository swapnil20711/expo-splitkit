# Use on your backend

The bucketing engine ships on its own as [`splitkit-core`](https://www.npmjs.com/package/splitkit-core): no React, no native code, no dependencies. It runs anywhere JavaScript does: Node, Next.js, Cloudflare Workers, Deno, Bun and browsers.

```bash
npm install splitkit-core
```

`expo-splitkit` re-exports everything from `splitkit-core`, so the same function gives the same answer in your app and on your server.

## Share one experiment config

Put your experiments in a file both sides import, or copy the object. A variant depends only on the user id, the experiment `key` and the variant order and weights, so matching config means matching assignments.

```ts
// experiments.ts
import type { Experiment } from 'splitkit-core';

export const EXPERIMENTS: Record<string, Experiment> = {
  checkout_cta: {
    key: 'checkout_cta',
    variants: [
      { name: 'control', weight: 0.5 },
      { name: 'buy_now', weight: 0.5 },
    ],
    fallback: 'control',
  },
};
```

## Node / Express

```ts
import { evaluateExperiment } from 'splitkit-core';
import { EXPERIMENTS } from './experiments';

app.post('/checkout', (req, res) => {
  const { variant } = evaluateExperiment(EXPERIMENTS.checkout_cta, { id: req.user.id });
  // Same variant the app rendered for this user, with no call to the device.
  res.json({ discount: variant === 'buy_now' ? 0.1 : 0 });
});
```

## Next.js server component

Evaluating on the server means the right variant is in the first HTML response, so there's no flicker on hydration.

```tsx
import { evaluateExperiment } from 'splitkit-core';
import { EXPERIMENTS } from '@/experiments';

export default async function Page() {
  const user = await getUser();
  const { variant } = evaluateExperiment(EXPERIMENTS.checkout_cta, { id: user.id });
  return variant === 'buy_now' ? <BuyNowButton /> : <CheckoutButton />;
}
```

## Edge workers

```ts
import { evaluateExperiment } from 'splitkit-core';
import { EXPERIMENTS } from './experiments';

export default {
  async fetch(request: Request) {
    const userId = request.headers.get('x-user-id') ?? 'anonymous';
    const { variant } = evaluateExperiment(EXPERIMENTS.checkout_cta, { id: userId });
    return new Response(variant);
  },
};
```

## Anonymous users

For signed-out users, `expo-splitkit` buckets by the device ID from `getDeviceId()`. To match those assignments on the server, send that ID with your requests (a header works) and pass it as `user.id`.

## Other languages

`getBucketScore` is the canonical MurmurHash3 (x86, 32-bit) of the UTF-8 string `"<userId>:<experimentKey>"`, divided by 2³². Any murmur3 library reproduces it, so a Python or Go service can bucket users without JavaScript. See [How bucketing works](./how-bucketing-works).
