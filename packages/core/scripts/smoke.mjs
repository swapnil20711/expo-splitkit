// Loads the built package the way a Node consumer would, through its own
// `exports` map, in both module systems, and checks they agree with each other
// and with a known reference value.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const cjs = createRequire(import.meta.url)('splitkit-core');
const esm = await import('splitkit-core');

for (const [name, mod] of [['cjs', cjs], ['esm', esm]]) {
  // Canonical MurmurHash3 x86_32 test vector.
  assert.equal(mod.murmur3_32('hello'), 0x248bfa47, `${name}: murmur3_32`);
  assert.equal(mod.getBucketScore('user-123', 'onboarding_v2').toFixed(6), '0.750269', `${name}: getBucketScore`);
  const experiment = {
    key: 'onboarding_v2',
    fallback: 'a',
    variants: [{ name: 'a', weight: 0.5 }, { name: 'b', weight: 0.5, payload: { x: 1 } }],
  };
  assert.deepEqual(mod.evaluateExperiment(experiment, { id: 'user-123' }), { variant: 'b', payload: { x: 1 } }, `${name}: evaluateExperiment`);
}

console.log('splitkit-core: CJS and ESM builds load in Node and agree');
