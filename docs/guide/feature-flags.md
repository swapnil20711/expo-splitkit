# Feature flags

A flag is just a two-variant experiment. Use `enabled` or `targetingRules` for hard gating.

```ts
const EXPERIMENTS = {
  new_checkout: {
    key: 'new_checkout',
    variants: [
      { name: 'off', weight: 0.9 },
      { name: 'on', weight: 0.1 }, // 10% rollout
    ],
    fallback: 'off',
    targetingRules: (attrs) => attrs.plan === 'pro',
  },
};
```

```tsx
const { variant } = useExperiment('new_checkout', 'off');
return variant === 'on' ? <NewCheckout /> : <OldCheckout />;
```

Users who fail `targetingRules`, and everyone in an experiment with `enabled: false`, receive `fallback` and are never bucketed.

## Targeting

`targetingRules` receives `user.attributes` from the provider:

```tsx
<SplitKitProvider
  user={{ id: userId, attributes: { plan: 'pro', country: 'IN' } }}
  experiments={EXPERIMENTS}>
```

## Gradual rollouts

To widen a rollout without moving anyone who already has the feature, keep `on` where it is and shift weight from `off` to `on`. Because `off` comes first in the array, a user's score only has to be above the `off` weight to get `on`, so raising `on` from 10% to 50% only adds users:

```ts
variants: [
  { name: 'off', weight: 0.5 },
  { name: 'on', weight: 0.5 }, // was 0.1: everyone who had it still has it
],
```

::: warning
Changing weights mid-experiment changes which users are in which group. For a measured A/B test, fix the weights for the life of the experiment. For a rollout, only ever increase the last variant's share.
:::

## Kill switch

Set `enabled: false` to send everyone to `fallback`. Note that experiments live in your app code, so this needs a release. If you need instant remote kill switches, see [Why SplitKit?](./why-splitkit).
