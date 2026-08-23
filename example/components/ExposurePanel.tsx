import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { mono, theme } from '../theme';
import { Panel } from './Panel';

export type ExposureRow = {
  experimentKey: string;
  variant: string;
  userId: string;
  timestamp: number;
};

export function ExposurePanel({ events }: { events: ExposureRow[] }) {
  return (
    <Panel
      step={6}
      title="Exposure events"
      caption="Fired once per user + experiment + variant, not once per render. Wire onExposure to PostHog, Mixpanel, Segment — anything.">
      {events.length === 0 ? (
        <Text style={styles.empty}>waiting for first exposure…</Text>
      ) : (
        <View style={styles.list}>
          {events
            .slice(-6)
            .reverse()
            .map((event) => (
              <View key={`${event.userId}:${event.variant}:${event.timestamp}`} style={styles.row}>
                <View style={styles.tick} />
                <View style={styles.rowBody}>
                  <Text style={styles.rowTop}>
                    {event.experimentKey} → <Text style={styles.variant}>{event.variant}</Text>
                  </Text>
                  <Text style={styles.rowSub} numberOfLines={1}>
                    {event.userId}
                  </Text>
                </View>
              </View>
            ))}
        </View>
      )}

      <Text style={styles.note}>
        {events.length} event{events.length === 1 ? '' : 's'} · deduplicated by
        userId:experiment:variant
      </Text>
    </Panel>
  );
}

const styles = StyleSheet.create({
  empty: { fontFamily: mono, fontSize: 12, color: theme.dim },
  list: { gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  tick: { width: 6, height: 6, borderRadius: 3, backgroundColor: theme.green },
  rowBody: { flex: 1 },
  rowTop: { fontFamily: mono, fontSize: 12, color: theme.muted },
  variant: { color: theme.text, fontWeight: '700' },
  rowSub: { fontFamily: mono, fontSize: 11, color: theme.dim, marginTop: 2 },
  note: { fontFamily: mono, fontSize: 11, color: theme.dim, marginTop: 16 },
});
