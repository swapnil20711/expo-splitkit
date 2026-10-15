import { registerWebModule, NativeModule } from 'expo';

const DEVICE_ID_KEY = 'splitkit_persistent_device_id';

// Used when localStorage is unavailable (private mode, blocked storage, sandboxed
// iframes). The ID is then stable for the page session only.
let memoryDeviceId: string | null = null;

class SplitkitModule extends NativeModule<{}> {
  getDeviceId(): string {
    try {
      const stored = localStorage.getItem(DEVICE_ID_KEY);
      if (stored) {
        return stored;
      }
      const newId = crypto.randomUUID();
      localStorage.setItem(DEVICE_ID_KEY, newId);
      return newId;
    } catch {
      memoryDeviceId ??= crypto.randomUUID();
      return memoryDeviceId;
    }
  }
}

export default registerWebModule(SplitkitModule, 'SplitkitModule');
