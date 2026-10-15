# Why SplitKit?

Hosted experimentation platforms like GrowthBook, Statsig and LaunchDarkly are excellent, but they're a lot of machinery if all you want is to show half your users a different onboarding screen. SplitKit is the smallest thing that does that correctly.

| | **SplitKit** | GrowthBook | Statsig | LaunchDarkly |
| --- | :---: | :---: | :---: | :---: |
| Account or SDK key required | **No** | Yes | Yes | Yes |
| Network call to get assignments | **Never** | Fetches feature config | Yes, on initialize | Yes, on initialize |
| Variant ready on first render, offline, first launch | **Yes** | After config is cached | After values are cached | After flags are cached |
| Runtime dependencies | **0** | SDK | SDK | SDK |
| Cost | **Free, MIT** | Open source, free self-host or paid cloud | Free tier, then paid | Free dev tier, then paid |
| Experiments reviewed in PRs | **Yes, they're code** | Dashboard | Dashboard | Dashboard |
| Change a rollout without an app release | No | Yes | Yes | Yes |
| Results dashboard and stats engine | No, bring your own analytics | Yes | Yes | Yes |

## Use SplitKit when

- You want A/B tests or percentage rollouts without adding a vendor, an SDK key, or a network dependency.
- You need the variant on the very first frame, with no flicker or loading state, including on a first launch with no connection.
- You already have analytics (PostHog, Amplitude, Mixpanel, Segment, your own warehouse) and just need clean exposure events to join against.
- Privacy or compliance rules make sending user ids to another third party a hassle.

## Use a hosted platform when

- Product managers need to change rollouts or kill a feature from a dashboard **without shipping a release**.
- You want built-in statistical analysis, guardrail metrics and experiment reports.
- You run many concurrent experiments across teams and need governance around them.

Since bucketing is a plain MurmurHash3 of `userId:experimentKey`, starting with SplitKit doesn't lock you in. Your backend can recompute every assignment, and migrating later mostly means swapping the hook.
