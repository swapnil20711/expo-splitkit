import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Variant } from 'expo-splitkit';
import { mono, theme, VARIANT_COLORS } from '../theme';
import { Panel } from './Panel';

export const WEIGHT_PRESETS: { label: string; weights: number[] }[] = [
  { label: '50 / 50', weights: [0.5, 0.5] },
  { label: '70 / 30', weights: [0.7, 0.3] },
  { label: '90 / 10', weights: [0.9, 0.1] },
];

export function BucketMeter({
  score,
  variants,
  assigned,
  presetIndex,
  onPreset,
}: {
  score: number;
  variants: Variant[];
  assigned: string;
  presetIndex: number;
  onPreset: (index: number) => void;
}) {
  return (
    <Panel
      step={2}
      title="Where did that land?"
      caption="MurmurHash3 maps the id to a score in [0, 1). The bar is the weight ranges; the needle is this user.">
      <View style={styles.track}>
        {variants.map((variant, i) => (
          <View
            key={variant.name}
            style={{
              flex: variant.weight,
              backgroundColor: VARIANT_COLORS[i % VARIANT_COLORS.length],
              opacity: variant.name === assigned ? 1 : 0.28,
            }}
          />
        ))}
        {/* Needle is positioned by percentage so it stays aligned as weights change. */}
        <View style={[styles.needle, { left: `${score * 100}%` }]} />
      </View>

      <View style={styles.scaleRow}>
        <Text style={styles.scale}>0.0</Text>
        <Text style={styles.score}>{score.toFixed(4)}</Text>
        <Text style={styles.scale}>1.0</Text>
      </View>

      <View style={styles.legend}>
        {variants.map((variant, i) => (
          <View key={variant.name} style={styles.legendItem}>
            <View
              style={[
                styles.dot,
                { backgroundColor: VARIANT_COLORS[i % VARIANT_COLORS.length] },
              ]}
            />
            <Text style={styles.legendText}>
              {variant.name} · {Math.round(variant.weight * 100)}%
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.label}>Split</Text>
      <View style={styles.row}>
        {WEIGHT_PRESETS.map((preset, i) => {
          const active = i === presetIndex;
          return (
            <Pressable
              key={preset.label}
              onPress={() => onPreset(i)}
              style={[styles.chip, active && styles.chipActive]}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {preset.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Panel>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 34,
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: theme.cardAlt,
  },
  needle: {
    position: 'absolute',
    top: -4,
    width: 3,
    height: 42,
    marginLeft: -1.5,
    borderRadius: 2,
    backgroundColor: theme.text,
  },
  scaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  scale: { fontFamily: mono, fontSize: 11, color: theme.dim },
  score: { fontFamily: mono, fontSize: 15, fontWeight: '700', color: theme.text },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 14 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  dot: { width: 9, height: 9, borderRadius: 5 },
  legendText: { fontFamily: mono, fontSize: 12, color: theme.muted },
  label: {
    fontSize: 11,
    color: theme.dim,
    marginTop: 18,
    marginBottom: 8,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  row: { flexDirection: 'row', gap: 8 },
  chip: {
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  chipActive: { backgroundColor: theme.purple, borderColor: theme.purple },
  chipText: { fontFamily: mono, fontSize: 12, color: theme.muted },
  chipTextActive: { color: '#fff', fontWeight: '700' },
});
