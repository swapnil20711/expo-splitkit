---
layout: home

hero:
  name: SplitKit
  text: A/B testing that never leaves the device
  tagline: Deterministic experiments and feature flags for Expo & React Native. No backend, no network calls, no SDK keys.
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: Try the live demo
      link: /demo
    - theme: alt
      text: ⭐ Star on GitHub
      link: https://github.com/swapnil20711/expo-splitkit

features:
  - icon: 🎯
    title: Deterministic
    details: MurmurHash3 of userId:experimentKey. The same user gets the same variant on every launch, with nothing persisted.
  - icon: ✈️
    title: Offline-first
    details: Assignments resolve synchronously on the first render. Nothing to fetch, no loading state, works on a plane.
  - icon: 📦
    title: Zero runtime dependencies
    details: The whole engine is a hash function and a weighted range check. No vendor SDK in your bundle.
  - icon: 🔑
    title: No account, no SDK key
    details: Experiments are plain objects in your code, reviewed in PRs like everything else.
  - icon: 🧩
    title: Typed payloads
    details: Attach config to each variant and read it back type-safe from useExperiment.
  - icon: 📈
    title: Bring your own analytics
    details: Deduplicated exposure events you can send to PostHog, Amplitude, Mixpanel, Segment or your own backend.
---

## Install

```bash
npx expo install expo-splitkit
```

```tsx
const { variant, payload } = useExperiment<{ title: string }>('onboarding_v2');
```

![SplitKit demo: switching user ids and watching the bucket assignment change deterministically](/demo.gif)
