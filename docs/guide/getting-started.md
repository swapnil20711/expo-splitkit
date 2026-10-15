# Getting started

## Installation

```bash
npx expo install expo-splitkit
```

SplitKit is a native module, so Expo Go won't pick it up. Rebuild your native project:

```bash
npx expo prebuild
npx expo run:ios     # or: npx expo run:android
```

Supported platforms: iOS, Android, and Web.

## Quick start

Wrap your app in a provider, declare your experiments, and read the assigned variant with a hook.

```tsx
// App.tsx
import { SplitKitProvider, getDeviceId } from 'expo-splitkit';
import OnboardingScreen from './OnboardingScreen';

const EXPERIMENTS = {
  onboarding_v2: {
    key: 'onboarding_v2',
    variants: [
      { name: 'video_intro', weight: 0.5, payload: { title: 'Watch Intro Video' } },
      { name: 'quick_swipe', weight: 0.5, payload: { title: '3-Step Swipe Walkthrough' } },
    ],
    fallback: 'video_intro',
  },
};

export default function App() {
  return (
    <SplitKitProvider
      user={{ id: getDeviceId() }}
      experiments={EXPERIMENTS}
      onExposure={(event) => {
        analytics.track('experiment_exposure', event);
      }}>
      <OnboardingScreen />
    </SplitKitProvider>
  );
}
```

```tsx
// OnboardingScreen.tsx
import { useExperiment } from 'expo-splitkit';

type Payload = { title: string };

export default function OnboardingScreen() {
  const { variant, payload } = useExperiment<Payload>('onboarding_v2');

  if (variant === 'quick_swipe') {
    return <SwipeWalkthrough title={payload?.title} />;
  }
  return <VideoIntro title={payload?.title} />;
}
```

The variant is available on the very first render. There's no loading state to handle, because nothing is fetched.

## Choosing a user id

- **Signed-in users:** pass your own account id so the user sees the same variant on every device.
- **Anonymous users:** pass `getDeviceId()`, or leave `user.id` empty and SplitKit falls back to the device id automatically.

::: tip Upgrading from 0.2
`SplitKitTestingProvider` was renamed to `SplitKitProvider`. The old name still works as a deprecated alias and will be removed in 1.0.
:::

## Next steps

- [How bucketing works](./how-bucketing-works): what keeps assignments stable, and what reshuffles them
- [Feature flags](./feature-flags): gradual rollouts and targeting
- [Exposure tracking](./exposure-tracking): wiring up your analytics
- [Live demo](/demo): try it in your browser
