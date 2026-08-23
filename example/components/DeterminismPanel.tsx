import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { evaluateExperiment, type Experiment } from 'expo-splitkit';
import { mono, theme } from '../theme';
import { Panel } from './Panel';

export function DeterminismPanel({
  experiment,
  userId,
}: {
  experiment: Experiment;
  userId: string;
}) {
  const [results, setResults] = useState<string[]>([]);

  // Re-running the engine from scratch — no cache, no persisted assignment.
  // The point of the panel is that the answer never moves.
  const rerun = () => {
    const next = Array.from({ length: 10 }, () =>
      evaluateExperiment(experiment, { id: userId }).variant
    );
    setResults((prev) => [...prev, ...next]);
  };

  const unique = new Set(results);

  return (
    <Panel
      step={4}
      title="Run it again. And again."
      caption="Nothing is cached and nothing is persisted — each press re-hashes from scratch. The answer never moves.">
      <Pressable onPress={rerun} style={styles.button}>
        <Text style={styles.buttonText}>Re-evaluate ×10</Text>
      </Pressable>

      <View style={styles.statRow}>
        <Stat label="evaluations" value={String(results.length)} />
        <Stat
          label="distinct results"
          value={results.length === 0 ? '—' : String(unique.size)}
          highlight={results.length > 0 && unique.size === 1}
        />
      </View>

      {results.length > 0 && (
        <Text style={styles.trace}>
          {[...unique].join(', ')} × {results.length}
        </Text>
      )}

      {results.length > 0 && (
        <Pressable onPress={() => setResults([])} hitSlop={8}>
          <Text style={styles.reset}>reset</Text>
        </Pressable>
      )}
    </Panel>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, highlight && { color: theme.green }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
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
  statRow: { flexDirection: 'row', gap: 28, marginTop: 18 },
  stat: {},
  statValue: { fontFamily: mono, fontSize: 26, fontWeight: '700', color: theme.text },
  statLabel: {
    fontSize: 11,
    color: theme.dim,
    marginTop: 3,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  trace: { fontFamily: mono, fontSize: 12, color: theme.muted, marginTop: 14 },
  reset: { fontFamily: mono, fontSize: 11, color: theme.dim, marginTop: 12 },
});
