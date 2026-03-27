# Files and trees only under `gitnexus-cj/`

## `src/core/ingestion/type-extractors/cangjie.ts`

Minimal **`LanguageTypeConfig`**: empty **`declarationNodeTypes`**, no-op **`extractDeclaration`** / **`extractParameter`**. Full type inference for Cangjie is explicitly deferred.

## `bin/gitnexus-cj.mjs`

Documented in [01-package-bin-scripts.md](./01-package-bin-scripts.md).

## `scripts/patch-tree-sitter-cangjie-compat.cjs` and `scripts/npm-install-with-cpp20.sh`

Documented in [01-package-bin-scripts.md](./01-package-bin-scripts.md).

## `MNIST/` directory

Present only under **`gitnexus-cj/`** (not excluded as `test/`). Typical contents in this snapshot include:

- Cangjie sources (**`*.cj`**) such as training/network utilities.
- **`.gitnexus/`** artifacts (**`meta.json`**, **`lbug`**) from a local index run.
- **`.claude/skills/gitnexus/*.md`**, **`AGENTS.md`**, **`CLAUDE.md`**, **`ladybug.sh`**, **`.gitignore`** — sample agent/repo layout.

**Porting note:** Treat **`MNIST/`** as an optional **sample / dogfood project**, not as core product code. When merging into **`gitnexus/`**, do not copy wholesale unless you intend to ship a fixture; prefer **`test/fixtures`** patterns if automated tests need Cangjie samples (those live under `test/`, which was out of scope for this compare).
