# Ladybug schema and main-thread parser loader

## `src/core/lbug/schema.ts`

**`CodeRelation` / graph edge constraints** gain additional allowed pairs from **`Enum`**:

- **`Enum` → `Method`**
- **`Enum` → `Constructor`**
- **`Enum` → `Property`**

Aligns with Cangjie enum member functions/properties being indexed instead of dropped on schema validation.

## `src/core/tree-sitter/parser-loader.ts`

- **`import { createRequire } from 'node:module'`** moved to the **top** of the file (was lower).
- **`import cangjiePkg from 'tree-sitter-cangjie'`**.
- Short comment: pass the **grammar module object** (e.g. like `tree-sitter-javascript`), not **`.language` alone**, because **Query** unwraps via **`.language`**.
- **`LANGUAGE_LOADERS`:** **`[SupportedLanguages.Cangjie]: cangjiePkg`**.
