# Porting notes: `gitnexus-old` → `gitnexus-cj`

These notes record **every non-test** difference between the two trees **`gitnexus-old/`** and **`gitnexus-cj/`** in this workspace. They are meant to support a later port into the current **`gitnexus/`** package.

## Scope

- **Included:** All paths except anything under `test/` (per request).
- **Excluded from compare:** `node_modules/`, `dist/` (build output), and `.DS_Store` noise.
- **Method:** Pairwise directory comparison (e.g. `diff -rq gitnexus-old gitnexus-cj` with exclusions). No version-control commands are required to use these notes.

## Document map

| File | Contents |
|------|----------|
| [00-inventory.md](./00-inventory.md) | Files only in one tree, files changed in both, quick stats |
| [01-package-bin-scripts.md](./01-package-bin-scripts.md) | `package.json`, `bin/`, `scripts/`, lockfile presence |
| [02-documentation.md](./02-documentation.md) | `CHANGELOG.md`, `README.md` |
| [03-cli-and-config.md](./03-cli-and-config.md) | `src/cli/index.ts`, `src/config/supported-languages.ts` |
| [04-ingestion-and-queries.md](./04-ingestion-and-queries.md) | Ingestion pipeline, queries, type extractors, workers, resolvers |
| [05-schema-and-parser-loader.md](./05-schema-and-parser-loader.md) | `src/core/lbug/schema.ts`, `src/core/tree-sitter/parser-loader.ts` |
| [06-cj-only-additions.md](./06-cj-only-additions.md) | New files and the `MNIST/` sample tree |

## Theme of the fork

**`gitnexus-cj`** adds **Cangjie** (`.cj`) support: a new language enum value, Tree-sitter grammar dependency, query text, import resolution for Harmony-style packages, graph/schema tweaks for enum members, CLI program naming via environment variable, **`tree-sitter` 0.25.x**, and a **postinstall patch** for native grammar interoperability with that runtime.
