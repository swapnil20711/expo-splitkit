import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { mono, theme } from '../theme';
import { Panel } from './Panel';

const PRESETS = ['user_alice', 'user_bob', 'user_carol', 'user_dave'];

export function IdentityPanel({
  userId,
  deviceId,
  onChange,
}: {
  userId: string;
  deviceId: string;
  onChange: (id: string) => void;
}) {
  return (
    <Panel
      step={1}
      title="Who are we bucketing?"
      caption="The variant is a pure function of this string. Change it and the assignment changes — but the same string always lands in the same place.">
      <TextInput
        value={userId}
        onChangeText={onChange}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="user id"
        placeholderTextColor={theme.dim}
        style={styles.input}
      />

      <View style={styles.row}>
        {PRESETS.map((preset) => {
          const active = preset === userId;
          return (
            <Pressable
              key={preset}
              onPress={() => onChange(preset)}
              style={[styles.chip, active && styles.chipActive]}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{preset}</Text>
            </Pressable>
          );
        })}
        <Pressable onPress={() => onChange(deviceId)} style={styles.chip}>
          <Text style={styles.chipText}>this device</Text>
        </Pressable>
      </View>

      <Text style={styles.device}>device id · {deviceId}</Text>
    </Panel>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: theme.cardAlt,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: mono,
    fontSize: 15,
    color: theme.text,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  chip: {
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  chipActive: { backgroundColor: theme.orange, borderColor: theme.orange },
  chipText: { fontFamily: mono, fontSize: 12, color: theme.muted },
  chipTextActive: { color: '#fff', fontWeight: '700' },
  device: { fontFamily: mono, fontSize: 11, color: theme.dim, marginTop: 14 },
});
