// Builds ESM and CommonJS outputs with plain tsc. Each output directory gets a
// package.json marking its module type, so Node and TypeScript read the .js and
// .d.ts files in it correctly without needing .mjs/.cjs extensions.
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tsc = createRequire(import.meta.url).resolve('typescript/bin/tsc');

rmSync(join(root, 'dist'), { recursive: true, force: true });

for (const [config, dir, type] of [
  ['tsconfig.json', 'esm', 'module'],
  ['tsconfig.cjs.json', 'cjs', 'commonjs'],
]) {
  execFileSync(process.execPath, [tsc, '-p', join(root, config)], { stdio: 'inherit' });
  mkdirSync(join(root, 'dist', dir), { recursive: true });
  writeFileSync(join(root, 'dist', dir, 'package.json'), JSON.stringify({ type }) + '\n');
}
