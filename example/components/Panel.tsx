import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { mono, theme } from '../theme';

export function Panel({
  step,
  title,
  caption,
  children,
}: {
  step: number;
  title: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.panel}>
      <View style={styles.head}>
        <Text style={styles.step}>{String(step).padStart(2, '0')}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.caption}>{caption}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: theme.card,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  step: {
    fontFamily: mono,
    fontSize: 12,
    color: theme.orange,
    letterSpacing: 1,
  },
  title: { fontSize: 17, fontWeight: '700', color: theme.text },
  caption: {
    fontSize: 13,
    lineHeight: 19,
    color: theme.muted,
    marginTop: 6,
    marginBottom: 16,
  },
});
