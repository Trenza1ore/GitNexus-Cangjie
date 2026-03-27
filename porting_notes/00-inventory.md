# Inventory (`gitnexus-old` vs `gitnexus-cj`, excluding `test/`)

## Only in `gitnexus-old`

| Path | Note |
|------|------|
| `package-lock.json` | Present under `gitnexus-old/`; **absent** under `gitnexus-cj/` in this snapshot. Lockfile policy may differ between trees. |

## Only in `gitnexus-cj`

| Path | Role |
|------|------|
| `bin/gitnexus-cj.mjs` | Published CLI shim: sets `GITNEXUS_PROGRAM_NAME` default to `gitnexus-cj`, then loads `../dist/cli/index.js`. |
| `scripts/npm-install-with-cpp20.sh` | Runs `npm install` with `CXXFLAGS` defaulting to `-std=c++20` (Node 22+ / native `tree-sitter` build). |
| `scripts/patch-tree-sitter-cangjie-compat.cjs` | Postinstall patch to `node_modules/tree-sitter/index.js` for Cangjie `External` language handles. |
| `src/core/ingestion/type-extractors/cangjie.ts` | Minimal `LanguageTypeConfig` (no-op extractors) for Cangjie. |
| `MNIST/` | Sample Cangjie project and indexed artifacts (see [06-cj-only-additions.md](./06-cj-only-additions.md)). Not under `test/`. |

## Present in both but content differs

| Path |
|------|
| `CHANGELOG.md` |
| `README.md` |
| `package.json` |
| `src/cli/index.ts` |
| `src/config/supported-languages.ts` |
| `src/core/ingestion/ast-cache.ts` |
| `src/core/ingestion/call-processor.ts` |
| `src/core/ingestion/call-routing.ts` |
| `src/core/ingestion/entry-point-scoring.ts` |
| `src/core/ingestion/export-detection.ts` |
| `src/core/ingestion/heritage-processor.ts` |
| `src/core/ingestion/import-processor.ts` |
| `src/core/ingestion/parsing-processor.ts` |
| `src/core/ingestion/resolvers/utils.ts` |
| `src/core/ingestion/tree-sitter-queries.ts` |
| `src/core/ingestion/type-extractors/index.ts` |
| `src/core/ingestion/utils.ts` |
| `src/core/ingestion/workers/parse-worker.ts` |
| `src/core/lbug/schema.ts` |
| `src/core/tree-sitter/parser-loader.ts` |

## Unchanged (same paths, same content in this compare)

All other tracked source/config files under both trees matched when comparing with `test/`, `node_modules/`, `dist/`, and `.DS_Store` excluded. Re-run a recursive diff after local edits to confirm.
