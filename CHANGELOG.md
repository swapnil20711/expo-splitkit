# Changelog

All notable changes to `expo-splitkit` are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org/).

## [0.3.0] - 2026-10-15

### Added

- **Docs site** at [swapnil20711.github.io/expo-splitkit](https://swapnil20711.github.io/expo-splitkit/), with guides for bucketing, feature flags, gradual rollouts and exposure tracking, plus a full API reference.
- **Live web demo.** The example app now runs in the browser and is embedded in the docs at [/demo](https://swapnil20711.github.io/expo-splitkit/demo).
- Analytics recipes for `onExposure` with PostHog, Mixpanel, Segment and Firebase.
- "Why not GrowthBook, Statsig or LaunchDarkly?" comparison in the README and docs.

### Changed

- `SplitKitTestingProvider` is renamed to **`SplitKitProvider`**, and `SplitKitTestingProviderProps` to `SplitKitProviderProps`.
- The GitHub repository is renamed from `splitkit` to `expo-splitkit` to match the npm package. Old URLs redirect.

### Deprecated

- `SplitKitTestingProvider` and `SplitKitTestingProviderProps` still work as aliases but will be removed in 1.0. To migrate, rename the import:

  ```diff
  - import { SplitKitTestingProvider } from 'expo-splitkit';
  + import { SplitKitProvider } from 'expo-splitkit';
  ```

### Fixed

- Web: `getDeviceId()` no longer throws when `localStorage` is unavailable (private browsing, blocked storage, sandboxed iframes). It falls back to an id that lasts for the page session.
- README: corrected the example value of `getBucketScore('user-123', 'onboarding_v2')` to `0.7502…`.

## [0.2.1] - 2026-08-23

### Added

- Six-panel example app that shows determinism, bucket scores, split distribution and exposure deduplication.
- Demo GIF in the README.

### Fixed

- The npm package now ships only the library files (`build`, `src`, native code and module config) via a `files` whitelist, so IDE caches and local Android config are no longer published.
- The example app resolves `expo-splitkit` by its published name, so its imports match what consumers write.

## [0.2.0] - 2026-08-16

### Changed

- `murmur3_32` hashes strings as UTF-8 bytes, matching the canonical MurmurHash3 (x86, 32-bit) reference in any language. ASCII ids hash the same as before; **non-ASCII user ids are rebucketed once**.
- `getBucketScore` divides by 2³² so scores fall in a true `[0, 1)` range.

### Fixed

- Users whose score lands above the total weight (from floating-point rounding) now get the last variant instead of `fallback`, so nobody silently drops out of an experiment.
- `useExperiment` calls all hooks unconditionally, following the Rules of Hooks.
- Exposure events report the same id used for bucketing, so anonymous users log their device id instead of `undefined`.

### Added

- Development warning when variant weights are negative, empty, or don't sum to 1.0.

## [0.1.3] - 2026-08-16

### Changed

- Lowercase npm keywords for better search ranking.

## [0.1.2] - 2026-08-16

### Changed

- Expanded npm keywords.

## [0.1.1] - 2026-08-15

### Added

- First release as `expo-splitkit`: deterministic MurmurHash3 bucketing, `SplitKitTestingProvider`, `useExperiment`, `evaluateExperiment`, native `getDeviceId()` for iOS, Android and web, typed payloads, targeting rules and deduplicated exposure tracking.

[0.3.0]: https://github.com/swapnil20711/expo-splitkit/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/swapnil20711/expo-splitkit/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/swapnil20711/expo-splitkit/compare/v0.1.3...v0.2.0
[0.1.3]: https://github.com/swapnil20711/expo-splitkit/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/swapnil20711/expo-splitkit/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/swapnil20711/expo-splitkit/releases/tag/v0.1.1
