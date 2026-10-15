# How bucketing works

1. Compute `murmur3_32("<userId>:<experimentKey>")` and normalize it to a score in `[0, 1)`.
2. Walk the `variants` array, accumulating `weight`.
3. The first variant whose cumulative weight exceeds the score wins.

```ts
import { getBucketScore } from 'expo-splitkit';

getBucketScore('user-123', 'onboarding_v2'); // => 0.7502…
// With a 50/50 split, 0.7502 falls past the first variant's 0.5, so user-123 gets quick_swipe.
```

## Consequences worth knowing

- **Assignments are stable** as long as `userId` and `key` don't change. Nothing is persisted, so there's no cache to invalidate.
- **Order matters.** Reordering `variants` reshuffles who lands where. Append new variants at the end when you can.
- **Changing `key` reshuffles everyone.** That's the mechanism for a clean re-randomization.
- **Weights should sum to 1.0.** If they don't, the split is skewed, and SplitKit warns about it in development. Users above the total land in the *last* variant rather than `fallback`, so floating-point rounding never drops anyone out of an experiment.
- **Each experiment is independent** because the key is part of the hash input. A user in `variant_a` of one test isn't biased toward any variant of another.

## Same answer on your backend

Strings are hashed as UTF-8 bytes, and the implementation matches the canonical MurmurHash3 (x86, 32-bit) reference. A backend in any language can recompute the exact same bucket for a user without calling the app, which makes server-side analysis and joins straightforward.

## See it happen

The [live demo](/demo) hashes 10,000 synthetic ids in your browser and charts the actual distribution, so you can check the split for yourself.
