# API

## `<SplitKitProvider />`

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `user` | `UserContext` | yes | The subject being bucketed. If `user.id` is falsy, the native device ID is used instead. |
| `experiments` | `Record<string, Experiment>` | yes | Experiment config, keyed by experiment key. |
| `onExposure` | `ExposureCallback` | no | Fired the first time a user is exposed to a given experiment/variant pair. |
| `children` | `ReactNode` | yes | |

`SplitKitTestingProvider` is a deprecated alias for this component.

## `useExperiment<T>(experimentKey, fallbackVariant?)`

Returns `{ variant: string; payload?: T; deviceId: string }`.

```tsx
const { variant, payload, deviceId } = useExperiment<MyPayload>('checkout_button', 'control');
```

- `fallbackVariant` defaults to `'control'` and is only used when the hook is called outside a provider or the key isn't in `experiments`.
- Calling the hook logs an exposure (once per `userId:experimentKey:variant`) via `onExposure`.
- Used outside a provider it degrades gracefully: it returns the fallback variant and an empty `deviceId` rather than throwing.

## `getDeviceId(): string`

Synchronously returns a stable per-install device identifier.

| Platform | Source |
| --- | --- |
| iOS | `UIDevice.identifierForVendor`, falling back to a UUID in `UserDefaults` |
| Android | `Settings.Secure.ANDROID_ID`, falling back to a UUID in `SharedPreferences` |
| Web | UUID stored in `localStorage` (in memory for the session if storage is blocked) |

## `evaluateExperiment<T>(experiment, user)`

The pure bucketing function behind the hook. Useful in tests, scripts, or non-React code.

```ts
import { evaluateExperiment } from 'expo-splitkit';

evaluateExperiment(EXPERIMENTS.onboarding_v2, { id: 'user-123' });
// => { variant: 'quick_swipe', payload: { title: '3-Step Swipe Walkthrough' } }
```

## `murmur3_32(key, seed?)` / `getBucketScore(userId, experimentKey)`

The hashing primitives. `getBucketScore` returns a stable float in `[0, 1)` for a user/experiment pair, handy for verifying your split distribution offline.

```ts
getBucketScore('user-123', 'onboarding_v2'); // => 0.7502…
```

## Types

```ts
interface Variant<T = any> {
  name: string;
  weight: number; // 0.0–1.0; weights should sum to 1.0 per experiment
  payload?: T;
}

interface Experiment<T = any> {
  key: string;
  variants: Variant<T>[];
  fallback: string; // variant name used when disabled/untargeted
  enabled?: boolean; // set false to force the fallback
  targetingRules?: (attributes: Record<string, any>) => boolean;
}

interface UserContext {
  id: string;
  attributes?: Record<string, any>;
}

type ExposureCallback = (event: {
  experimentKey: string;
  variant: string;
  userId: string;
  timestamp: number;
}) => void;
```
