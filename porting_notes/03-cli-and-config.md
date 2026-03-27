# CLI and language config

## `src/cli/index.ts`

- Reads **`process.env.GITNEXUS_PROGRAM_NAME`** with fallback **`'gitnexus'`**.
- Commander **`.name(programName)`** instead of hard-coded `'gitnexus'`.
- Effect: default CLI name stays `gitnexus` when running `dist/cli/index.js` directly; **`bin/gitnexus-cj.mjs`** sets the env var so help/version show **`gitnexus-cj`**.

## `src/config/supported-languages.ts`

- Extends enum **`SupportedLanguages`** with **`Cangjie = 'cangjie'`** (inserted after `Swift`).
