#!/usr/bin/env node
/**
 * Global / local CLI entry for installs from this package.
 * Commander shows `gitnexus-cj` in help; the published npm `gitnexus` package still uses `gitnexus`.
 */
process.env.GITNEXUS_PROGRAM_NAME ??= 'gitnexus-cj';
await import('../dist/cli/index.js');
