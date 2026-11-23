import { evaluateExperiment, getBucketScore, murmur3_32 } from '../index';
import type { Experiment } from '../index';

describe('murmur3_32', () => {
  // Reference values from the canonical MurmurHash3_x86_32 implementation.
  it.each([
    ['', 0, 0],
    ['', 1, 0x514e28b7],
    ['hello', 0, 0x248bfa47],
    ['The quick brown fox jumps over the lazy dog', 0, 0x2e4ff723],
  ])('hashes %j with seed %i', (input, seed, expected) => {
    expect(murmur3_32(input, seed)).toBe(expected);
  });

  it('hashes strings as UTF-8, matching the byte form', () => {
    const bytes = new Uint8Array([0xc3, 0xa9]); // "é"
    expect(murmur3_32('é')).toBe(murmur3_32(bytes));
  });
});

describe('getBucketScore', () => {
  it('is stable and in [0, 1)', () => {
    const score = getBucketScore('user-123', 'onboarding_v2');
    expect(score).toBeCloseTo(0.7502694826, 9);
    expect(getBucketScore('user-123', 'onboarding_v2')).toBe(score);
  });

  it('re-randomizes per experiment key', () => {
    expect(getBucketScore('user-123', 'a')).not.toBe(getBucketScore('user-123', 'b'));
  });
});

describe('evaluateExperiment', () => {
  const experiment: Experiment<{ title: string }> = {
    key: 'onboarding_v2',
    fallback: 'video_intro',
    variants: [
      { name: 'video_intro', weight: 0.5, payload: { title: 'Video' } },
      { name: 'quick_swipe', weight: 0.5, payload: { title: 'Swipe' } },
    ],
  };

  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('assigns by bucket score and returns the payload', () => {
    expect(evaluateExperiment(experiment, { id: 'user-123' })).toEqual({
      variant: 'quick_swipe',
      payload: { title: 'Swipe' },
    });
  });

  it('returns the fallback when disabled', () => {
    expect(evaluateExperiment({ ...experiment, enabled: false }, { id: 'user-123' })).toEqual({
      variant: 'video_intro',
    });
  });

  it('returns the fallback when targeting rules fail', () => {
    const targeted = { ...experiment, targetingRules: (a: Record<string, any>) => a.plan === 'pro' };
    expect(evaluateExperiment(targeted, { id: 'user-123', attributes: { plan: 'free' } }).variant).toBe(
      'video_intro'
    );
    expect(evaluateExperiment(targeted, { id: 'user-123', attributes: { plan: 'pro' } }).variant).toBe(
      'quick_swipe'
    );
  });

  it('returns the fallback when there are no variants', () => {
    expect(evaluateExperiment({ ...experiment, key: 'empty', variants: [] }, { id: 'u' })).toEqual({
      variant: 'video_intro',
    });
  });

  it('puts users past an under-weighted total in the last variant', () => {
    const underweight: Experiment = {
      key: 'underweight',
      fallback: 'fb',
      variants: [
        { name: 'a', weight: 0.1 },
        { name: 'b', weight: 0.1 },
      ],
    };
    const id = Array.from({ length: 1000 }, (_, i) => `u${i}`).find(
      (u) => getBucketScore(u, 'underweight') >= 0.2
    )!;
    expect(evaluateExperiment(underweight, { id }).variant).toBe('b');
  });

  it('splits traffic close to the configured weights', () => {
    const counts: Record<string, number> = {};
    for (let i = 0; i < 10000; i++) {
      const { variant } = evaluateExperiment(experiment, { id: `user-${i}` });
      counts[variant] = (counts[variant] ?? 0) + 1;
    }
    expect(counts.quick_swipe / 10000).toBeGreaterThan(0.48);
    expect(counts.quick_swipe / 10000).toBeLessThan(0.52);
  });
});
