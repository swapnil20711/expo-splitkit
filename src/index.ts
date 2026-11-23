// Reexport the native module. On web, it will be resolved to SplitkitModule.web.ts
// and on native platforms to SplitkitModule.ts
export { default } from './SplitkitModule';

// The engine lives in splitkit-core so it can run on servers and other runtimes.
export * from 'splitkit-core';
export * from './context';
