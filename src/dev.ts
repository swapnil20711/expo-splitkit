export function isDevelopment(): boolean {
  const globals = globalThis as any;
  if (typeof globals.__DEV__ !== 'undefined') {
    return !!globals.__DEV__;
  }
  return globals.process?.env?.NODE_ENV !== 'production';
}
