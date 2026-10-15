# Exposure tracking

`onExposure` fires once per unique `userId:experimentKey:variant` for the lifetime of the provider, so you can point it straight at an analytics sink without worrying about duplicate events on re-render.

```tsx
<SplitKitProvider
  user={{ id: userId }}
  experiments={EXPERIMENTS}
  onExposure={({ experimentKey, variant, userId, timestamp }) => {
    amplitude.track('$exposure', { experiment: experimentKey, variant, userId, timestamp });
  }}>
```

An exposure is logged when `useExperiment` is called for an experiment, so put the hook in the component that actually shows the difference. That way only users who saw the variant are counted.

Dedupe state lives in a ref, so it resets when the provider unmounts (typically an app restart).

## Event shape

```ts
type ExposureCallback = (event: {
  experimentKey: string;
  variant: string;
  userId: string; // the id used for bucketing, including the device-id fallback
  timestamp: number;
}) => void;
```

## Analytics recipes

::: code-group

```ts [PostHog]
onExposure={({ experimentKey, variant }) => {
  posthog.capture('$feature_flag_called', {
    $feature_flag: experimentKey,
    $feature_flag_response: variant,
  });
}}
```

```ts [Mixpanel]
onExposure={({ experimentKey, variant }) => {
  mixpanel.track('$experiment_started', {
    'Experiment name': experimentKey,
    'Variant name': variant,
  });
}}
```

```ts [Segment]
onExposure={({ experimentKey, variant }) => {
  analytics.track('Experiment Viewed', {
    experiment_id: experimentKey,
    variation_id: variant,
  });
}}
```

```ts [Firebase]
onExposure={({ experimentKey, variant }) => {
  analytics().logEvent('experiment_exposure', {
    experiment: experimentKey,
    variant,
  });
}}
```

:::
