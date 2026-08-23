import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getBucketScore, type Variant } from 'expo-splitkit';
import { mono, theme, VARIANT_COLORS } from '../theme';
import { Panel } from './Panel';

const SAMPLE = 10_000;

export function DistributionPanel({
  experimentKey,
  variants,
}: {
  experimentKey: string;
  variants: Variant[];
}) {
  const [counts, setCounts] = useState<number[] | null>(null);
  const [elapsed, setElapsed] = useState(0);

  // 10k hashes is a few milliseconds, so this runs inline without blocking the
  // frame. It also proves the "microseconds per assignment" claim on-device.
  const run = () => {
    const started = Date.now();
    const tally = new Array(variants.length).fill(0);

    for (let i = 0; i < SAMPLE; i++) {
      const score = getBucketScore(`synthetic_user_${i}`, experimentKey);
      let cumulative = 0;
      for (let v = 0; v < variants.length; v++) {
        cumulative += variants[v].weight;
        if (score < cumulative) {
          tally[v]++;
          break;
        }
      }
    }

    setElapsed(Date.now() - started);
    setCounts(tally);
  };

  return (
    <Panel
      step={5}
      title="Is the split actually even?"
      caption={`Hashes ${SAMPLE.toLocaleString()} synthetic ids on this device and tallies where they land. Uniform distribution is what makes the results trustworthy.`}>
      <Pressable onPress={run} style={styles.button}>
        <Text style={styles.buttonText}>Simulate {SAMPLE.toLocaleString()} users</Text>
      </Pressable>

      {counts && (
        <View style={styles.results}>
          {variants.map((variant, i) => {
            const pct = (counts[i] / SAMPLE) * 100;
            return (
              <View key={variant.name} style={styles.bar}>
                <View style={styles.barHead}>
                  <Text style={styles.barName}>{variant.name}</Text>
                  <Text style={styles.barPct}>{pct.toFixed(2)}%</Text>
                </View>
                <View style={styles.barTrack}>
                  <View
                    style={{
                      width: `${pct}%`,
                      height: '100%',
                      borderRadius: 5,
                      backgroundColor: VARIANT_COLORS[i % VARIANT_COLORS.length],
                    }}
                  />
                </View>
                <Text style={styles.barTarget}>
                  target {Math.round(variant.weight * 100)}% · drift{' '}
                  {(pct - variant.weight * 100 >= 0 ? '+' : '') +
                    (pct - variant.weight * 100).toFixed(2)}
                  pt
                </Text>
              </View>
            );
          })}
          <Text style={styles.elapsed}>
            {SAMPLE.toLocaleString()} assignments in {elapsed}ms
          </Text>
        </View>
      )}
    </Panel>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.cardAlt,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: { color: theme.text, fontWeight: '600', fontSize: 15 },
  results: { marginTop: 20, gap: 18 },
  bar: {},
  barHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 7 },
  barName: { fontFamily: mono, fontSize: 13, color: theme.text },
  barPct: { fontFamily: mono, fontSize: 13, fontWeight: '700', color: theme.text },
  barTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.cardAlt,
    overflow: 'hidden',
  },
  barTarget: { fontFamily: mono, fontSize: 11, color: theme.dim, marginTop: 6 },
  elapsed: { fontFamily: mono, fontSize: 11, color: theme.green, marginTop: 2 },
});
