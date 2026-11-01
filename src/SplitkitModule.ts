import { NativeModule, requireOptionalNativeModule } from 'expo';

import { isDevelopment } from './dev';

declare class SplitkitModule extends NativeModule<{}> {
  getDeviceId(): string;
}

// The native module is missing in Expo Go and Snack, which only ship the
// modules bundled into their own binaries. Falling back to JS keeps the library
// usable there for trying it out, at the cost of a device ID that only lives as
// long as the JS runtime.
const nativeModule = requireOptionalNativeModule<SplitkitModule>('Splitkit');

let memoryDeviceId: string | null = null;

// Hermes doesn't ship `crypto.randomUUID`, so build a v4 UUID by hand when it's
// missing. Bucketing only needs the ID to be stable, not unguessable.
function randomUUID(): string {
  const globals = globalThis as any;
  if (typeof globals.crypto?.randomUUID === 'function') {
    return globals.crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function getFallbackDeviceId(): string {
  if (memoryDeviceId === null) {
    memoryDeviceId = randomUUID();
    if (isDevelopment()) {
      console.warn(
        '[splitkit] Native module not found (Expo Go or Snack?). Using an in-memory ' +
          'device ID that changes on every app reload, so anonymous users will be ' +
          're-bucketed. Pass your own `user.id`, or use a development build, for ' +
          'stable assignments.'
      );
    }
  }
  return memoryDeviceId;
}

export default {
  getDeviceId(): string {
    return nativeModule ? nativeModule.getDeviceId() : getFallbackDeviceId();
  },
};
