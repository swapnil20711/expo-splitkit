const mockRequireOptionalNativeModule = jest.fn();

jest.mock('expo', () => ({
  requireOptionalNativeModule: (name: string) => mockRequireOptionalNativeModule(name),
}));

function loadModule() {
  let mod: typeof import('../SplitkitModule').default;
  jest.isolateModules(() => {
    mod = require('../SplitkitModule').default;
  });
  return mod!;
}

describe('SplitkitModule', () => {
  beforeEach(() => {
    mockRequireOptionalNativeModule.mockReset();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('uses the native module when it is installed', () => {
    mockRequireOptionalNativeModule.mockReturnValue({ getDeviceId: () => 'native-id' });

    expect(loadModule().getDeviceId()).toBe('native-id');
    expect(console.warn).not.toHaveBeenCalled();
  });

  it('falls back to a stable in-memory UUID when the native module is missing', () => {
    mockRequireOptionalNativeModule.mockReturnValue(null);
    const mod = loadModule();

    const id = mod.getDeviceId();
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    expect(mod.getDeviceId()).toBe(id);
    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  it('builds a UUID without crypto.randomUUID (Hermes)', () => {
    mockRequireOptionalNativeModule.mockReturnValue(null);
    const original = (globalThis as any).crypto;
    Object.defineProperty(globalThis, 'crypto', { value: undefined, configurable: true });
    try {
      expect(loadModule().getDeviceId()).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
      );
    } finally {
      Object.defineProperty(globalThis, 'crypto', { value: original, configurable: true });
    }
  });
});
