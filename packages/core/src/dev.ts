/**
 * True unless the host says it's a production build. Reads React Native's
 * `__DEV__` when present, otherwise `process.env.NODE_ENV`, without assuming
 * either global exists (browsers and edge runtimes have neither).
 */
export function isDevelopment(): boolean {
  const globals = globalThis as any;
  if (typeof globals.__DEV__ !== 'undefined') {
    return !!globals.__DEV__;
  }
  return globals.process?.env?.NODE_ENV !== 'production';
}

/** `console.warn` without depending on DOM or Node typings, or on console existing. */
export function warn(message: string): void {
  (globalThis as any).console?.warn?.(message);
}
