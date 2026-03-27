# Package, bin entry, and scripts

## `package.json`

### Identity and publishing

- **name:** `gitnexus` → `gitnexus-cj`
- **version:** `1.4.7` → `1.4.7.cj-beta3`
- **description / homepage / repository.directory:** Retargeted to the Cangjie-focused package path in the monorepo.
- **keywords:** Added `gitnexus-cj`, `cangjie`, `仓颉`, `cj`.

### `bin`

- **Before:** `"gitnexus": "dist/cli/index.js"`
- **After:** `"gitnexus-cj": "bin/gitnexus-cj.mjs"`

### `files` array

- Adds `"bin"` so the shim ships on npm.

### npm scripts

| Script | Change |
|--------|--------|
| `postinstall` | Appends `&& node scripts/patch-tree-sitter-cangjie-compat.cjs` after the Swift patch. |
| `install:with-cpp20` | **New:** `bash scripts/npm-install-with-cpp20.sh`. |
| `prepack` | Also `chmod +x bin/gitnexus-cj.mjs`. |

### Dependencies

| Package | Change |
|---------|--------|
| `tree-sitter` | `^0.21.0` → pinned **`0.25.0`** (required for Cangjie grammar ABI). |
| `tree-sitter-cangjie` | **Added:** `git+https://gitcode.com/Cangjie-SIG/tree-sitter-cangjie` |
| `@ladybugdb/core` | Same version; **moved earlier** in the JSON list (no functional change). |

Optional dependencies and other language grammars are unchanged aside from the above.

## `bin/gitnexus-cj.mjs` (new)

- Shebang `#!/usr/bin/env node`.
- Sets `process.env.GITNEXUS_PROGRAM_NAME ??= 'gitnexus-cj'`.
- Dynamic `import('../dist/cli/index.js')` so Commander shows the Cangjie CLI name when launched via this bin.

## `scripts/npm-install-with-cpp20.sh` (new)

- `set -euo pipefail`
- Exports `CXXFLAGS` default `-std=c++20` if unset, then `exec npm install "$@"`.
- Comment: Node 24+ headers / `tree-sitter` ≥0.25 source build may need C++20.

## `scripts/patch-tree-sitter-cangjie-compat.cjs` (new)

Patches **`node_modules/tree-sitter/index.js`** when layout matches expectations:

1. **`initializeLanguageNodeClasses`:** If `getNodeTypeNamesById` / `getNodeFieldNamesById` return falsy, **return early** (skip subclass generation). Marked with `/* gitnexus-cangjie-compat */`.
2. **Unmarshal path:** Use `(tree.language.nodeSubclasses && tree.language.nodeSubclasses[nodeTypeId]) || SyntaxNode` so missing subclasses fall back to base `SyntaxNode`.

**Rationale (in-file comment):** `tree-sitter-cangjie` exposes `language` as `Napi::External<TSLanguage>`; introspection can fail across the native boundary, breaking `setLanguage` without the patch.

If needles are not found, logs a warning and skips (forward-compat with upstream `tree-sitter` layout changes).

## `package-lock.json`

- Present only under **`gitnexus-old/`** in this workspace snapshot; **`gitnexus-cj/`** has no top-level lockfile here. When porting to **`gitnexus/`**, regenerate the lockfile with the chosen dependency set (especially `tree-sitter` 0.25 + `tree-sitter-cangjie`).
