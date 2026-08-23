import React, { useCallback, useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  getBucketScore,
  getDeviceId,
  SplitKitTestingProvider,
  type Experiment,
} from 'expo-splitkit';

import { BucketMeter, WEIGHT_PRESETS } from './components/BucketMeter';
import { DeterminismPanel } from './components/DeterminismPanel';
import { DistributionPanel } from './components/DistributionPanel';
import { ExposurePanel, type ExposureRow } from './components/ExposurePanel';
import { IdentityPanel } from './components/IdentityPanel';
import { VariantPreview } from './components/VariantPreview';
import { mono, theme } from './theme';

const EXPERIMENT_KEY = 'checkout_cta';

const PAYLOADS = [
  { text: 'Buy Now', color: '#2563EB' },
  { text: 'Claim 50% Off', color: '#16A34A' },
];

export default function App() {
  const deviceId = useMemo(() => getDeviceId(), []);
  const [userId, setUserId] = useState('user_alice');
  const [presetIndex, setPresetIndex] = useState(0);
  const [events, setEvents] = useState<ExposureRow[]>([]);

  // Rebuilding the config on every weight change is a demo affordance, not a
  // pattern to copy: in production the weights are fixed for the life of the
  // experiment, because moving them re-buckets users mid-flight.
  const experiment = useMemo<Experiment>(() => {
    const weights = WEIGHT_PRESETS[presetIndex].weights;
    return {
      key: EXPERIMENT_KEY,
      variants: [
        { name: 'control', weight: weights[0], payload: PAYLOADS[0] },
        { name: 'variant_b', weight: weights[1], payload: PAYLOADS[1] },
      ],
      fallback: 'control',
    };
  }, [presetIndex]);

  const experiments = useMemo(() => ({ [EXPERIMENT_KEY]: experiment }), [experiment]);
  const user = useMemo(() => ({ id: userId }), [userId]);
  const score = useMemo(() => getBucketScore(userId, EXPERIMENT_KEY), [userId]);

  const assigned = useMemo(() => {
    let cumulative = 0;
    for (const variant of experiment.variants) {
      cumulative += variant.weight;
      if (score < cumulative) return variant.name;
    }
    return experiment.variants[experiment.variants.length - 1].name;
  }, [experiment, score]);

  const onExposure = useCallback((event: ExposureRow) => {
    setEvents((prev) => [...prev, event]);
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <SplitKitTestingProvider
        user={user}
        experiments={experiments}
        onExposure={onExposure}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.eyebrow}>EXPO · REACT NATIVE</Text>
            <Text style={styles.title}>
              A/B testing with{'\n'}
              <Text style={styles.hot}>zero backend</Text>.
            </Text>
            <Text style={styles.lede}>
              Every assignment below is computed on this device, from a hash. No network, no
              SDK key, no waiting.
            </Text>
          </View>

          <IdentityPanel userId={userId} deviceId={deviceId} onChange={setUserId} />

          <BucketMeter
            score={score}
            variants={experiment.variants}
            assigned={assigned}
            presetIndex={presetIndex}
            onPreset={setPresetIndex}
          />

          <VariantPreview experimentKey={EXPERIMENT_KEY} />

          <DeterminismPanel experiment={experiment} userId={userId} />

          <DistributionPanel
            experimentKey={EXPERIMENT_KEY}
            variants={experiment.variants}
          />

          <ExposurePanel events={events} />

          <Text style={styles.footer}>expo-splitkit · MIT · 0 dependencies</Text>
        </ScrollView>
      </SplitKitTestingProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.bg },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 48 },
  header: { marginBottom: 26, marginTop: 8 },
  eyebrow: {
    fontFamily: mono,
    fontSize: 11,
    letterSpacing: 3,
    color: theme.orange,
    fontWeight: '700',
  },
  title: {
    fontSize: 38,
    lineHeight: 42,
    fontWeight: '800',
    color: theme.text,
    marginTop: 12,
    letterSpacing: -1,
  },
  hot: { color: theme.orange },
  lede: { fontSize: 14, lineHeight: 21, color: theme.muted, marginTop: 14 },
  footer: {
    fontFamily: mono,
    fontSize: 11,
    color: theme.dim,
    textAlign: 'center',
    marginTop: 8,
  },
});
