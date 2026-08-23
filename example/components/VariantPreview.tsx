import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useExperiment } from 'expo-splitkit';
import { mono, theme } from '../theme';
import { Panel } from './Panel';

type CtaPayload = { text: string; color: string };

export function VariantPreview({ experimentKey }: { experimentKey: string }) {
  // This is the entire consumer-facing API: one hook, resolved synchronously
  // on the first render. No loading state, so there is nothing to flicker.
  const { variant, payload } = useExperiment<CtaPayload>(experimentKey);

  return (
    <Panel
      step={3}
      title="What the user actually sees"
      caption="One hook call. It resolves during the first render, so there is no loading state and nothing flickers.">
      <View style={styles.badgeRow}>
        <Text style={styles.badgeLabel}>variant</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{variant}</Text>
        </View>
      </View>

      <View style={styles.stage}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.cta, { backgroundColor: payload?.color ?? theme.blue }]}>
          <Text style={styles.ctaText}>{payload?.text ?? 'Continue'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.code}>{'const { payload } = useExperiment(\n  \''}{experimentKey}{'\'\n);'}</Text>
    </Panel>
  );
}

const styles = StyleSheet.create({
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  badgeLabel: {
    fontSize: 11,
    color: theme.dim,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  badge: {
    backgroundColor: theme.cardAlt,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeText: { fontFamily: mono, fontSize: 13, fontWeight: '700', color: theme.green },
  stage: {
    marginTop: 16,
    backgroundColor: theme.cardAlt,
    borderRadius: 14,
    padding: 22,
  },
  cta: { borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  ctaText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  code: {
    fontFamily: mono,
    fontSize: 12,
    lineHeight: 19,
    color: theme.dim,
    marginTop: 16,
  },
});
