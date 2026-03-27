# Documentation deltas

## `CHANGELOG.md`

Under **### Fixed**, one new bullet:

- **lbug:** `CodeRelation` schema now allows `HAS_METHOD` / `HAS_PROPERTY` from `Enum` to members (Cangjie enum methods were parsed but edges dropped on load).

## `README.md`

### Title and positioning

- Title becomes **`# gitnexus-cj`** with a short note that this is a **self-contained** package (full engine), including **Cangjie** (`.cj`), not a thin wrapper.

### Badges

- Removes the npm version badge for `gitnexus` (package name changed).

### New sections

- **Monorepo layout:** Explains `gitnexus-cj/` in the GitHub repo, workspace install, `npx` from monorepo root vs path install, references root `bin/gitnexus-cj.mjs` and root README “Run from GitHub”.
- **Building from this repo (native `tree-sitter`):** C++20 via `CXXFLAGS`, global install notes (`sudo -E`), `npm run install:with-cpp20`, and note that **Cangjie** needs **`tree-sitter` ≥ 0.25** (language version 15).

### Global string replacements

Throughout the doc, user-facing command examples change from **`gitnexus`** to **`gitnexus-cj`** (analyze, setup, MCP examples, CLI command list, multi-repo paragraph, local backend `serve`, skills install blurb).

### Supported languages line

- Appends **“, Cangjie (`.cj`)”** to the language list.

### Requirements

- Still lists Node ≥ 18; the existing “repository / commit tracking” requirement line in the README is otherwise unchanged in intent.
